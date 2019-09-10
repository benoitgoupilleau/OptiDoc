import React from 'react';
import PropTypes from 'prop-types';
import { Image } from 'react-native';

import logo from '../assets/images/logo.png';

import { Wrapper, Title } from './HeaderTitle.styled';

const HeaderTitle = ({ title, noLogo }) => {
  const displayTitle =
    title.length > 25 ? title.substring(0, 25) + '(...)' : title;
  return (
    <Wrapper>
      {logo && !noLogo && (
        <Image source={logo} style={{ width: 75, height: 45 }} />
      )}
      {displayTitle.length > 0 && <Title>{displayTitle}</Title>}
    </Wrapper>
  );
};

HeaderTitle.propTypes = {
  title: PropTypes.string,
  noLogo: PropTypes.bool
};

HeaderTitle.defaultProps = {
  title: '',
  noLogo: false
};

export default HeaderTitle;
