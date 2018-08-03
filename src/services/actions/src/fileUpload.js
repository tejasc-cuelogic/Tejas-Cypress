import { createUploadEntry, removeUploadedFile } from '../../stores/queries/common';
import { GqlClient as client } from '../../../api/gqlApi';
import { DataFormatter } from '../../../helper';
import { uiStore } from '../../stores';
import apiService from '../../../api/restApi';

export class FileUpload {
  setFileUploadData = (applicationId, fileData, stepName, userRole) => {
    uiStore.setProgress();
    return new Promise((resolve, reject) => {
      client
        .mutate({
          mutation: createUploadEntry,
          variables: {
            applicationId,
            stepName,
            userRole,
            fileData,
          },
        })
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          uiStore.setErrors(DataFormatter.getSimpleErr(err));
          reject(err);
        })
        .finally(() => {
          uiStore.setProgress(false);
        });
    });
  }

  removeUploadedData = (removeFileId) => {
    uiStore.setProgress();
    return new Promise((resolve, reject) => {
      client
        .mutate({
          mutation: removeUploadedFile,
          variables: {
            fileId: removeFileId,
          },
        })
        .then(() => {
          resolve();
        })
        .catch((err) => {
          uiStore.setErrors(DataFormatter.getSimpleErr(err));
          reject(err);
        })
        .finally(() => {
          uiStore.setProgress(false);
        });
    });
  }

  putUploadedFileOnS3 = fileObj => new Promise((resolve, reject) => {
    apiService.uploadOnS3(fileObj.preSignedUrl, fileObj.fileData).then(() => {
      resolve();
    })
      .catch((err) => {
        reject(err);
      });
  });

  resetFileObj = (obj) => {
    const field = obj;
    field.value = [];
    field.fileId = [];
    field.rule = 'required';
  }
}

export default new FileUpload();
