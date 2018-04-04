import { observable, action, computed } from 'mobx';
import _ from 'lodash';
import api from '../ns-api';
import uiStore from './uiStore';

import {
  PROFILE_DETAILS,
  IDENTITY_QUESTIONS_FORM_VALUES,
} from '../constants/profile';

export class ProfileStore {
  @observable profile = undefined;

  @observable profileDetails = { ...PROFILE_DETAILS }

  @observable confirmIdentityQuestions = { ...IDENTITY_QUESTIONS_FORM_VALUES }

  @observable confirmPhoneNumberVerificationCode = {
    value: '',
    key: 'verificationCode',
    error: undefined,
    rule: 'required',
    label: 'Enter verification code here:',
  }

  @observable confirmEmailAddressVerificationCode = {
    value: '',
    key: 'verificationCode',
    error: undefined,
    rule: 'required',
    label: 'Enter verification code here:',
  }

  @action loadProfile(username) {
    uiStore.setProgress(true);
    api.User.get(username)
      .then(action((profile) => { this.profile = profile; }))
      .finally(action(() => { uiStore.setProgress(false); }));
  }

  @action
  setProfileDetails(field, value) {
    this.profileDetails[field].value = value;
  }

  @action
  setProfileError(field, error) {
    this.profileDetails[field].error = error;
  }

  @action
  resetProfileDetails() {
    this.profileDetails.firstLegalName.value = '';
    this.profileDetails.firstLegalName.error = undefined;
    this.profileDetails.lastLegalName.value = '';
    this.profileDetails.lastLegalName.error = undefined;
    this.profileDetails.residentalStreet.value = '';
    this.profileDetails.residentalStreet.error = undefined;
    this.profileDetails.city.value = '';
    this.profileDetails.city.error = undefined;
    this.profileDetails.state.value = '';
    this.profileDetails.state.error = undefined;
    this.profileDetails.zipCode.value = '';
    this.profileDetails.zipCode.error = undefined;
    this.profileDetails.phoneNumber.value = '';
    this.profileDetails.phoneNumber.error = undefined;
    this.profileDetails.dateOfBirth.value = '';
    this.profileDetails.dateOfBirth.error = undefined;
    this.profileDetails.ssn.value = '';
    this.profileDetails.ssn.error = undefined;
  }

  @computed
  get canSubmitProfileDetails() {
    return _.isEmpty(_.filter(this.profileDetails, field => field.error));
  }

  @action
  setConfirmIdentityQuestions(field, value) {
    this.confirmIdentityQuestions[field].value = value;
  }

  @action
  setConfirmIdentityQuestionsError(field, error) {
    this.confirmIdentityQuestions[field].error = error;
  }

  @computed
  get canSubmitConfirmIdentityForm() {
    return _.isEmpty(_.filter(this.confirmIdentityQuestions, field => field.error));
  }

  @action
  setConfirmEmailAddressVerificationCode(code) {
    this.confirmEmailAddressVerificationCode.value = code;
  }

  @action
  setConfirmEmailAddressVerificationCodeError(error) {
    this.confirmEmailAddressVerificationCode.error = error;
  }

  @action
  resetConfirmEmailAddressVerificationCode() {
    this.confirmEmailAddressVerificationCode.value = '';
    this.confirmEmailAddressVerificationCode.error = undefined;
  }

  @computed
  get canSubmitEmailAddressVerification() {
    return _.isEmpty(this.confirmEmailAddressVerificationCode.error);
  }

  @action
  setConfirmPhoneNumberVerificationCode(code) {
    this.confirmPhoneNumberVerificationCode.value = code;
  }

  @action
  setConfirmPhoneNumberVerificationCodeError(error) {
    this.confirmPhoneNumberVerificationCode.error = error;
  }

  @action
  resetConfirmPhoneNumberVerificationCode() {
    this.confirmPhoneNumberVerificationCode.value = '';
    this.confirmPhoneNumberVerificationCode.error = undefined;
  }

  @computed
  get canSubmitPhoneNumberVerification() {
    return _.isEmpty(this.confirmPhoneNumberVerificationCode.error);
  }
}
export default new ProfileStore();
