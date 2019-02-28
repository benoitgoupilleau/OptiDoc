import React from 'react';
import { connect } from 'react-redux';
import Orientation from 'react-native-orientation';
import { Text, View, TextInput, ScrollView, Dimensions, CameraRoll, PermissionsAndroid, TouchableOpacity } from 'react-native';
import styled from 'styled-components'

import Logout from '../components/Logout';
import HeaderTitle from '../components/HeaderTitle'
import Picture from '../components/business/Picture';

import Layout from '../constants/Layout'
import Colors from '../constants/Colors'

const { width } = Dimensions.get('window');

const StyledScroll = styled(ScrollView)`
  width: ${width};
  padding-bottom: ${Layout.space.large};
`;

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

const Comment = styled(TextInput)`
  width: 100%;
  border-color: ${Colors.thirdColor};
  border-width: 1px;
`;

const ListPicture = styled(View)`
  margin: 10px 0;
  flex-flow: row wrap;
`;

class AddFileScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      Dossier2: 'PV',
      photos: [],
      FileName: '',
      image: '',
      comment: '',
      FileNameFinal: '',
      pictureName: '',
      pictureNameFinal: props.Dossier1
    }
    this.handleButtonPress()
  } 
  static navigationOptions = {
    headerTitle: <HeaderTitle title="Ajouter une photo"/>,
    headerRight: <Logout />,
    headerStyle: {
      height: 70
    }
  }

  componentDidMount() {
    Orientation.lockToPortrait();
  }

  handleButtonPress = async () => {
    const isAuthorised = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
    if (isAuthorised) {
      this.getPhotos();
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
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
      first: 8,
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
    this.setState({ FileName, FileNameFinal: FileName })
  }

  handleSelectPicture = (pictureName) => {
    this.setState({ pictureName })
  }

  onCreatePicture = () => {

  }

  render() {
    const title = this.props.navigation.getParam('affaire', '')
    return (
      <Wrapper>
        <Title>{title}</Title>
        <Section>Sélectionner une photo</Section>
        <View>
          <StyledButton onPress={this.handleButtonPress}>
            <StyledText>Charger les photos</StyledText>
          </StyledButton>
          <FileNameInput
            placeholder="Nom du fichier"
            onChangeText={(pictureNameFinal) => this.setState({ pictureNameFinal })}
            value={this.state.pictureNameFinal}
          />
          <Text>Commentaire obligatoire pour la photo :</Text>
          <Comment 
            multiline={true}
            onChangeText={(comment) => this.setState({ comment })}
            value={this.state.comment}
            returnKeyType="done"
          />
          <ButtonWrapper>
            <StyledButton disabled={this.state.pictureName === '' || this.state.comment === ''} onPress={() => console.log('Create')}>
              <StyledText>Créer le fichier</StyledText>
            </StyledButton>
          </ButtonWrapper>
          <ListPicture>
            <StyledScroll showsVerticalScrollIndicator scrollEnabled >
              <View>
                {this.state.photos.map((p) => <Picture
                  key={p.node.image.uri}
                  p={p}
                  handleSelect={() => this.handleSelectPicture(p.node.image.uri)}
                  selected={this.state.pictureName === p.node.image.uri}
                /> )}
              </View>
            </StyledScroll>
          </ListPicture>
        </View>
      </Wrapper>
    );
  }
}

const mapStateToProps = state => ({
  modeleDocs: state.business.docs.filter(d => (d.Dossier1 && d.Dossier1 === 'Modele')),
})

export default connect(mapStateToProps)(AddFileScreen);