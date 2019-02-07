import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, Text, ActivityIndicator } from 'react-native';
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

const ReaSection = styled(View)`
  align-items: center;
  border-bottom-color: ${Colors.mainColor};
  border-bottom-width: 1px;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: ${Layout.space.medium};
  padding: ${Layout.space.medium};
`

const Section = styled(Text)`
  color: ${Colors.mainColor};
  font-size: ${Layout.font.medium};
`;

const PrepSection = styled(Text)`
  border-bottom-color: ${Colors.mainColor};
  border-bottom-width: 1px;
  color: ${Colors.mainColor};
  font-size: ${Layout.font.medium};
  margin-bottom: ${Layout.space.medium};
  padding: ${Layout.space.medium};
`;

const checkIfNew = (docs, id) => {
  const doc = docs.filter(d => d.ID === id)
  if (doc.length > 0 && !!doc[0].isNew) {
    return true;
  } 
  return false;
}

class Business extends React.Component {
  displayIcon = () => {
    const { title, prep, rea, downloadedBusiness, downloadBusiness, userId, loadingBusiness, modeleDocs } = this.props;
    if (loadingBusiness.includes(title)) {
      return <ActivityIndicator />
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
        onPress={() => downloadBusiness(userId, title, prep, rea, modeleDocs)}
      />
    )
  }

  render() {
    const { title, prep, rea, navigation, editedDocs } = this.props;
    return (
      <BusinessWrapper>
        <MainSection>
          <Title>{title}</Title>
          {this.displayIcon()}
        </MainSection>
        <PrepSection>Préparation</PrepSection>
        {prep.map(p => <Document key={p.ID} {...p} type={Folder.prep} prep={prep} rea={rea} />)}
        <ReaSection>
          <Section>Réalisation</Section>
          <Ionicons
            name={"md-add"}
            size={26}
            color={Colors.mainColor}
            onPress={() => navigation.navigate('Add', { affaire: title })}
          />
        </ReaSection>
        {rea.map(r => <Document key={r.ID} isNew={checkIfNew(editedDocs, r.ID)} {...r} type={Folder.rea} prep={prep} rea={rea} />)}
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
  downloadedBusiness: state.user.downloadedBusiness,
  loadingBusiness: state.user.loadingBusiness,
  userId: state.user.id,
  editedDocs: state.user.editedDocs,
  modeleDocs: state.business.docs.filter(d => d.Dossier1 === 'Modele'),
})

export default withNavigation(connect(mapStateToProps, { downloadBusiness })(Business));
