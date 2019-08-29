import styled from 'styled-components/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

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
  max-width: 500px;
  font-weight: bold;
`;

export const SectionWrapper = styled.View`
  align-items: center;
  border-bottom-color: ${Colors.mainColor};
  border-bottom-width: 1px;
  flex-direction: row;
  margin-bottom: ${Layout.space.medium};
  padding: ${Layout.space.medium};
`

export const Section = styled.Text`
  color: ${Colors.mainColor};
  font-size: ${Layout.font.medium};
  flex-grow: 1;
`;

export const IconView = styled.View`
  flex-direction: row;
`;

export const Icons = styled(Ionicons)`
  padding: 0 ${Layout.space.medium};
`;

export const AddIcons = styled(Icons)`
  padding: 0 ${Layout.space.large};
`;
