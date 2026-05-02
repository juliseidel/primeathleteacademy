import { useQuery } from '@tanstack/react-query';

import type { Tables } from '@/lib/database.types';
import { supabase } from '@/lib/supabase';

export type Profile = Tables<'profiles'>;
export type AthleteProfile = Tables<'athlete_profiles'>;

export function useMyProfile(userId: string | undefined) {
  return useQuery({
    queryKey: ['profile', userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId!)
        .single();
      if (error) throw error;
      return data as Profile;
    },
  });
}

export function useMyAthleteProfile(userId: string | undefined) {
  return useQuery({
    queryKey: ['athlete-profile', userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('athlete_profiles')
        .select('*')
        .eq('id', userId!)
        .single();
      if (error) throw error;
      return data as AthleteProfile;
    },
  });
}

export function firstName(fullName: string): string {
  return fullName.split(' ')[0] ?? fullName;
}

export function initialsFor(fullName: string): string {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? '?';
  return (parts[0][0]! + parts[parts.length - 1][0]!).toUpperCase();
}
