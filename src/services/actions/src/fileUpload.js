import * as moment from 'moment';
import { get } from 'lodash';
import { createUploadEntry, removeUploadedFile, adminAccreditedStatusUploadEntry } from '../../stores/queries/common';
import { GqlClient as client } from '../../../api/gqlApi';
import { DataFormatter } from '../../../helper';
import Helper from '../../../helper/utility';
import { uiStore, commonStore } from '../../stores';
import apiService from '../../../api/restApi';
import { S3_BUCKET_URL } from '../../../constants/common';

export class FileUpload {
  setFileUploadData = (applicationId, fileData, stepName, userRole, applicationIssuerId = '', offeringId = '', tags = '', params) => new Promise((resolve, reject) => {
    const investorId = get(params, 'investorId');
    if (fileData.fileSize) {
      // eslint-disable-next-line no-param-reassign
      fileData.fileSize = fileData.fileSize.toString();
    }

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
          investorId,
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

  uploadToS3 = (fileObj, dir, fullUrl = false) => new Promise((resolve, reject) => {
    const key = `${dir}/${moment().unix()}_${Helper.sanitize(fileObj.name)}`;
    const dataToUpload = Helper.isBase64(fileObj.obj) ? Helper.b64toBlob(fileObj.obj)
      : fileObj.obj;
    commonStore.getCdnSignedUrl(key).then((res) => {
      apiService.uploadOnS3(res.data.createCdnSignedUrl, dataToUpload, fileObj.type).then(() => resolve(fullUrl ? `${S3_BUCKET_URL}/${key}` : `${key}`))
        .catch(err => reject(err));
    }).catch(err => reject(err));
  });

  setAccreditationFileUploadData = (userRole, fileData, accountType, action, userId) => new Promise((resolve, reject) => {
    if (fileData.fileSize) {
      // eslint-disable-next-line no-param-reassign
      fileData.fileSize = fileData.fileSize.toString();
    }
    client
      .mutate({
        mutation: adminAccreditedStatusUploadEntry,
        variables: {
          userRole,
          fileData,
          accountType,
          action,
          userId,
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
}

export default new FileUpload();
