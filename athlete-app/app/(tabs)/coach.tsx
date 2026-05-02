import { Ionicons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GlassCard } from '@/lib/design/components/GlassCard';
import { color, font, space } from '@/lib/design/tokens';

export default function CoachScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.root}>
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingTop: insets.top + space[4], paddingBottom: 140 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>JK</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>Jonas Kehl</Text>
            <View style={styles.statusRow}>
              <View style={styles.statusDot} />
              <Text style={styles.status}>Online · dein Lead-Coach</Text>
            </View>
          </View>
        </View>

        {/* Coach-Nachricht */}
        <View style={styles.messageReceived}>
          <GlassCard variant="standard" style={styles.bubble}>
            <Text style={styles.message}>
              Wie war das Squat-Set heute? Falls die Form gewackelt hat — nimm 5kg runter und bleib sauber.
            </Text>
            <Text style={styles.timestamp}>14:32</Text>
          </GlassCard>
        </View>

        {/* Eigene Antwort */}
        <View style={styles.messageSent}>
          <View style={[styles.bubble, styles.bubbleOwn]}>
            <Text style={[styles.message, { color: color.bg }]}>Lief gut, alle Wdh sauber.</Text>
            <Text style={[styles.timestamp, { color: 'rgba(10,10,10,0.6)' }]}>14:45</Text>
          </View>
        </View>

        {/* Compose-Hinweis */}
        <GlassCard variant="subtle" style={styles.composeHint}>
          <View style={styles.composeRow}>
            <Ionicons name="chatbubble-ellipses-outline" size={18} color={color.textMuted} />
            <Text style={styles.composeText}>Chat-Eingabe folgt · MVP-Stub</Text>
          </View>
          <View style={styles.composeIcons}>
            <Ionicons name="mic-outline" size={20} color={color.gold} />
            <Ionicons name="camera-outline" size={20} color={color.gold} />
            <Ionicons name="videocam-outline" size={20} color={color.gold} />
          </View>
        </GlassCard>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: color.bg },
  scroll: { paddingHorizontal: space[5], gap: space[4] },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[3],
    paddingVertical: space[3],
    marginBottom: space[2],
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: color.surfaceLight,
    borderWidth: 1,
    borderColor: color.goldA30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: font.family,
    fontSize: 16,
    fontWeight: '700',
    color: color.gold,
    letterSpacing: 0.4,
  },
  name: {
    fontFamily: font.family,
    fontSize: 19,
    fontWeight: '700',
    color: color.text,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[2],
    marginTop: 2,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: color.success,
  },
  status: {
    fontFamily: font.family,
    fontSize: 12,
    color: color.textMuted,
  },
  messageReceived: { alignItems: 'flex-start' },
  messageSent: { alignItems: 'flex-end' },
  bubble: {
    maxWidth: '80%',
    padding: space[4],
  },
  bubbleOwn: {
    backgroundColor: color.gold,
    borderRadius: 24,
  },
  message: {
    fontFamily: font.family,
    fontSize: 15,
    lineHeight: 21,
    color: color.text,
  },
  timestamp: {
    fontFamily: font.family,
    fontSize: 11,
    color: color.textMuted,
    marginTop: space[2],
  },
  composeHint: {
    padding: space[4],
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[3],
    marginTop: space[6],
  },
  composeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[3],
    flex: 1,
  },
  composeText: {
    fontFamily: font.family,
    fontSize: 13,
    color: color.textMuted,
  },
  composeIcons: {
    flexDirection: 'row',
    gap: space[3],
  },
});
