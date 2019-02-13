import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, Text, ActivityIndicator, Alert } from 'react-native';
import { withNavigation } from 'react-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Document from './Document'
import { downloadBusiness } from '../../redux/actions/user'

import Colors from '../../constants/Colors';
import Layout from '../../constants/Layout'
import Folder from '../../constants/Folder'

const BusinessWrapper = styled(View)`
  background: ${Colors.antiBackground};
  border-radius: 5px;
  margin: ${Layout.space.large};
  padding: ${Layout.space.medium};
  text-align: left;
`;

const MainSection = styled(View)`
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
  margin: ${Layout.space.medium};
`

const Title = styled(Text)`
  color: ${Colors.secondColor};
  font-size: ${Layout.font.large};
  font-weight: bold;
`;

const SectionWrapper = styled(View)`
  align-items: center;
  border-bottom-color: ${Colors.mainColor};
  border-bottom-width: 1px;
  flex-direction: row;
  margin-bottom: ${Layout.space.medium};
  padding: ${Layout.space.medium};
`

const Section = styled(Text)`
  color: ${Colors.mainColor};
  font-size: ${Layout.font.medium};
  flex-grow: 1;
`;

const Icons = styled(Ionicons)`
  padding: 0 ${Layout.space.medium};
`;

const checkIfNew = (docs, id) => {
  const doc = docs.filter(d => d.ID === id)
  if (doc.length > 0 && !!doc[0].isNew) {
    return true;
  } 
  return false;
}

class Business extends React.Component {
  state = {
    showPrep: false,
    showRea: false
  }

  displayIcon = () => {
    const { title, downloadedBusiness, loadingBusiness, nbDocBusiness, totalDocBusiness } = this.props;
    if (loadingBusiness.includes(title)) {
      return (
        <View>
          <Text>{nbDocBusiness}/{totalDocBusiness}</Text>
          <ActivityIndicator />
        </View>)
    } else if (downloadedBusiness.includes(title)) {
      return (
        <Ionicons
          name={"md-phone-portrait"}
          size={30}
          color={Colors.secondColor}
        />
      );
    }
    return (
      <Ionicons
        name={"md-cloud-download"}
        size={30}
        color={Colors.secondColor}
        onPress={this.onDownload}
      />
    )
  }

  onDownload = () => {
    const { title, prep, rea, modeleDownloaded, downloadBusiness, userId, loadingBusiness, isConnected } = this.props;
    if (isConnected) {
      if (modeleDownloaded === 'in progress') {
        Alert.alert('Modèle en cours de téléchargement', 'Les fichiers modèles sont en cours de téléchargement. Merci de réessayer dans quelques instants', [{ text: 'Ok' }]);
      } else {
        if (loadingBusiness.includes(title)) {
          Alert.alert('Un téléchargement est en cours', "Merci d'attendre la fin du téléchargement", [{ text: 'Ok' }]);
        } else {
          downloadBusiness(userId, title, prep, rea)
        }
      }
    } else {
      Alert.alert('Vous êtes en mode hors-ligne', 'Vous pourrez télécharger cette affaire une fois votre connexion rétablie', [{ text: 'Ok' }]);
    }
  }

  toggleRea = () => {
    this.setState({showRea: !this.state.showRea})
  }

  togglePrep = () => {
    this.setState({showPrep: !this.state.showPrep})
  }

  render() {
    const { title, prep, rea, navigation, editedDocs, downloadedBusiness } = this.props;
    const affaire = this.props.affaires.filter(a => a.ID === title)[0]
    const clientName = affaire ? `${affaire.Client} - ${affaire.Designation}` : title;
    return (
      <BusinessWrapper>
        <MainSection>
          <Title>{clientName}</Title>
          {this.displayIcon()}
        </MainSection>
        <SectionWrapper>
          <Icons
            name={this.state.showPrep ? "md-arrow-dropdown" : "md-arrow-dropright"}
            size={26}
            color={Colors.mainColor}
            onPress={this.togglePrep}
          />
          <Section>Préparation</Section>
        </SectionWrapper>
        {this.state.showPrep && prep.map(p => <Document key={p.ID} {...p} type={Folder.prep} prep={prep} rea={rea} isDownloaded={downloadedBusiness.includes(title)}/>)}
        <SectionWrapper>
          <Icons
            name={this.state.showRea ? "md-arrow-dropdown" : "md-arrow-dropright"}
            size={26}
            color={Colors.mainColor}
            onPress={this.toggleRea}
          />
          <Section>Réalisation</Section>
          <Icons
            name={"md-add"}
            size={26}
            color={Colors.mainColor}
            onPress={() => navigation.navigate('Add', { affaire: title })}
          />
        </SectionWrapper>
        {this.state.showRea && rea.map(r => <Document key={r.ID} isNew={checkIfNew(editedDocs, r.ID)} {...r} type={Folder.rea} prep={prep} rea={rea} isDownloaded={downloadedBusiness.includes(title)}/>)}
      </BusinessWrapper>
    );
  }
}

Business.propTypes = {
  title: PropTypes.string.isRequired,
  prep: PropTypes.array,
  rea: PropTypes.array,
  modeleDocs: PropTypes.array.isRequired,
  downloadedBusiness: PropTypes.array.isRequired,
  loadingBusiness: PropTypes.array.isRequired,
  downloadBusiness: PropTypes.func.isRequired,
  userId: PropTypes.string.isRequired,
  navigation: PropTypes.object.isRequired,
}

Business.defaultProps = {
  prep: [],
  rea: []
}

const mapStateToProps = state => ({
  isConnected: state.network.isConnected,
  downloadedBusiness: state.user.downloadedBusiness,
  loadingBusiness: state.user.loadingBusiness,
  nbDocBusiness: state.user.nbDocBusiness,
  totalDocBusiness: state.user.totalDocBusiness,
  userId: state.user.id,
  editedDocs: state.user.editedDocs,
  modeleDocs: state.business.docs.filter(d => d.Dossier1 === 'Modele'),
  affaires: state.business.affaires,
  modeleDownloaded: state.user.modeleDownloaded
})

export default withNavigation(connect(mapStateToProps, { downloadBusiness })(Business));
