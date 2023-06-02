import styled from 'styled-components/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Layout from '../../constants/Layout';

export const ModeleWrapper = styled.TouchableOpacity`
  margin: ${Layout.space.small};
  flex-direction: row;
  justify-content: space-between;
  width: ${({ width }) => Math.round(width / 2) - 40}px;
`;

export const Title = styled.Text`
  font-size: ${Layout.font.small};
  max-width: ${({ width }) => Math.round(width / 2) - 75}px;
  ${(props) => props.selected && 'color: black;'}
`;

export const Icons = styled(Ionicons)`
  padding: 0 10px;
`;
