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

  @computed
  get formattedUserInfo() {
    const userInfo = {
      firstLegalName: this.verifyIdentity01.fields.firstLegalName.value,
      lastLegalName: this.verifyIdentity01.fields.lastLegalName.value,
      dateOfBirth: this.verifyIdentity01.fields.dateOfBirth.value,
      ssn: Helper.unMaskInput(this.verifyIdentity01.fields.ssn.value),
      legalAddress: {
        street: this.verifyIdentity01.fields.residentalStreet.value,
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
      number: Helper.unMaskInput(this.verifyIdentity01.fields.phoneNumber.value),
      countryCode: '91',
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

  getCipStatus = (cipIdentityResponse) => {
    const { key, questions } = cipIdentityResponse;
    if (key === 'id.error') {
      return 'FAIL';
    } else if (key === 'id.failure' && questions) {
      return 'SOFT_FAIL';
    } else if (key === 'id.success') {
      return 'PASS';
    }
    return 'HARD_FAIL';
  }

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
          const cipStatus = this.getCipStatus(data.data.verifyCIPIdentity);
          client
            .mutate({
              mutation: updateUserCIPInfo,
              variables: {
                userId: userStore.currentUser.sub,
                user: this.formattedUserInfo,
                phoneDetails: this.formattedPhoneDetails,
                cipStatus,
              },
            })
            .then((result) => {
              console.log(result);
            })
            .catch(() => {});
          resolve();
        })
        .catch((err) => {
          uiStore.setErrors(this.simpleErr(err));
          reject(err);
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
          /* eslint-disable no-underscore-dangle */
          if (result.data.verifyCIPAnswers.__typename === 'UserCIPPass') {
            client
              .mutate({
                mutation: updateUserCIPInfo,
                variables: {
                  userId: userStore.currentUser.sub,
                  user: this.formattedUserInfo,
                  phoneDetails: this.formattedPhoneDetails,
                  cipStatus: 'PASS',
                },
              })
              .then((data) => {
                resolve(data);
              })
              .catch(() => {});
          }
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
        .catch(err => uiStore.setErrors(JSON.stringify(err)), reject());
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
          client
            .mutate({
              mutation: updateUserCIPInfo,
              variables: {
                userId: userStore.currentUser.sub,
                user: this.formattedUserInfo,
                phoneDetails: this.formattedPhoneDetails,
                cipStatus: 'PASS',
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

  uploadAndUpdateCIPInfo = () => {
    uiStore.setProgress();
    return new Promise((resolve, reject) => {
      client
        .mutate({
          mutation: updateUserCIPInfo,
          variables: {
            userId: userStore.currentUser.sub,
            user: this.formattedUserInfo,
            phoneDetails: this.formattedPhoneDetails,
            cipStatus: 'MANUAL_VERIFICATION_PENDING',
          },
        })
        .then((result) => {
          console.log(result);
          resolve();
        })
        .catch((err) => {
          reject(err);
        })
        .finally(() => {
          uiStore.setProgress(false);
        });
    });
  }

  simpleErr = err => ({
    statusCode: err.statusCode,
    code: err.code,
    message: err.message,
  });
}
export default new ProfileStore();
