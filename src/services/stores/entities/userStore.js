import { observable, action, computed } from 'mobx';
import { FormValidator as Validator } from '../../../helper';
import { NEW_USER } from '../../../constants/user';
import { PRIVATE_NAV } from '../../../constants/NavigationMeta';

export class UserStore {
  @observable currentUser;
  @observable USR_FRM = Validator.prepareFormObject(NEW_USER);
  @observable opt = {};

  @action
  userEleChange = (e, res, type) => {
    this.USR_FRM = Validator.onChange(this.USR_FRM, Validator.pullValues(e, res), type);
  };

  @action
  applyFormError = (form, error) => {
    this[form].meta.isValid = false;
    this[form].meta.error = error.message;
  }

  @action
  userReset = () => {
    this.USR_FRM = Validator.prepareFormObject(NEW_USER);
  }

  @action forgetUser() {
    this.currentUser = undefined;
  }

  @action setCurrentUser(user) {
    this.currentUser = user;
  }

  @computed get capabilitiesMeta() {
    console.log(this.opt);
    let capabilities = [];
    PRIVATE_NAV.map(n => n.capability).forEach((c) => {
      if (c) {
        const meta = c.replace('_ANY', '');
        capabilities = [
          ...capabilities,
          ...[
            { key: `${meta}_FULL`, value: `${meta}_FULL`, text: `${meta}_FULL` },
            { key: `${meta}_MANAGER`, value: `${meta}_MANAGER`, text: `${meta}_MANAGER` },
            { key: `${meta}_SUPPORT`, value: `${meta}_SUPPORT`, text: `${meta}_SUPPORT` },
          ],
        ];
      }
    });
    return capabilities;
  }

  isCurrentUserWithRole(role) {
    return this.currentUser.roles.includes(role);
  }
}

export default new UserStore();
