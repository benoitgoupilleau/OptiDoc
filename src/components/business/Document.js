import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { TouchableOpacity, Text, View } from 'react-native';
import RNFS from 'react-native-fs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { withNavigation } from 'react-navigation';
import { downloadBusiness, editFile } from '../../redux/actions/user'

import Layout from '../../constants/Layout';
import Folder from '../../constants/Folder';
import Colors from '../../constants/Colors'

const rootDir = RNFS.DocumentDirectoryPath;

const DocumentWrapper = styled(TouchableOpacity)`
  margin: ${Layout.space.medium};
  flex-direction: row;
  justify-content: space-between;
`;

const File = styled(View)`
  flex-direction: row;
  align-items: center;
`;

const Title = styled(Text)`
  font-size: ${Layout.font.medium};
`;

const IconsWrapper = styled(View)`
  flex-direction: row;
  align-items: center;
`;

const EditIcons = styled(View)`
  flex-direction: row;
  align-items: center;
`;

const Icons = styled(Ionicons)`
  padding: 0 10px;
`;

class Document extends React.Component {
  onEdit = async () => {
    const { type, ID, Extension, Dossier1, userId, loadingBusiness, prep, rea } = this.props;
    const filePath = `${rootDir}/${userId}/${Dossier1}/${type}/${ID}.${Extension}`;
    const fileExists = await RNFS.exists(filePath);
    if (fileExists) {
      this.props.editFile(ID, filePath)
    } else if (!loadingBusiness.includes(Dossier1)) {
      this.props.downloadBusiness(userId, Dossier1, prep, rea)
    }
  }

  onUpload = () => {

  }

  onCancel = () => {

  }

  render() {
    const { FileName, type, navigation, ID, Dossier3, Extension, Dossier1, editedDocs } = this.props;
    return (
      <DocumentWrapper
        onPress={() => navigation.navigate('Pdf', { title: FileName, ID, Dossier3, Extension, Dossier1, type })}
      > 
        <File>
          <Icons
            name={['png', 'jpg'].includes(Extension) ? 'md-image' : 'md-document'}
            size={18}
          />
          <Title>{FileName}</Title>
        </File>
        {type === Folder.rea &&
          <IconsWrapper>
            {editedDocs.includes(ID) && (
              <EditIcons>
                <Icons
                  name="md-close"
                  size={26}
                  color="red"
                  onPress={this.onCancel}
                />
                <Icons
                  name="md-cloud-upload"
                  size={26}
                  color={Colors.secondColor}
                  onPress={this.onUpload}
                />
              </EditIcons>
            )}
            <Icons
              name="md-create"
              size={26}
              onPress={this.onEdit}
            />
          </IconsWrapper>
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
  rea: PropTypes.array.isRequired,
  editFile: PropTypes.func.isRequired,
  editedDocs: PropTypes.array.isRequired
}

Document.defaultProps = {
  type: Folder.prep
}

const mapStateToProps = state => ({
  loadingBusiness: state.user.loadingBusiness,
  editedDocs: state.user.editedDocs,
  userId: state.user.id
})

export default withNavigation(connect(mapStateToProps, { downloadBusiness, editFile })(Document));
