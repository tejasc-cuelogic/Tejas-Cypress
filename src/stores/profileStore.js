import { observable, action, computed } from 'mobx';
import Validator from 'validatorjs';
import mapValues from 'lodash/mapValues';
import _ from 'lodash';
import { GqlClient as client } from '../services/graphql';
import { verifyCIPUser, verifyCIPAnswers, checkUserPhoneVerificationCode, startUserPhoneVerification, updateUserCIPInfo } from '../stores/queries/profile';

import api from '../ns-api';
import uiStore from './uiStore';
import userStore from './userStore';
import Helper from '../helper/utility';

import {
  UPDATE_PROFILE_INFO,
  VERIFY_IDENTITY_STEP_01,
  VERIFY_IDENTITY_STEP_04,
  CONFIRM_IDENTITY_DOCUMENTS,
} from '../constants/profile';

export class ProfileStore {
  @observable profile = undefined;

  @observable verifyIdentity01 = { fields: { ...VERIFY_IDENTITY_STEP_01 }, meta: { isValid: false, error: '' }, response: {} };

  @observable verifyIdentity02 = { fields: [], meta: { isValid: false, error: '' } };

  @observable verifyIdentity04 = { fields: { ...VERIFY_IDENTITY_STEP_04 }, meta: { isValid: false, error: '' } };

  @observable confirmIdentityDocuments = { ...CONFIRM_IDENTITY_DOCUMENTS };
  @observable investmentLimits = {
    annualIncome: {
      value: '',
      label: 'Annual Income',
      error: undefined,
      rule: 'required',
      tooltip: 'Mention your Annual Income here',
    },
    netWorth: {
      value: '',
      label: 'Net Worth',
      error: undefined,
      rule: 'required',
      tooltip: 'Mention your Net Worth here',
    },
    otherRegulation: {
      value: '',
      label: 'Other Regulation Crowdfunding investments made in prior 12 months',
      error: undefined,
      rule: 'required',
      tooltip: 'Other Regulation Crowdfunding investments made in prior 12 months',
    },
  };

  @observable updateProfileInfo = { fields: { ...UPDATE_PROFILE_INFO }, meta: { isValid: false, error: '' } };

  @action loadProfile(username) {
    uiStore.setProgress(true);
    api.User.get(username)
      .then(action((profile) => { this.profile = profile; }))
      .finally(action(() => { uiStore.setProgress(false); }));
  }

  /**
   * @desc Handle functions for Verify Identity Form 1 fields.
   */
  @action
  verifyIdentityEleChange = (e, result) => {
    const fieldName = typeof result === 'undefined' ? e.target.name : result.name;
    const fieldValue = typeof result === 'undefined' ? e.target.value : result.value;
    this.onFieldChange('verifyIdentity01', fieldName, fieldValue);
  };

  @action
  verifyIdentityDateChange = (date) => {
    this.onFieldChange('verifyIdentity01', 'dateOfBirth', date);
  };

  @action
  setVerifyIdentityResponse = (response) => {
    this.verifyIdentity01.response = response;
  }

  @action
  reset() {
    this.verifyIdentity01 = { fields: { ...VERIFY_IDENTITY_STEP_01 }, meta: { isValid: false, error: '' }, response: {} };
    this.verifyIdentity04 = { fields: { ...VERIFY_IDENTITY_STEP_04 }, meta: { isValid: false, error: '' } };
  }

  @computed
  get formattedUserInfo() {
    const userInfo = {
      firstLegalName: this.verifyIdentity01.fields.firstLegalName.value,
      lastLegalName: this.verifyIdentity01.fields.lastLegalName.value,
      dateOfBirth: this.verifyIdentity01.fields.dateOfBirth.value,
      ssn: Helper.unMaskInput(this.verifyIdentity01.fields.ssn.value),
      legalAddress: {
        street1: this.verifyIdentity01.fields.residentalStreet.value,
        city: this.verifyIdentity01.fields.city.value,
        state: this.verifyIdentity01.fields.state.value,
        zipCode: this.verifyIdentity01.fields.zipCode.value,
      },
    };
    return userInfo;
  }

  @computed
  get formattedPhoneDetails() {
    const phoneDetails = {
      phoneNumber: Helper.unMaskInput(this.verifyIdentity01.fields.phoneNumber.value),
      countryCode: '1',
    };
    return phoneDetails;
  }

  /**
   * @desc Functions for Verify Identity Form 2.
   */
  @action
  setIdentityQuestions = () => {
    const { questions } = this.verifyIdentity01.response;
    const questionsArray = [];
    let optionsArray = [];
    _.forEach(questions, (question) => {
      const questionObj = { rule: 'required', error: undefined };
      optionsArray = [];
      _.forEach(question.choices, (choice) => {
        optionsArray.push({ key: choice.text, value: choice.text, text: choice.text });
      });
      questionObj.label = question.prompt;
      questionObj.key = question.type;
      questionObj.options = optionsArray;
      questionObj.value = '';
      questionsArray.push(questionObj);
    });
    this.verifyIdentity02.fields = questionsArray;
  }

  @action
  identityQuestionAnswerChange = (e, { name, value }) => {
    const changedAnswer = _.find(this.verifyIdentity02.fields, { key: name });
    changedAnswer.value = value;

    const validation = new Validator(
      mapValues(_.keyBy(this.verifyIdentity02.fields, 'key'), f => f.value),
      mapValues(_.keyBy(this.verifyIdentity02.fields, 'key'), f => f.rule),
    );
    this.verifyIdentity02.meta.isValid = validation.passes();
    changedAnswer.error = validation.errors.first(changedAnswer.key);
  }

