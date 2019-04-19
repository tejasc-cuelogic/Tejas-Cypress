import { observable, action } from 'mobx';
import { get } from 'lodash';
import * as elasticSearchQueries from '../../queries/elasticSearch';
import { generateInvestorFolderStructure } from '../../queries/data';
import { GqlClient as client } from '../../../../api/gqlApi';
import Helper from '../../../../helper/utility';
import { FormValidator as Validator } from '../../../../helper';
import { STORAGE_DETAILS_SYNC } from '../../../constants/admin/data';

export class ElasticSearchStore {
  @observable STORAGE_DETAILS_SYNC_FRM = Validator.prepareFormObject(STORAGE_DETAILS_SYNC);
  @observable inProgress = {};
  @observable boxMsg = '';

  @action
  setFieldValue = (field, value) => {
    this[field] = value;
  }

  @action
  resetForm = () => {
    Validator.resetFormData(this.STORAGE_DETAILS_SYNC_FRM);
  }

  @action
  submitStorageDetails = () => {
    this.setFieldValue('boxMsg', '');
    const userId = get(this.STORAGE_DETAILS_SYNC_FRM, 'fields.userId.value') || null;
    return new Promise((res, rej) => {
      client
        .mutate({
          mutation: generateInvestorFolderStructure,
          variables: { userId },
        })
        .then((result) => {
          this.setFieldValue('boxMsg', result.data.generateInvestorFolderStructure);
          Helper.toast('Your request is processed successfully.', 'success');
          this.resetForm();
          res(result);
        })
        .catch((error) => {
          this.setFieldValue('boxMsg', '');
          Helper.toast('Something went wrong, please try again later.', 'error');
          rej(error);
        });
    });
  }

  @action
  storageDetailsChange = (e, res) => {
    this.STORAGE_DETAILS_SYNC_FRM =
    Validator.onChange(this.STORAGE_DETAILS_SYNC_FRM, Validator.pullValues(e, res));
  };

  @action
  elasticSearchHandler = (mutation) => {
    this.setFieldValue('inProgress', mutation);
    return new Promise((resolve, reject) => {
      client
        .mutate({
          mutation: elasticSearchQueries[mutation],
        })
        .then((result) => {
          Helper.toast('Your request is processed successfully.', 'success');
          resolve(result);
          this.setFieldValue('inProgress', false);
        })
        .catch((error) => {
          Helper.toast('Something went wrong, please try again later.', 'error');
          reject(error);
          this.setFieldValue('inProgress', false);
        });
    });
  }
}

export default new ElasticSearchStore();
