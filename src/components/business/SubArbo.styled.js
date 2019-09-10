import styled from 'styled-components/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Colors from '../../constants/Colors';
import Layout from '../../constants/Layout';

export const SubArboWrapper = styled.View`
  align-items: center;
  flex-direction: row;
  margin-bottom: ${Layout.space.small};
  padding: ${Layout.space.small};
`;

export const SubArboEl = styled.Text`
  color: ${Colors.secondColor};
  font-size: ${Layout.font.small};
  flex-grow: 1;
`;

export const Icons = styled(Ionicons)`
  padding: 0 ${Layout.space.medium};
`;
