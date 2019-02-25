import { Dimensions } from 'react-native';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default {
  window: {
    width,
    height,
  },
  isSmallDevice: width < 375,
  icon: {
    default: 18,
    small: 14,
    xsmall: 12
  },
  font: {
    xlarge: '28px',
    large: '18px',
    medium: '14px',
    small: '12px',
    xsmall: '10px'
  },
  space: {
    xlarge: '30px',
    large: '20px',
    medium: '10px',
    small: '5px'
  }
};
