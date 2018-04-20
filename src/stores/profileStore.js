import { observable, action } from 'mobx';
import Validator from 'validatorjs';
import mapValues from 'lodash/mapValues';
import _ from 'lodash';
// import graphql from 'mobx-apollo';
import { GqlClient as client } from '../services/graphql';
import { verifyCIPUser, verifyCIPAnswers, checkUserPhoneVerificationCode, startUserPhoneVerification } from '../stores/queries/profile';

import api from '../ns-api';
import uiStore from './uiStore';
import userStore from './userStore';

import {
  VERIFY_IDENTITY_STEP_01,
  VERIFY_IDENTITY_STEP_04,
  IDENTITY_QUESTIONS_FORM_VALUES,
  CONFIRM_IDENTITY_DOCUMENTS,
} from '../constants/profile';

export class ProfileStore {
  @observable profile = undefined;

  @observable verifyIdentity01 = { fields: { ...VERIFY_IDENTITY_STEP_01 }, meta: { isValid: false, error: '' } };

  @observable verifyIdentityResponse = {};

  @observable softFailId = '';

  @observable verifyIdentity02 = [];

  @observable verifyIdentity04 = { fields: { ...VERIFY_IDENTITY_STEP_04 }, meta: { isValid: false, error: '' } };

  @observable confirmIdentityQuestions = { ...IDENTITY_QUESTIONS_FORM_VALUES };

  @observable confirmIdentityDocuments = { ...CONFIRM_IDENTITY_DOCUMENTS };

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
    this.verifyIdentity01 = { fields: { ...VERIFY_IDENTITY_STEP_01 }, meta: { isValid: false, error: '' } };
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
    this.verifyIdentityResponse = response;
  }

  @action
  setIdentityQuestions = (questions) => {
    const questionsList = _.map(questions);
    const identityQuestions = questionsList.map(value => ({
      label: value.prompt, key: value.type, value: '', rule: 'required', error: undefined, placeHolder: 'Type Answer',
    }));
    this.verifyIdentity02 = identityQuestions;
  }

  @action
  setSoftFailId = (id) => {
    this.softFailId = id;
  }

  @action
  identityQuestionAnswerChange = (e, { name, value }) => {
    const changedAnswer = _.find(this.verifyIdentity02, { key: name });
    changedAnswer.value = value;
  }

  /* eslint-disable arrow-body-style */
  submitInvestorPersonalDetails = () => {
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
          console.log(data);
          this.setVerifyIdentityResponse(data.data.verifyCIPIdentity);
          resolve();
        })
        .catch((error) => {
          console.log(error);
          reject();
        });
    });
  }

  getFormattedIdentityQuestionsAnswers = () => {
    const formattedIdentityQuestionsAnswers =
    _.flatMap(this.verifyIdentity02, n => [{ type: n.key }, { text: n.value }]);
    console.log(formattedIdentityQuestionsAnswers);
    return formattedIdentityQuestionsAnswers;
  }

  submitConfirmIdentityQuestions = () => {
    return new Promise((resolve, reject) => {
      client
        .mutate({
          mutation: verifyCIPAnswers,
          variables: {
            userId: userStore.currentUser.sub,
            cipAnswers: {
              id: this.softFailId,
              answers: this.getFormattedIdentityQuestionsAnswers,
            },
          },
        })
        .then((data) => {
          console.log(data);
          resolve();
        })
        .catch((error) => {
          console.log(error);
          reject();
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
              phoneNumber: '7588368463',
              countryCode: '91',
            },
            method: 'sms',
          },
        })
        .then((data) => {
          console.log(data);
          resolve();
        })
        .catch((error) => {
          console.log(error);
          reject();
        });
    });
  }

  // verifyIdentity04.fields.code
  confirmPhoneNumber = () => {
    client
      .mutate({
        mutation: checkUserPhoneVerificationCode,
        variables: {
          phoneDetails: {
            phoneNumber: '7588368463',
            countryCode: '91',
          },
          verificationCode: this.verifyIdentity04.fields.code.value,
        },
      })
      .then(data => console.log(data))
      .catch(error => console.log(error));
  }
}
export default new ProfileStore();
