import styled from 'styled-components/native';

import Colors from '../constants/Colors';
import Layout from '../constants/Layout';

export const Wrapper = styled.View`
  background-color: ${({ type }) =>
    type === 'error'
      ? Colors.errorBackground
      : type === 'warning'
      ? Colors.warningBackground
      : Colors.mainColor};
  height: 30px;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  width: ${({ width }) => width};
`;

export const Message = styled.Text`
  color: ${({ type }) =>
    type === 'error'
      ? Colors.errorText
      : type === 'warning'
      ? Colors.warningText
      : Colors.warningText};
  font-size: ${Layout.font.small};
  padding: 0 3px;
`;
