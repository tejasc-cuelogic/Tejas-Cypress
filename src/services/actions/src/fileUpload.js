import moment from 'moment';
import { createUploadEntry, removeUploadedFile } from '../../stores/queries/common';
import { GqlClient as client } from '../../../api/gqlApi';
import { DataFormatter } from '../../../helper';
import { uiStore, commonStore } from '../../stores';
import apiService from '../../../api/restApi';

export class FileUpload {
  setFileUploadData = (applicationId, fileData, stepName, userRole, applicationIssuerId = '', offeringId = '', tags) =>
    new Promise((resolve, reject) => {
      client
        .mutate({
          mutation: createUploadEntry,
          variables: {
            applicationId,
            applicationIssuerId,
            stepName,
            userRole,
            fileData,
            offeringId,
            tags,
          },
        })
        .then((result) => {
          resolve(result);
          uiStore.setProgress(false);
        })
        .catch((err) => {
          uiStore.setErrors(DataFormatter.getSimpleErr(err));
          reject(err);
          uiStore.setProgress(false);
        });
    })

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
    apiService.uploadOnS3(fileObj.preSignedUrl, fileObj.fileData, fileObj.fileType).then(() => {
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

  uploadToS3 = (fileObj, dir) => new Promise((resolve, reject) => {
    const key = `${dir}/${moment().unix()}_${fileObj.name}`;
    commonStore.getCdnSignedUrl(key).then((res) => {
      apiService.uploadOnS3(res.data.createCdnSignedUrl, fileObj.obj, fileObj.type).then(() => resolve(`${key}`))
        .catch(err => reject(err));
    }).catch(err => reject(err));
  });
}

export default new FileUpload();
