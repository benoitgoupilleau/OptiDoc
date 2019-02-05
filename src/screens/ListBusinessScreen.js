import React from 'react';
import { Text, ScrollView, Dimensions, View } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Logout from '../components/Logout';
import HeaderTitle from '../components/HeaderTitle'
import Main from '../components/Main';


import Layout from '../constants/Layout'
import Colors from '../constants/Colors'


const { width } = Dimensions.get('window');

const StyledScroll = styled(ScrollView)`
  background-color: #ededed;
  padding-bottom: ${Layout.space.large};
  width: ${width};
`;

const BusinessWrapper = styled(View)`
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

class ListBusinessScreen extends React.Component {
  static navigationOptions = {
    headerTitle: <HeaderTitle/>,
    headerRight: <Logout />,
    headerStyle: {
      height: 70
    }
  }

  
  render() {
    if (this.props.availableBusinesses.length > 0) {
      return (
        <Main>
          <View>
            <StyledScroll>
              {this.props.availableBusinesses.map(b => (
              <BusinessWrapper key={b.ID_Affaire +Math.random()}>
                <Title>{b.ID_Affaire}</Title>
              </BusinessWrapper>
              ))}
            </StyledScroll>
          </View>
        </Main>
      );
    }
    return (
      <Main>
        <Text>Aucune affaire disponible</Text>
      </Main>
    );
  }
}

ListBusinessScreen.propTypes = {
  availableBusinesses: PropTypes.array.isRequired,
}


const mapStateToProps = (state) => ({
  availableBusinesses: state.business.business
})

export default connect(mapStateToProps)(ListBusinessScreen);