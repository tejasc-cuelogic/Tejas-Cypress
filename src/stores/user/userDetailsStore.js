/* eslint-disable class-methods-use-this, arrow-body-style, no-return-assign */
import { toJS, observable, computed, action } from 'mobx';
import graphql from 'mobx-apollo';
import Validator from 'validatorjs';
import mapValues from 'lodash/mapValues';
import map from 'lodash/map';
import filter from 'lodash/filter';
import _ from 'lodash';
import moment from 'moment';
import { GqlClient as client } from '../../services/graphql';
import { GqlClient as client2 } from '../../services/graphqlCool';
import uiStore from '../uiStore';
import authStore from '../authStore';
import profileStore from '../profileStore';
import iraAccountStore from '../user/iraAccountStore';
import entityAccountStore from '../user/entityAccountStore';
import individualAccountStore from '../user/individualAccountStore';
import { BENEFICIARY_FRM, FIN_INFO } from '../../constants/user';
import { userDetailsQuery, toggleUserAccount } from '../queries/users';
import { allBeneficiaries, getBeneficiaries, requestOptForBeneficiaries, createBeneficiaryMutation, deleteBeneficiary } from '../queries/beneficiaries';
import { finLimit, updateFinLimit } from '../queries/financialLimits';
import Helper from '../../helper/utility';

export class UserDetailsStore {
  @observable currentUser = {};
  @observable beneficiariesData = [];
  @observable financialLimit = {};
  @observable editCard = 0;
  @observable BENEFICIARY_META = { fields: [{ ...BENEFICIARY_FRM }], meta: { isValid: false, error: '' } };
  @observable removeBeneficiaryIndex = null;
  @observable beneficiaryModal = false;
  @observable beneficiaryOtpRequestId = null;
  @observable deleting = 0;
  @observable FIN_INFO = { fields: { ...FIN_INFO }, meta: { isValid: false, error: '' } };
  validAccStatus = ['PASS', 'MANUAL_VERIFICATION_PENDING'];

  @computed get userDetails() {
    const details = (this.currentUser.data && toJS(this.currentUser.data.user)) || {};
    return details;
  }

  @action
  toggleBeneficiaryConfirmModal(index) {
    this.beneficiaryModal = !this.beneficiaryModal;
    this.removeBeneficiaryIndex = this.beneficiaryModal ? index : null;
  }

  @action
  setProfilePhoto(url) {
    if (this.currentUser) {
      this.currentUser.data.user.avatar.url = url;
    }
  }

  @action
  addMoreBeneficiary() {
    this.BENEFICIARY_META = {
      ...this.BENEFICIARY_META,
      fields: [
        ...this.BENEFICIARY_META.fields,
        BENEFICIARY_FRM,
      ],
      meta: {
        ...this.BENEFICIARY_META.meta,
        isValid: false,
      },
    };
  }

  @action
  removeBeneficiary(index) {
    this.BENEFICIARY_META.fields.splice(index, 1);
    this.beneficiaryModal = !this.beneficiaryModal;
    this.removeBeneficiaryIndex = null;
  }

  @action
  setEditCard = (cardIndex) => {
    this.editCard = cardIndex || 0;
  }

  @action
  save = () => {
    this.editCard = 0;
    Helper.toast('User details updated sucessfully', 'success');
  }

  @action
  setUserAccDetails = () => {
    if (!_.isEmpty(this.userDetails)) {
      authStore.checkIsInvestmentAccountCreated(this.userDetails);
      iraAccountStore.populateData(this.userDetails);
      individualAccountStore.populateData(this.userDetails);
      entityAccountStore.populateData(this.userDetails);
    }
  }

  @action
  getUser = (id) => {
    this.currentUser = graphql({
      client,
      query: userDetailsQuery,
      fetchPolicy: 'network-only',
      variables: {
        id,
      },
      onFetch: () => {
        profileStore.setProfileInfo(this.userDetails);
      },
    });
  }

