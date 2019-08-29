import styled from 'styled-components/native';

import Colors from '../../constants/Colors';
import Layout from '../../constants/Layout';

export const BusinessWrapper = styled.View`
  background: ${Colors.antiBackground};
  border-radius: 5px;
  margin: ${Layout.space.large};
  padding: ${Layout.space.medium};
  text-align: left;
`;

export const MainSection = styled.View`
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
  margin: ${Layout.space.medium};
`

export const Title = styled.Text`
  color: ${Colors.secondColor};
  font-size: ${Layout.font.large};
  flex-grow: 1;
  max-width: 450px;
  font-weight: bold;
`;

export const IconView = styled.View`
  flex-direction: row;
`;