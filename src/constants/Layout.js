import { Dimensions } from 'react-native';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default {
  window: {
    width,
    height,
  },
  isSmallDevice: width < 375,
  font: {
    xlarge: '32px',
    large: '22px',
    medium: '20px',
    small: '18px',
    xsmall: '16px'
  },
  space: {
    xlarge: '30px',
    large: '20px',
    medium: '10px',
    small: '5px'
  }
};
