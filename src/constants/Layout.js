import { Dimensions } from 'react-native';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default {
  window: {
    width,
    height
  },
  isSmallDevice: width < 375,
  icon: {
    large: 24,
    default: 20,
    small: 16,
    xsmall: 14
  },
  font: {
    xlarge: '30px',
    large: '22px',
    medium: '18px',
    small: '16px',
    xsmall: '14px'
  },
  space: {
    xlarge: '30px',
    large: '20px',
    medium: '10px',
    small: '5px'
  }
};