  @action
  updateUserStatus = (status) => {
    this.currentUser.data.user.accountStatus = status;
  }

  @action
  toggleState = () => {
    const { accountStatus, id } = this.currentUser.data.user;
    const params = { status: accountStatus === 'LOCK' ? 'UNLOCKED' : 'LOCK', id };
    client
      .mutate({
        mutation: toggleUserAccount,
        variables: params,
      })
      .then(() => this.updateUserStatus(params.status))
      .catch(() => Helper.toast('Error while updating user', 'warn'));
  }

  @action
  getBeneficiaries = () => {
    this.beneficiariesData = graphql({
      client,
      query: getBeneficiaries,
    });
  }

  @action beneficiaryReset = () => {
    this.BENEFICIARY_META = { fields: [{ ...BENEFICIARY_FRM }], meta: { isValid: false, error: '' } };
  }

  @computed get beneficiaries() {
    return (this.beneficiariesData.data
      && this.beneficiariesData.data.beneficiaries
      && toJS(this.beneficiariesData.data.beneficiaries)
    ) || [];
  }

  @computed get bErr() {
    return (this.beneficiariesData.error && this.beneficiariesData.error.message) || null;
  }

  @computed get bLoading() {
    return this.beneficiariesData.loading;
  }

  @computed get fLoading() {
    return this.financialLimit.loading;
  }

  @computed get signupStatus() {
    const details = { idVerification: 'FAIL', accounts: [], phoneVerification: 'FAIL' };
    const validAccTypes = ['individual', 'ira', 'entity'];
    details.inActiveAccounts = [];
    const accTypes = [];
    if (this.userDetails) {
      details.idVerification = (this.userDetails.legalDetails &&
        this.userDetails.legalDetails.cipStatus && this.userDetails.legalDetails.cipStatus.status
      ) ? this.userDetails.legalDetails.cipStatus.status : 'FAIL';
      details.accounts = mapValues(this.userDetails.accounts, (a) => {
        const data = { accountId: a.accountId, accountType: a.accountType, status: a.status };
        return data;
      });
      Object.keys(details.accounts).map((key) => {
        accTypes.push(details.accounts[key].accountType);
        return true;
      });
      details.inActiveAccounts = _.difference(validAccTypes, accTypes);
      details.partialAccounts = map(filter(details.accounts, a => a.status === 'PARTIAL'), 'accountType');
      details.activeAccounts = map(filter(details.accounts, a => a.status === 'FULL'), 'accountType');
      details.phoneVerification = (this.userDetails.contactDetails &&
        this.userDetails.contactDetails.phone &&
        this.userDetails.contactDetails.phone.verificationDate) ? 'DONE' : 'FAIL';

      details.finalStatus = (details.activeAccounts.length > 2 &&
        this.validAccStatus.includes(details.idVerification) &&
        details.phoneVerification === 'DONE');

      return details;
    }
    return details;
  }

  getStepStatus = (step) => {
    const statusDetails = this.signupStatus;
    let status = '';
    if (statusDetails[step]) {
      if (step === 'idVerification') {
        if (this.validAccStatus.includes(statusDetails[step])) {
          status = 'done';
        } else {
          status = 'enable';
        }
      } else if (step === 'phoneVerification') {
        if (this.validAccStatus.includes(statusDetails.idVerification)) {
          if (statusDetails.phoneVerification === 'DONE') {
            status = 'done';
          } else {
            status = 'enable';
          }
        } else {
          status = 'disable';
        }
      } else if (step === 'accounts') {
        if (this.validAccStatus.includes(statusDetails.idVerification)) {
          if (statusDetails.phoneVerification === 'DONE') {
            if (!_.isEmpty(statusDetails.accounts)) {
              status = 'done';
            } else {
              status = 'enable';
            }
          } else {
            status = 'disable';
          }
        } else {
          status = 'disable';
        }
      }
    }
    return status;
  }

