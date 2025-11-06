/** @type {Detox.DetoxConfig} */
module.exports = {
  testRunner: {
    args: {
      '$0': 'jest',
      config: 'e2e/jest.config.js'
    },
    jest: {
      setupTimeout: 120000
    }
  },
  apps: {
    'ios.release': {
      type: 'ios.app',
      build: 'npx expo run:ios --configuration Release --device',
      binaryPath: 'ios/build/Build/Products/Release-iphonesimulator/mesbonnesadresses.app'
    },
    'android.release': {
      type: 'android.apk',
      build: 'npx expo run:android --variant=release',
      binaryPath: 'android/app/build/outputs/apk/release/app-release.apk'
    }
  },
  devices: {
    simulator: {
      type: 'ios.simulator',
      device: {
        type: 'iPhone 15'
      }
    },
    emulator: {
      type: 'android.emulator',
      device: {
        avdName: 'Pixel_5_API_33'
      }
    }
  },
  configurations: {
    'ios.sim.release': {
      device: 'simulator',
      app: 'ios.release'
    },
    'android.emu.release': {
      device: 'emulator',
      app: 'android.release'
    }
  }
};
