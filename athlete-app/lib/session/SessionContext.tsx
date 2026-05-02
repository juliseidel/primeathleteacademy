import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';

type ActiveSessionState = {
  workoutId: string;
  startedAt: number;             // ms epoch
  currentExerciseId: string | null;
  pausesEndAt: Record<string, number>;  // setId → epoch ms when pause ends
};

type SessionContextValue = {
  active: ActiveSessionState | null;
  isActive: (workoutId: string) => boolean;
  startSession: (workoutId: string) => void;
  setCurrentExercise: (exerciseId: string | null) => void;
  startPause: (setId: string, restSec: number) => void;
  cancelPause: (setId: string) => void;
  pauseSecondsLeft: (setId: string) => number;
  endSession: () => Promise<void>;
};

const SessionContext = createContext<SessionContextValue | null>(null);

const STORAGE_KEY = (id: string) => `session:active:${id}`;
const ACTIVE_KEY = 'session:active:current';

export function SessionProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState<ActiveSessionState | null>(null);
  const [, forceTick] = useState(0);
  const tickInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  // Restore on app start
  useEffect(() => {
    (async () => {
      try {
        const id = await AsyncStorage.getItem(ACTIVE_KEY);
        if (!id) return;
        const raw = await AsyncStorage.getItem(STORAGE_KEY(id));
        if (raw) setActive(JSON.parse(raw) as ActiveSessionState);
      } catch {
        // ignore
      }
    })();
  }, []);

  // Persist on change
  useEffect(() => {
    (async () => {
      if (active) {
        await AsyncStorage.setItem(ACTIVE_KEY, active.workoutId);
        await AsyncStorage.setItem(STORAGE_KEY(active.workoutId), JSON.stringify(active));
      } else {
        await AsyncStorage.removeItem(ACTIVE_KEY);
      }
    })();
  }, [active]);

  // 1-second tick for pause-timer reactivity
  useEffect(() => {
    if (active && Object.keys(active.pausesEndAt).length > 0) {
      tickInterval.current = setInterval(() => forceTick((n) => n + 1), 1000);
      return () => {
        if (tickInterval.current) clearInterval(tickInterval.current);
      };
    }
    return;
  }, [active]);

  const startSession = useCallback((workoutId: string) => {
    setActive({
      workoutId,
      startedAt: Date.now(),
      currentExerciseId: null,
      pausesEndAt: {},
    });
  }, []);

  const setCurrentExercise = useCallback((exerciseId: string | null) => {
    setActive((prev) => (prev ? { ...prev, currentExerciseId: exerciseId } : prev));
  }, []);

  const startPause = useCallback((setId: string, restSec: number) => {
    setActive((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        pausesEndAt: { ...prev.pausesEndAt, [setId]: Date.now() + restSec * 1000 },
      };
    });
  }, []);

  const cancelPause = useCallback((setId: string) => {
    setActive((prev) => {
      if (!prev) return prev;
      const { [setId]: _, ...rest } = prev.pausesEndAt;
      return { ...prev, pausesEndAt: rest };
    });
  }, []);

  const pauseSecondsLeft = useCallback(
    (setId: string): number => {
      if (!active) return 0;
      const endAt = active.pausesEndAt[setId];
      if (!endAt) return 0;
      return Math.max(0, Math.ceil((endAt - Date.now()) / 1000));
    },
    [active],
  );

  const endSession = useCallback(async () => {
    if (active) {
      await AsyncStorage.removeItem(STORAGE_KEY(active.workoutId));
    }
    setActive(null);
  }, [active]);

  return (
    <SessionContext.Provider
      value={{
        active,
        isActive: (id) => active?.workoutId === id,
        startSession,
        setCurrentExercise,
        startPause,
        cancelPause,
        pauseSecondsLeft,
        endSession,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error('useSession must be used within SessionProvider');
  return ctx;
}
