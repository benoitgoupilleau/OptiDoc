
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { View, Text, Image } from 'react-native';

import logo from '../assets/images/logo.png';
import Colors from '../constants/Colors'
import Layout from '../constants/Layout'

const Wrapper = styled(View)`
  align-items: center;
  display: flex;
  flex-direction: row;
  margin: 0 ${Layout.space.large};
`;

const Title = styled(Text)`
  color: ${Colors.mainColor};
  font-size: ${Layout.font.medium};
  max-width: 400px;
`


const HeaderTitle = ({ title }) => {
  return (
    <Wrapper> 
      <Image
        source={logo}
        style={{ width: 200, height: 50 }}
      />
      {title.length > 0 && <Title>{title}</Title> }
    </Wrapper>
  );
}

HeaderTitle.propTypes = {
  title: PropTypes.string
}

HeaderTitle.defaultProps = {
  title: ''
}

export default HeaderTitle;
