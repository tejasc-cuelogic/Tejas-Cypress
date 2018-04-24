import { observable, action } from 'mobx';
import Validator from 'validatorjs';
import mapValues from 'lodash/mapValues';
import _ from 'lodash';
import { GqlClient as client } from '../services/graphql';
import { verifyCIPUser, verifyCIPAnswers, checkUserPhoneVerificationCode, startUserPhoneVerification } from '../stores/queries/profile';

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

  @action
  verifyIdentityEleChange = (e) => {
    this.onFieldChange('verifyIdentity01', e.target.name, e.target.value);
  };

  @action
  verifyIdentitySelChange = (e, { name, value }) => {
    this.onFieldChange('verifyIdentity01', name, value);
  };

  @action
  verifyPhoneNumberEleChange = (e, { name, value }) => {
    this.onFieldChange('verifyIdentity04', name, value);
  };

  @action
  verifyIdentityDateChange = (date) => {
    this.onFieldChange('verifyIdentity01', 'dateOfBirth', date);
  };

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

  @action
  setVerifyIdentityResponse = (response) => {
    this.verifyIdentity01.response = response;
  }

  @action
  setIdentityQuestions = () => {
    const { questions } = this.verifyIdentity01.response;
    const identityQuestions = questions.map(value => ({
      label: value.prompt, key: value.type, value: '', rule: 'required', error: undefined, placeHolder: 'Type Answer',
    }));
    this.verifyIdentity02.fields = identityQuestions;
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

  /* eslint-disable arrow-body-style */
  submitInvestorPersonalDetails = () => {
    uiStore.setProgress();
    uiStore.setLoaderMessage('Submitting Personal Details');
    return new Promise((resolve, reject) => {
      client
        .mutate({
          mutation: verifyCIPUser,
          variables: {
            userId: userStore.currentUser.sub,
            user: {
              firstLegalName: this.verifyIdentity01.fields.firstLegalName.value,
              lastLegalName: this.verifyIdentity01.fields.lastLegalName.value,
              dateOfBirth: this.verifyIdentity01.fields.dateOfBirth.value,
              ssn: this.verifyIdentity01.fields.ssn.value,
              legalAddress: {
                street1: this.verifyIdentity01.fields.residentalStreet.value,
                city: this.verifyIdentity01.fields.city.value,
                state: this.verifyIdentity01.fields.state.value,
                zipCode: this.verifyIdentity01.fields.zipCode.value,
              },
            },
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
          uiStore.clearLoaderMessage();
        });
    });
  }

  getFormattedIdentityQuestionsAnswers = () => {
    const formattedIdentityQuestionsAnswers =
    _.flatMap(this.verifyIdentity02.fields, n => [{ type: n.key }, { text: n.value }]);
    return formattedIdentityQuestionsAnswers;
  }

  submitConfirmIdentityQuestions = () => {
    uiStore.setProgress();
    uiStore.setLoaderMessage('Submitting Confirm Identity Questions');
    return new Promise((resolve, reject) => {
      client
        .mutate({
          mutation: verifyCIPAnswers,
          variables: {
            userId: userStore.currentUser.sub,
            cipAnswers: {
              id: this.verifyIdentity01.response.softFailId,
              answers: this.getFormattedIdentityQuestionsAnswers,
            },
          },
        })
        .then(() => {
          Helper.toast('Identity questions submitted.', 'success');
          resolve();
        })
        .catch((err) => {
          uiStore.setErrors(this.simpleErr(err));
          reject();
        })
        .finally(() => {
          uiStore.setProgress(false);
          uiStore.clearLoaderMessage();
        });
    });
  }

  startPhoneVerification = () => {
    return new Promise((resolve, reject) => {
      client
        .mutate({
          mutation: startUserPhoneVerification,
          variables: {
            phoneDetails: {
              phoneNumber: this.verifyIdentity01.fields.phoneNumber.value,
              countryCode: '91',
            },
            method: 'sms',
          },
        })
        .then(() => {
          Helper.toast('Verification code sent to user.', 'success');
          resolve();
        })
        .catch((err) => {
          uiStore.setErrors(this.simpleErr(err));
          reject();
        });
    });
  }

  confirmPhoneNumber = () => {
    uiStore.setProgress();
    uiStore.setLoaderMessage('Confirming Phone Number');
    return new Promise((resolve, reject) => {
      client
        .mutate({
          mutation: checkUserPhoneVerificationCode,
          variables: {
            phoneDetails: {
              phoneNumber: this.verifyIdentity01.fields.phoneNumber.value,
              countryCode: '91',
            },
            verificationCode: this.verifyIdentity04.fields.code.value,
          },
        })
        .then(() => {
          Helper.toast('Phone number is confirmed.', 'success');
          resolve();
        })
        .catch((err) => {
          uiStore.setErrors(this.simpleErr(err));
          reject(err);
        })
        .finally(() => {
          uiStore.setProgress(false);
          uiStore.clearLoaderMessage();
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
