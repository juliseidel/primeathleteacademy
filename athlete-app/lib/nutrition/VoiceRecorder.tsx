/**
 * VoiceRecorder — separate Komponente, damit `expo-audio` lazy geladen werden
 * kann. Wenn das native Modul im Dev-Build nicht vorhanden ist (vor dem
 * nächsten EAS-Build), wird diese Datei nicht required und der Foto-Flow läuft
 * trotzdem (nur ohne Voice-Note).
 *
 * Wichtig: dieser File wird NUR via require() in photo.tsx geladen, NIE per
 * direktem ES-Import — sonst trifft Metro den expo-audio-Import und crasht
 * den ganzen Bundle.
 */

import { Ionicons } from '@expo/vector-icons';
import {
  RecordingPresets,
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
  useAudioRecorder,
} from 'expo-audio';
import { useEffect, useRef, useState } from 'react';
import { Alert, Animated, Easing, Pressable, StyleSheet, Text, View } from 'react-native';

import { color, font, radius, space } from '@/lib/design/tokens';

export type VoiceRecorderProps = {
  /** Aktuelle Voice-URI (null wenn keine Aufnahme da) */
  voiceUri: string | null;
  /** Aufgenommene Sekunden (für Anzeige + Persistenz im Parent) */
  voiceSeconds: number;
  /** Wird aufgerufen wenn Aufnahme fertig oder verworfen wurde */
  onVoiceChange: (uri: string | null, seconds: number) => void;
  /** Wird aufgerufen wenn Recording-Status ändert (Parent disabled "Analyse" während recording) */
  onRecordingChange: (isRecording: boolean) => void;
};

export function VoiceRecorder({ voiceUri, voiceSeconds, onVoiceChange, onRecordingChange }: VoiceRecorderProps) {
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const [isRecording, setIsRecording] = useState(false);
  const [localSeconds, setLocalSeconds] = useState(voiceSeconds);
  const recordingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const micPulse = useRef(new Animated.Value(1)).current;

  // Parent informieren bei Recording-Status-Änderung
  useEffect(() => {
    onRecordingChange(isRecording);
  }, [isRecording, onRecordingChange]);

  // Mic-Pulse-Animation
  useEffect(() => {
    if (isRecording) {
      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(micPulse, { toValue: 1.25, duration: 700, easing: Easing.out(Easing.quad), useNativeDriver: true }),
          Animated.timing(micPulse, { toValue: 1, duration: 700, easing: Easing.in(Easing.quad), useNativeDriver: true }),
        ]),
      );
      loop.start();
      return () => loop.stop();
    }
    micPulse.setValue(1);
    return undefined;
  }, [isRecording, micPulse]);

  const startRecording = async () => {
    try {
      const perm = await requestRecordingPermissionsAsync();
      if (!perm.granted) {
        Alert.alert('Mikrofon-Zugriff benötigt', 'Bitte in den iOS-Einstellungen erlauben.');
        return;
      }
      await setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true });
      await recorder.prepareToRecordAsync();
      recorder.record();
      setIsRecording(true);
      setLocalSeconds(0);
      onVoiceChange(null, 0);
      recordingTimerRef.current = setInterval(() => setLocalSeconds((s) => s + 1), 1000);
    } catch (err) {
      Alert.alert('Aufnahme-Fehler', err instanceof Error ? err.message : 'Unbekannter Fehler');
    }
  };

  const stopRecording = async () => {
    try {
      await recorder.stop();
      setIsRecording(false);
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
      const uri = recorder.uri;
      if (uri) onVoiceChange(uri, localSeconds);
    } catch (err) {
      Alert.alert('Stop-Fehler', err instanceof Error ? err.message : 'Unbekannter Fehler');
    }
  };

  const discard = () => {
    setLocalSeconds(0);
    onVoiceChange(null, 0);
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Sprachnotiz (optional)</Text>
      <Text style={styles.sub}>
        Sag z.B. „150g Reis, 200g Hähnchen, einen Esslöffel Öl" — die KI nutzt das zur Korrektur.
      </Text>
      {!voiceUri && !isRecording ? (
        <Pressable onPress={startRecording} style={({ pressed }) => [styles.micBtn, pressed && { opacity: 0.7 }]}>
          <Ionicons name="mic-outline" size={26} color={color.text} />
          <Text style={styles.micBtnLabel}>Aufnahme starten</Text>
        </Pressable>
      ) : null}
      {isRecording ? (
        <View style={styles.recordingRow}>
          <Animated.View style={[styles.recordingDot, { transform: [{ scale: micPulse }] }]} />
          <Text style={styles.recordingTimer}>{formatDuration(localSeconds)}</Text>
          <Pressable onPress={stopRecording} style={({ pressed }) => [styles.stopBtn, pressed && { opacity: 0.7 }]}>
            <Ionicons name="stop" size={18} color={color.bg} />
            <Text style={styles.stopBtnLabel}>Stopp</Text>
          </Pressable>
        </View>
      ) : null}
      {voiceUri && !isRecording ? (
        <View style={styles.doneRow}>
          <Ionicons name="checkmark-circle" size={18} color={color.macroProtein} />
          <Text style={styles.doneLabel}>Aufnahme: {formatDuration(voiceSeconds)}</Text>
          <Pressable onPress={discard} hitSlop={6}>
            <Text style={styles.discardLabel}>Verwerfen</Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

const styles = StyleSheet.create({
  card: {
    padding: space[5],
    borderRadius: radius.lg,
    backgroundColor: color.blackA40,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    gap: space[3],
  },
  title: {
    fontFamily: font.family,
    fontSize: 16,
    fontWeight: '700',
    color: color.text,
  },
  sub: {
    fontFamily: font.family,
    fontSize: 12,
    color: color.textMuted,
    lineHeight: 18,
  },
  micBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[2],
    paddingVertical: space[3],
    paddingHorizontal: space[4],
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    alignSelf: 'flex-start',
  },
  micBtnLabel: {
    fontFamily: font.family,
    fontSize: 14,
    fontWeight: '600',
    color: color.text,
  },
  recordingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[3],
  },
  recordingDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: color.danger,
  },
  recordingTimer: {
    flex: 1,
    fontFamily: font.family,
    fontSize: 16,
    fontWeight: '700',
    color: color.text,
    fontVariant: ['tabular-nums'],
  },
  stopBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: space[3],
    paddingVertical: space[2],
    borderRadius: radius.pill,
    backgroundColor: color.text,
  },
  stopBtnLabel: {
    fontFamily: font.family,
    fontSize: 13,
    fontWeight: '700',
    color: color.bg,
  },
  doneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[2],
  },
  doneLabel: {
    flex: 1,
    fontFamily: font.family,
    fontSize: 13,
    color: color.text,
  },
  discardLabel: {
    fontFamily: font.family,
    fontSize: 12,
    color: color.danger,
    textDecorationLine: 'underline',
  },
});
