import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAuth } from '@/lib/auth/AuthContext';
import { displaySerif } from '@/lib/design/light';
import { color, font, glow, radius, space } from '@/lib/design/tokens';

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const { signIn } = useAuth();

  const [email, setEmail] = useState('juliseidel10@gmail.com');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!email || !password) {
      setError('Bitte E-Mail und Passwort eingeben.');
      return;
    }
    setError(null);
    setSubmitting(true);
    const { error: signInError } = await signIn(email.trim(), password);
    setSubmitting(false);
    if (signInError) {
      setError(translateAuthError(signInError.message));
    }
  };

  return (
    <View style={styles.root}>
      <BackgroundDecor />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scroll,
            { paddingTop: insets.top + space[16], paddingBottom: insets.bottom + space[10] },
          ]}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.brandBlock}>
            <Text style={styles.eyebrow}>PRIME ATHLETE ACADEMY</Text>
            <Text style={styles.headline}>Willkommen{'\n'}zurück</Text>
            <Text style={styles.sub}>Melde dich an, um deinen Wochenplan zu sehen.</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.field}>
              <Text style={styles.label}>E-MAIL</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                placeholder="deine@mail.de"
                placeholderTextColor={color.textDim}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>PASSWORT</Text>
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                placeholder="••••••••"
                placeholderTextColor={color.textDim}
              />
            </View>

            {error ? (
              <View style={styles.errorBox}>
                <Ionicons name="alert-circle" size={16} color={color.danger} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <Pressable
              onPress={handleSubmit}
              disabled={submitting}
              style={({ pressed }) => [
                styles.cta,
                pressed && styles.ctaPressed,
                submitting && styles.ctaDisabled,
              ]}
            >
              {submitting ? (
                <ActivityIndicator color={color.bg} />
              ) : (
                <Text style={styles.ctaLabel}>Anmelden</Text>
              )}
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

function translateAuthError(msg: string): string {
  if (msg.toLowerCase().includes('invalid login credentials')) {
    return 'E-Mail oder Passwort falsch.';
  }
  if (msg.toLowerCase().includes('email not confirmed')) {
    return 'E-Mail noch nicht bestätigt.';
  }
  return msg;
}

function BackgroundDecor() {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFillObject}>
      <LinearGradient
        colors={[color.surfaceDeep, color.bg, color.bg]}
        locations={[0, 0.4, 1]}
        style={StyleSheet.absoluteFill}
      />
      <View style={[styles.orb, { top: -160, right: -140, ...glow.goldHaloOuter }]} />
      <View style={[styles.orb, { bottom: -200, left: -160, ...glow.goldHaloInner }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: color.bg },
  scroll: {
    paddingHorizontal: space[6],
    gap: space[8],
  },
  brandBlock: {
    gap: space[3],
  },
  eyebrow: {
    fontFamily: font.family,
    fontSize: 11,
    fontWeight: '600',
    color: color.gold,
    letterSpacing: 3.2,
  },
  headline: {
    fontFamily: displaySerif as string,
    fontSize: 44,
    fontStyle: 'italic',
    fontWeight: '400',
    color: color.text,
    lineHeight: 50,
    letterSpacing: -0.5,
    marginTop: space[2],
  },
  sub: {
    fontFamily: font.family,
    fontSize: 15,
    color: color.textMuted,
    lineHeight: 22,
    marginTop: space[1],
  },
  form: {
    gap: space[5],
    marginTop: space[6],
  },
  field: {
    gap: space[2],
  },
  label: {
    fontFamily: font.family,
    fontSize: 10,
    fontWeight: '600',
    color: color.textMuted,
    letterSpacing: 2.4,
  },
  input: {
    fontFamily: font.family,
    fontSize: 16,
    color: color.text,
    backgroundColor: color.surface,
    borderWidth: 1,
    borderColor: color.goldA20,
    borderRadius: radius.md,
    paddingHorizontal: space[4],
    paddingVertical: space[4],
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[2],
    paddingVertical: space[2],
  },
  errorText: {
    fontFamily: font.family,
    fontSize: 13,
    color: color.danger,
    flex: 1,
  },
  cta: {
    backgroundColor: color.gold,
    borderRadius: radius.md,
    paddingVertical: space[4],
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: space[2],
    ...glow.goldSoft,
  },
  ctaPressed: {
    backgroundColor: color.goldDark,
    transform: [{ scale: 0.98 }],
  },
  ctaDisabled: {
    opacity: 0.6,
  },
  ctaLabel: {
    fontFamily: font.family,
    fontSize: 15,
    fontWeight: '700',
    color: color.bg,
    letterSpacing: 0.4,
  },
  orb: {
    position: 'absolute',
    width: 380,
    height: 380,
    borderRadius: 190,
    backgroundColor: color.goldA10,
    opacity: 0.55,
  },
});
