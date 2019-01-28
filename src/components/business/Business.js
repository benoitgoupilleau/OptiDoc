import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, Text } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Document from './Document'

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

const Business = ({ title, prep, rea, downloadedBusiness }) => (
  <BusinessWrapper>
    <MainSection>
      <Title>{title}</Title>
      {downloadedBusiness.includes(title) ?
        <Ionicons
          name={"md-phone-portrait"}
          size={30}
          color={Colors.secondColor}
        /> : 
        <Ionicons
          name={"md-cloud-download"}
          size={30}
          color={Colors.secondColor}
          onPress={() => console.log('md-cloud-download clicked')}
        />
      }
    </MainSection>
    <PrepSection>Préparation</PrepSection>
    {prep.map(p => <Document key={p.ID} title={p.FileName} type="prep"/>)}
    <ReaSection>
      <Section>Réalisation</Section>
      <Ionicons
        name={"md-add"}
        size={26}
        color={Colors.mainColor}
        onPress={() => console.log('md-add clicked')}
      />
    </ReaSection>
    {rea.map(r => <Document key={r.ID} title={r.FileName} type="rea"/>)}
  </BusinessWrapper>
);

Business.propTypes = {
  title: PropTypes.string.isRequired,
  prep: PropTypes.array,
  rea: PropTypes.array,
  downloadedBusiness: PropTypes.array.isRequired
}

Business.defaultProps = {
  prep: [],
  rea: []
}

const mapStateToProps = state => ({
  downloadedBusiness: state.user.downloadedBusiness
})

export default connect(mapStateToProps)(Business);