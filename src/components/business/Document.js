import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { TouchableOpacity, Text } from 'react-native';
import RNFS from 'react-native-fs';
import FileViewer from 'react-native-file-viewer';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { withNavigation } from 'react-navigation';
import { downloadBusiness } from '../../redux/actions/user'

import Layout from '../../constants/Layout';
import Folder from '../../constants/Folder'

const rootDir = RNFS.DocumentDirectoryPath;

const DocumentWrapper = styled(TouchableOpacity)`
  margin: ${Layout.space.medium};
  flex-direction: row;
  justify-content: space-between;
`;

const Title = styled(Text)`
  font-size: ${Layout.font.medium};
`;

class Document extends React.Component {
  onPress = async () => {
    const { type, ID, Extension, Dossier1, userId, loadingBusiness, prep, rea } = this.props;
    const filePath = `${rootDir}/${userId}/${Dossier1}/${type}/${ID}.${Extension}`;
    const fileExists = await RNFS.exists(filePath);
    if (fileExists) {
      FileViewer.open(filePath, { showOpenWithDialog: true })
    } else if (!loadingBusiness.includes(Dossier1)) {
      this.props.downloadBusiness(userId, Dossier1, prep, rea)
    }
  }

  render() {
    const { FileName, type, navigation, ID, Dossier3, Extension, Dossier1 } = this.props;
    return (
      <DocumentWrapper
        onPress={() => navigation.navigate('Pdf', { title: FileName, ID, Dossier3, Extension, Dossier1, type })}
      >
        <Title>{FileName}</Title>
        {type === Folder.rea &&
          <Ionicons
            name={"md-create"}
            size={26}
            onPress={this.onPress}
          />
        }
      </DocumentWrapper>
    );
  } 
}

Document.propTypes = {
  FileName: PropTypes.string.isRequired,
  ID: PropTypes.string.isRequired,
  Dossier3: PropTypes.string.isRequired,
  Extension: PropTypes.string.isRequired,
  Dossier1: PropTypes.string.isRequired,
  type: PropTypes.string,
  navigation: PropTypes.object.isRequired,
  loadingBusiness: PropTypes.array.isRequired,
  downloadBusiness: PropTypes.func.isRequired,
  userId: PropTypes.string.isRequired,
  prep: PropTypes.array.isRequired,
  rea: PropTypes.array.isRequired
}

Document.defaultProps = {
  type: Folder.prep
}

const mapStateToProps = state => ({
  loadingBusiness: state.user.loadingBusiness,
  userId: state.user.id
})

export default withNavigation(connect(mapStateToProps, { downloadBusiness })(Document));
