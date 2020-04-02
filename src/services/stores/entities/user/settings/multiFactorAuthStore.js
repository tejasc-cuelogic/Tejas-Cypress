import { observable, action } from 'mobx';
import { GqlClient as client } from '../../../../../api/gqlApi';
import { uiStore, userDetailsStore } from '../../../index';
import { MFA_MODE_TYPES } from '../../../../constants/multiFactorAuth';
import { FormValidator as Validator } from '../../../../../helper';
import { updateUserMFA } from '../../../queries/mfaModes';
import Helper from '../../../../../helper/utility';

export class MultiFactorAuthStore {
  @observable MFA_MODE_TYPE_META = Validator.prepareFormObject(MFA_MODE_TYPES);

  @action
  handleMfaModeTypeChanged = (e, { value }) => {
    Validator.onChange(this.MFA_MODE_TYPE_META, { name: 'mfaModeTypes', value });
  }

  @action
  handleMfaModePhoneTypeChanged = (e, { value }) => {
    Validator.onChange(this.MFA_MODE_TYPE_META, { name: 'mfaPhoneModeTypes', value });
  }

  @action
  initialiseMfaMode = () => {
    const { currentUser } = userDetailsStore;
    if (currentUser && currentUser.data && currentUser.data.user) {
      const { mfaMode } = currentUser.data.user;
      // const phoneType = phone.type && phone.type === 'TEXT' ? 'TEXT' : 'CALL';
      // const communicationType = mfaMode === 'EMAIL' ? 'EMAIL' : phoneType;
      const communicationType = mfaMode && mfaMode !== '' ? mfaMode === 'PHONE' ? 'CALL' : mfaMode : 'TEXT';
      if (communicationType) {
        this.handleMfaModeTypeChanged(null, { value: communicationType });
      }
    }
  }

  @action
  updateUserMFA = () => {
    uiStore.setProgress();
    const { fields } = this.MFA_MODE_TYPE_META;
    const mfaModeType = fields.mfaModeTypes.value;
    return new Promise((resolve, reject) => {
      client
        .mutate({
          mutation: updateUserMFA,
          variables: {
            mfaMode: mfaModeType,
          },
        })
        .then(action(() => {
          userDetailsStore.setUserMfaMode(mfaModeType);
          Helper.toast('Multi-factor autentitaction updated successfully.', 'success');
          uiStore.setProgress(false);
          resolve();
        }))
        .catch(() => {
          Helper.toast('Someting went wrong. Please try again in sometime', 'error');
          uiStore.setProgress(false);
          reject();
        });
    });
  }
}

export default new MultiFactorAuthStore();
