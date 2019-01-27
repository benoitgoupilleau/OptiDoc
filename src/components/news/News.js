import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { View, Text } from 'react-native';

import Colors from '../../constants/Colors';
import Layout from '../../constants/Layout';

const NewsWrapper = styled(View)`
  background: ${Colors.antiBackground};
  border-radius: 5px;
  margin: ${Layout.space.large} ${Layout.space.large} 0 ${Layout.space.large};
  padding: ${Layout.space.medium};
  text-align: left;
`;

const Title = styled(Text)`
  color: ${Colors.secondColor};
  font-size: ${Layout.font.medium};
  font-weight: bold;
  margin: ${Layout.space.medium} 0;
`;

const Content = styled(Text)`
  color: ${Colors.thirdColor};
`;


const News = ({ title, content }) => (
  <NewsWrapper>
    <Title>{title}</Title>
    <Content>{content}</Content>
  </NewsWrapper>
);

News.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired
}

export default News;
