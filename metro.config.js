const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

config.resolver.blockList = [/\/.claude\/.*/];

// react-native-health is iOS-only. On Android / Expo Go the native module is
// absent. We don't stub it here (it's installed in node_modules) — instead the
// hook guards every call behind Platform.OS === 'ios' so the Android bundle
// never invokes any HealthKit native method.
//
// react-native-health-connect is Android-only and NOT installed in node_modules.
// We provide a stub so Metro can bundle for iOS / web without "module not found".
//
// react-native-ble-plx IS installed. Metro uses the real package; the hook's
// lazy try/catch handles the absent native module in Expo Go.
config.resolver.extraNodeModules = {
  'react-native-health-connect': path.resolve(__dirname, 'src/health/health-connect-stub.js'),
};

module.exports = withNativeWind(config, { input: './global.css' });
