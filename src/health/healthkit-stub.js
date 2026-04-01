// Stub for react-native-health
// Used on Android dev builds / Expo Go where HealthKit is unavailable.
// Metro resolves this file via extraNodeModules when the real iOS native
// module cannot be loaded; callbacks return errors so hooks degrade gracefully.

const IS_STUB = true;

const Constants = {
  Permissions: {
    ActiveEnergyBurned:          'ActiveEnergyBurned',
    BodyTemperature:              'BodyTemperature',
    HeartRate:                    'HeartRate',
    HeartRateVariability:         'HeartRateVariabilitySDNN',
    OxygenSaturation:             'OxygenSaturation',
    SleepAnalysis:                'SleepAnalysis',
    Steps:                        'StepCount',
    Water:                        'DietaryWater',
    Weight:                       'BodyMass',
  },
};

const noop = (_opts, cb) =>
  setTimeout(() => cb('HealthKit not available in this environment', null), 0);

const AppleHealthKit = {
  IS_STUB,
  Constants,
  initHealthKit:                    (_opts, cb) => setTimeout(() => cb('HealthKit unavailable'), 0),
  getLatestHeartRate:               noop,
  getStepCount:                     noop,
  getSleepSamples:                  (_opts, cb) => setTimeout(() => cb('unavailable', []), 0),
  getLatestBloodOxygenSaturation:   noop,
  getActiveEnergyBurned:            (_opts, cb) => setTimeout(() => cb('unavailable', []), 0),
  getHeartRateVariabilitySamples:   (_opts, cb) => setTimeout(() => cb('unavailable', []), 0),
  getLatestBodyTemperature:         noop,
};

module.exports         = AppleHealthKit;
module.exports.default = AppleHealthKit;
