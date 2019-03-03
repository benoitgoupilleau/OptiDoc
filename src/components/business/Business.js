import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, Text, ActivityIndicator, Alert } from 'react-native';
import { withNavigation } from 'react-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { downloadBusiness } from '../../redux/actions/user'

import Colors from '../../constants/Colors';
import Layout from '../../constants/Layout'

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
  flex-grow: 1;
  max-width: 450px;
  font-weight: bold;
`;

const IconView = styled(View)`
  flex-direction: row;
`;

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
        <IconView>
            <Ionicons
            name={"md-phone-portrait"}
            size={Layout.icon.large}
            color={Colors.secondColor}
          />
          <Ionicons
            name={"md-arrow-dropright"}
            size={Layout.icon.large}
            style={{ paddingLeft: 30 }}
            color={Colors.secondColor}
            onPress={this.goToDocs}
          />
        </IconView>
      );
    }
    return (
      <Ionicons
        name={"md-cloud-download"}
        size={Layout.icon.large}
        color={Colors.secondColor}
        onPress={this.onDownload}
      />
    )
  }

  goToDocs = () => {
    const { title } = this.props
    this.props.navigation.navigate('Docs', { affaire: title })
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

  render() {
    const { title } = this.props;
    const affaire = this.props.affaires.filter(a => a.ID === title)[0]
    const clientName = affaire ? `${affaire.Client} - ${affaire.Designation}` : title;
    return (
      <BusinessWrapper>
        <MainSection>
          <Title onPress={() => { 
            if (this.props.downloadedBusiness.includes(title)) {
              return this.goToDocs();
            } else if (!this.props.loadingBusiness.includes(title)) {
              return this.onDownload();
            }
            return;
          }} >{clientName}</Title>
          {this.displayIcon()}
        </MainSection>
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
  nbDocBusiness: PropTypes.number.isRequired,
  totalDocBusiness: PropTypes.number.isRequired,
  isConnected: PropTypes.bool.isRequired,
  modeleDownloaded: PropTypes.string.isRequired,
  affaires: PropTypes.array.isRequired
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
  modeleDocs: state.business.docs.filter(d => (d.Dossier1 && d.Dossier1 === 'Modele')),
  affaires: state.business.affaires,
  modeleDownloaded: state.user.modeleDownloaded
})

export default withNavigation(connect(mapStateToProps, { downloadBusiness })(Business));
