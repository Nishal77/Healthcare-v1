/**
 * storage.ts — Pure JS key-value store backed by expo-file-system.
 *
 * Works in Expo Go, development builds, and production builds without
 * any native module linking. Data is persisted to the app's document directory.
 */

import * as FileSystem from 'expo-file-system';

const STORE_DIR = `${FileSystem.documentDirectory ?? ''}vedarogya_store/`;

async function ensureDir(): Promise<void> {
  const info = await FileSystem.getInfoAsync(STORE_DIR);
  if (!info.exists) {
    await FileSystem.makeDirectoryAsync(STORE_DIR, { intermediates: true });
  }
}

function keyToPath(key: string): string {
  // Sanitise the key so it's a safe filename
  return STORE_DIR + key.replace(/[^a-zA-Z0-9_\-]/g, '_');
}

export async function storageGet(key: string): Promise<string | null> {
  try {
    await ensureDir();
    const path = keyToPath(key);
    const info = await FileSystem.getInfoAsync(path);
    if (!info.exists) return null;
    return await FileSystem.readAsStringAsync(path);
  } catch {
    return null;
  }
}

export async function storageSet(key: string, value: string): Promise<void> {
  await ensureDir();
  await FileSystem.writeAsStringAsync(keyToPath(key), value);
}

export async function storageRemove(key: string): Promise<void> {
  try {
    await FileSystem.deleteAsync(keyToPath(key), { idempotent: true });
  } catch {
    // best-effort
  }
}
