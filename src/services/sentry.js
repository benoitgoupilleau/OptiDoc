import * as Sentry from '@sentry/react-native';
import { SENTRY_DSN } from 'react-native-dotenv';
import DeviceInfo from 'react-native-device-info';

export const setupSentry = () => {
  Sentry.init({ dsn: SENTRY_DSN, tracesSampleRate: 1.0 });
  addBuildContext();
};

const addBuildContext = () => {
  Sentry.setTags({
    appVersion: DeviceInfo.getVersion(),
    buildNumber: DeviceInfo.getBuildNumber(),
    deviceInfo: {
      systemName: DeviceInfo.getSystemName(),
      systemVersion: DeviceInfo.getSystemVersion(),
      deviceName: DeviceInfo.getDeviceName(),
    },
  });
};

export default Sentry;
