import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';

export type NavMode = 'main' | 'training-sub' | 'nutrition-sub';
export type TrainingSubTab = 'heute' | 'woche' | 'historie' | 'fortschritt';
export type NutritionSubTab = 'heute' | 'plan' | 'lebensmittel' | 'matchday';

type AthleteNavContextValue = {
  mode: NavMode;
  trainingSubTab: TrainingSubTab;
  nutritionSubTab: NutritionSubTab;
  splashLabel: string | null;

  enterTrainingSub: () => void;
  enterNutritionSub: () => void;
  exitToMain: () => void;

  setTrainingSub: (tab: TrainingSubTab) => void;
  setNutritionSub: (tab: NutritionSubTab) => void;
};

const AthleteNavContext = createContext<AthleteNavContextValue | null>(null);

// Matches WelcomeSplash animation total: 720ms in + 1500ms hold + 520ms out + buffer
const SPLASH_DURATION_MS = 2840;

export function AthleteNavProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<NavMode>('main');
  const [trainingSubTab, setTrainingSubTab] = useState<TrainingSubTab>('heute');
  const [nutritionSubTab, setNutritionSubTab] = useState<NutritionSubTab>('heute');
  const [splashLabel, setSplashLabel] = useState<string | null>(null);
  const splashTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (splashTimer.current) clearTimeout(splashTimer.current);
    };
  }, []);

  const triggerSplash = useCallback((label: string) => {
    setSplashLabel(label);
    if (splashTimer.current) clearTimeout(splashTimer.current);
    splashTimer.current = setTimeout(() => {
      setSplashLabel(null);
    }, SPLASH_DURATION_MS);
  }, []);

  const enterTrainingSub = useCallback(() => {
    setMode('training-sub');
    triggerSplash('TRAINING');
  }, [triggerSplash]);

  const enterNutritionSub = useCallback(() => {
    setMode('nutrition-sub');
    triggerSplash('ERNÄHRUNG');
  }, [triggerSplash]);

  const exitToMain = useCallback(() => {
    setMode('main');
    triggerSplash('HOME');
  }, [triggerSplash]);

  const setTrainingSub = useCallback((tab: TrainingSubTab) => {
    setTrainingSubTab(tab);
  }, []);

  const setNutritionSub = useCallback((tab: NutritionSubTab) => {
    setNutritionSubTab(tab);
  }, []);

  return (
    <AthleteNavContext.Provider
      value={{
        mode,
        trainingSubTab,
        nutritionSubTab,
        splashLabel,
        enterTrainingSub,
        enterNutritionSub,
        exitToMain,
        setTrainingSub,
        setNutritionSub,
      }}
    >
      {children}
    </AthleteNavContext.Provider>
  );
}

export function useAthleteNav() {
  const ctx = useContext(AthleteNavContext);
  if (!ctx) throw new Error('useAthleteNav must be used within AthleteNavProvider');
  return ctx;
}
