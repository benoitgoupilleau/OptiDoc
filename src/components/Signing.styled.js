import styled from 'styled-components/native';

import Colors from '../constants/Colors'
import Layout from '../constants/Layout'

export const Wrapper = styled.View`
  max-width: 400px;
  width: 80%;
  min-width: 200px;
`;

export const Title = styled.Text`
  color: ${Colors.mainColor};
  font-size: ${Layout.font.xlarge};
  margin-bottom: ${Layout.space.xlarge};
  text-align: center;
`;

export const StyledInput = styled.TextInput`
  border-color: gray;
  border-width: 1px;
  font-size: ${Layout.font.medium};
  height: 50px;
  margin-bottom: ${Layout.space.large};
`;

export const StyledButton = styled.TouchableOpacity`
  align-items: center;
  background-color: ${Colors.mainColor};
  height: 50px;
  text-align: center;
  padding: ${Layout.space.medium};
`;

export const Message = styled.Text`
  text-align: center;
  font-style: italic;
  padding-bottom: ${Layout.space.small};
`;

export const StyledText = styled.Text`
  color: white;
  font-size: ${Layout.font.medium};
`;