import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import type { Tables } from '@/lib/database.types';
import { color, font, radius, space } from '@/lib/design/tokens';

type SetT = Tables<'workout_exercise_sets'>;
type LibraryT = Tables<'exercise_library'>;

type Props = {
  set: SetT;
  library: LibraryT;
  saving?: boolean;
  onCommit: (patch: Partial<SetT>) => Promise<void> | void;
  onDelete?: () => void;
};

const COMMIT_DEBOUNCE_MS = 3000;

/**
 * FEELY-Style Set-Row:  [n]  [kg-input]  ×  [reps/distance/time]  [● status]  [× delete]
 * Adaptiv pro measurement_type — irrelevante Slots werden ausgelassen.
 * Auto-Commit nach 3s Idle, oder manueller Tap auf Status-Dot.
 */
export function SetRow({ set, library, saving, onCommit, onDelete }: Props) {
  const layout = layoutFor(library.measurement_type);

  const [reps, setReps] = useState<string>(toStr(set.actual_reps));
  const [load, setLoad] = useState<string>(toStr(set.actual_load_kg));
  const [distance, setDistance] = useState<string>(toStr(set.actual_distance_m));
  const [timeSec, setTimeSec] = useState<string>(toStr(set.actual_time_sec));

  const [completed, setCompleted] = useState<boolean>(set.completed);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync from props if backend updates
  useEffect(() => {
    setCompleted(set.completed);
    if (set.completed) setIsEditing(false);
  }, [set.completed]);

  // If a completed set's actuals change in DB (e.g. by another device), refresh local state
  useEffect(() => {
    if (!isEditing) {
      setReps(toStr(set.actual_reps));
      setLoad(toStr(set.actual_load_kg));
      setDistance(toStr(set.actual_distance_m));
      setTimeSec(toStr(set.actual_time_sec));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [set.actual_reps, set.actual_load_kg, set.actual_distance_m, set.actual_time_sec]);

  const inputsDisabled = completed && !isEditing;

  const ready = useMemo(() => {
    return layout.requiredFields.every((f) => isFilled(getField(f, { reps, load, distance, timeSec })));
  }, [layout.requiredFields, reps, load, distance, timeSec]);

  // Auto-commit after idle (für initial commit UND re-edit)
  useEffect(() => {
    if (debounce.current) clearTimeout(debounce.current);
    if (!ready) return;
    if (completed && !isEditing) return; // not editing → no commit
    debounce.current = setTimeout(() => doCommit(), COMMIT_DEBOUNCE_MS);
    return () => {
      if (debounce.current) clearTimeout(debounce.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, reps, load, distance, timeSec, completed, isEditing]);

  const doCommit = () => {
    if (!ready) return;
    if (debounce.current) clearTimeout(debounce.current);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    setCompleted(true);
    setIsEditing(false);
    onCommit({
      completed: true,
      actual_reps: layout.tracksReps ? toNum(reps) : null,
      actual_load_kg: layout.tracksLoad ? toNum(load) : null,
      actual_distance_m: layout.tracksDistance ? toNum(distance) : null,
      actual_time_sec: layout.tracksTime ? toNum(timeSec) : null,
    });
  };

  const handleDotTap = () => {
    if (saving) return;
    if (completed && !isEditing) {
      // Tap auf grünen Dot = Edit-Modus aktivieren
      Haptics.selectionAsync().catch(() => {});
      setIsEditing(true);
      return;
    }
    if (ready) doCommit();
  };

  return (
    <View
      style={[
        styles.row,
        completed && !isEditing && styles.rowDone,
        ready && (!completed || isEditing) && styles.rowReady,
        isEditing && styles.rowEditing,
      ]}
    >
      {/* Set number */}
      <View style={styles.numberWrap}>
        <Text style={[styles.number, completed && !isEditing && styles.numberDone]}>
          {set.set_number}
        </Text>
      </View>

      {/* Inputs */}
      <View style={styles.fieldsRow}>
        {layout.left ? (
          <Field
            placeholder={layout.left.placeholder(set)}
            value={getField(layout.left.field, { reps, load, distance, timeSec })}
            onChange={getSetter(layout.left.field, { setReps, setLoad, setDistance, setTimeSec })}
            disabled={inputsDisabled}
            kind={layout.left.kind}
          />
        ) : (
          <View style={styles.fieldSpacer} />
        )}

        {layout.right ? (
          <>
            <Text style={[styles.mult, completed && !isEditing && styles.multDone]}>×</Text>
            <Field
              placeholder={layout.right.placeholder(set)}
              value={getField(layout.right.field, { reps, load, distance, timeSec })}
              onChange={getSetter(layout.right.field, { setReps, setLoad, setDistance, setTimeSec })}
              disabled={inputsDisabled}
              kind={layout.right.kind}
            />
          </>
        ) : null}
      </View>

      {/* Status dot — bei completed tappable, um Edit-Modus zu starten */}
      <Pressable
        onPress={handleDotTap}
        hitSlop={8}
        disabled={saving || (!completed && !ready)}
        style={[
          styles.dot,
          completed && !isEditing && styles.dotDone,
          ready && (!completed || isEditing) && styles.dotReady,
          isEditing && !ready && styles.dotEditing,
        ]}
      >
        {isEditing && !ready ? (
          <Ionicons name="pencil" size={12} color={color.gold} />
        ) : completed && !isEditing ? (
          <Ionicons name="checkmark" size={14} color={color.bg} />
        ) : ready ? (
          <Ionicons name="checkmark" size={14} color={color.bg} />
        ) : (
          <View style={styles.dotInner} />
        )}
      </Pressable>

      {/* Delete */}
      <Pressable
        onPress={onDelete}
        hitSlop={6}
        style={({ pressed }) => [styles.delete, pressed && { opacity: 0.5 }]}
      >
        <Ionicons name="close" size={14} color={color.textDim} />
      </Pressable>
    </View>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Field component
// ────────────────────────────────────────────────────────────────────────────

function Field({
  value,
  onChange,
  placeholder,
  disabled,
  kind,
}: {
  value: string;
  onChange: (s: string) => void;
  placeholder: string;
  disabled?: boolean;
  kind: 'integer' | 'decimal';
}) {
  const handle = (t: string) => {
    const cleaned =
      kind === 'integer'
        ? t.replace(/[^0-9]/g, '')
        : t.replace(',', '.').replace(/[^0-9.]/g, '');
    onChange(cleaned);
  };

  return (
    <View style={[styles.field, disabled && styles.fieldDisabled]}>
      <TextInput
        style={[styles.input, disabled && styles.inputDisabled]}
        value={value}
        onChangeText={handle}
        editable={!disabled}
        placeholder={placeholder}
        placeholderTextColor={color.textDim}
        keyboardType={kind === 'integer' ? 'number-pad' : 'decimal-pad'}
        maxLength={6}
        selectTextOnFocus
      />
    </View>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Layout per measurement_type
// ────────────────────────────────────────────────────────────────────────────

type FieldKey = 'reps' | 'load' | 'distance' | 'time';

type SlotSpec = {
  field: FieldKey;
  kind: 'integer' | 'decimal';
  placeholder: (s: SetT) => string;
};

type Layout = {
  left: SlotSpec | null;
  right: SlotSpec | null;
  requiredFields: FieldKey[];
  tracksReps: boolean;
  tracksLoad: boolean;
  tracksDistance: boolean;
  tracksTime: boolean;
};

function layoutFor(t: LibraryT['measurement_type']): Layout {
  const repsPh = (s: SetT) => formatRepsPh(s);
  const loadPh = (s: SetT) => s.planned_load_display ?? (s.planned_load_kg != null ? `${stripZ(s.planned_load_kg)}kg` : 'kg');
  const distPh = (s: SetT) => (s.planned_distance_m != null ? `${stripZ(s.planned_distance_m)}m` : 'm');
  const timePh = (s: SetT) => (s.planned_time_sec != null ? `${s.planned_time_sec}s` : 's');

  switch (t) {
    case 'reps_weight':
      return {
        left: { field: 'load', kind: 'decimal', placeholder: loadPh },
        right: { field: 'reps', kind: 'integer', placeholder: repsPh },
        requiredFields: ['load', 'reps'],
        tracksReps: true, tracksLoad: true, tracksDistance: false, tracksTime: false,
      };
    case 'reps_only':
      return {
        left: { field: 'load', kind: 'decimal', placeholder: () => 'kg' },
        right: { field: 'reps', kind: 'integer', placeholder: repsPh },
        requiredFields: ['reps'],
        tracksReps: true, tracksLoad: true, tracksDistance: false, tracksTime: false,
      };
    case 'distance':
      return {
        left: null,
        right: { field: 'distance', kind: 'decimal', placeholder: distPh },
        requiredFields: ['distance'],
        tracksReps: false, tracksLoad: false, tracksDistance: true, tracksTime: false,
      };
    case 'distance_time':
      return {
        left: { field: 'distance', kind: 'decimal', placeholder: distPh },
        right: { field: 'time', kind: 'decimal', placeholder: timePh },
        requiredFields: ['distance', 'time'],
        tracksReps: false, tracksLoad: false, tracksDistance: true, tracksTime: true,
      };
    case 'time':
      return {
        left: null,
        right: { field: 'time', kind: 'decimal', placeholder: timePh },
        requiredFields: ['time'],
        tracksReps: false, tracksLoad: false, tracksDistance: false, tracksTime: true,
      };
    case 'rounds':
      return {
        left: null,
        right: { field: 'reps', kind: 'integer', placeholder: () => 'Runden' },
        requiredFields: ['reps'],
        tracksReps: true, tracksLoad: false, tracksDistance: false, tracksTime: false,
      };
    case 'cardio':
      return {
        left: null,
        right: { field: 'time', kind: 'integer', placeholder: () => 'min' },
        requiredFields: ['time'],
        tracksReps: false, tracksLoad: false, tracksDistance: false, tracksTime: true,
      };
    default:
      return {
        left: null,
        right: { field: 'reps', kind: 'integer', placeholder: repsPh },
        requiredFields: ['reps'],
        tracksReps: true, tracksLoad: false, tracksDistance: false, tracksTime: false,
      };
  }
}

function formatRepsPh(s: SetT): string {
  if (s.planned_reps_label) return s.planned_reps_label;
  if (s.planned_reps_min != null && s.planned_reps_max != null) {
    return s.planned_reps_min === s.planned_reps_max
      ? String(s.planned_reps_min)
      : `${s.planned_reps_min}-${s.planned_reps_max}`;
  }
  return 'Wdh';
}

function stripZ(n: number): string {
  if (Number.isInteger(n)) return String(n);
  return String(n).replace('.', ',');
}

function getField(
  k: FieldKey,
  v: { reps: string; load: string; distance: string; timeSec: string },
): string {
  return v[k === 'time' ? 'timeSec' : k];
}

function getSetter(
  k: FieldKey,
  v: {
    setReps: (s: string) => void;
    setLoad: (s: string) => void;
    setDistance: (s: string) => void;
    setTimeSec: (s: string) => void;
  },
): (s: string) => void {
  switch (k) {
    case 'reps': return v.setReps;
    case 'load': return v.setLoad;
    case 'distance': return v.setDistance;
    case 'time': return v.setTimeSec;
  }
}

function isFilled(s: string): boolean {
  const n = parseFloat(s);
  return Number.isFinite(n) && n > 0;
}

function toStr(n: number | null | undefined): string {
  if (n == null) return '';
  return Number.isInteger(n) ? String(n) : String(n);
}

function toNum(s: string): number | null {
  const n = parseFloat(s);
  return Number.isFinite(n) ? n : null;
}

// ────────────────────────────────────────────────────────────────────────────
// Styles
// ────────────────────────────────────────────────────────────────────────────

const ROW_HEIGHT = 60;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    height: ROW_HEIGHT,
    paddingHorizontal: space[3],
    gap: space[2],
    borderRadius: radius.lg,
    backgroundColor: 'rgba(20, 20, 20, 0.55)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  rowReady: {
    borderColor: color.gold,
    backgroundColor: 'rgba(197, 165, 90, 0.04)',
  },
  rowDone: {
    backgroundColor: 'rgba(197, 165, 90, 0.06)',
    borderColor: 'rgba(197, 165, 90, 0.30)',
  },
  rowEditing: {
    borderColor: color.gold,
    borderStyle: 'dashed',
    backgroundColor: 'rgba(197, 165, 90, 0.04)',
  },
  numberWrap: {
    width: 28,
    alignItems: 'center',
  },
  number: {
    fontFamily: font.family,
    fontSize: 15,
    fontWeight: '700',
    color: color.text,
  },
  numberDone: {
    color: color.gold,
  },

  fieldsRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[2],
  },
  field: {
    flex: 1,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: space[3],
    justifyContent: 'center',
  },
  fieldDisabled: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
  fieldSpacer: {
    flex: 0.6,
  },
  input: {
    fontFamily: font.family,
    fontSize: 15,
    fontWeight: '600',
    color: color.text,
    padding: 0,
    textAlign: 'center',
  },
  inputDisabled: {
    color: color.text,
  },
  mult: {
    fontFamily: font.family,
    fontSize: 14,
    color: color.textMuted,
  },
  multDone: {
    color: color.textMuted,
  },

  dot: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.20)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  dotInner: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.30)',
  },
  dotReady: {
    backgroundColor: color.gold,
    borderColor: color.gold,
  },
  dotDone: {
    backgroundColor: color.gold,
    borderColor: color.gold,
  },
  dotEditing: {
    backgroundColor: 'transparent',
    borderColor: color.gold,
    borderWidth: 1.5,
    borderStyle: 'dashed',
  },

  delete: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
