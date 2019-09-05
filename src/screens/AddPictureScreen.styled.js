import styled from 'styled-components/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Colors from '../constants/Colors'
import Layout from '../constants/Layout'

export const Container = styled.View`
  padding: 10px 20px;
`;

export const Wrapper = styled.ScrollView`
`;

export const Title = styled.Text`
  color: ${Colors.secondColor};
  font-size: ${Layout.font.large};
  font-weight: bold;
  text-align: center;
`;

export const Section = styled.Text`
  font-size: ${Layout.font.large};
  font-weight: bold;
`

export const ButtonWrapper = styled.View`
  align-items: center;
`;

export const StyledButton = styled.TouchableOpacity`
  align-items: center;
  background-color: ${({ disabled }) => disabled ? Colors.thirdColor : Colors.mainColor};
  height: 40px;
  margin: 10px 0;
  padding: ${Layout.space.small};
  text-align: center;
  width: 200px;
`;

export const StyledText = styled.Text`
  color: white;
  font-size: ${Layout.font.small};
`;


export const FileNameInput = styled.TextInput`
  width: 100%;
  border-color: ${Colors.thirdColor};
  margin: 10px 0;
  border-width: 1px;
`;

export const Comment = styled.TextInput`
  width: 100%;
  border-color: ${Colors.thirdColor};
  border-width: 1px;
`;

export const StyledScroll = styled.ScrollView`
  width: ${({ width }) => width};
  padding-bottom: ${Layout.space.large};
  height: ${({ height }) => height - 500}px;
`;

export const PictureWrapper = styled.View`
  flex-direction: row;
  display: flex;
  justify-content: space-between;
  width: 100%;
  position: relative;
`;

export const ImageFrame = styled.Image`
  width: ${({ screenWidth }) => screenWidth - 80}px;
  height: ${({ width, height, screenWidth }) => ((screenWidth - 80) * height) / width}px;
`;

export const Icons = styled(Ionicons)`
  position: absolute;
  right: 10px;
  top: 10px;
`;