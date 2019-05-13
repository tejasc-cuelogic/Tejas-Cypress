
import { observable, action, toJS } from 'mobx';
import { get } from 'lodash';
import { updateOfferingRepaymentsMeta } from '../../queries/data';
import { GqlClient as client } from '../../../../api/gqlApi';
import Helper from '../../../../helper/utility';
import { FormValidator as Validator } from '../../../../helper';
import { OFFERING_REPAYMENT_META } from '../../../constants/admin/data';

export class DataStore {
  @observable OFFERING_REPAYMENT_META_FRM = Validator.prepareFormObject(OFFERING_REPAYMENT_META);
  @observable inProgress = {
    offeringRepayment: false,
  };
  @observable outputMsg = null;

  @action
  setFieldValue = (field, value, field2 = false) => {
    if (field2) {
      this[field][field2] = value;
    } else {
      this[field] = value;
    }
  }

  @action
  resetForm = (form) => {
    this[form] = Validator.resetFormData(this[form]);
  }

  @action
  resetOfferingAudit = () => {
    this.OFFERING_REPAYMENT_META_FRM = Validator.prepareFormObject(OFFERING_REPAYMENT_META);
    this.outputMsg = null;
  }

  @action
  formChange = (e, res, form) => {
    this[form] =
    Validator.onChange(this[form], Validator.pullValues(e, res));
  };

  @action
  updateOfferingRepaymentsMeta = () => {
    const offeringData = Validator.evaluateFormData(this.OFFERING_REPAYMENT_META_FRM.fields);
    this.setFieldValue('inProgress', true, 'offeringRepayment');
    this.setFieldValue('outputMsg', null);
    return new Promise((res, rej) => {
      client
        .mutate({
          mutation: updateOfferingRepaymentsMeta,
          variables: {
            audit: toJS(offeringData.audit).length,
            offeringId: offeringData.offeringId,
          },
        })
        .then(action((result) => {
          this.setFieldValue('inProgress', false, 'offeringRepayment');
          Helper.toast('Your request is processed.', 'success');
          this.resetForm('OFFERING_REPAYMENT_META_FRM');
          this.setFieldValue('outputMsg', { type: 'success', data: get(result, 'data.updateOfferingRepaymentsMeta') });
          res(result);
        }))
        .catch((error) => {
          this.setFieldValue('outputMsg', { type: 'error', data: get(error, 'message') });
          this.setFieldValue('inProgress', false, 'offeringRepayment');
          Helper.toast('Something went wrong, please try again later.', 'error');
          rej(error);
        });
    });
  }
}

export default new DataStore();
