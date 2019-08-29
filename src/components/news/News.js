import React from 'react';
import PropTypes from 'prop-types';

import { NewsWrapper, Title, Content } from './News.styled';

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
