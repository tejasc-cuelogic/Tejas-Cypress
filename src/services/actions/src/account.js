import { createUploadEntry, removeUploadedFile } from '../../stores/queries/common';
import { GqlClient as client } from '../../../api/gqlApi';
import { DataFormatter } from '../../../helper';
import { uiStore } from '../../stores';
import Helper from '../../../helper/utility';

export class Account {
  setFileUploadData = (form, field, files, stepName, userRole) => {
    const currentForm = form;
    currentForm.fields[field].fileData = files;
    const fileData = Helper.getFormattedFileData(files);
    uiStore.setProgress();
    return new Promise((resolve, reject) => {
      client
        .mutate({
          mutation: createUploadEntry,
          variables: {
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

  removeUploadedData = (form, field) => {
    uiStore.setProgress();
    return new Promise((resolve, reject) => {
      client
        .mutate({
          mutation: removeUploadedFile,
          variables: {
            fileId: form.fields[field].fileId,
          },
        })
        .then(() => {
          resolve();
        })
        .catch((err) => {
          uiStore.setErrors(DataFormatter.getSimpleErr(err));
          reject();
        })
        .finally(() => {
          uiStore.setProgress(false);
        });
    });
  }
}

export default new Account();
