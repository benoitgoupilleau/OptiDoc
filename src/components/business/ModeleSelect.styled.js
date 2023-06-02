import styled from 'styled-components/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Colors from '../../constants/Colors';

export const SearchContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
  position: relative;
`;

export const SearchInput = styled.TextInput`
  flex-grow: 1;
  border-color: ${Colors.thirdColor};
  border-width: 1px;
`;

export const Icons = styled(Ionicons)`
  margin: 0 10px;
  padding: 10px;
`;

export const ModeleList = styled.View`
  flex-direction: row;
  align-items: center;
  width: 100%;
  margin: 10px 0;
  flex-flow: row wrap;
`;

export const ClearIcons = styled(Ionicons)`
  position: absolute;
  padding: 10px;
  right: 60px;
  z-index: 3;
`;
