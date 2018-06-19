/* eslint-disable class-methods-use-this, arrow-body-style, no-return-assign */
import { toJS, observable, computed, action } from 'mobx';
import graphql from 'mobx-apollo';
import Validator from 'validatorjs';
import mapValues from 'lodash/mapValues';
import map from 'lodash/map';
import filter from 'lodash/filter';
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
import { allBeneficiaries, createBeneficiaryMutation, deleteBeneficiary } from '../queries/beneficiaries';
import { finLimit, updateFinLimit } from '../queries/financialLimits';
import Helper from '../../helper/utility';

export class UserDetailsStore {
  @observable currentUser = {};
  @observable beneficiariesData = [];
  @observable financialLimit = {};
  @observable editCard = 0;
  @observable BENEFICIARY_META = { fields: { ...BENEFICIARY_FRM }, meta: { isValid: false, error: '' } };
  @observable deleting = 0;
  @observable FIN_INFO = { fields: { ...FIN_INFO }, meta: { isValid: false, error: '' } };
  validAccStatus = ['PASS', 'MANUAL_VERIFICATION_PENDING'];

  @computed get userDetails() {
    const details = (this.currentUser.data && toJS(this.currentUser.data.user)) || {};
    return details;
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
    authStore.checkIsInvestmentAccountCreated(this.userDetails);
    iraAccountStore.populateData(this.userDetails);
    individualAccountStore.populateData(this.userDetails);
    entityAccountStore.populateData(this.userDetails);
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
      client: client2,
      query: allBeneficiaries,
    });
  }

  @action beneficiaryReset = () => {
    this.BENEFICIARY_META = { fields: { ...BENEFICIARY_FRM }, meta: { isValid: false, error: '' } };
  }

  @computed get beneficiaries() {
    return (this.beneficiariesData.data
      && this.beneficiariesData.data.allBeneficiaries
      && toJS(this.beneficiariesData.data.allBeneficiaries)
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
    const details = { idVerification: 'FAIL', accounts: [] };
    if (this.userDetails) {
      details.idVerification = (this.userDetails.legalDetails &&
        this.userDetails.legalDetails.cipStatus && this.userDetails.legalDetails.cipStatus.status
      ) ? this.userDetails.legalDetails.cipStatus.status : 'FAIL';
      details.accounts = mapValues(this.userDetails.accounts, (a) => {
        const data = { accountId: a.accountId, accountType: a.accountType, status: a.status };
        return data;
      });
      details.activeAccounts = map(filter(details.accounts, a => a.status === 'FULL'), 'accountType');
      return details;
    }
    return details;
  }

  @computed get isUserVerified() {
    const accDetails = this.signupStatus;
    return this.validAccStatus.includes(accDetails.idVerification);
  }

  @action
  createBeneficiary = () => {
    const beneficiary = mapValues(this.BENEFICIARY_META.fields, f => f.value);
    uiStore.setProgress();
    return new Promise((resolve, reject) => {
      client2
        .mutate({
          mutation: createBeneficiaryMutation,
          variables: {
            firstName: beneficiary.firstName,
            lastName: beneficiary.lastName,
            relationship: beneficiary.relationship,
            residentalStreet: beneficiary.residentalStreet,
            city: beneficiary.city,
            state: beneficiary.state,
            zipCode: parseInt(beneficiary.zipCode, 10),
            dob: beneficiary.dob,
          },
          refetchQueries: [{ query: allBeneficiaries }],
        })
        .then(() => resolve())
        .catch(() => reject())
        .finally(() => {
          this.beneficiaryReset();
          uiStore.setProgress(false);
        });
    });
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
  beneficiaryEleChange = (e, result) => {
    const fieldName = typeof result === 'undefined' ? e.target.name : result.name;
    const fieldValue = typeof result === 'undefined' ? e.target.value : result.value;
    this.onFieldChange('BENEFICIARY_META', fieldName, fieldValue);
  };

  @action
  beneficiaryDateChange = (date) => {
    this.onFieldChange('BENEFICIARY_META', 'dob', date);
  };

  @action
  finInfoEleChange = (e, result) => {
    const fieldName = typeof result === 'undefined' ? e.target.name : result.name;
    const fieldValue = typeof result === 'undefined' ? e.target.value : result.value;
    this.onFieldChange('FIN_INFO', fieldName, fieldValue);
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
  setAddressFields = (place) => {
    const data = Helper.gAddressClean(place);
    this.onFieldChange('BENEFICIARY_META', 'residentalStreet', data.residentalStreet);
    this.onFieldChange('BENEFICIARY_META', 'city', data.city);
    this.onFieldChange('BENEFICIARY_META', 'state', data.state);
    this.onFieldChange('BENEFICIARY_META', 'zipCode', data.zipCode);
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