  @computed
  get formattedIdentityQuestionsAnswers() {
    const formattedIdentityQuestionsAnswers =
    _.flatMap(this.verifyIdentity02.fields, n => [{ type: n.key, text: n.value }]);
    return formattedIdentityQuestionsAnswers;
  }

  /**
   * @desc Handle function for Verify Identity Form 4 field.
   */
  @action
  verifyVerificationCodeChange = (e, { name, value }) => {
    this.onFieldChange('verifyIdentity04', name, value);
  };

  /**
   * @desc Generic function for on change of each form field.
   */
  @action
  onFieldChange = (currentForm, field, value) => {
    const form = currentForm || 'formFinInfo';
    this[form].fields[field].value = value;
    const validation = new Validator(
      mapValues(this[form].fields, f => f.value),
      mapValues(this[form].fields, f => f.rule),
    );
    this[form].meta.isValid = validation.passes();
    this[form].fields[field].error = validation.errors.first(field);
  };

  /* eslint-disable arrow-body-style */
  submitInvestorPersonalDetails = () => {
    uiStore.setProgress();
    return new Promise((resolve, reject) => {
      client
        .mutate({
          mutation: verifyCIPUser,
          variables: {
            userId: userStore.currentUser.sub,
            user: this.formattedUserInfo,
          },
        })
        .then((data) => {
          this.setVerifyIdentityResponse(data.data.verifyCIPIdentity);
          resolve();
        })
        .catch((err) => {
          uiStore.setErrors(this.simpleErr(err));
          reject();
        })
        .finally(() => {
          uiStore.setProgress(false);
        });
    });
  }

  @action
  setConfirmIdentityDocuments(field, value) {
    this.confirmIdentityDocuments[field].value = value;
  }

  @action
  setConfirmIdentityDocumentsError(field, error) {
    this.confirmIdentityDocuments[field].error = error;
  }

  @computed
  get canSubmitConfirmIdentityDocumentsForm() {
    return _.isEmpty(_.filter(this.confirmIdentityDocuments, field => field.error));
  }

  @computed
  get canSubmitNewPhoneNumber() {
    return ((typeof this.verifyIdentity01.fields.phoneNumber.error !== 'undefined' &&
    !_.isEmpty(this.verifyIdentity01.fields.phoneNumber.value)) ||
    _.isEmpty(this.verifyIdentity01.fields.phoneNumber.value));
  }

  submitConfirmIdentityQuestions = () => {
    uiStore.setProgress();
    return new Promise((resolve, reject) => {
      client
        .mutate({
          mutation: verifyCIPAnswers,
          variables: {
            userId: userStore.currentUser.sub,
            cipAnswers: {
              id: this.verifyIdentity01.response.softFailId,
              answers: this.formattedIdentityQuestionsAnswers,
            },
          },
        })
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          uiStore.setErrors(this.simpleErr(err));
          reject();
        })
        .finally(() => {
          uiStore.setProgress(false);
        });
    });
  }

  /* eslint-disable arrow-body-style */
  startPhoneVerification = () => {
    uiStore.clearErrors();
    return new Promise((resolve, reject) => {
      client
        .mutate({
          mutation: startUserPhoneVerification,
          variables: {
            phoneDetails: this.formattedPhoneDetails,
            method: 'sms',
          },
        })
        .then(() => Helper.toast('Verification code sent to user.', 'success'), resolve())
        .catch(err => uiStore.setErrors(this.simpleErr(err)), reject());
    });
  }

  confirmPhoneNumber = () => {
    uiStore.setProgress();
    return new Promise((resolve, reject) => {
      client
        .mutate({
          mutation: checkUserPhoneVerificationCode,
          variables: {
            phoneDetails: this.formattedPhoneDetails,
            verificationCode: this.verifyIdentity04.fields.code.value,
          },
        })
        .then(() => {
          this.onFieldChange('updateProfileInfo', 'phoneNumber', this.verifyIdentity01.fields.phoneNumber.value);
          client
            .mutate({
              mutation: updateUserCIPInfo,
              variables: {
                userId: userStore.currentUser.sub,
                user: this.formattedUserInfo,
                phoneDetails: this.formattedPhoneDetails,
              },
            });
          resolve();
        })
        .catch(action((err) => {
          uiStore.setErrors(JSON.stringify(err.message));
          reject(err);
        }))
        .finally(() => {
          uiStore.setProgress(false);
        });
    });
  }

  /**
   * @desc Handle function for update profile info change.
   */
  @action
  updateProfileInfoChange = (e, result) => {
    const fieldName = typeof result === 'undefined' ? e.target.name : result.name;
    const fieldValue = typeof result === 'undefined' ? e.target.value : result.value;
    this.onFieldChange('updateProfileInfo', fieldName, fieldValue);
  };

  @action
  setProfileInfo = (currentUser) => {
    this.onFieldChange('updateProfileInfo', 'firstName', currentUser.givenName);
    this.onFieldChange('updateProfileInfo', 'lastName', currentUser.familyName);
    this.onFieldChange('updateProfileInfo', 'email', currentUser.email);
  }

  simpleErr = err => ({
    statusCode: err.statusCode,
    code: err.code,
    message: err.message,
  });
}
export default new ProfileStore();
