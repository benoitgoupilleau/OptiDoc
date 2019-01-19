import React from 'react';
import styled from 'styled-components';

const NewsWrapper = styled.section`

`;

const Title = styled.h1`

`;

const Content = styled.p`

`;


const News = ({ title, content }) => (
  <NewsWrapper>
    <Title>{title}</Title>
    <Content>{content}</Content>
  </NewsWrapper>
);

export default News;
