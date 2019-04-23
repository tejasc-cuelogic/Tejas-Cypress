import { toJS, observable, computed, action } from 'mobx';
import graphql from 'mobx-apollo';
import { forEach, floor, ceil } from 'lodash';
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
  @observable isShareModalDataSet = false;
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
  setShareModalData(value) {
    this.isShareModalDataSet = value;
  }

  @action
  resetFormData(form) {
    this[form] = Validator.resetFormData(this[form]);
  }

  @action
  updateBeneficiaryRules() {
    if (this.BENEFICIARY_META.fields.beneficiary.length) {
      forEach(this.BENEFICIARY_META.fields.beneficiary, (beneficiary, key) => {
        this.BENEFICIARY_META.fields.beneficiary[key].share.rule = !this.isShareModalDataSet ?
          'required|sharePercentage:share' : 'optional';
      });
      this.BENEFICIARY_META = Validator
        .onArrayFieldChange(this.BENEFICIARY_META, { name: 'firstName', value: this.BENEFICIARY_META.fields.beneficiary[0].firstName.value }, 'beneficiary', 0);
    }
  }

  @action
  calculateSharePercentage() {
    let url = '';
    if (this.BENEFICIARY_META.fields.beneficiary.length > 1) {
      const val = (100 / this.BENEFICIARY_META.fields.beneficiary.length);
      forEach(this.BENEFICIARY_META.fields.beneficiary, (beneficiary, key) => {
        this.BENEFICIARY_META = Validator
          .onArrayFieldChange(this.BENEFICIARY_META, { name: 'share', value: key === 0 ? ceil(val) : floor(val) }, 'beneficiary', key);
      });
      url = 'confirm';
    } else {
      this.BENEFICIARY_META = Validator
        .onArrayFieldChange(this.BENEFICIARY_META, { name: 'share', value: 100 }, 'beneficiary', 0);
      url = 'preview';
    }
    return url;
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
      fields: {
        ...this.BENEFICIARY_META.fields,
        beneficiary: [
          ...this.BENEFICIARY_META.fields.beneficiary,
          BENEFICIARY_FRM.beneficiary[0],
        ],
      },
      meta: {
        ...this.BENEFICIARY_META.meta,
        isValid: false,
      },
    };
  }

  @action
  removeBeneficiary() {
    this.BENEFICIARY_META.fields.beneficiary.splice(this.removeBeneficiaryIndex, 1);
    const shareVal = this.BENEFICIARY_META.fields.beneficiary[0].share.value;
    this.BENEFICIARY_META = Validator
      .onArrayFieldChange(this.BENEFICIARY_META, { name: 'share', value: shareVal }, 'beneficiary', 0);
    this.beneficiaryModal = !this.beneficiaryModal;
    this.removeBeneficiaryIndex = null;
  }

  @action
  getBeneficiaries = () => {
    this.beneficiariesData = [];
    this.beneficiariesData = graphql({
      client,
      query: getBeneficiaries,
      fetchPolicy: 'network-only',
    });
  }

  @action beneficiaryReset = () => {
    this.BENEFICIARY_META = Validator.prepareFormObject(BENEFICIARY_FRM);
  }

  @computed get beneficiaries() {
    return (this.beneficiariesData.data
      && this.beneficiariesData.data.beneficiaries
      && toJS(this.beneficiariesData.data.beneficiaries)
    ) || [];
  }

  @computed get getBeneficiariesData() {
    return this.BENEFICIARY_META.fields.beneficiary.length ?
      toJS(this.BENEFICIARY_META.fields.beneficiary).map(beneficiaries => ({
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
      forEach(beneficiaryList.beneficiary.recipients, (beneficiary, key) => {
        this.BENEFICIARY_META = Validator
          .onArrayFieldChange(this.BENEFICIARY_META, { name: 'firstName', value: beneficiary.firstName }, 'beneficiary', key);
        this.BENEFICIARY_META = Validator
          .onArrayFieldChange(this.BENEFICIARY_META, { name: 'lastName', value: beneficiary.lastName }, 'beneficiary', key);
        this.BENEFICIARY_META = Validator
          .onArrayFieldChange(this.BENEFICIARY_META, { name: 'city', value: beneficiary.address.city }, 'beneficiary', key);
        this.BENEFICIARY_META = Validator
          .onArrayFieldChange(this.BENEFICIARY_META, { name: 'state', value: beneficiary.address.state }, 'beneficiary', key);
        this.BENEFICIARY_META = Validator
          .onArrayFieldChange(this.BENEFICIARY_META, { name: 'residentalStreet', value: beneficiary.address.street }, 'beneficiary', key);
        this.BENEFICIARY_META = Validator
          .onArrayFieldChange(this.BENEFICIARY_META, { name: 'zipCode', value: beneficiary.address.zipCode }, 'beneficiary', key);
        this.BENEFICIARY_META = Validator
          .onArrayFieldChange(this.BENEFICIARY_META, { name: 'dob', value: beneficiary.dob && moment(new Date(beneficiary.dob)) ? moment(new Date(beneficiary.dob)) : '' }, 'beneficiary', key);
        this.BENEFICIARY_META = Validator
          .onArrayFieldChange(this.BENEFICIARY_META, { name: 'relationship', value: beneficiary.relationship }, 'beneficiary', key);
        this.BENEFICIARY_META = Validator
          .onArrayFieldChange(this.BENEFICIARY_META, { name: 'share', value: beneficiary.shares }, 'beneficiary', key);
        if (key < beneficiaryList.beneficiary.recipients.length - 1) {
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
  verifyVerificationCodeChange = (value) => {
    this.OTP_VERIFY_META = Validator.onChange(
      this.OTP_VERIFY_META,
      { name: 'code', value },
    );
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
        .catch((error) => {
          console.log(toJS(error.message));
          uiStore.setErrors(error.message);
          reject(error);
        })
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
      .onArrayFieldChange(this.BENEFICIARY_META, Validator.pullValues(e, result), 'beneficiary', index);
  };

  @action
  beneficiaryShareChange = (values, index) => {
    this.BENEFICIARY_META = Validator
      .onArrayFieldChange(this.BENEFICIARY_META, { name: 'share', value: values.floatValue }, 'beneficiary', index);
  };

  @action
  beneficiaryDateChange = (date, index) => {
    this.BENEFICIARY_META = Validator
      .onArrayFieldChange(this.BENEFICIARY_META, { name: 'dob', value: date }, 'beneficiary', index);
  };

  @action
  setAddressFields = (place, index) => {
    const data = Helper.gAddressClean(place);
    this.BENEFICIARY_META = Validator
      .onArrayFieldChange(this.BENEFICIARY_META, { name: 'residentalStreet', value: data.residentalStreet ? data.residentalStreet : '' }, 'beneficiary', index);
    this.BENEFICIARY_META = Validator
      .onArrayFieldChange(this.BENEFICIARY_META, { name: 'city', value: data.city ? data.city : '' }, 'beneficiary', index);
    this.BENEFICIARY_META = Validator
      .onArrayFieldChange(this.BENEFICIARY_META, { name: 'state', value: data.state ? data.state : '' }, 'beneficiary', index);
    this.BENEFICIARY_META = Validator
      .onArrayFieldChange(this.BENEFICIARY_META, { name: 'zipCode', value: data.zipCode ? data.zipCode : '' }, 'beneficiary', index);
  }
}

export default new BeneficiaryStore();
