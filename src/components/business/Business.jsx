import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Alert } from 'react-native';
import { withNavigation } from 'react-navigation';

import { downloadBusiness } from '../../redux/actions/user';

import BusinessIcons from './BusinessIcons';
import { BusinessWrapper, MainSection, Title } from './Business.styled';

const Business = React.memo(
  ({
    isConnected,
    userId,
    prep,
    rea,
    sysDoc,
    id,
    downloadBusiness,
    downloadedBusiness,
    loadingBusiness,
    navigation,
    client,
    designation,
  }) => {
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

    const clientName = `${client} - ${designation}`;
    return (
      <BusinessWrapper>
        <MainSection>
          <Title
            onPress={() => {
              if (downloadedBusiness.includes(id) || loadingBusiness.some((l) => l.ID === id)) {
                return goToDocs();
              } else if (!loadingBusiness.some((l) => l.ID === id)) {
                return onDownload();
              }
              return;
            }}
          >
            {clientName}
          </Title>
          <BusinessIcons id={id} prep={prep} rea={rea} sysDoc={sysDoc} />
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
  sysDoc: PropTypes.array,
  downloadedBusiness: PropTypes.array.isRequired,
  loadingBusiness: PropTypes.array.isRequired,
  downloadBusiness: PropTypes.func.isRequired,
  userId: PropTypes.string.isRequired,
  navigation: PropTypes.object.isRequired,
  isConnected: PropTypes.bool.isRequired,
};

Business.defaultProps = {
  prep: [],
  rea: [],
  sysDoc: [],
};

const mapStateToProps = (state) => ({
  isConnected: state.network.isConnected,
  downloadedBusiness: state.user.downloadedBusiness,
  loadingBusiness: state.user.loadingBusiness,
  userId: state.user.userId,
});

export default withNavigation(connect(mapStateToProps, { downloadBusiness })(Business));
