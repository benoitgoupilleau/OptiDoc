import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { View, Text } from "react-native";

const NewsWrapper = styled(View)`
  background: #fff;
  border-radius: 5px;
  margin: 20px 20px 0 20px;
  padding: 10px;
  text-align: left;
`;

const Title = styled(Text)`
  font-size: 20px;
  font-weight: bold;
  margin: 10px 0;
`;

const Content = styled(Text)`
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
