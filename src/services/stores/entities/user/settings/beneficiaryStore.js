import { toJS, observable, computed, action } from 'mobx';
import graphql from 'mobx-apollo';
import { forEach } from 'lodash';
import moment from 'moment';
import { GqlClient as client } from '../../../../../api/gqlApi';
import { uiStore } from '../../../index';
import { BENEFICIARY_FRM, VERIFY_OTP } from '../../../../constants/beneficiaries';
import { createBeneficiaryMutation, getBeneficiaries, requestOptForBeneficiaries } from '../../../queries/beneficiaries';
import Helper from '../../../../../helper/utility';
import { FormValidator as Validator } from '../../../../../helper';

export class BeneficiaryStore {
  @observable beneficiariesData = [];
  @observable BENEFICIARY_META = Validator.prepareFormObject(BENEFICIARY_FRM);
  @observable OTP_VERIFY_META = Validator.prepareFormObject(VERIFY_OTP);
  @observable removeBeneficiaryIndex = null;
  @observable beneficiaryModal = false;
  @observable beneficiaryOtpRequestId = null;
  @observable currentSelectedAccountId = null;
  @observable beneficiaryDisplayPhoneNumber = null;
  @observable reSendVerificationCode = null;

  @action
  toggleBeneficiaryConfirmModal(index) {
    this.beneficiaryModal = !this.beneficiaryModal;
    this.removeBeneficiaryIndex = this.beneficiaryModal ? index : null;
  }

  @action
  setReSendVerificationCode(value) {
    this.reSendVerificationCode = value;
  }

  @action
  resetFormData(form) {
    this[form] = Validator.resetFormData(this[form]);
  }

  @computed get bErr() {
    return (this.beneficiariesData.error && this.beneficiariesData.error.message) || null;
  }

  @computed get bLoading() {
    return this.beneficiariesData.loading;
  }

  @action
  addMoreBeneficiary() {
    this.BENEFICIARY_META = {
      ...this.BENEFICIARY_META,
      fields: [
        ...this.BENEFICIARY_META.fields,
        BENEFICIARY_FRM,
      ],
      meta: {
        ...this.BENEFICIARY_META.meta,
        isValid: false,
        isShareValid: false,
      },
    };
  }

  @action
  removeBeneficiary(index) {
    this.BENEFICIARY_META.fields.splice(index, 1);
    this.beneficiaryModal = !this.beneficiaryModal;
    this.removeBeneficiaryIndex = null;
  }

  @action
  getBeneficiaries = () => {
    this.beneficiariesData = graphql({
      client,
      query: getBeneficiaries,
    });
  }

  @action beneficiaryReset = () => {
    this.BENEFICIARY_META = { fields: [{ ...BENEFICIARY_FRM }], meta: { isValid: false, error: '' } };
  }

  @computed get beneficiaries() {
    return (this.beneficiariesData.data
      && this.beneficiariesData.data.beneficiaries
      && toJS(this.beneficiariesData.data.beneficiaries)
    ) || [];
  }

  @computed get getBeneficiariesData() {
    return this.BENEFICIARY_META.fields.length ?
      toJS(this.BENEFICIARY_META.fields).map(beneficiaries => ({
        firstName: beneficiaries.firstName.value,
        lastName: beneficiaries.lastName.value,
        dob: moment(beneficiaries.dob.value).format('MM-DD-YYYY'),
        relationship: beneficiaries.relationship.value,
        shares: beneficiaries.share.value,
        address: {
          street: beneficiaries.residentalStreet.value,
          city: beneficiaries.city.value,
          state: beneficiaries.state.value,
          zipCode: beneficiaries.zipCode.value,
        },
      })) : [];
  }

