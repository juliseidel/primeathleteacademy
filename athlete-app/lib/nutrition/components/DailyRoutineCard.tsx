import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { displaySerif } from '@/lib/design/light';
import { color, font, radius, space } from '@/lib/design/tokens';
import type { DailySupplement } from '@/lib/nutrition/nutritionData';

const PRIORITY_LABEL: Record<DailySupplement['priority'], string> = {
  daily: 'Täglich',
  very_recommended: 'Sehr sinnvoll',
  pre_training: 'Vor Training',
  post_training: 'Nach Training',
};

const PRIORITY_ORDER: DailySupplement['priority'][] = [
  'daily',
  'pre_training',
  'post_training',
  'very_recommended',
];

type Props = {
  supplements: DailySupplement[];
  checkedIds: Set<string>;
  onToggle: (id: string, nextChecked: boolean) => void;
};

export function DailyRoutineCard({ supplements, checkedIds, onToggle }: Props) {
  const [expanded, setExpanded] = useState(false);

  const grouped = useMemo(() => {
    const map = new Map<DailySupplement['priority'], DailySupplement[]>();
    for (const s of supplements) {
      if (!map.has(s.priority)) map.set(s.priority, []);
      map.get(s.priority)!.push(s);
    }
    return PRIORITY_ORDER.filter((p) => map.has(p)).map((p) => ({ priority: p, items: map.get(p)! }));
  }, [supplements]);

  const totalChecked = supplements.filter((s) => checkedIds.has(s.id)).length;

  return (
    <View style={styles.card}>
      <Pressable onPress={() => setExpanded((e) => !e)} style={styles.header}>
        <View style={styles.iconBox}>
          <Ionicons name="sparkles" size={14} color={color.text} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>The Difference</Text>
          <Text style={styles.subtitle}>Daily Routine — {totalChecked} / {supplements.length} erledigt</Text>
        </View>
        <Ionicons
          name={expanded ? 'chevron-up' : 'chevron-down'}
          size={18}
          color={color.textMuted}
        />
      </Pressable>

      {expanded ? (
        <View style={styles.body}>
          {grouped.map(({ priority, items }) => (
            <View key={priority} style={styles.group}>
              <Text style={styles.groupLabel}>{PRIORITY_LABEL[priority]}</Text>
              {items.map((item) => (
                <SupplementRow
                  key={item.id}
                  item={item}
                  checked={checkedIds.has(item.id)}
                  onToggle={(next) => onToggle(item.id, next)}
                />
              ))}
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
}

function SupplementRow({
  item,
  checked,
  onToggle,
}: {
  item: DailySupplement;
  checked: boolean;
  onToggle: (next: boolean) => void;
}) {
  return (
    <Pressable onPress={() => onToggle(!checked)} style={styles.row}>
      <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
        {checked ? <Ionicons name="checkmark" size={12} color={color.bg} /> : null}
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.itemName, checked && styles.itemNameChecked]}>{item.name}</Text>
        {item.when_to_take || item.amount ? (
          <Text style={styles.itemDetail}>
            {[item.when_to_take, item.amount].filter(Boolean).join(' · ')}
          </Text>
        ) : null}
        {item.benefit ? <Text style={styles.itemBenefit}>{item.benefit}</Text> : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    backgroundColor: color.blackA55,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[3],
    padding: space[5],
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: radius.sm,
    backgroundColor: color.whiteA08,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: displaySerif as string,
    fontSize: 18,
    fontStyle: 'italic',
    color: color.text,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontFamily: font.family,
    fontSize: 11,
    color: color.text,
    letterSpacing: 0.4,
    marginTop: 2,
    fontWeight: '600',
  },
  body: {
    paddingHorizontal: space[5],
    paddingBottom: space[5],
    gap: space[4],
  },
  group: {
    gap: space[2],
  },
  groupLabel: {
    fontFamily: font.family,
    fontSize: 9,
    fontWeight: '700',
    color: color.text,
    letterSpacing: 1.8,
    paddingTop: space[2],
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: space[3],
    paddingVertical: space[2],
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.30)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  checkboxChecked: {
    backgroundColor: color.text,
    borderColor: color.text,
  },
  itemName: {
    fontFamily: font.family,
    fontSize: 14,
    fontWeight: '500',
    color: color.text,
  },
  itemNameChecked: {
    textDecorationLine: 'line-through',
    color: color.textMuted,
  },
  itemDetail: {
    fontFamily: font.family,
    fontSize: 11,
    color: color.textMuted,
    marginTop: 2,
  },
  itemBenefit: {
    fontFamily: font.family,
    fontSize: 11,
    fontStyle: 'italic',
    color: color.textDim,
    marginTop: 2,
  },
});
