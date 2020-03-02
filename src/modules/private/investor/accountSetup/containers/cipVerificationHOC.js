import React from 'react';
import { inject, observer } from 'mobx-react';
import { NsModal, ListErrors } from '../../../../../theme/shared';
import { FormInput, MaskedInput, FormDropDown } from '../../../../../theme/form';
import { US_STATES } from '../../../../../constants/account';
import { INVESTOR_URLS } from '../../../../../services/constants/url';


function cipVerificationHOC(WrappedComponent) {
  // eslint-disable-next-line no-unused-expressions
  return inject('identityStore', 'accountStore', 'userDetailsStore', 'uiStore', 'userStore')(observer((class extends React.Component {
    constructor(props) {
      super(props);
      this.props.identityStore.setCipDetails();
      this.props.identityStore.changeSsnRules();
      const isCipForm = window.location.pathname === INVESTOR_URLS.cipForm;
      if (!isCipForm) {
        this.props.identityStore.validateForm('ID_VERIFICATION_FRM');
      }
      if (!this.props.identityStore.ID_VERIFICATION_FRM.meta.isValid
        && !isCipForm) {
        this.props.history.push(INVESTOR_URLS.cipForm);
      }
    }

    handleCloseModal = () => {
      this.props.identityStore.setFieldValue('cipErrors', null);
      this.props.uiStore.removeOneFromProgressArray('submitAccountLoader');
      this.props.history.push('/dashboard/setup');
    }

    handleBack = (isAddressOrPhoneFailure = undefined) => {
      const { setFieldValue, cipBackUrl } = this.props.identityStore;
      if (isAddressOrPhoneFailure) {
        setFieldValue(isAddressOrPhoneFailure, false);
      }
      setFieldValue('cipErrors', null);
      this.props.history.push(cipBackUrl.pop());
    }

    handleCipExpiration = async () => {
      let url;
      const { phoneVerification } = this.props.userDetailsStore.signupStatus;
      const { accountForWhichCipExpired, isUserVerified } = this.props.userDetailsStore;
      const expiredAccountFromLocalStorage = window.sessionStorage.getItem('AccountCipExp');

      if (phoneVerification === 'DONE') {
        this.props.uiStore.setFieldvalue('inProgressArray', []);
        if (window.sessionStorage.getItem('cipErrorMessage') && !isUserVerified) {
          url = await this.props.accountStore.accountProcessingWrapper(
            accountForWhichCipExpired || expiredAccountFromLocalStorage, { url: '/dashboard/setup/account-creation/' },
          );
        } else if (accountForWhichCipExpired || expiredAccountFromLocalStorage) {
          this.props.history.push(`/dashboard/setup/account-creation/${accountForWhichCipExpired}`);
          this.props.identityStore.setFieldValue('signUpLoading', false);
        } else {
          this.props.history.push('/dashboard/setup');
          this.props.identityStore.setFieldValue('signUpLoading', false);
        }
      }
      return url;
    }

    handleCip = async (isAddressOrPhoneFailure = undefined) => {
      const { setFieldValue, cipBackUrl } = this.props.identityStore;
      const { url } = await this.props.identityStore.verifyCip();
      if (isAddressOrPhoneFailure) {
        const failObj = { backUrl: isAddressOrPhoneFailure === 'addressFail' ? 'cipAddressFail' : 'cipPhoneFail' };
        if (isAddressOrPhoneFailure === 'phoneFail') {
          setFieldValue('isPhoneFailed', false);
        }
        if (window.location.pathname !== url) {
          setFieldValue('cipBackUrl', [...cipBackUrl, ...[INVESTOR_URLS[failObj.backUrl]]]);
        }
      }
      this.redirectTo(url);
    }

    redirectTo = (url) => {
      if (url) {
        this.props.history.push(url);
      }
    }

    addressTemplate = (form) => {
      const { personalInfoChange, personalInfoMaskedChange } = this.props.identityStore;
      const addressForm = this.props.identityStore[form];
      return (
        <>
          <FormInput
            key="city"
            type="text"
            name="city"
            fielddata={addressForm.fields.city}
            changed={(e, result) => personalInfoChange(e, result, form)}
          />
          <FormDropDown
            name="state"
            fielddata={{ ...addressForm.fields.state, error: undefined }}
            options={US_STATES}
            search
            selection
            placeholder="Select"
            checkStateCode
            // onChange={(e, res) => userEleChange(e, res, 'dropdown')}
            onChange={(e, result) => personalInfoChange(e, result, form)}
          />
          <MaskedInput
            key="zipCode"
            name="zipCode"
            fielddata={addressForm.fields.zipCode}
            changed={(values, name) => personalInfoMaskedChange(values, name, form)}
            zipCode
          />
        </>
      );
    }

    render() {
      const cipUtility = { closeModal: this.handleCloseModal, handleCipExpiration: this.handleCipExpiration, redirectTo: this.redirectTo, handleCip: this.handleCip, addressTemplate: this.addressTemplate, handleBack: this.handleBack };
      const { inProgress } = this.props.uiStore;
      const { signUpLoading, cipErrors } = this.props.identityStore;
      const elements = { FormInput, FormDropDown, MaskedInput };
      return (
        <WrappedComponent
          {...this.props}
          cipUtility={cipUtility}
          NsModal={NsModal}
          elements={elements}
          ListErrors={ListErrors}
          isLoading={signUpLoading || inProgress}
          errors={cipErrors}
          headerLogo
          borderedHeader
          investorUrls={INVESTOR_URLS}
          isProgressHeaderDisable
        />
      );
    }
  })));
}
export default cipVerificationHOC;
