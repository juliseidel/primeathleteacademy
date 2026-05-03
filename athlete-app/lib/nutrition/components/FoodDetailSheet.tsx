/**
 * FoodDetailSheet — Modal-Sheet für Lebensmittel-Details (FEELY-Style).
 *
 * Zeigt Nährwerte für 100g + Portions-Editor (Gramm + Portionen),
 * Schließen + kcal-Total, Eintrag löschen.
 *
 * Modus:
 *   - "edit"   — bestehender Log-Eintrag, Edit/Delete sind aktiv
 *   - "view"   — Coach-Vorgabe, nur Anzeige + "Übernehmen"-Button
 *   - "create" — neues Item aus Suche, Add-Button statt Speichern
 */

import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { color, font, radius, space } from '@/lib/design/tokens';

export type FoodDetailMacros = {
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
};

type Props = {
  visible: boolean;
  mode: 'edit' | 'view' | 'create';
  name: string;
  timeLabel?: string;
  macrosPer100g: FoodDetailMacros;
  initialAmountG: number;
  initialServings?: number;
  onClose: () => void;
  onSave?: (amountG: number, servings: number) => void;
  onDelete?: () => void;
  onAdopt?: (amountG: number, servings: number) => void;
};

export function FoodDetailSheet({
  visible,
  mode,
  name,
  timeLabel,
  macrosPer100g,
  initialAmountG,
  initialServings = 1,
  onClose,
  onSave,
  onDelete,
  onAdopt,
}: Props) {
  const insets = useSafeAreaInsets();
  const [amountG, setAmountG] = useState(initialAmountG);
  const [servings, setServings] = useState(initialServings);

  useEffect(() => {
    if (visible) {
      setAmountG(initialAmountG);
      setServings(initialServings);
    }
  }, [visible, initialAmountG, initialServings]);

  const factor = (amountG / 100) * servings;
  const total: FoodDetailMacros = {
    kcal: macrosPer100g.kcal * factor,
    protein: macrosPer100g.protein * factor,
    carbs: macrosPer100g.carbs * factor,
    fat: macrosPer100g.fat * factor,
  };

  const isReadOnly = mode === 'view' && !onAdopt;

  const handlePrimary = () => {
    if (isReadOnly) {
      onClose();
      return;
    }
    if (mode === 'edit') onSave?.(amountG, servings);
    else if (mode === 'create') onSave?.(amountG, servings);
    else if (mode === 'view') onAdopt?.(amountG, servings);
    onClose();
  };

  const primaryLabel = isReadOnly
    ? `Schließen · ${Math.round(total.kcal)} kcal`
    : mode === 'edit'
      ? `Speichern · ${Math.round(total.kcal)} kcal`
      : mode === 'create'
        ? `Hinzufügen · ${Math.round(total.kcal)} kcal`
        : `Übernehmen · ${Math.round(total.kcal)} kcal`;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={[styles.sheet, { paddingBottom: insets.bottom + space[4] }]}>
        <View style={styles.handleRow}>
          <View style={styles.handle} />
        </View>

        <View style={styles.header}>
          <Pressable onPress={onClose} hitSlop={8} style={styles.closeBtn}>
            <Ionicons name="close" size={20} color={color.text} />
          </Pressable>
          <Text style={styles.headerTitle}>Details</Text>
          <View style={styles.closeBtn} />
        </View>

        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {/* Name + Zeit */}
          <View style={styles.nameCard}>
            <Text style={styles.nameText}>{name}</Text>
            {timeLabel ? <Text style={styles.timeText}>{timeLabel}</Text> : null}
          </View>

          {/* Nährwerte */}
          <View style={styles.macroCard}>
            <View style={styles.macroHeader}>
              <Ionicons name="flame" size={14} color={color.text} />
              <Text style={styles.macroHeaderTitle}>Nährwerte</Text>
            </View>

            <View style={styles.macroValueRow}>
              <Text style={styles.macroBig}>
                {Math.round(total.kcal)}
                <Text style={styles.macroBigUnit}> kcal</Text>
              </Text>
              <Text style={styles.macroSub}>
                Pro 100g: {Math.round(macrosPer100g.kcal)} kcal
              </Text>
            </View>

            <View style={styles.macroPills}>
              <MacroPill label="Eiweiß" value={total.protein} accent={color.macroProtein} />
              <MacroPill label="Kohlenh." value={total.carbs} accent={color.macroCarbs} />
              <MacroPill label="Fett" value={total.fat} accent={color.macroFat} />
            </View>
          </View>

          {/* Portion */}
          <View style={styles.portionCard}>
            <View style={styles.portionHeader}>
              <Ionicons name="resize-outline" size={14} color={color.text} />
              <Text style={styles.portionTitle}>Portion bearbeiten</Text>
            </View>

            <View style={styles.portionRow}>
              <Text style={styles.portionLabel}>MENGE (G)</Text>
              <Text style={styles.portionLabel}>PORTIONEN</Text>
            </View>

            <View style={styles.portionEditorRow}>
              <Stepper
                value={amountG}
                onChange={setAmountG}
                step={10}
                min={5}
                suffix="g"
                isFloat={false}
                large
              />
              <Stepper
                value={servings}
                onChange={setServings}
                step={1}
                min={1}
                suffix="×"
                isFloat={false}
              />
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Pressable
            onPress={handlePrimary}
            style={({ pressed }) => [styles.primaryBtn, pressed && { opacity: 0.85 }]}
          >
            <Text style={styles.primaryLabel}>{primaryLabel}</Text>
          </Pressable>
          {mode === 'edit' && onDelete ? (
            <Pressable
              onPress={() => {
                onDelete();
                onClose();
              }}
              style={({ pressed }) => [styles.deleteBtn, pressed && { opacity: 0.7 }]}
            >
              <Text style={styles.deleteLabel}>Eintrag löschen</Text>
            </Pressable>
          ) : null}
        </View>
      </View>
    </Modal>
  );
}

