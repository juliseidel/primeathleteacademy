import { Ionicons } from '@expo/vector-icons';
import { useQueryClient } from '@tanstack/react-query';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system/legacy';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAuth } from '@/lib/auth/AuthContext';
import { AvatarService } from '@/lib/avatar/AvatarService';
import { loadPaaLogoBase64 } from '@/lib/avatar/loadLogo';
import { displaySerif } from '@/lib/design/light';
import { color, font, radius, space } from '@/lib/design/tokens';

type Phase =
  | { kind: 'idle' }
  | { kind: 'selected'; selfieDataUri: string }
  | { kind: 'generating'; selfieDataUri: string; status: string }
  | {
      kind: 'result';
      selfieDataUri: string;
      avatarDataUri: string;
      faceDescription: string;
    }
  | { kind: 'error'; selfieDataUri: string; message: string };

export default function AvatarSetupRoute() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { session } = useAuth();
  const [phase, setPhase] = useState<Phase>({ kind: 'idle' });
  const [saving, setSaving] = useState(false);

  const userId = session?.user.id;

  async function pickFromLibrary() {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (perm.status !== 'granted') {
      Alert.alert('Foto-Zugriff', 'Bitte erlaube den Zugriff auf deine Foto-Bibliothek in den Einstellungen.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.85,
      base64: false,
    });
    if (!result.canceled && result.assets[0]) {
      const dataUri = await assetToDataUri(result.assets[0]);
      setPhase({ kind: 'selected', selfieDataUri: dataUri });
    }
  }

  async function takeSelfie() {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (perm.status !== 'granted') {
      Alert.alert('Kamera-Zugriff', 'Bitte erlaube den Kamera-Zugriff in den Einstellungen.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.85,
      cameraType: ImagePicker.CameraType.front,
    });
    if (!result.canceled && result.assets[0]) {
      const dataUri = await assetToDataUri(result.assets[0]);
      setPhase({ kind: 'selected', selfieDataUri: dataUri });
    }
  }

  async function generate() {
    if (phase.kind !== 'selected' && phase.kind !== 'error') return;
    const selfieDataUri = phase.selfieDataUri;

    try {
      setPhase({ kind: 'generating', selfieDataUri, status: 'Logo wird vorbereitet…' });
      const { base64: logoBase64, mimeType: logoMimeType } = await loadPaaLogoBase64();

      setPhase({
        kind: 'generating',
        selfieDataUri,
        status: 'Gesicht wird analysiert…',
      });
      // describeFace + generateAvatarImage in einem Call gekapselt:
      const result = await AvatarService.generateFromSelfie(selfieDataUri, {
        logoBase64,
        logoMimeType,
      });

      setPhase({
        kind: 'result',
        selfieDataUri,
        avatarDataUri: result.avatarDataUri,
        faceDescription: result.faceDescription,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unbekannter Fehler';
      setPhase({ kind: 'error', selfieDataUri, message });
    }
  }

  async function saveAndContinue() {
    if (phase.kind !== 'result' || !userId) return;
    try {
      setSaving(true);
      await AvatarService.persistAvatar({
        userId,
        selfieDataUri: phase.selfieDataUri,
        faceDescription: phase.faceDescription,
        avatarDataUri: phase.avatarDataUri,
      });

      // Cache sofort updaten — sonst sieht der RootNav-Redirect noch keinen
      // Avatar und schickt uns sofort zurück hierher.
      queryClient.setQueryData(['athlete-profile', userId], (old: unknown) => {
        const base = (old as Record<string, unknown> | undefined) ?? {};
        return {
          ...base,
          avatar_data_uri: phase.avatarDataUri,
          selfie_data_uri: phase.selfieDataUri,
          face_description: phase.faceDescription,
          avatar_updated_at: new Date().toISOString(),
        };
      });
      await queryClient.invalidateQueries({ queryKey: ['athlete-profile', userId] });

      router.replace('/(tabs)');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Speichern fehlgeschlagen';
      Alert.alert('Fehler', message);
    } finally {
      setSaving(false);
    }
  }

  function reset() {
    setPhase({ kind: 'idle' });
  }

  return (
    <View style={styles.root}>
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingTop: insets.top + space[6], paddingBottom: insets.bottom + space[8] },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.eyebrow}>SCHRITT 1 · AVATAR</Text>
          <Text style={styles.title}>Erstelle deinen digitalen Zwilling</Text>
          <Text style={styles.subtitle}>
            Lade ein Foto von dir hoch — wir verwandeln dich in einen PAA-Athleten im
            Tech-Fleece-Trikot. Das Avatar erscheint auf deinem Home-Screen jeden Tag.
          </Text>
        </View>

        {phase.kind === 'idle' ? (
          <IdleView onCamera={takeSelfie} onLibrary={pickFromLibrary} />
        ) : phase.kind === 'selected' ? (
          <SelectedView
            selfieDataUri={phase.selfieDataUri}
            onGenerate={generate}
            onChange={reset}
          />
        ) : phase.kind === 'generating' ? (
          <GeneratingView selfieDataUri={phase.selfieDataUri} status={phase.status} />
        ) : phase.kind === 'result' ? (
          <ResultView
            avatarDataUri={phase.avatarDataUri}
            saving={saving}
            onSave={saveAndContinue}
            onReject={() => setPhase({ kind: 'selected', selfieDataUri: phase.selfieDataUri })}
            onChange={reset}
          />
        ) : (
          <ErrorView
            message={phase.message}
            onRetry={generate}
            onChange={reset}
          />
        )}
      </ScrollView>
    </View>
  );
}

