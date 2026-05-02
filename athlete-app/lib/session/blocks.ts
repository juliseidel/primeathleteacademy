import type { ExerciseRow } from '@/lib/data/workouts';

export type Block = {
  /** Block-Prefix wie 'A', 'B', 'C' — oder null für standalone Übungen */
  label: string | null;
  /** Originale Übungen im Block, sortiert nach order_index */
  exercises: ExerciseRow[];
  /** True wenn Block mehrere Übungen hat (echter Supersatz) */
  isSuperset: boolean;
};

export type ActiveLocation = {
  blockIdx: number;
  exerciseIdx: number;       // index innerhalb des Blocks
  roundIdx: number;          // 0-based — entspricht set_number - 1 (oder Position in der Sets-Liste)
  setId: string;
};

/**
 * Gruppiert Übungen nach group_label-Prefix.
 *
 *  group_label: 'A1' | 'A2' → Block 'A' (Supersatz)
 *  group_label: 'B1'        → Block 'B' (alleine, kein Supersatz)
 *  group_label: null         → Block null (standalone)
 *
 * Standalone-Übungen ohne group_label werden nicht zusammen gruppiert,
 * jede ist ein eigener Block.
 */
export function getBlocks(exercises: ExerciseRow[]): Block[] {
  const sorted = [...exercises].sort((a, b) => a.order_index - b.order_index);
  const blocks: Block[] = [];
  let currentLabel: string | null = '__INIT__';
  let currentBlock: Block | null = null;

  for (const ex of sorted) {
    const prefix = blockLabelPrefix(ex.group_label);

    // Standalone (no group_label) → eigener Block pro Übung
    if (prefix === null) {
      if (currentBlock) blocks.push(currentBlock);
      currentBlock = { label: null, exercises: [ex], isSuperset: false };
      currentLabel = `__STANDALONE_${blocks.length}__`;
      blocks.push(currentBlock);
      currentBlock = null;
      continue;
    }

    if (prefix !== currentLabel) {
      if (currentBlock) blocks.push(currentBlock);
      currentBlock = { label: prefix, exercises: [ex], isSuperset: false };
      currentLabel = prefix;
    } else if (currentBlock) {
      currentBlock.exercises.push(ex);
      currentBlock.isSuperset = true;
    }
  }

  if (currentBlock) blocks.push(currentBlock);
  return blocks;
}

function blockLabelPrefix(groupLabel: string | null): string | null {
  if (!groupLabel) return null;
  // 'A1' → 'A', 'B2' → 'B', 'C' → 'C'
  const match = groupLabel.match(/^([A-Z]+)/);
  return match?.[1] ?? null;
}

/**
 * Findet den aktiven Satz nach Supersatz-Round-Pattern:
 * Iteriere durch Blocks → Rounds (0,1,2,...) → Übungen im Block →
 * erster nicht completed Set ist aktiv.
 *
 * Beispiel Block A mit A1 (3 Sätze) + A2 (3 Sätze):
 *   Round 0: A1 Set 1 → A2 Set 1
 *   Round 1: A1 Set 2 → A2 Set 2
 *   Round 2: A1 Set 3 → A2 Set 3
 */
export function findActiveLocation(blocks: Block[]): ActiveLocation | null {
  for (let bIdx = 0; bIdx < blocks.length; bIdx++) {
    const block = blocks[bIdx];
    const maxRounds = Math.max(0, ...block.exercises.map((e) => e.sets.length));

    for (let rIdx = 0; rIdx < maxRounds; rIdx++) {
      for (let eIdx = 0; eIdx < block.exercises.length; eIdx++) {
        const ex = block.exercises[eIdx];
        const set = ex.sets[rIdx];
        if (set && !set.completed) {
          return { blockIdx: bIdx, exerciseIdx: eIdx, roundIdx: rIdx, setId: set.id };
        }
      }
    }
  }
  return null;
}

export function isBlockComplete(block: Block): boolean {
  return block.exercises.every((e) => e.sets.length > 0 && e.sets.every((s) => s.completed));
}

export function blockSetsTotal(block: Block): number {
  return block.exercises.reduce((sum, e) => sum + e.sets.length, 0);
}

export function blockSetsCompleted(block: Block): number {
  return block.exercises.reduce(
    (sum, e) => sum + e.sets.filter((s) => s.completed).length,
    0,
  );
}

export function blockTotalRounds(block: Block): number {
  return Math.max(0, ...block.exercises.map((e) => e.sets.length));
}
