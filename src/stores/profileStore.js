import { observable, action, computed } from 'mobx';
import _ from 'lodash';
import api from '../ns-api';
import uiStore from './uiStore';

import {
  PROFILE_DETAILS,
} from '../constants/profile';

export class ProfileStore {
  @observable profile = undefined;

  @observable profileDetails = { ...PROFILE_DETAILS }

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
}
export default new ProfileStore();
