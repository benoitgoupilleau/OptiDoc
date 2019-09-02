import styled from 'styled-components/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Layout from '../../constants/Layout';

export const DocumentWrapper = styled.TouchableOpacity`
  margin: ${Layout.space.medium};
  flex-direction: row;
  justify-content: space-between;
`;

export const File = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const Title = styled.Text`
  font-size: ${Layout.font.medium};
  max-width: ${({ width }) => width / 2}px;
`;

export const StyledInput = styled.TextInput`
  padding: 0;
  color: gray;
  font-size: ${Layout.font.medium};
  width: ${({ width }) => (width / 2)}px;
  ${({ editable }) => editable && 'border-bottom-color: gray; border-bottom-width: 1px;'}
`;

export const IconsWrapper = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const EditIcons = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const Icons = styled(Ionicons)`
  padding: 0 10px 0 5px;
`;