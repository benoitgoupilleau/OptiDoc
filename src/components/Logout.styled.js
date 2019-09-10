import styled from 'styled-components/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Colors from '../constants/Colors';
import Layout from '../constants/Layout';

export const Wrapper = styled.View`
  margin: ${Layout.space.large};
  flex-direction: row;
  align-items: center;
`;

export const Icons = styled(Ionicons)`
  padding: 0 20px;
`;

export const StyledButton = styled.TouchableOpacity`
  align-items: center;
  background-color: ${Colors.mainColor};
  height: 32px;
  text-align: center;
`;

export const StyledText = styled.Text`
  color: white;
  padding: 5px;
  font-size: ${Layout.font.small};
`;
