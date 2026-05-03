/**
 * Barcode-Scanner — vollbild-Modal mit Live-Camera + Open Food Facts Lookup.
 *
 * Flow:
 *   1. Permission prüfen / anfragen
 *   2. CameraView mit barcodeScannerSettings (EAN-13, UPC, Code-128, …)
 *   3. Auf Scan: getProductByBarcode → bei Success router.replace zurück zu
 *      MealDetail mit `openBarcode=<code>`, das Produkt liegt im React-Query-
 *      Cache und wird dort sofort als Sheet geöffnet.
 *   4. Bei "nicht gefunden": Alert mit Option zur manuellen Eingabe.
 *
 * Adaptiert aus FEELY (BarcodeScannerScreen.js) auf PAA Dark-Theme.
 */

import { Ionicons } from '@expo/vector-icons';
import { useQueryClient } from '@tanstack/react-query';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Linking,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  Vibration,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { color, font, radius, space } from '@/lib/design/tokens';
import { getProductByBarcode } from '@/lib/nutrition/OpenFoodFactsService';

const SCAN_BOX_SIZE = 260;

export default function BarcodeScanScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ slotKey: string; label: string; coachMealId?: string }>();
  const queryClient = useQueryClient();

  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const lastScannedRef = useRef<string | null>(null);
  const scanLineAnim = useRef(new Animated.Value(0)).current;

  // Scan-Linien Animation (FEELY-Style)
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(scanLineAnim, { toValue: 1, duration: 2000, useNativeDriver: true }),
        Animated.timing(scanLineAnim, { toValue: 0, duration: 0, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [scanLineAnim]);

  const scanLineY = scanLineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, SCAN_BOX_SIZE - 4],
  });

  const handleBarcodeScanned = async ({ type, data }: { type: string; data: string }) => {
    if (scanned || loading) return;
    if (lastScannedRef.current === data) return;

    lastScannedRef.current = data;
    setScanned(true);
    setLoading(true);

    if (Platform.OS === 'ios') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      Vibration.vibrate(80);
    }

    try {
      const result = await getProductByBarcode(data);

      if (result.success) {
        // Im React-Query-Cache ablegen, damit MealDetail sofort zugreifen kann
        queryClient.setQueryData(['scanned-product', data], result);

        router.replace({
          pathname: '/nutrition/meal/[slotKey]',
          params: {
            slotKey: params.slotKey,
            label: params.label,
            coachMealId: params.coachMealId ?? '',
            openBarcode: data,
          },
        });
      } else {
        Alert.alert(
          'Produkt nicht gefunden',
          'Dieses Produkt ist nicht in der Open Food Facts Datenbank. Du kannst es per Suche manuell eintragen.',
          [
            {
              text: 'Erneut scannen',
              style: 'default',
              onPress: () => {
                setScanned(false);
                setLoading(false);
                lastScannedRef.current = null;
              },
            },
            {
              text: 'Zurück',
              style: 'cancel',
              onPress: () => router.back(),
            },
          ],
        );
      }
    } catch (err) {
      console.error('Barcode scan error:', err);
      Alert.alert('Fehler', 'Konnte Produktdaten nicht laden. Bitte prüfe deine Internetverbindung.', [
        {
          text: 'OK',
          onPress: () => {
            setScanned(false);
            setLoading(false);
            lastScannedRef.current = null;
          },
        },
      ]);
    }
  };

  // Permission-State noch unbekannt
  if (!permission) {
    return (
      <View style={styles.fullCenter}>
        <ActivityIndicator color={color.text} />
      </View>
    );
  }

  // Permission abgelehnt
  if (!permission.granted) {
    return (
      <View style={[styles.permissionRoot, { paddingTop: insets.top + space[4] }]}>
        <Pressable onPress={() => router.back()} hitSlop={10} style={styles.closeBtn}>
          <Ionicons name="close" size={22} color={color.text} />
        </Pressable>
        <View style={styles.permissionContent}>
          <View style={styles.permissionIconCircle}>
            <Ionicons name="camera-outline" size={56} color={color.text} />
          </View>
          <Text style={styles.permissionTitle}>Kamera-Zugriff benötigt</Text>
          <Text style={styles.permissionText}>
            Um Barcodes zu scannen, benötigen wir Zugriff auf deine Kamera.
          </Text>
          <Pressable
            onPress={requestPermission}
            style={({ pressed }) => [styles.permissionBtn, pressed && { opacity: 0.85 }]}
          >
            <Text style={styles.permissionBtnLabel}>Erlauben</Text>
          </Pressable>
          {permission.canAskAgain === false ? (
            <Pressable onPress={() => Linking.openSettings()} style={{ marginTop: space[3] }}>
              <Text style={styles.openSettingsLabel}>In Einstellungen öffnen</Text>
            </Pressable>
          ) : null}
        </View>
      </View>
    );
  }

  // Camera aktiv
  return (
    <View style={styles.root}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        onBarcodeScanned={loading ? undefined : handleBarcodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ['ean13', 'ean8', 'upc_a', 'upc_e', 'code128', 'code39'],
        }}
      />

      {/* Dim-Overlay rundherum */}
      <View style={styles.overlay}>
        <View style={styles.overlayTop} />
        <View style={styles.overlayMiddle}>
          <View style={styles.overlaySide} />
          <View style={styles.scanBox}>
            <View style={[styles.corner, styles.cornerTL]} />
            <View style={[styles.corner, styles.cornerTR]} />
            <View style={[styles.corner, styles.cornerBL]} />
            <View style={[styles.corner, styles.cornerBR]} />
            {!loading ? (
              <Animated.View style={[styles.scanLine, { transform: [{ translateY: scanLineY }] }]} />
            ) : null}
          </View>
          <View style={styles.overlaySide} />
        </View>
        <View style={styles.overlayBottom}>
          <Text style={styles.hintText}>
            {loading ? 'Produkt wird geladen…' : 'Barcode in den Rahmen halten'}
          </Text>
          {loading ? <ActivityIndicator color={color.text} style={{ marginTop: space[3] }} /> : null}
        </View>
      </View>

      {/* Header (Close-Button + Slot-Label) */}
      <View style={[styles.header, { paddingTop: insets.top + space[2] }]}>
        <Pressable onPress={() => router.back()} hitSlop={10} style={styles.closeBtn}>
          <Ionicons name="close" size={22} color={color.text} />
        </Pressable>
        <Text style={styles.headerTitle}>{(params.label ?? 'Mahlzeit').toUpperCase()}</Text>
        <View style={styles.closeBtn} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: color.bg },
  fullCenter: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: color.bg },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: space[5],
    paddingBottom: space[3],
  },
  headerTitle: {
    flex: 1,
    fontFamily: font.family,
    fontSize: 14,
    fontWeight: '900',
    color: color.text,
    letterSpacing: 1.6,
    textAlign: 'center',
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  overlayTop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
  },
  overlayMiddle: {
    flexDirection: 'row',
    height: SCAN_BOX_SIZE,
  },
  overlaySide: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
  },
  overlayBottom: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    alignItems: 'center',
    paddingTop: space[5],
  },
  scanBox: {
    width: SCAN_BOX_SIZE,
    height: SCAN_BOX_SIZE,
    overflow: 'hidden',
  },
  corner: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderColor: color.macroProtein,
  },
  cornerTL: { top: 0, left: 0, borderLeftWidth: 3, borderTopWidth: 3, borderTopLeftRadius: 6 },
  cornerTR: { top: 0, right: 0, borderRightWidth: 3, borderTopWidth: 3, borderTopRightRadius: 6 },
  cornerBL: { bottom: 0, left: 0, borderLeftWidth: 3, borderBottomWidth: 3, borderBottomLeftRadius: 6 },
  cornerBR: { bottom: 0, right: 0, borderRightWidth: 3, borderBottomWidth: 3, borderBottomRightRadius: 6 },
  scanLine: {
    position: 'absolute',
    left: 6,
    right: 6,
    height: 2,
    borderRadius: 2,
    backgroundColor: color.macroProtein,
    shadowColor: color.macroProtein,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
  },
  hintText: {
    fontFamily: font.family,
    fontSize: 14,
    fontWeight: '600',
    color: color.text,
    textAlign: 'center',
    paddingHorizontal: space[5],
  },
  permissionRoot: {
    flex: 1,
    backgroundColor: color.bg,
    paddingHorizontal: space[5],
  },
  permissionContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: space[3],
  },
  permissionIconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    marginBottom: space[3],
  },
  permissionTitle: {
    fontFamily: font.family,
    fontSize: 22,
    fontWeight: '700',
    color: color.text,
    textAlign: 'center',
  },
  permissionText: {
    fontFamily: font.family,
    fontSize: 14,
    color: color.textMuted,
    textAlign: 'center',
    paddingHorizontal: space[4],
    lineHeight: 20,
  },
  permissionBtn: {
    marginTop: space[5],
    paddingVertical: space[4],
    paddingHorizontal: space[8],
    borderRadius: radius.pill,
    backgroundColor: color.text,
  },
  permissionBtnLabel: {
    fontFamily: font.family,
    fontSize: 15,
    fontWeight: '700',
    color: color.bg,
    letterSpacing: 0.4,
  },
  openSettingsLabel: {
    fontFamily: font.family,
    fontSize: 13,
    color: color.textMuted,
    textDecorationLine: 'underline',
  },
});