  @computed get isUserVerified() {
    const accDetails = this.signupStatus;
    return this.validAccStatus.includes(accDetails.idVerification);
  }

  @computed get getBeneficiariesData() {
    return toJS(this.BENEFICIARY_META.fields).map(beneficiaries => ({
      firstName: beneficiaries.firstName.value,
      lastName: beneficiaries.lastName.value,
      dob: moment(beneficiaries.dob.value).format('MM-DD-YYYY'),
      relationship: beneficiaries.relationship.value,
      shares: beneficiaries.share.value,
      address: {
        street: beneficiaries.residentalStreet.value,
        city: beneficiaries.city.value,
        state: beneficiaries.state.value,
        zipCode: beneficiaries.zipCode.value,
      },
    }));
  }

  @action
  setBeneficiariesInfo = (accountId) => {
    const beneficiaryList = this.beneficiaries.filter(acc => acc.accountId === accountId)[0];
    console.log(accountId);
    console.log(beneficiaryList.beneficiary);
    if (beneficiaryList.beneficiary) {
      let index = 0;
      _.forEach(beneficiaryList.beneficiary.recipients, (beneficiary) => {
        this.onFieldArrayChange('BENEFICIARY_META', 'firstName', beneficiary.firstName, index);
        this.onFieldArrayChange('BENEFICIARY_META', 'lastName', beneficiary.lastName, index);
        this.onFieldArrayChange('BENEFICIARY_META', 'city', beneficiary.address.city, index);
        this.onFieldArrayChange('BENEFICIARY_META', 'state', beneficiary.address.state, index);
        this.onFieldArrayChange('BENEFICIARY_META', 'residentalStreet', beneficiary.address.street, index);
        this.onFieldArrayChange('BENEFICIARY_META', 'zipCode', beneficiary.address.zipCode, index);
        // this.onFieldArrayChange('BENEFICIARY_META', 'dob', beneficiary.dob, index);
        this.onFieldArrayChange('BENEFICIARY_META', 'relationship', beneficiary.relationship, index);
        this.onFieldArrayChange('BENEFICIARY_META', 'share', beneficiary.shares, index);
        index += 1;
        if (index !== beneficiaryList.beneficiary.recipients.length) {
          this.addMoreBeneficiary();
        }
        console.log(beneficiary);
      });
    }
  }

  @action
  requestOtpForManageBeneficiary = () => {
    uiStore.setProgress();
    return new Promise((resolve, reject) => {
      client
        .mutate({
          mutation: requestOptForBeneficiaries,
          variables: {
            scopeType: 'BENEFICIARY',
            method: 'sms',
          },
        })
        .then((result) => {
          this.beneficiaryOtpRequestId = result.data.requestOtp.requestId;
          resolve();
        })
        .catch(() => reject())
        .finally(() => {
          uiStore.setProgress(false);
        });
    });
  }

  @action
  createBeneficiary = (accountId) => {
    const beneficiaries = this.getBeneficiariesData;
    console.log(beneficiaries, createBeneficiaryMutation, accountId);
    // uiStore.setProgress();
    // return new Promise((resolve, reject) => {
    //   client
    //     .mutate({
    //       mutation: createBeneficiaryMutation,
    //       variables: {
    //         requestId: this.beneficiaryOtpRequestId,
    //         accountId: accountId,
    //         verificationCode: accountId,
    //         beneficiaries: beneficiaries,
    //       },
    //       refetchQueries: [{ query: getBeneficiaries }],
    //     })
    //     .then(() => resolve())
    //     .catch(() => reject())
    //     .finally(() => {
    //       this.beneficiaryReset();
    //       uiStore.setProgress(false);
    //     });
    // });
  }

  @action
  setDelStatus = (status) => {
    this.deleting = status;
  }

  @action
  deleteBeneficiary = (id) => {
    this.deleting = id;
    client2
      .mutate({
        mutation: deleteBeneficiary,
        variables: { id },
        refetchQueries: [{ query: allBeneficiaries }],
      })
      .then(() => Helper.toast('Beneficiary deleted!', 'success'))
      .catch(error => Helper.toast(`Error while deleting Beneficiary- ${error}`, 'warn'))
      .finally(() => this.setDelStatus(0));
  }

