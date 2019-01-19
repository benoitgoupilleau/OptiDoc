
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { View, Text, Image } from 'react-native';

import logo from '../assets/images/logo.png';

const Wrapper = styled(View)`
  align-items: center;
  display: flex;
  flex-direction: row;
  margin: 0 20px;
`;

const Title = styled(Text)`
  font-size: 20px;
  max-width: 400px;
`


const HeaderTitle = ({ title, ...rest }) => {
  console.log({rest});
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
