// Learn more https://docs.expo.io/guides/customizing-metro
const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Exclude git worktrees inside .claude/ — Metro would otherwise pick up
// stale/duplicate component files from worktree subdirectories
config.resolver.blockList = [/\/.claude\/.*/];

// Stub out native-only packages that aren't installed in Expo Go / iOS.
// Metro resolves all require() calls at bundle time even inside try/catch,
// so missing modules crash the bundler before the app ever loads.
config.resolver.extraNodeModules = {
  'react-native-health-connect': path.resolve(
    __dirname,
    'src/health/health-connect-stub.js',
  ),
};

module.exports = withNativeWind(config, { input: './global.css' });
