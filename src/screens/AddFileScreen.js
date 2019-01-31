import React from 'react';
import { connect } from 'react-redux';
import { Text, View, Button, ScrollView, Image, CameraRoll, PermissionsAndroid, TouchableOpacity } from 'react-native';
import styled from 'styled-components'

import Logout from '../components/Logout';
import HeaderTitle from '../components/HeaderTitle'
import Modele from '../components/business/Modele';

import { getModeleHierarchy } from '../redux/selector/business';

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

const Separator = styled(View)`
  height: 2px;
  background-color: ${Colors.thirdColor};
  margin: 10px 0;
`;

class AddFileScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      Dossier2: 'PV',
      photos: [],
      FileName: ''
    }
  } 
  static navigationOptions = {
    headerTitle: <HeaderTitle title="Ajouter un document"/>,
    headerRight: <Logout />,
    headerStyle: {
      height: 70
    }
  }

  handleButtonPress = async () => {
    const isAuthorised = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE);
    if (isAuthorised) {
      this.getPhotos();
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            title: "Optidoc demande d'acccès aux photos",
            message:
              "Optidoc a besoin d'accéder à vos photos " +
              "pour que vous puissiez les importer dans l'application.",
            buttonNeutral: 'Plus tard',
            buttonNegative: 'Annuler',
            buttonPositive: 'Autoriser',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          this.getPhotos();
        } else {
          console.log('permission denied');
        }
      } catch (err) {
        console.warn(err);
      }
    }
    
  }

  getPhotos = () => {
    CameraRoll.getPhotos({
      first: 20,
      assetType: 'Photos',
    })
      .then(r => {
        this.setState({ photos: r.edges });
      })
      .catch((err) => {
        console.log({err})
        //Error Loading Images
      });
  };

  handleSelectModele = (FileName) => {
    this.setState({ FileName })
  }

  render() {
    const title = this.props.navigation.getParam('affaire', '')
    return (
      <Wrapper>
        <Title>{title}</Title>
        <Section>A partir d'un modèle</Section>
        <Selector>
          <Option
            isSelected={this.state.Dossier2 === 'PV'}
            onPress={() => this.setState({ Dossier2: 'PV' })}
          >
            <OptionText isSelected={this.state.Dossier2 === 'PV'}>PV</OptionText>
          </Option>
          <Option
            isSelected={this.state.Dossier2 === 'DMOS'}
            onPress={() => this.setState({ Dossier2: 'DMOS' })}
          >
            <OptionText isSelected={this.state.Dossier2 === 'DMOS'}>DMOS</OptionText>
          </Option>
        </Selector>
        <ModeleList>
          {this.props.modeleDocs.filter(m => m.Dossier2 === this.state.Dossier2).map(m => (
            <Modele key={m.ID} FileName={m.FileName} handleSelect={() => this.handleSelectModele(m.FileName)} selected={this.state.FileName === m.FileName}/>))
          }
        </ModeleList>
        <Separator />
        <Section>A partir d'une photo</Section>
        <View>
          <Button title="Load Images" onPress={this.handleButtonPress} />
          <ScrollView>
            {this.state.photos.map((p, i) => {
              return (
                <Image
                  key={i}
                  style={{
                    width: 300,
                    height: 100,
                  }}
                  source={{ uri: p.node.image.uri }}
                />
              );
            })}
          </ScrollView>
        </View>
      </Wrapper>
    );
  }
}

const mapStateToProps = state => ({
  modeleDocs: state.business.docs.filter(d => d.Dossier1 === 'Modele'),
  hierarchy: getModeleHierarchy(state.business.docs)
})

export default connect(mapStateToProps)(AddFileScreen);