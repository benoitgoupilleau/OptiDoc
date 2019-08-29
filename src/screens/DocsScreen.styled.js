import styled from 'styled-components/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Layout from '../constants/Layout'

export const StyledScroll = styled.ScrollView`
  background-color: #ededed;
  padding-bottom: ${Layout.space.large};
  width: ${({ width }) => width};
`;

export const Legend = styled.View`
  align-items: center;
  flex-direction: row;
  padding: 5px 0;
  font-size: 10px;
`;

export const LegendWrapper = styled.View`
  flex-flow: row wrap;
  flex-grow: 1;
  width: ${({ width }) => width - 40}px;
`

export const LegendItem = styled.View`
  flex-direction: row;
  padding: 0 5px;
  align-items: center;
`;

export const Icons = styled(Ionicons)`
  padding: 0 3px;
`;