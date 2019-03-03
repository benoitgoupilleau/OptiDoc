
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
  margin: 0 ${Layout.space.small};
`;

const Title = styled(Text)`
  color: ${Colors.mainColor};
  font-size: ${Layout.font.medium};
  padding-left: 5px;
  max-width: 400px;
`


const HeaderTitle = ({ title, noLogo }) => {
  const displayTitle = title.length > 25 ? title.substring(0, 25) + '(...)' : title
  return (
    <Wrapper> 
      {logo && !noLogo && <Image
        source={logo}
        style={{ width: 95, height: 50 }}
      />}
      {displayTitle.length > 0 && <Title>{displayTitle}</Title> }
    </Wrapper>
  );
}

HeaderTitle.propTypes = {
  title: PropTypes.string,
  noLogo: PropTypes.bool
}

HeaderTitle.defaultProps = {
  title: '',
  noLogo: false
}

export default HeaderTitle;
