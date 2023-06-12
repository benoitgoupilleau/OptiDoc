import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, Text, ActivityIndicator, Alert } from 'react-native';
import { withNavigation } from 'react-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { downloadBusiness } from '../../redux/actions/user';

import Colors from '../../constants/Colors';
import Layout from '../../constants/Layout';

import { IconView } from './Business.styled';

const BusinessIcons = React.memo(
  ({ isConnected, userId, prep, rea, sysDoc, id, downloadBusiness, downloadedBusiness, loadingBusiness, navigation, hideNav }) => {
    const goToDocs = () => {
      navigation.navigate('Docs', { affaire: id });
    };

    const onDownload = () => {
      if (isConnected) {
        Alert.alert('Confirmer le téléchargement', 'Etes-vous sûr de vouloir télécharger cette affaire ?', [
          {
            text: 'Annuler',
            style: 'cancel',
          },
          {
            text: 'Oui',
            onPress: () => downloadBusiness(userId, id, { prep, rea, sysDoc }),
          },
        ]);
      } else {
        Alert.alert('Vous êtes en mode hors-ligne', 'Vous pourrez télécharger cette affaire une fois votre connexion rétablie', [
          { text: 'Ok' },
        ]);
      }
    };

    if (loadingBusiness.some((l) => l.ID === id)) {
      const dowloadingBusiness = loadingBusiness.find((l) => l.ID === id);
      return (
        <IconView>
          <View>
            {dowloadingBusiness.totalDocBusiness > 0 && (
              <Text>
                {dowloadingBusiness.nbDocBusiness}/{dowloadingBusiness.totalDocBusiness}
              </Text>
            )}
            <ActivityIndicator />
          </View>
          {!hideNav && (
            <Ionicons
              name={'md-caret-forward'}
              size={Layout.icon.large}
              style={{ paddingLeft: 30 }}
              color={Colors.secondColor}
              onPress={goToDocs}
            />
          )}
        </IconView>
      );
    } else if (downloadedBusiness.includes(id)) {
      return (
        <IconView>
          <Ionicons name={'md-phone-portrait-sharp'} size={Layout.icon.large} color={Colors.secondColor} />
          {!hideNav && (
            <Ionicons
              name={'md-caret-forward'}
              size={Layout.icon.large}
              style={{ paddingLeft: 30 }}
              color={Colors.secondColor}
              onPress={goToDocs}
            />
          )}
        </IconView>
      );
    }
    return <Ionicons name={'md-cloud-download'} size={Layout.icon.large} color={Colors.secondColor} onPress={onDownload} />;
  }
);

BusinessIcons.propTypes = {
  id: PropTypes.string.isRequired,
  client: PropTypes.string.isRequired,
  prep: PropTypes.array,
  rea: PropTypes.array,
  sysDoc: PropTypes.array,
  downloadedBusiness: PropTypes.array.isRequired,
  loadingBusiness: PropTypes.array.isRequired,
  downloadBusiness: PropTypes.func.isRequired,
  userId: PropTypes.string.isRequired,
  navigation: PropTypes.object.isRequired,
  isConnected: PropTypes.bool.isRequired,
  hideNav: PropTypes.bool,
};

BusinessIcons.defaultProps = {
  prep: [],
  rea: [],
  sysDoc: [],
  hideNav: false,
};

const mapStateToProps = (state) => ({
  isConnected: state.network.isConnected,
  downloadedBusiness: state.user.downloadedBusiness,
  loadingBusiness: state.user.loadingBusiness,
  userId: state.user.userId,
});

export default withNavigation(connect(mapStateToProps, { downloadBusiness })(BusinessIcons));
