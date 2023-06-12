import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';

import Colors from '../../constants/Colors';
import Layout from '../../constants/Layout';

import { SubArboWrapper, SubArboEl, Icons } from './SubArbo.styled';

const SubArbo = ({ title, children }) => {
  const [display, setDisplay] = useState(false);

  const toggleArbo = () => {
    setDisplay(!display);
  };

  return (
    <View>
      <SubArboWrapper>
        <Icons
          name={display ? 'md-caret-down-outline' : 'md-caret-forward'}
          size={Layout.icon.default}
          color={Colors.secondColor}
          onPress={toggleArbo}
        />
        <SubArboEl onPress={toggleArbo}>{title}</SubArboEl>
      </SubArboWrapper>
      {display && children}
    </View>
  );
};

SubArbo.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.any.isRequired,
};

export default SubArbo;