  @action
  beneficiaryEleChange = (e, result, index) => {
    const fieldName = typeof result === 'undefined' ? e.target.name : result.name;
    const fieldValue = typeof result === 'undefined' ? e.target.value : result.value;
    this.onFieldArrayChange('BENEFICIARY_META', fieldName, fieldValue, index);
  };

  @action
  beneficiaryDateChange = (date, index) => {
    this.onFieldArrayChange('BENEFICIARY_META', 'dob', date, index);
  };

  @action
  finInfoEleChange = (e, result) => {
    const fieldName = typeof result === 'undefined' ? e.target.name : result.name;
    const fieldValue = typeof result === 'undefined' ? e.target.value : result.value;
    this.onFieldChange('FIN_INFO', fieldName, fieldValue);
  };

  @action
  onFieldArrayChange = (currentForm, field, value, index) => {
    const form = currentForm || 'formFinInfo';
    if (field) {
      this[form].fields[index][field].value = value;
    }

    const validation = new Validator(
      mapValues(this[form].fields[index], f => f.value),
      mapValues(this[form].fields[index], f => f.rule),
    );

    this[form].meta.isValid = validation.passes();
    if (field) {
      this[form].fields[index][field].error = validation.errors.first(field);
    }

    const errorList = this[form].fields.map((fieldsSet) => {
      const allvalidation = new Validator(
        mapValues(fieldsSet, f => f.value),
        mapValues(fieldsSet, f => f.rule),
      );
      return allvalidation.passes();
    });
    this[form].meta.isValid = !errorList.filter(val => !val).length;
  };

  @action
  onFieldChange = (currentForm, field, value) => {
    const form = currentForm || 'formFinInfo';
    if (field) {
      this[form].fields[field].value = value;
    }
    const validation = new Validator(
      mapValues(this[form].fields, f => f.value),
      mapValues(this[form].fields, f => f.rule),
    );
    this[form].meta.isValid = validation.passes();
    if (field) {
      this[form].fields[field].error = validation.errors.first(field);
    }
  };

  @action
  setAddressFields = (place, index) => {
    const data = Helper.gAddressClean(place);
    this.onFieldArrayChange('BENEFICIARY_META', 'residentalStreet', data.residentalStreet, index);
    this.onFieldArrayChange('BENEFICIARY_META', 'city', data.city, index);
    this.onFieldArrayChange('BENEFICIARY_META', 'state', data.state, index);
    this.onFieldArrayChange('BENEFICIARY_META', 'zipCode', data.zipCode, index);
  }

  /*
  Financial Limits
  */
  @action
  getFinancialLimit = () => {
    this.financialLimit = graphql({
      client: client2,
      query: finLimit,
      onFetch: (data) => {
        Object.keys(this.FIN_INFO.fields).map((f) => {
          this.FIN_INFO.fields[f].value = data.FinancialLimits[f];
          return this.FIN_INFO.fields[f];
        });
        this.onFieldChange('FIN_INFO');
      },
    });
  }

  @action
  updateFinInfo = () => {
    const data = mapValues(this.FIN_INFO.fields, f => parseInt(f.value, 10));
    const currentLimit = Helper.getInvestmentLimit(data);
    uiStore.setProgress();
    client2
      .mutate({
        mutation: updateFinLimit,
        variables: {
          annualIncome: data.annualIncome,
          netWorth: data.netWorth,
          otherInvestments: data.otherInvestments,
          currentLimit,
        },
      })
      .then(() => Helper.toast('Updated Financial Info!', 'success'))
      .catch(error => Helper.toast(`Error while updating Financial Info- ${error}`, 'warn'))
      .finally(() => uiStore.setProgress(false));
  }
}

export default new UserDetailsStore();
