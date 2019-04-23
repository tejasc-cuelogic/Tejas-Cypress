import { observable, action } from 'mobx';
import { get } from 'lodash';
import * as elasticSearchQueries from '../../queries/elasticSearch';
import { generateInvestorFolderStructure, storageDetailsForInvestor } from '../../queries/data';
import { GqlClient as client } from '../../../../api/gqlApi';
import Helper from '../../../../helper/utility';
import { FormValidator as Validator } from '../../../../helper';
import { STORAGE_DETAILS_SYNC, BULK_STORAGE_DETAILS_SYNC } from '../../../constants/admin/data';
import uiStore from '../../../stores/entities/shared/uiStore';

export class ElasticSearchStore {
  @observable STORAGE_DETAILS_SYNC_FRM = Validator.prepareFormObject(STORAGE_DETAILS_SYNC);
  @observable BULK_STORAGE_DETAILS_SYNC_FRM =
  Validator.prepareFormObject(BULK_STORAGE_DETAILS_SYNC);
  @observable inProgress = {};
  @observable boxMsg = '';
  @observable countValues = [];

  @action
  setFieldValue = (field, value) => {
    this[field] = value;
  }

  @action
  resetForm = () => {
    this.STORAGE_DETAILS_SYNC_FRM = Validator.prepareFormObject(STORAGE_DETAILS_SYNC);
  }

  @action
  submitStorageDetails = () => {
    uiStore.setProgress();
    this.setFieldValue('boxMsg', '');
    const userId = get(this.STORAGE_DETAILS_SYNC_FRM, 'fields.userId.value') || null;
    return new Promise((res, rej) => {
      client
        .mutate({
          mutation: generateInvestorFolderStructure,
          variables: { userId },
        })
        .then((result) => {
          if (result.data.generateInvestorFolderStructure.includes('True')) {
            Helper.toast('Box folder details not found, creation has been initiated, please check after some time.', 'success');
            document.getElementsByName('userId')[0].value = '';
          } else {
            this.setFieldValue('boxMsg', result.data.generateInvestorFolderStructure);
          }
          this.resetForm();
          uiStore.setProgress(false);
          res(result);
        })
        .catch((error) => {
          Helper.toast('Something went wrong, please try again later.', 'error');
          uiStore.setProgress(false);
          rej(error);
        });
    });
  }

  @action
  storageDetailsChange = (e, res) => {
    this.STORAGE_DETAILS_SYNC_FRM =
    Validator.onChange(this.STORAGE_DETAILS_SYNC_FRM, Validator.pullValues(e, res));
    this.setFieldValue('boxMsg', '');
  };

  @action
  bulkStorageDetailsChange = (values, field, formName, fieldType) => {
    if (fieldType === 'mask') {
      this[formName] = Validator.onChange(
        this[formName],
        { name: field, value: values.floatValue },
      );
    } else {
      this[formName] =
      Validator.onChange(this[formName], Validator.pullValues(field, values));
    }
  };

  @action
  submitStorageDetailsinBulk = () => {
    uiStore.setProgress();
    this.setFieldValue('countValues', '');
    const limit = get(this.BULK_STORAGE_DETAILS_SYNC_FRM, 'fields.limit.value') || null;
    return new Promise((res, rej) => {
      client
        .mutate({
          mutation: storageDetailsForInvestor,
          variables: { limit },
        })
        .then((result) => {
          if (result.data.storageDetailsForInvestor) {
            Helper.toast('Box folder Creation has been initiated, please check after some time.', 'success');
            document.getElementsByName('limit')[0].value = '';
            this.setFieldValue('countValues', get(result.data, 'storageDetailsForInvestor'));
          }
          this.resetForm();
          uiStore.setProgress(false);
          res(result);
        })
        .catch((error) => {
          Helper.toast('Something went wrong, please try again later.', 'error');
          uiStore.setProgress(false);
          rej(error);
        });
    });
  }

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
