import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, Text, ActivityIndicator, Alert } from 'react-native';
import { withNavigation } from 'react-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { downloadBusiness } from '../../redux/actions/user'

import Colors from '../../constants/Colors';
import Layout from '../../constants/Layout'

import { BusinessWrapper, MainSection, Title, IconView } from './Business.styled'

class Business extends React.Component {
  state = {
    showPrep: false,
    showRea: false
  }

  displayIcon = () => {
    const { id, downloadedBusiness, loadingBusiness, nbDocBusiness, totalDocBusiness } = this.props;
    if (loadingBusiness.includes(id)) {
      return (
        <View>
          {totalDocBusiness > 0 && <Text>{nbDocBusiness}/{totalDocBusiness}</Text>}
          <ActivityIndicator />
        </View>)
    } else if (downloadedBusiness.includes(id)) {
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
    const { id } = this.props
    this.props.navigation.navigate('Docs', { affaire: id })
  }

  onDownload = () => {
    const { id, prep, rea, modeleDownloaded, downloadBusiness, userId, loadingBusiness, isConnected } = this.props;
    if (isConnected) {
      if (modeleDownloaded === 'in progress') {
        Alert.alert('Modèle en cours de téléchargement', 'Les fichiers modèles sont en cours de téléchargement. Merci de réessayer dans quelques instants', [{ text: 'Ok' }]);
      } else {
        if (loadingBusiness.length > 0) {
          Alert.alert('Un téléchargement est en cours', "Merci d'attendre la fin du téléchargement", [{ text: 'Ok' }]);
        } else {
          Alert.alert('Confirmer le téléchargement', "Etes-vous sûr de vouloir télécharger cette affaire ?", [{
            text: 'Annuler',
            style: 'cancel',
          }, { 
            text: 'Oui',
            onPress: () => downloadBusiness(userId, id, prep, rea)
          }]);
          
        }
      }
    } else {
      Alert.alert('Vous êtes en mode hors-ligne', 'Vous pourrez télécharger cette affaire une fois votre connexion rétablie', [{ text: 'Ok' }]);
    }
  }

  render() {
    const { id, client, designation } = this.props;
    const clientName = `${client} - ${designation}`;
    return (
      <BusinessWrapper>
        <MainSection>
          <Title onPress={() => { 
            if (this.props.downloadedBusiness.includes(id)) {
              return this.goToDocs();
            } else if (!this.props.loadingBusiness.includes(id)) {
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
  id: PropTypes.string.isRequired,
  client: PropTypes.string.isRequired,
  designation: PropTypes.string.isRequired,
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
  modeleDocs: state.business.modeles,
  modeleDownloaded: state.user.modeleDownloaded
})

export default withNavigation(connect(mapStateToProps, { downloadBusiness })(Business));
