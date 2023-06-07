import styled from 'styled-components/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Colors from '../../constants/Colors';
import Layout from '../../constants/Layout';

export const SectionWrapper = styled.View`
  align-items: center;
  border-bottom-color: ${Colors.mainColor};
  border-bottom-width: 1px;
  flex-direction: row;
  margin-bottom: ${Layout.space.medium};
  padding: ${({ noTitle }) => (noTitle ? Layout.space.small : Layout.space.medium)};
`;

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
