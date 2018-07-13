import { createUploadEntry, removeUploadedFile } from '../../stores/queries/common';
import { GqlClient as client } from '../../../api/gqlApi';
import { FormValidator, DataFormatter } from '../../../helper';
import { uiStore, userStore } from '../../stores';
import Helper from '../../../helper/utility';

export class Account {
  setFileUploadData = (form, field, files, stepName) => {
    let currentForm = form;
    currentForm.fields[field].fileData = files;
    const fileData = Helper.getFormattedFileData(files);
    currentForm = FormValidator.onChange(
      currentForm,
      { name: field, value: fileData.fileName },
    );
    uiStore.setProgress();
    return new Promise((resolve, reject) => {
      client
        .mutate({
          mutation: createUploadEntry,
          variables: {
            userId: userStore.currentUser.sub,
            stepName,
            fileData,
          },
        })
        .then((result) => {
          const { fileId, preSignedUrl } = result.data.createUploadEntry;
          currentForm.fields[field].fileId = fileId;
          currentForm.fields[field].preSignedUrl = preSignedUrl;
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

  removeUploadedData = (form, field, step) => {
    let currentForm = form;
    const currentStep = { name: step };
    uiStore.setProgress();
    return new Promise((resolve, reject) => {
      client
        .mutate({
          mutation: removeUploadedFile,
          variables: {
            fileId: currentForm.fields[field].fileId,
          },
        })
        .then(() => {
          currentForm = FormValidator.onChange(
            currentForm,
            { name: field, value: '' },
          );
          currentForm.fields[field].fileId = '';
          currentForm.fields[field].preSignedUrl = '';
          this.createAccount(currentStep, 'draft', true, field);
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
}

export default new Account();
