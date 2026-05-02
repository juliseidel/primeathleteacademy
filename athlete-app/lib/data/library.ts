import { useQuery } from '@tanstack/react-query';

import type { Tables } from '@/lib/database.types';
import { supabase } from '@/lib/supabase';

export type LibraryRow = Tables<'exercise_library'>;

export function useExerciseLibrary() {
  return useQuery<LibraryRow[]>({
    queryKey: ['exercise-library'],
    staleTime: 1000 * 60 * 30, // 30min — Library ändert sich selten
    queryFn: async () => {
      const { data, error } = await supabase
        .from('exercise_library')
        .select('*')
        .eq('is_archived', false)
        .order('name', { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });
}
