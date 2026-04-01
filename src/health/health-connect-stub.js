// Stub for react-native-health-connect used in Expo Go / iOS / web
// Metro resolves all require() at bundle time — this stub prevents "module not found" errors.
// At runtime, getSdkStatus returns 0 (unavailable) so useHealthConnect gracefully falls back.
module.exports = {
  getSdkStatus: async () => 0,
  requestPermission: async () => [],
  readRecords: async () => ({ records: [] }),
  initialize: async () => false,
};