// ─── Phase Views ────────────────────────────────────────────────────────────

function IdleView({
  onCamera,
  onLibrary,
}: {
  onCamera: () => void;
  onLibrary: () => void;
}) {
  return (
    <Animated.View entering={FadeIn.duration(400)} style={styles.idleBody}>
      <View style={styles.uploadCard}>
        <View style={styles.uploadIcon}>
          <Ionicons name="person-add-outline" size={32} color={color.gold} />
        </View>
        <Text style={styles.uploadTitle}>Foto wählen</Text>
        <Text style={styles.uploadHint}>
          Frontal, gutes Licht, möglichst klares Gesicht — funktioniert mit jedem
          aktuellen Selfie.
        </Text>
      </View>

      <Pressable
        onPress={onCamera}
        style={({ pressed }) => [styles.primaryBtn, pressed && { opacity: 0.92 }]}
      >
        <Ionicons name="camera-outline" size={18} color={color.bg} />
        <Text style={styles.primaryBtnLabel}>Selfie aufnehmen</Text>
      </Pressable>

      <Pressable
        onPress={onLibrary}
        style={({ pressed }) => [styles.secondaryBtn, pressed && { opacity: 0.85 }]}
      >
        <Ionicons name="images-outline" size={18} color={color.text} />
        <Text style={styles.secondaryBtnLabel}>Aus Bibliothek wählen</Text>
      </Pressable>
    </Animated.View>
  );
}

function SelectedView({
  selfieDataUri,
  onGenerate,
  onChange,
}: {
  selfieDataUri: string;
  onGenerate: () => void;
  onChange: () => void;
}) {
  return (
    <Animated.View entering={FadeIn.duration(300)} style={styles.previewBody}>
      <Image source={{ uri: selfieDataUri }} style={styles.previewImage} />

      <Pressable
        onPress={onGenerate}
        style={({ pressed }) => [styles.primaryBtn, pressed && { opacity: 0.92 }]}
      >
        <Ionicons name="sparkles" size={18} color={color.bg} />
        <Text style={styles.primaryBtnLabel}>Avatar generieren</Text>
      </Pressable>

      <Pressable onPress={onChange} hitSlop={12}>
        <Text style={styles.linkLabel}>Anderes Foto wählen</Text>
      </Pressable>

      <Text style={styles.fineprint}>
        Dauert ~15-30 Sekunden. Dein Foto wird sicher in deinem Profil gespeichert.
      </Text>
    </Animated.View>
  );
}

function GeneratingView({
  selfieDataUri,
  status,
}: {
  selfieDataUri: string;
  status: string;
}) {
  return (
    <Animated.View entering={FadeIn.duration(300)} style={styles.previewBody}>
      <View style={styles.previewWrap}>
        <Image source={{ uri: selfieDataUri }} style={[styles.previewImage, { opacity: 0.5 }]} />
        <View style={styles.loadingOverlay}>
          <ActivityIndicator color={color.gold} size="large" />
        </View>
      </View>
      <Text style={styles.statusText}>{status}</Text>
      <Text style={styles.fineprint}>
        Bitte warten — Gemini Nano Banana arbeitet. Bei Bedarf wird auf das
        Fallback-Modell umgeschaltet.
      </Text>
    </Animated.View>
  );
}

function ResultView({
  avatarDataUri,
  saving,
  onSave,
  onReject,
  onChange,
}: {
  avatarDataUri: string;
  saving: boolean;
  onSave: () => void;
  onReject: () => void;
  onChange: () => void;
}) {
  return (
    <Animated.View entering={FadeIn.duration(400)} style={styles.previewBody}>
      <Image source={{ uri: avatarDataUri }} style={styles.avatarImage} />

      <Pressable
        onPress={onSave}
        disabled={saving}
        style={({ pressed }) => [styles.primaryBtn, (pressed || saving) && { opacity: 0.85 }]}
      >
        {saving ? (
          <ActivityIndicator color={color.bg} />
        ) : (
          <>
            <Ionicons name="checkmark" size={18} color={color.bg} />
            <Text style={styles.primaryBtnLabel}>Übernehmen</Text>
          </>
        )}
      </Pressable>

      <Pressable
        onPress={onReject}
        disabled={saving}
        style={({ pressed }) => [styles.secondaryBtn, pressed && { opacity: 0.85 }]}
      >
        <Ionicons name="refresh" size={18} color={color.text} />
        <Text style={styles.secondaryBtnLabel}>Neu generieren</Text>
      </Pressable>

      <Pressable onPress={onChange} disabled={saving} hitSlop={12}>
        <Text style={styles.linkLabel}>Anderes Foto wählen</Text>
      </Pressable>
    </Animated.View>
  );
}

