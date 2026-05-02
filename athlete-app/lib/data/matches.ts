import { useQuery } from '@tanstack/react-query';

import type { Tables } from '@/lib/database.types';
import { addDays, localIso, startOfWeek } from '@/lib/data/dates';
import { supabase } from '@/lib/supabase';

export type MatchRow = Tables<'matches'>;

function startOfWeekIso(date: Date = new Date()): string {
  return localIso(startOfWeek(date));
}

function addDaysIso(iso: string, days: number): string {
  const [y, m, d] = iso.split('-').map(Number);
  const date = new Date(y, (m ?? 1) - 1, d);
  return localIso(addDays(date, days));
}

async function fetchMatchesRange(athleteId: string, fromIso: string, toIso: string): Promise<MatchRow[]> {
  const { data, error } = await supabase
    .from('matches')
    .select('*')
    .eq('athlete_id', athleteId)
    .gte('match_date', fromIso)
    .lte('match_date', toIso)
    .order('match_date', { ascending: true })
    .order('match_time', { ascending: true, nullsFirst: false });

  if (error) throw error;
  return (data ?? []) as MatchRow[];
}

export function useWeekMatches(athleteId: string | undefined, anchorDate?: Date) {
  const monday = startOfWeekIso(anchorDate);
  const sunday = addDaysIso(monday, 6);
  return useQuery<MatchRow[]>({
    queryKey: ['matches', 'week', athleteId, monday],
    enabled: !!athleteId,
    queryFn: () => fetchMatchesRange(athleteId!, monday, sunday),
  });
}
