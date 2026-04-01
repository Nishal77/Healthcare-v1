const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

config.resolver.blockList = [/\/.claude\/.*/];

// Native-only packages that crash Metro when missing.
// Stubs let the bundle build; at runtime IS_STUB / null getSdkStatus
// tell the hooks to surface "unavailable" instead of fake data.
config.resolver.extraNodeModules = {
  'react-native-ble-plx': path.resolve(__dirname, 'src/health/ble-stub.js'),
  'react-native-health-connect': path.resolve(__dirname, 'src/health/health-connect-stub.js'),
};

module.exports = withNativeWind(config, { input: './global.css' });
