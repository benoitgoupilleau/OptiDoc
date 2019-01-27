import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { View, Text } from 'react-native';

import Document from './Document'

import Colors from '../../constants/Colors';
import Layout from '../../constants/Layout'

const BusinessWrapper = styled(View)`
  background: ${Colors.antiBackground};
  border-radius: 5px;
  margin: ${Layout.space.large} ${Layout.space.large} 0 ${Layout.space.large};
  padding: ${Layout.space.medium};
  text-align: left;
`;

const Title = styled(Text)`
  color: ${Colors.secondColor};
  font-size: ${Layout.font.large};
  font-weight: bold;
  margin: ${Layout.space.medium};
`;

const Section = styled(Text)`
  color: ${Colors.mainColor};
  border-bottom-color: ${Colors.mainColor};
  border-bottom-width: 1px;
  font-size: ${Layout.font.medium};
  padding: ${Layout.space.medium};
  margin-bottom: ${Layout.space.medium};
`;



const Business = ({ title, prep, rea }) => (
  <BusinessWrapper>
    <Title>{title}</Title>
    <Section>Préparation</Section>
    {prep.map(p => <Document key={p.ID} title={p.FileName} type="prep"/>)}
    <Section>Réalisation</Section>
    {rea.map(r => <Document key={r.ID} title={r.FileName} type="rea"/>)}
  </BusinessWrapper>
);

Business.propTypes = {
  title: PropTypes.string.isRequired,
  prep: PropTypes.array,
  rea: PropTypes.array
}

Business.defaultProps = {
  prep: [],
  rea: []
}

export default Business;
