import styled from 'styled-components/native';

import Colors from '../../constants/Colors';
import Layout from '../../constants/Layout';

export const NewsWrapper = styled.View`
  background: ${Colors.antiBackground};
  border-radius: 5px;
  margin: ${Layout.space.large} ${Layout.space.large} 0 ${Layout.space.large};
  padding: ${Layout.space.medium};
  text-align: left;
`;

export const Title = styled.Text`
  color: ${Colors.secondColor};
  font-size: ${Layout.font.medium};
  font-weight: bold;
  margin: ${Layout.space.medium} 0;
`;

export const Content = styled.Text`
  color: ${Colors.thirdColor};
`;
