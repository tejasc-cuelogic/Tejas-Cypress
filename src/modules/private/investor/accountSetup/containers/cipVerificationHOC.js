import React from 'react';
import { inject, observer } from 'mobx-react';
import { NsModal, ListErrors } from '../../../../../theme/shared';
import { FormInput, MaskedInput, FormDropDown } from '../../../../../theme/form';
import { US_STATES } from '../../../../../constants/account';

function cipVerificationHOC(WrappedComponent) {
  // eslint-disable-next-line no-unused-expressions
  return inject('identityStore', 'accountStore', 'userDetailsStore', 'uiStore', 'userStore')(observer((class extends React.Component {
    constructor(props) {
      super(props);
      this.props.identityStore.setCipDetails();
      this.props.identityStore.changeSsnRules();
    }

    handleCloseModal = () => {
      this.props.identityStore.setFieldValue('cipErrors', null);
      this.props.uiStore.removeOneFromProgressArray('submitAccountLoader');
      this.props.history.push('/dashboard/setup');
    }

    handleCipExpiration = async () => {
      let url;
      const { phoneVerification } = this.props.userDetailsStore.signupStatus;
      if (phoneVerification === 'DONE') {
        const { accountForWhichCipExpired, isUserVerified } = this.props.userDetailsStore;
        this.props.uiStore.setFieldvalue('inProgressArray', []);
        const expiredAccountFromLocalStorage = window.sessionStorage.getItem('AccountCipExp');
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

    handleCip = async () => {
      const { url } = await this.props.identityStore.verifyCip();
      this.props.identityStore.setFieldValue('isAddressFailed', false);
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
            fielddata={addressForm.fields.state}
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
      const commonMethods = { closeModal: this.handleCloseModal, handleCipExpiration: this.handleCipExpiration, redirectTo: this.redirectTo, handleCip: this.handleCip, addressTemplate: this.addressTemplate };
      const { inProgress } = this.props.uiStore;
      const { signUpLoading, cipErrors } = this.props.identityStore;
      const elements = { FormInput, FormDropDown, MaskedInput };
      return (
        <WrappedComponent
          {...this.props}
          commonMethods={commonMethods}
          NsModal={NsModal}
          elements={elements}
          ListErrors={ListErrors}
          isLoading={signUpLoading || inProgress}
          errors={cipErrors}
          headerLogo
          borderedHeader
          isProgressHeaderDisable
        />
      );
    }
  })));
}
export default (cipVerificationHOC);
