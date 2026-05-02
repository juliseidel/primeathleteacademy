/**
 * Lädt das gebundlete PAA-Logo als base64-String — wird als zweites
 * Reference-Image in den Avatar-Generation-Prompt gehängt.
 *
 * Asset wird beim ersten Call gecacht, damit nachfolgende Generations
 * keinen erneuten File-Read brauchen.
 */

import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system/legacy';

let cached: { base64: string; mimeType: string } | null = null;

export async function loadPaaLogoBase64(): Promise<{ base64: string; mimeType: string }> {
  if (cached) return cached;

  const asset = Asset.fromModule(require('@/assets/branding/paa_logo.jpg'));
  await asset.downloadAsync();

  const localUri = asset.localUri ?? asset.uri;
  if (!localUri) throw new Error('PAA-Logo konnte nicht geladen werden.');

  const base64 = await FileSystem.readAsStringAsync(localUri, {
    encoding: FileSystem.EncodingType.Base64,
  });

  cached = { base64, mimeType: 'image/jpeg' };
  return cached;
}
