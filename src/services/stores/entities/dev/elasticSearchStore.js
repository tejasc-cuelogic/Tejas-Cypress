import { observable, action, computed, toJS } from 'mobx';
import { get } from 'lodash';
import graphql from 'mobx-apollo';
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
  @observable bulkSyncLoader = false;
  @observable boxMsg = '';
  @observable countValues = [];
  @observable esAudit = null;
  @observable esAuditOutput = null;
  @observable swapIndex = null;
  @observable mutations = {
    USERS: ['userDeleteIndices', 'userPopulateIndex'],
    CrowdPay: ['crowdPayDeleteIndices', 'crowdPayPopulateIndex'],
    Accreditation: ['accreditationDeleteIndices', 'accreditationPopulateIndex'],
    LinkedBank: ['linkedBankDeleteIndices', 'linkedBankPopulateIndex'],
    Offerings: ['offeringsDeleteIndices', 'offeringsPopulateIndex'],
  }

  @action
  setFieldValue = (field, value) => {
    this[field] = value;
  }

  @action
  resetForm = (form) => {
    this[form] = Validator.resetFormData(this[form]);
  }

  @action
  elasticSearchHandler = (alias, module) => {
    this.setFieldValue('inProgress', `${alias}_${module}`);
    if (module === 'SWAP') {
      this.swapIndexAliases(alias);
    } else if (module === 'POPULATE' || module === 'DELETE') {
      const mutation = this.mutations[alias];
      this.esMutations(module === 'POPULATE' ? mutation[1] : mutation[0]);
    }
  }

  @action
  esMutations = mutation => new Promise((resolve, reject) => {
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

  @action
  getESAudit = () => {
    this.esAudit = graphql({
      client,
      query: elasticSearchQueries.getESAudit,
      variables: {},
      fetchPolicy: 'network-only',
      onError: () => {
        this.setFieldValue('inProgress', false);
        Helper.toast('Something went wrong, please try again later.', 'error');
      },
    });
  }

  @action
  swapIndexAliases = () => {
    this.swapIndex = graphql({
      client,
      query: elasticSearchQueries.swapIndexAliases,
      variables: {},
      fetchPolicy: 'network-only',
      onError: () => {
        this.setFieldValue('inProgress', false);
        Helper.toast('Something went wrong, please try again later.', 'error');
      },
    });
  }

  @action
  getESAuditPara = (indexAliasName, random = 'RANDOM') => {
    const variables = {
      indexAliasName,
      random,
    };
    this.esAuditOutput = graphql({
      client,
      query: elasticSearchQueries.getESAudit,
      variables,
      fetchPolicy: 'network-only',
      onError: () => {
        Helper.toast('Something went wrong, please try again later.', 'error');
      },
    });
  }

  @computed get eSAudit() {
    return get(this.esAudit, 'data.getESAudit.indices[0]') ?
      toJS(get(this.esAudit, 'data.getESAudit.indices')) : [];
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
        .then(action((result) => {
          if (result.data.generateInvestorFolderStructure.includes('True')) {
            Helper.toast('Box folder details not found, creation has been initiated, please check after some time.', 'success');
            this.resetForm('STORAGE_DETAILS_SYNC_FRM');
            document.getElementsByName('userId')[0].value = '';
          } else {
            const tempobj = { ...this.STORAGE_DETAILS_SYNC_FRM };
            tempobj.fields.userId.value = '';
            tempobj.fields.userId.error = result.data.generateInvestorFolderStructure;
            this.setFieldValue('STORAGE_DETAILS_SYNC_FRM', tempobj);
          }
          uiStore.setProgress(false);
          res(result);
        }))
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
    uiStore.clearErrors();
    if (fieldType === 'mask') {
      if (values.floatValue < 500) {
        this[formName] = Validator.onChange(
          this[formName],
          { name: field, value: values.floatValue },
        );
        this.setFieldValue('countValues', '');
      } else {
        const tempobj = { ...this.BULK_STORAGE_DETAILS_SYNC_FRM };
        tempobj.fields.limit.value = '';
        tempobj.fields.limit.error = 'The number of users should be within 0 - 500.';
        this.setFieldValue('BULK_STORAGE_DETAILS_SYNC_FRM', tempobj);
      }
    } else {
      this[formName] =
        Validator.onChange(this[formName], Validator.pullValues(field, values));
    }
  };

  @action
  submitStorageDetailsinBulk = () => {
    this.bulkSyncLoader = true;
    this.setFieldValue('countValues', '');
    uiStore.clearErrors();
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
            this.setFieldValue('countValues', get(result, 'data'));
          }
          this.resetForm('BULK_STORAGE_DETAILS_SYNC_FRM');
          this.setFieldValue('bulkSyncLoader', false);
          res(result);
        })
        .catch((error) => {
          Helper.toast('Something went wrong, please try again later.', 'error');
          this.setFieldValue('bulkSyncLoader', false);
          rej(error);
        });
    });
  }
}

export default new ElasticSearchStore();
