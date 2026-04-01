// Stub for react-native-health-connect
// Used on iOS / Expo Go / web — platforms where Health Connect is unavailable.
// Metro maps 'react-native-health-connect' → this file via extraNodeModules.
// IS_STUB: true signals useHealthData to skip Android-only code paths.

module.exports = {
  IS_STUB: true,
  getSdkStatus:      async () => 0,          // 0 = SDK_UNAVAILABLE
  requestPermission: async () => [],
  readRecords:       async () => ({ records: [] }),
  initialize:        async () => false,
};
