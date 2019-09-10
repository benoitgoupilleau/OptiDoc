import { PermissionsAndroid, Alert } from 'react-native';
import Sentry from '../services/sentry';

export const checkAccessCamera = async () => {
  const isAuthorised = await PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.CAMERA
  );
  if (isAuthorised) {
    return true;
  } else {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: "Optidoc demande l'acccès à vos photos",
          message:
            "Optidoc a besoin d'accéder à vos photos " +
            'pour que vous puissiez les ajouter',
          buttonPositive: 'Autoriser'
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        return true;
      } else {
        Alert.alert(
          "L'application doit pouvoir accéder aux photos",
          "Impossible d'ajouter une photo sans accès à vos photos",
          [{ text: 'Ok', onPress: () => checkAccessCamera() }]
        );
      }
    } catch (err) {
      Sentry.captureMessage(err, {
        func: 'checkAccessCAMERA',
        doc: 'AddPictureScreen.js'
      });
    }
  }
};

export const checkAccessStorage = async () => {
  const isAuthorised = await PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
  );
  if (isAuthorised) {
    return true;
  } else {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: "Optidoc demande l'acccès aux documents",
          message:
            "Optidoc a besoin d'accéder à vos documents " +
            'pour que vous puissiez les modifier',
          buttonPositive: 'Autoriser'
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        return true;
      } else {
        Alert.alert(
          "L'application doit pouvoir accéder aux documents",
          "L'application est inutilisable sans accès aux documents. Merci de valider l'accès",
          [{ text: 'Ok', onPress: () => checkAccessStorage() }]
        );
      }
    } catch (err) {
      Sentry.captureMessage(err, {
        func: 'checkAccessWRITE_EXTERNAL_STORAGE',
        doc: 'AuthLoadingScreen.js'
      });
    }
  }
};
