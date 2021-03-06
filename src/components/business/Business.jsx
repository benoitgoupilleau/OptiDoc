import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, Text, ActivityIndicator, Alert } from 'react-native';
import { withNavigation } from 'react-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { downloadBusiness } from '../../redux/actions/user';

import Colors from '../../constants/Colors';
import Layout from '../../constants/Layout';

import {
  BusinessWrapper,
  MainSection,
  Title,
  IconView
} from './Business.styled';

const Business = React.memo(
  ({
    isConnected,
    userId,
    prep,
    rea,
    id,
    downloadBusiness,
    downloadedBusiness,
    loadingBusiness,
    navigation,
    client,
    designation
  }) => {
    const goToDocs = () => {
      navigation.navigate('Docs', { affaire: id });
    };

    const onDownload = () => {
      if (isConnected) {
        Alert.alert(
          'Confirmer le téléchargement',
          'Etes-vous sûr de vouloir télécharger cette affaire ?',
          [
            {
              text: 'Annuler',
              style: 'cancel'
            },
            {
              text: 'Oui',
              onPress: () => downloadBusiness(userId, id, prep, rea)
            }
          ]
        );
      } else {
        Alert.alert(
          'Vous êtes en mode hors-ligne',
          'Vous pourrez télécharger cette affaire une fois votre connexion rétablie',
          [{ text: 'Ok' }]
        );
      }
    };

    const displayIcon = () => {
      if (loadingBusiness.some(l => l.ID === id)) {
        const dowloadingBusiness = loadingBusiness.find(l => l.ID === id);
        return (
          <IconView>
            <View>
              {dowloadingBusiness.totalDocBusiness > 0 && (
                <Text>
                  {dowloadingBusiness.nbDocBusiness}/
                  {dowloadingBusiness.totalDocBusiness}
                </Text>
              )}
              <ActivityIndicator />
            </View>
            <Ionicons
              name={'md-arrow-dropright'}
              size={Layout.icon.large}
              style={{ paddingLeft: 30 }}
              color={Colors.secondColor}
              onPress={goToDocs}
            />
          </IconView>
        );
      } else if (downloadedBusiness.includes(id)) {
        return (
          <IconView>
            <Ionicons
              name={'md-phone-portrait'}
              size={Layout.icon.large}
              color={Colors.secondColor}
            />
            <Ionicons
              name={'md-arrow-dropright'}
              size={Layout.icon.large}
              style={{ paddingLeft: 30 }}
              color={Colors.secondColor}
              onPress={goToDocs}
            />
          </IconView>
        );
      }
      return (
        <Ionicons
          name={'md-cloud-download'}
          size={Layout.icon.large}
          color={Colors.secondColor}
          onPress={onDownload}
        />
      );
    };

    const clientName = `${client} - ${designation}`;
    return (
      <BusinessWrapper>
        <MainSection>
          <Title
            onPress={() => {
              if (
                downloadedBusiness.includes(id) ||
                loadingBusiness.some(l => l.ID === id)
              ) {
                return goToDocs();
              } else if (!loadingBusiness.some(l => l.ID === id)) {
                return onDownload();
              }
              return;
            }}
          >
            {clientName}
          </Title>
          {displayIcon()}
        </MainSection>
      </BusinessWrapper>
    );
  }
);

Business.propTypes = {
  id: PropTypes.string.isRequired,
  client: PropTypes.string.isRequired,
  designation: PropTypes.string.isRequired,
  prep: PropTypes.array,
  rea: PropTypes.array,
  downloadedBusiness: PropTypes.array.isRequired,
  loadingBusiness: PropTypes.array.isRequired,
  downloadBusiness: PropTypes.func.isRequired,
  userId: PropTypes.string.isRequired,
  navigation: PropTypes.object.isRequired,
  isConnected: PropTypes.bool.isRequired
};

Business.defaultProps = {
  prep: [],
  rea: []
};

const mapStateToProps = state => ({
  isConnected: state.network.isConnected,
  downloadedBusiness: state.user.downloadedBusiness,
  loadingBusiness: state.user.loadingBusiness,
  userId: state.user.userId
});

export default withNavigation(
  connect(
    mapStateToProps,
    { downloadBusiness }
  )(Business)
);
