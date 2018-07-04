import { observable, action } from 'mobx';
// import graphql from 'mobx-apollo';
// import { GqlClient as client } from '../../../../../api/gqlApi';
import { uiStore } from '../../../index';
import { MFA_MODE_TYPES } from '../../../../constants/multiFactorAuth';
import { FormValidator as Validator } from '../../../../../helper';

export class MultiFactorAuthStore {
  @observable MFA_MODE_TYPE_META = Validator.prepareFormObject(MFA_MODE_TYPES);
  @observable MFA_DATA = null;

  @action
  handleMfaModeTypeChanged = (e, { value }) => {
    this.MFA_MODE_TYPE_META.fields.mfaModeTypes.value = value;
  }

  @action
  setMfaModeType = () => {
    uiStore.setProgress();
    // return new Promise((resolve, reject) => {
    //   client
    //     .mutate({
    //       mutation: requestOptForBeneficiaries,
    //       variables: {
    //         scopeType: 'BENEFICIARY',
    //         method: 'sms',
    //       },
    //     })
    //     .then((result) => {
    //       this.beneficiaryOtpRequestId = result.data.requestOtp.requestId;
    //       this.beneficiaryDisplayPhoneNumber = result.data.requestOtp.phoneNumber;
    //       resolve();
    //     })
    //     .catch(() => reject())
    //     .finally(() => {
    //       uiStore.setProgress(false);
    //     });
    // });
  }
}

export default new MultiFactorAuthStore();
