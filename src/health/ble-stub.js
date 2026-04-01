// BLE stub — used by Metro when react-native-ble-plx native module is absent
// (Expo Go, web). All async methods resolve immediately with empty/error results.
// IS_STUB lets runtime code detect that no real BLE hardware path is available.

const IS_STUB = true;

class BleManager {
  onStateChange(_cb, _emit) {
    return { remove: () => {} };
  }
  state() {
    return Promise.resolve('Unknown');
  }
  startDeviceScan(_uuids, _opts, _cb) {}
  stopDeviceScan() {}
  connectToDevice(_id) {
    return Promise.reject(new Error('BLE not available in Expo Go'));
  }
  cancelDeviceConnection(_id) {
    return Promise.resolve();
  }
  destroy() {}
}

const State = {
  Unknown:      'Unknown',
  Resetting:    'Resetting',
  Unsupported:  'Unsupported',
  Unauthorized: 'Unauthorized',
  PoweredOff:   'PoweredOff',
  PoweredOn:    'PoweredOn',
};

module.exports = { BleManager, State, IS_STUB };
