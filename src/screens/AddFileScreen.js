import React from 'react';
import { connect } from 'react-redux';
import { Text, View, TextInput, TouchableOpacity } from 'react-native';
import styled from 'styled-components'

import Logout from '../components/Logout';
import HeaderTitle from '../components/HeaderTitle'
import Modele from '../components/business/Modele';

import Layout from '../constants/Layout'
import Colors from '../constants/Colors'

const Wrapper = styled(View)`
  padding: 40px;
`;

const Title = styled(Text)`
  color: ${Colors.secondColor};
  font-size: ${Layout.font.large};
  font-weight: bold;
  text-align: center;
`;

const Section = styled(Text)`
  font-size: ${Layout.font.large};
  font-weight: bold;
`
const Selector = styled(View)`
  flex-direction: row;
  align-items: center;
  width:100%;
`;

const Option = styled(TouchableOpacity)`
  width: 50%;
  align-items: center;
  ${props => props.isSelected && `background-color: ${Colors.thirdColor};`}
  border-bottom-color: ${Colors.thirdColor};
  border-bottom-width: 1px;
  margin: 10px 0;
`;

const OptionText = styled(Text)`
  ${props => props.isSelected && `color: white;`}
  padding: 5px 0;
`;

const ModeleList = styled(Selector)`
  margin: 10px 0;
  flex-flow: row wrap;
`;

const ButtonWrapper = styled(View)`
  align-items: center;
`;

const StyledButton = styled(TouchableOpacity)`
  align-items: center;
  background-color: ${props => props.disabled ? Colors.thirdColor : Colors.mainColor};
  height: 40px;
  margin: 10px 0;
  padding: ${Layout.space.small};
  text-align: center;
  width: 200px;
`;

const StyledText = styled(Text)`
  color: white;
  font-size: ${Layout.font.small};
`;

const FileNameInput = styled(TextInput)`
  width: 100%;
  border-color: ${Colors.thirdColor};
  border-width: 1px;
`;

class AddFileScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      Dossier2: 'PV',
      FileName: '',
      comment: '',
      FileNameFinal: '',
    }
  } 
  static navigationOptions = {
    headerTitle: <HeaderTitle title="Ajouter un document"/>,
    headerRight: <Logout />,
    headerStyle: {
      height: 70
    }
  }

  handleSelectModele = (FileName) => {
    this.setState({ FileName, FileNameFinal: FileName })
  }

  onCreateFile = () => {
    
  }

  render() {
    const title = this.props.navigation.getParam('affaire', '')
    return (
      <Wrapper>
        <Title>{title}</Title>
        <Section>Sélectionner un modèle</Section>
        <Selector>
          <Option
            isSelected={this.state.Dossier2 === 'PV'}
            onPress={() => this.setState({ Dossier2: 'PV', FileName: '' })}
          >
            <OptionText isSelected={this.state.Dossier2 === 'PV'}>PV</OptionText>
          </Option>
          <Option
            isSelected={this.state.Dossier2 === 'DMOS'}
            onPress={() => this.setState({ Dossier2: 'DMOS', FileName: '' })}
          >
            <OptionText isSelected={this.state.Dossier2 === 'DMOS'}>DMOS</OptionText>
          </Option>
        </Selector>
        <ModeleList>
          {this.props.modeleDocs.filter(m => m.Dossier2 === this.state.Dossier2).map(m => (
            <Modele key={m.ID} FileName={m.FileName} handleSelect={() => this.handleSelectModele(m.FileName)} selected={this.state.FileName === m.FileName}/>))
          }
        </ModeleList>
        <ButtonWrapper>
          <FileNameInput
            placeholder="Nom du fichier"
            onChangeText={(FileNameFinal) => this.setState({ FileNameFinal })}
            value={this.state.FileNameFinal}
          />
          <StyledButton disabled={this.state.FileName === ''} onPress={() => console.log('Create')}>
            <StyledText>Créer le fichier</StyledText>
          </StyledButton>
        </ButtonWrapper>
      </Wrapper>
    );
  }
}

const mapStateToProps = state => ({
  modeleDocs: state.business.docs.filter(d => d.Dossier1 === 'Modele'),
})

export default connect(mapStateToProps)(AddFileScreen);