function ErrorView({
  message,
  onRetry,
  onChange,
}: {
  message: string;
  onRetry: () => void;
  onChange: () => void;
}) {
  return (
    <Animated.View entering={FadeIn.duration(300)} style={styles.previewBody}>
      <View style={styles.errorBox}>
        <Ionicons name="alert-circle-outline" size={24} color={color.danger} />
        <Text style={styles.errorTitle}>Generation fehlgeschlagen</Text>
        <Text style={styles.errorBody}>{message}</Text>
      </View>

      <Pressable
        onPress={onRetry}
        style={({ pressed }) => [styles.primaryBtn, pressed && { opacity: 0.92 }]}
      >
        <Ionicons name="refresh" size={18} color={color.bg} />
        <Text style={styles.primaryBtnLabel}>Erneut versuchen</Text>
      </Pressable>

      <Pressable onPress={onChange} hitSlop={12}>
        <Text style={styles.linkLabel}>Anderes Foto wählen</Text>
      </Pressable>
    </Animated.View>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function assetToDataUri(asset: ImagePicker.ImagePickerAsset): Promise<string> {
  const base64 = await FileSystem.readAsStringAsync(asset.uri, {
    encoding: FileSystem.EncodingType.Base64,
  });
  const mimeType = asset.mimeType ?? 'image/jpeg';
  return `data:${mimeType};base64,${base64}`;
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: color.bg,
  },
  scroll: {
    paddingHorizontal: space[5],
  },
  header: {
    marginBottom: space[6],
  },
  eyebrow: {
    fontFamily: font.family,
    fontSize: 11,
    fontWeight: '700',
    color: color.gold,
    letterSpacing: 3.0,
    marginBottom: space[3],
  },
  title: {
    fontFamily: displaySerif as string,
    fontSize: 34,
    fontStyle: 'italic',
    fontWeight: '400',
    color: color.text,
    letterSpacing: -0.6,
    lineHeight: 40,
    marginBottom: space[3],
  },
  subtitle: {
    fontFamily: font.family,
    fontSize: 14,
    color: color.textMuted,
    lineHeight: 22,
  },

  idleBody: {
    gap: space[4],
  },
  uploadCard: {
    paddingVertical: space[6],
    paddingHorizontal: space[5],
    borderRadius: radius.lg,
    backgroundColor: 'rgba(20,20,20,0.55)',
    borderWidth: 1,
    borderColor: color.goldA20,
    alignItems: 'center',
    gap: space[3],
    marginBottom: space[2],
  },
  uploadIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: color.goldA10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: space[2],
  },
  uploadTitle: {
    fontFamily: displaySerif as string,
    fontSize: 22,
    fontStyle: 'italic',
    color: color.text,
  },
  uploadHint: {
    fontFamily: font.family,
    fontSize: 12,
    color: color.textMuted,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: space[3],
  },

  previewBody: {
    alignItems: 'center',
    gap: space[4],
  },
  previewWrap: {
    position: 'relative',
  },
  previewImage: {
    width: 240,
    height: 320,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: color.goldA30,
  },
  avatarImage: {
    width: 280,
    height: 373,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: color.goldA50,
    backgroundColor: '#0A0A0A',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusText: {
    fontFamily: displaySerif as string,
    fontSize: 18,
    fontStyle: 'italic',
    color: color.gold,
    marginTop: space[2],
  },

  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: space[2],
    paddingVertical: 16,
    paddingHorizontal: space[6],
    borderRadius: radius.pill,
    backgroundColor: color.gold,
    width: '100%',
    shadowColor: color.gold,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 18,
  },
  primaryBtnLabel: {
    fontFamily: font.family,
    fontSize: 15,
    fontWeight: '700',
    color: color.bg,
    letterSpacing: 0.4,
  },
  secondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: space[2],
    paddingVertical: 14,
    paddingHorizontal: space[6],
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    width: '100%',
  },
  secondaryBtnLabel: {
    fontFamily: font.family,
    fontSize: 14,
    fontWeight: '600',
    color: color.text,
    letterSpacing: 0.3,
  },
  linkLabel: {
    fontFamily: font.family,
    fontSize: 13,
    fontWeight: '600',
    color: color.gold,
    letterSpacing: 0.3,
    paddingVertical: space[2],
  },
  fineprint: {
    fontFamily: font.family,
    fontSize: 11,
    color: color.textDim,
    textAlign: 'center',
    lineHeight: 16,
    paddingHorizontal: space[4],
    marginTop: space[2],
  },

  errorBox: {
    width: '100%',
    paddingVertical: space[5],
    paddingHorizontal: space[5],
    borderRadius: radius.md,
    backgroundColor: 'rgba(220,60,60,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(220,60,60,0.30)',
    alignItems: 'center',
    gap: space[2],
  },
  errorTitle: {
    fontFamily: font.family,
    fontSize: 15,
    fontWeight: '700',
    color: color.danger,
  },
  errorBody: {
    fontFamily: font.family,
    fontSize: 13,
    color: color.textMuted,
    textAlign: 'center',
    lineHeight: 19,
  },
});
