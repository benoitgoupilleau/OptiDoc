import styled from 'styled-components/native';

import Colors from '../constants/Colors';
import Layout from '../constants/Layout';

export const Container = styled.View`
  padding: 10px;
`;

export const Wrapper = styled.ScrollView``;

export const Title = styled.Text`
  color: ${Colors.secondColor};
  font-size: ${Layout.font.large};
  font-weight: bold;
  text-align: center;
`;

export const Section = styled.Text`
  font-size: ${Layout.font.medium};
  font-weight: bold;
`;
export const Selector = styled.View`
  flex-direction: row;
  align-items: center;
  width: 100%;
`;

export const Option = styled.TouchableOpacity`
  width: 25%;
  align-items: center;
  ${({ isSelected }) => isSelected && `background-color: ${Colors.thirdColor};`}
  border-bottom-color: ${Colors.thirdColor};
  border-bottom-width: 1px;
  margin: 10px 0;
`;

export const OptionText = styled.Text`
  ${({ isSelected }) => isSelected && `color: white;`}
  padding: 5px 0;
`;

export const ButtonWrapper = styled.View`
  align-items: center;
`;

export const StyledButton = styled.TouchableOpacity`
  align-items: center;
  background-color: ${({ disabled }) => (disabled ? Colors.thirdColor : Colors.mainColor)};
  height: 30px;
  margin: 10px 0;
  padding: ${Layout.space.small};
  text-align: center;
  width: 250px;
`;

export const StyledText = styled.Text`
  color: white;
  font-size: ${Layout.font.small};
`;

export const FileNameInput = styled.TextInput`
  width: 100%;
  border-color: ${Colors.thirdColor};
  border-width: 1px;
`;
