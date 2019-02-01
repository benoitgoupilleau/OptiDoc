import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { TouchableOpacity, Text, View, ActivityIndicator } from 'react-native';
import pick from 'lodash.pick';
import RNFS from 'react-native-fs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { withNavigation } from 'react-navigation';
import { downloadBusiness, editFile, uploadFile, uploadingFile, removeFromEdit, downLoadOneFile  } from '../../redux/actions/user'

import Layout from '../../constants/Layout';
import Folder from '../../constants/Folder';
import Colors from '../../constants/Colors';
import Tables from '../../constants/Tables';

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
    const { type, ID, Extension, Dossier1, userId, loadingBusiness, prep, rea, modeleDocs } = this.props;
    const filePath = `${rootDir}/${userId}/${Dossier1}/${type}/${ID}.${Extension}`;
    const fileExists = await RNFS.exists(filePath);
    if (fileExists) {
      this.props.editFile(ID, filePath)
    } else if (!loadingBusiness.includes(Dossier1)) {
      this.props.downloadBusiness(userId, Dossier1, prep, rea, modeleDocs)
    }
  }
  onUpload = () => {
    const { type, ID, Extension, Dossier1, userId, Dossier3 } = this.props;
    const filePath = `${rootDir}/${userId}/${Dossier1}/${type}/${ID}.${Extension}`;
    const file = pick(this.props, Tables.docField);
    const remoteDir = `./${Dossier1}/Realisation${Dossier3 !== '' ? `/${Dossier3}` : ''}`
    const userName = this.props.firstName + ' ' + this.props.lastName;
    const now = new Date();
    const date = now.getFullYear() + '-' + (now.getMonth() + 1).toLocaleString('fr-FR', { minimumIntegerDigits: 2 }) + '-' + now.getDate().toLocaleString('fr-FR', { minimumIntegerDigits: 2 })
    const fileToUpLoad = {
      ...file,
      UpLoadedOn: date,
      UpdatedOn: date,
      UpdatedBy: userName,
      UpLoadedBy: userName
    }
    this.props.uploadingFile(ID);
    this.props.uploadFile(filePath, fileToUpLoad, remoteDir);
  }

  onCreate = () => {

  }
  onCancel = async () => {
    const { type, ID, Extension, Dossier1, userId, isNew, ServerPath } = this.props;
    const filePath = `${rootDir}/${userId}/${Dossier1}/${type}/${ID}.${Extension}`;
    await RNFS.unlink(filePath);
    
    if (!isNew) {
      this.props.removeFromEdit(ID);
      this.props.downLoadOneFile(ServerPath, `${rootDir}/${userId}/${Dossier1}/${type}`)
    }
  }

  render() {
    const { FileName, type, navigation, ID, Dossier3, Extension, Dossier1, editedDocs, isNew, uploadingDocs, Reviewed, Prepared} = this.props;
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
                {!uploadingDocs.includes(ID) ?
                <Icons
                  name="md-cloud-upload"
                  size={26}
                  color={Colors.secondColor}
                  onPress={() => (isNew ? this.onCreate() : this.onUpload())}
                /> : <ActivityIndicator style={{ paddingLeft: 10, paddingRight: 10 }}/>}
              </EditIcons>
            )}
            <Icons
              name="md-checkbox-outline"
              size={26}
              color={Prepared === 'O' && "green"}
              onPress={this.onPrepare}
            />
            {Reviewed === 'N' && <Icons
              name="md-create"
              size={26}
              onPress={this.onEdit}
            />}
          </IconsWrapper>
        }
      </DocumentWrapper>
    );
  } 
}

Document.propTypes = {
  FileName: PropTypes.string.isRequired,
  ID: PropTypes.string.isRequired,
  firstName: PropTypes.string.isRequired,
  lastName: PropTypes.string.isRequired,
  Dossier3: PropTypes.string.isRequired,
  Extension: PropTypes.string.isRequired,
  Dossier1: PropTypes.string.isRequired,
  ServerPath: PropTypes.string.isRequired,
  type: PropTypes.string,
  navigation: PropTypes.object.isRequired,
  loadingBusiness: PropTypes.array.isRequired,
  downloadBusiness: PropTypes.func.isRequired,
  userId: PropTypes.string.isRequired,
  prep: PropTypes.array.isRequired,
  rea: PropTypes.array.isRequired,
  modeleDocs: PropTypes.array.isRequired,
  editFile: PropTypes.func.isRequired,
  editedDocs: PropTypes.array.isRequired,
  uploadingDocs: PropTypes.array.isRequired,
  uploadingFile: PropTypes.func.isRequired,
  uploadFile: PropTypes.func.isRequired,
  removeFromEdit: PropTypes.func.isRequired,
  downLoadOneFile: PropTypes.func.isRequired,
  isNew: PropTypes.bool,
}

Document.defaultProps = {
  type: Folder.prep,
  isNew: false
}

const mapStateToProps = state => ({
  loadingBusiness: state.user.loadingBusiness,
  editedDocs: state.user.editedDocs,
  uploadingDocs: state.user.uploadingDocs,
  userId: state.user.id,
  lastName: state.user.lastName,
  firstName: state.user.firstName,
  modeleDocs: state.business.docs.filter(d => d.Dossier1 === 'Modele'),
})

export default withNavigation(connect(mapStateToProps, { downloadBusiness, editFile, uploadFile, uploadingFile, removeFromEdit, downLoadOneFile })(Document));