  @action
  setBeneficiariesInfo = () => {
    const beneficiaryList = this.beneficiaries.filter(acc =>
      acc.accountId === this.currentSelectedAccountId)[0];
    if (beneficiaryList.beneficiary) {
      let index = 0;
      forEach(beneficiaryList.beneficiary.recipients, (beneficiary) => {
        this.BENEFICIARY_META = Validator
          .onArrayFieldChange(this.BENEFICIARY_META, { name: 'firstName', value: beneficiary.firstName }, index);
        this.BENEFICIARY_META = Validator
          .onArrayFieldChange(this.BENEFICIARY_META, { name: 'lastName', value: beneficiary.lastName }, index);
        this.BENEFICIARY_META = Validator
          .onArrayFieldChange(this.BENEFICIARY_META, { name: 'city', value: beneficiary.address.city }, index);
        this.BENEFICIARY_META = Validator
          .onArrayFieldChange(this.BENEFICIARY_META, { name: 'state', value: beneficiary.address.state }, index);
        this.BENEFICIARY_META = Validator
          .onArrayFieldChange(this.BENEFICIARY_META, { name: 'residentalStreet', value: beneficiary.address.street }, index);
        this.BENEFICIARY_META = Validator
          .onArrayFieldChange(this.BENEFICIARY_META, { name: 'zipCode', value: beneficiary.address.zipCode }, index);
        this.BENEFICIARY_META = Validator
          .onArrayFieldChange(this.BENEFICIARY_META, { name: 'dob', value: moment(beneficiary.dob) }, index);
        this.BENEFICIARY_META = Validator
          .onArrayFieldChange(this.BENEFICIARY_META, { name: 'relationship', value: beneficiary.relationship }, index);
        this.BENEFICIARY_META = Validator
          .onArrayFieldChange(this.BENEFICIARY_META, { name: 'share', value: beneficiary.shares }, index);
        index += 1;
        if (index !== beneficiaryList.beneficiary.recipients.length) {
          this.addMoreBeneficiary();
        }
      });
    }
  }

  @action
  setCurrentSelectedAccountId = (accountId) => {
    this.currentSelectedAccountId = accountId;
  };

  @action
  verifyVerificationCodeChange = (e, { name, value }) => {
    this.OTP_VERIFY_META = Validator.onChange(this.OTP_VERIFY_META, { name, value });
  };

  @action
  requestOtpForManageBeneficiary = () => {
    uiStore.setProgress();
    return new Promise((resolve, reject) => {
      client
        .mutate({
          mutation: requestOptForBeneficiaries,
          variables: {
            scopeType: 'BENEFICIARY',
            method: 'sms',
          },
        })
        .then((result) => {
          this.beneficiaryOtpRequestId = result.data.requestOtp.requestId;
          this.beneficiaryDisplayPhoneNumber = result.data.requestOtp.phoneNumber;
          resolve();
        })
        .catch(() => reject())
        .finally(() => {
          uiStore.setProgress(false);
        });
    });
  }

  @action
  createBeneficiary = () => {
    uiStore.setProgress();
    return new Promise((resolve, reject) => {
      client
        .mutate({
          mutation: createBeneficiaryMutation,
          variables: {
            requestId: this.beneficiaryOtpRequestId,
            accountId: this.currentSelectedAccountId,
            verificationCode: this.OTP_VERIFY_META.fields.code.value,
            beneficiaries: this.getBeneficiariesData,
          },
          refetchQueries: [{ query: getBeneficiaries }],
        })
        .then(() => {
          uiStore.setErrors(null);
          this.beneficiaryReset();
          resolve();
        })
        .catch((error) => {
          uiStore.setErrors(error.message);
          reject(error);
        })
        .finally(() => {
          uiStore.setProgress(false);
        });
    });
  }

  @action
  beneficiaryEleChange = (e, result, index) => {
    this.BENEFICIARY_META = Validator
      .onArrayFieldChange(this.BENEFICIARY_META, Validator.pullValues(e, result), index);
  };

  @action
  beneficiaryDateChange = (date, index) => {
    this.BENEFICIARY_META = Validator
      .onArrayFieldChange(this.BENEFICIARY_META, { name: 'dob', value: date }, index);
  };

  @action
  setAddressFields = (place, index) => {
    const data = Helper.gAddressClean(place);
    this.BENEFICIARY_META = Validator
      .onArrayFieldChange(this.BENEFICIARY_META, { name: 'residentalStreet', value: data.residentalStreet }, index);
    this.BENEFICIARY_META = Validator
      .onArrayFieldChange(this.BENEFICIARY_META, { name: 'city', value: data.city }, index);
    this.BENEFICIARY_META = Validator
      .onArrayFieldChange(this.BENEFICIARY_META, { name: 'state', value: data.state }, index);
    this.BENEFICIARY_META = Validator
      .onArrayFieldChange(this.BENEFICIARY_META, { name: 'zipCode', value: data.zipCode }, index);
  }
}

export default new BeneficiaryStore();
