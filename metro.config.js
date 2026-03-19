// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require("nativewind/metro");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Exclude git worktrees inside .claude/ — Metro would otherwise pick up
// stale/duplicate component files from worktree subdirectories
config.resolver.blockList = [/\/.claude\/.*/];

module.exports = withNativeWind(config, { input: "./global.css" });