function MacroPill({ label, value, accent }: { label: string; value: number; accent: string }) {
  return (
    <View style={[styles.pill, { borderTopColor: accent }]}>
      <Text style={styles.pillValue}>
        {value.toFixed(1).replace('.', ',')}
        <Text style={styles.pillUnit}>g</Text>
      </Text>
      <Text style={styles.pillLabel}>{label}</Text>
    </View>
  );
}

function Stepper({
  value,
  onChange,
  step,
  min = 0,
  suffix,
  isFloat,
  large,
}: {
  value: number;
  onChange: (next: number) => void;
  step: number;
  min?: number;
  suffix: string;
  isFloat: boolean;
  large?: boolean;
}) {
  const display = isFloat ? value.toFixed(1).replace('.', ',') : String(Math.round(value));
  return (
    <View style={[styles.stepper, large && styles.stepperLarge]}>
      <Pressable
        onPress={() => onChange(Math.max(min, value - step))}
        hitSlop={6}
        style={({ pressed }) => [styles.stepBtn, pressed && { opacity: 0.6 }]}
      >
        <Text style={styles.stepBtnLabel}>−{step}</Text>
      </Pressable>
      <View style={styles.stepValueWrap}>
        <TextInput
          value={display}
          onChangeText={(t) => {
            const n = Number(t.replace(',', '.'));
            if (!Number.isNaN(n) && n >= min) onChange(n);
          }}
          keyboardType="numeric"
          style={styles.stepValue}
        />
        <Text style={styles.stepSuffix}>{suffix}</Text>
      </View>
      <Pressable
        onPress={() => onChange(value + step)}
        hitSlop={6}
        style={({ pressed }) => [styles.stepBtn, pressed && { opacity: 0.6 }]}
      >
        <Text style={styles.stepBtnLabel}>+{step}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: color.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderTopWidth: 1,
    borderColor: color.whiteA15,
    maxHeight: '90%',
  },
  handleRow: {
    paddingTop: space[2],
    paddingBottom: space[1],
    alignItems: 'center',
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: color.textDim,
    opacity: 0.4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: space[4],
    paddingVertical: space[3],
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.10)',
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  headerTitle: {
    fontFamily: font.family,
    fontSize: 16,
    fontWeight: '700',
    color: color.text,
  },
  scroll: {
    paddingHorizontal: space[5],
    paddingTop: space[4],
    gap: space[4],
  },
  nameCard: {
    paddingVertical: space[4],
    paddingHorizontal: space[5],
    borderRadius: radius.lg,
    backgroundColor: color.surfaceLight,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
  },
  nameText: {
    fontFamily: font.family,
    fontSize: 22,
    fontWeight: '700',
    color: color.text,
    letterSpacing: -0.4,
  },
  timeText: {
    fontFamily: font.family,
    fontSize: 12,
    color: color.textMuted,
    marginTop: 4,
    letterSpacing: 0.4,
  },
  macroCard: {
    paddingVertical: space[5],
    paddingHorizontal: space[5],
    borderRadius: radius.lg,
    backgroundColor: color.surfaceLight,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    gap: space[4],
  },
  macroHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[2],
  },
  macroHeaderTitle: {
    fontFamily: font.family,
    fontSize: 14,
    fontWeight: '700',
    color: color.text,
    letterSpacing: 0.2,
  },
  macroValueRow: {
    alignItems: 'center',
  },
  macroBig: {
    fontFamily: font.family,
    fontSize: 44,
    fontWeight: '800',
    color: color.text,
    letterSpacing: -1.4,
  },
  macroBigUnit: {
    fontSize: 18,
    fontWeight: '500',
    color: color.textMuted,
  },
  macroSub: {
    fontFamily: font.family,
    fontSize: 12,
    color: color.textMuted,
    marginTop: 4,
  },
  macroPills: {
    flexDirection: 'row',
    gap: space[2],
  },
  pill: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: space[3],
    borderRadius: radius.md,
    backgroundColor: 'rgba(20,20,20,0.45)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    borderTopWidth: 2,
  },
  pillValue: {
    fontFamily: font.family,
    fontSize: 16,
    fontWeight: '700',
    color: color.text,
  },
  pillUnit: {
    fontSize: 11,
    fontWeight: '500',
    color: color.textMuted,
  },
  pillLabel: {
    fontFamily: font.family,
    fontSize: 10,
    color: color.textMuted,
    marginTop: 4,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  portionCard: {
    paddingVertical: space[5],
    paddingHorizontal: space[5],
    borderRadius: radius.lg,
    backgroundColor: color.surfaceLight,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    gap: space[3],
  },
  portionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[2],
  },
  portionTitle: {
    fontFamily: font.family,
    fontSize: 14,
    fontWeight: '700',
    color: color.text,
  },
  portionRow: {
    flexDirection: 'row',
    gap: space[3],
  },
  portionLabel: {
    flex: 1,
    fontFamily: font.family,
    fontSize: 9,
    fontWeight: '700',
    color: color.text,
    letterSpacing: 1.6,
    textAlign: 'center',
    marginTop: space[2],
  },
  portionEditorRow: {
    flexDirection: 'row',
    gap: space[3],
  },
  stepper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[2],
  },
  stepperLarge: {
    flex: 1.4,
  },
  stepBtn: {
    minWidth: 44,
    paddingVertical: space[3],
    paddingHorizontal: space[2],
    borderRadius: 10,
    backgroundColor: 'rgba(20,20,20,0.45)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    alignItems: 'center',
  },
  stepBtnLabel: {
    fontFamily: font.family,
    fontSize: 13,
    fontWeight: '700',
    color: color.text,
  },
  stepValueWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: space[2],
    borderRadius: 10,
    backgroundColor: color.bg,
    borderWidth: 1,
    borderColor: color.whiteA15,
  },
  stepValue: {
    fontFamily: font.family,
    fontSize: 18,
    fontWeight: '700',
    color: color.text,
    textAlign: 'center',
    minWidth: 40,
    paddingVertical: 0,
  },
  stepSuffix: {
    fontFamily: font.family,
    fontSize: 12,
    color: color.textMuted,
  },
  footer: {
    paddingHorizontal: space[5],
    paddingTop: space[3],
    gap: space[2],
  },
  primaryBtn: {
    backgroundColor: color.text,
    paddingVertical: space[4],
    borderRadius: radius.pill,
    alignItems: 'center',
  },
  primaryLabel: {
    fontFamily: font.family,
    fontSize: 15,
    fontWeight: '700',
    color: color.bg,
    letterSpacing: 0.4,
  },
  deleteBtn: {
    paddingVertical: space[3],
    borderRadius: radius.pill,
    alignItems: 'center',
    backgroundColor: 'rgba(229, 90, 76, 0.10)',
    borderWidth: 1,
    borderColor: 'rgba(229, 90, 76, 0.30)',
  },
  deleteLabel: {
    fontFamily: font.family,
    fontSize: 14,
    fontWeight: '700',
    color: color.danger,
    letterSpacing: 0.4,
  },
});
