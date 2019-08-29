import styled from 'styled-components/native';

import Colors from '../constants/Colors'
import Layout from '../constants/Layout'

export const Wrapper = styled.View`
  align-items: center;
  display: flex;
  flex-direction: row;
  margin: 0 ${Layout.space.small};
`;

export const Title = styled.Text`
  color: ${Colors.mainColor};
  font-size: ${Layout.font.medium};
  padding-left: 5px;
  max-width: 400px;
`
