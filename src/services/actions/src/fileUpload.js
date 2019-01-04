import { uploadFile, deleteFile } from '../../../helper/aws-s3/S3Client';
import { createUploadEntry, removeUploadedFile } from '../../stores/queries/common';
import { GqlClient as client } from '../../../api/gqlApi';
import { DataFormatter } from '../../../helper';
import { uiStore } from '../../stores';
import apiService from '../../../api/restApi';
import { UPLOADS_CONFIG } from '../../../constants/aws';

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

  uploadToS3 = (fileObj) => {
    const config = {
      bucketName: UPLOADS_CONFIG.bucket,
      dirName: 'offerings',
      region: UPLOADS_CONFIG.region,
      accessKeyId: UPLOADS_CONFIG.accessKey,
      secretAccessKey: UPLOADS_CONFIG.secretKey,
    };
    return new Promise((resolve, reject) => {
      uploadFile(fileObj, config)
        .then(data => resolve(data))
        .catch(err => reject(err));
    });
  }

  deleteFromS3 = (file) => {
    const config = {
      bucketName: UPLOADS_CONFIG.bucket,
      dirName: 'offerings',
      region: UPLOADS_CONFIG.region,
      accessKeyId: UPLOADS_CONFIG.accessKey,
      secretAccessKey: UPLOADS_CONFIG.secretKey,
    };
    return new Promise((resolve, reject) => {
      deleteFile(file, config)
        .then(data => resolve(data))
        .catch(err => reject(err));
    });
  }
}

export default new FileUpload();
