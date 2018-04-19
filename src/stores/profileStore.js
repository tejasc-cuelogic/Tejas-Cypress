import { observable, action } from 'mobx';
import Validator from 'validatorjs';
import mapValues from 'lodash/mapValues';
import graphql from 'mobx-apollo';
import { GqlClient as client } from '../services/graphql';
import { verifyCIPUser } from '../stores/queries/profile';

import api from '../ns-api';
import uiStore from './uiStore';
import userStore from './userStore';

import {
  VERIFY_IDENTITY_STEP_01,
  IDENTITY_QUESTIONS_FORM_VALUES,
  CONFIRM_IDENTITY_DOCUMENTS,
} from '../constants/profile';

export class ProfileStore {
  @observable profile = undefined;

  @observable verifyIdentity01 = { fields: { ...VERIFY_IDENTITY_STEP_01 }, meta: { isValid: true, error: '' } };

  @observable confirmIdentityQuestions = { ...IDENTITY_QUESTIONS_FORM_VALUES }

  @observable confirmIdentityDocuments = { ...CONFIRM_IDENTITY_DOCUMENTS }

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

  @action
  verifyIdentityEleChange = (e) => {
    this.onFieldChange('verifyIdentity01', e.target.name, e.target.value);
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

  submitInvestorPersonalDetails = () => {
    graphql({
      client,
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
      .then(data => console.log(data))
      .catch(err => console.log(err));
  }
}
export default new ProfileStore();
