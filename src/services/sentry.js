import { Sentry } from 'react-native-sentry';
import { SENTRY_DSN } from 'react-native-dotenv';
import DeviceInfo from 'react-native-device-info';

export const setupSentry = () => {
  Sentry.config(SENTRY_DSN).install();
  addBuildContext();
};

const addBuildContext = () => {
  Sentry.setTagsContext({
    appVersion: DeviceInfo.getVersion(),
    buildNumber: DeviceInfo.getBuildNumber(),
    deviceInfo: {
      systemName: DeviceInfo.getSystemName(),
      systemVersion: DeviceInfo.getSystemVersion(),
      deviceName: DeviceInfo.getDeviceName()
    }
  });
};

export default Sentry;
