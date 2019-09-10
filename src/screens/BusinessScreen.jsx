import React, { useEffect } from 'react';
import { Text, Dimensions, View } from 'react-native';
import Orientation from 'react-native-orientation';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';

import Logout from '../components/Logout';
import HeaderTitle from '../components/HeaderTitle';
import Main from '../components/Main';

import Business from '../components/business/Business';

import Layout from '../constants/Layout';

import { listDocs } from '../redux/selector/business';
import { downloadModels } from '../redux/actions/user';

const { width } = Dimensions.get('window');

const StyledScroll = styled.ScrollView`
  background-color: #ededed;
  padding-bottom: ${Layout.space.large};
  width: ${width};
`;

const BusinessScreen = React.memo(
  ({ userBusiness, docs, modeleDownloaded, downloadModels, modeleDocs }) => {
    useEffect(() => {
      Orientation.lockToPortrait();
      if (modeleDownloaded !== 'in progress') {
        downloadModels(modeleDocs);
      }
    }, []);
    if (userBusiness.length > 0) {
      return (
        <Main>
          <View>
            <StyledScroll>
              {userBusiness.map(b => (
                <Business
                  key={b.id}
                  {...b}
                  prep={docs[b.id].prep}
                  rea={docs[b.id].rea}
                />
              ))}
            </StyledScroll>
          </View>
        </Main>
      );
    }
    return (
      <Main>
        <Text>Aucune affaire disponible</Text>
      </Main>
    );
  }
);

BusinessScreen.navigationOptions = {
  headerTitle: <HeaderTitle />,
  headerRight: <Logout />,
  headerStyle: {
    height: 70
  }
};

BusinessScreen.propTypes = {
  userBusiness: PropTypes.array.isRequired,
  docs: PropTypes.object.isRequired,
  modeleDownloaded: PropTypes.string.isRequired,
  modeleDocs: PropTypes.array.isRequired,
  downloadModels: PropTypes.func.isRequired
};

const mapStateToProps = ({ user, business }) => {
  const userBusiness = business.business;
  const docs = listDocs(business.docs, business.newDocs, userBusiness);
  return {
    userBusiness,
    docs,
    modeleDownloaded: user.modeleDownloaded,
    modeleDocs: business.modeles
  };
};

export default connect(
  mapStateToProps,
  { downloadModels }
)(BusinessScreen);
