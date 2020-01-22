/* eslint-disable no-unused-expressions */
import { toJS, observable, computed, action } from 'mobx';
import graphql from 'mobx-apollo';
import cookie from 'react-cookies';
import moment from 'moment';
import { mapValues, map, concat, set, isEmpty, difference, pick, find, findKey, filter, lowerCase, get, findIndex } from 'lodash';
import { GqlClient as client } from '../../../../api/gqlApi';
import { FormValidator as Validator } from '../../../../helper';
import { USER_PROFILE_FOR_ADMIN, USER_PROFILE_ADDRESS_ADMIN, FREEZE_FORM, USER_PROFILE_PREFERRED_INFO } from '../../../constants/user';
import {
  identityStore,
  accountStore,
  individualAccountStore,
  iraAccountStore,
  entityAccountStore,
  investorProfileStore,
  authStore,
  uiStore,
  investmentStore,
  userListingStore,
  userStore,
} from '../../index';
import { userDetailsQuery, selectedUserDetailsQuery, userDetailsQueryForBoxFolder, deleteProfile, adminUserHardDelete, adminUpdateUserStatus, adminSkipAddressOrPhoneValidationCheck, frozenAccountActivityDetected, adminFreezeAccount, adminFetchEmails } from '../../queries/users';
import { updateUserProfileData } from '../../queries/profile';
import { INVESTMENT_ACCOUNT_TYPES, INV_PROFILE, DELETE_MESSAGE, US_STATES } from '../../../../constants/account';
import Helper from '../../../../helper/utility';

export class UserDetailsStore {
  @observable currentUser = {};

  @observable userFirstLoad = false;

  @observable isClosedAccount = false;

  @observable currentActiveAccount = null;

  @observable accreditationData = {};

  @observable isAddressSkip = false;

  @observable isPhoneSkip = false;

  @observable isFrozen = false;

  @observable detailsOfUser = {};

  @observable editCard = 0;

  @observable deleting = 0;

  validAccStatus = ['PASS', 'MANUAL_VERIFICATION_PENDING'];

  @observable USER_BASIC = Validator.prepareFormObject(USER_PROFILE_FOR_ADMIN);

  @observable DELETE_MESSAGE_FRM = Validator.prepareFormObject(DELETE_MESSAGE);

  @observable USER_PROFILE_ADD_ADMIN_FRM = Validator.prepareFormObject(USER_PROFILE_ADDRESS_ADMIN);

  @observable USER_PROFILE_PREFERRED_INFO_FRM = Validator.prepareFormObject(USER_PROFILE_PREFERRED_INFO);

  @observable USER_INVESTOR_PROFILE = Validator.prepareFormObject(INV_PROFILE);

  @observable FRM_FREEZE = Validator.prepareFormObject(FREEZE_FORM);

  @observable accountForWhichCipExpired = '';

  @observable partialInvestNowSessionURL = '';

  @observable userStatus = null;

  @observable selectedUserId = '';

  @observable displayMode = true;

  @observable emailListArr = [];

  @action
  setFieldValue = (field, value) => {
    this[field] = value;
  }

  @action
  setSSNErrorMessage = (msg) => {
    this.USER_BASIC.fields.ssn.error = msg;
  }

  @computed get currentUserId() {
    return (this.userDetails && this.userDetails.id) || null;
  }

  @computed get userDetails() {
    const details = (this.currentUser.data && toJS(this.currentUser.data.user)) || {};
    details.roles && details.roles.map((role, index) => {
      details.roles[index].name = lowerCase(role.name);
      return details;
    });
    return details;
  }

  @computed
  get userAccreditationStatus() {
    let entityAccreditation = null;
    this.getActiveAccounts.map((role) => {
      if (role.name === 'entity') {
        entityAccreditation = get(role, 'details.accreditation.status') || null;
      }
      return null;
    });
    const accreditation = get(this.userDetails, 'accreditation.status');
    return (accreditation === null && entityAccreditation === null);
  }

  @computed get multipleUserAccounts() {
    const activeAccounts = [];
    activeAccounts.multipleAccounts = false;
    if (this.getActiveAccounts.length === 1) {
      activeAccounts.accountType = this.getActiveAccounts[0].name;
      activeAccounts.accountId = this.getActiveAccounts[0].details.accountId;
    } else {
      activeAccounts.multipleAccounts = true;
    }
    activeAccounts.noAccounts = this.getActiveAccounts.length === 0;
    return activeAccounts;
  }

  @action
  setAddressFieldsForProfile = (place, form) => {
    Validator.setAddressFields(place, this[form]);
    const state = US_STATES.find(s => s.text === this[form].fields.state.value.toUpperCase());
    this[form].fields.state.value = state ? state.key : '';
  }

  @action
  initiateAccreditation = () => {
    const { userDetails } = this;
    const entityAccreditation = userDetails && userDetails.roles
      && userDetails.roles.find(role => role.name === 'entity');
    const accData = {
      individual: userDetails && userDetails.accreditation,
      ira: userDetails && userDetails.accreditation,
      entity: entityAccreditation && entityAccreditation.details
        && entityAccreditation.details.accreditation,
    };
    this.accreditationData = accData;
  }

  @computed get getActiveAccounts() {
    let accDetails;
    if (this.userDetails) {
      accDetails = filter(this.userDetails.roles, account => account.name !== 'investor'
        && account.details
        && (account.details.accountStatus === 'FULL'
        || accountStore.isAccFrozen(account.details.accountStatus)));
    }
    return accDetails;
  }

  @computed get getAccountList() {
    let accDetails = [];
    if (this.userDetails) {
      accDetails = filter(this.userDetails.roles, account => account.name !== 'investor' && account.details);
    }
    return accDetails;
  }

  @computed get getActiveAccountsOfSelectedUsers() {
    let accDetails;
    if (this.getDetailsOfUser) {
      accDetails = filter(this.getDetailsOfUser.roles, account => account.name !== 'investor'
        && account.details);
    }
    return accDetails;
  }

  @computed get currentActiveAccountDetails() {
    const activeAccounts = this.getActiveAccounts;
    return find(activeAccounts, acc => acc.name === this.currentActiveAccount);
  }

  @computed get currentActiveAccountDetailsOfSelectedUsers() {
    if (this.isClosedAccount) {
      return accountStore.selectedClosedAccount;
    }
    const activeAccounts = this.getActiveAccountsOfSelectedUsers;
    return find(activeAccounts, acc => acc.name === this.currentActiveAccount);
  }

  @computed get isAccountFrozen() {
    const isFrozonAccountExists = findIndex(this.signupStatus.frozenAccounts, o => o === this.currentActiveAccount);
    return isFrozonAccountExists >= 0;
  }

  @computed get isAccountSoftFrozen() {
    const isFrozonAccountExists = findIndex(this.signupStatus.softFrozenAccounts, o => o === this.currentActiveAccount);
    return isFrozonAccountExists >= 0;
  }

  @computed get isAccountHardFrozen() {
    const isFrozonAccountExists = findIndex(this.signupStatus.hardFrozenAccounts, o => o === this.currentActiveAccount);
    return isFrozonAccountExists >= 0;
  }

  @action
  setProfilePhoto(url, name) {
    if (this.currentUser && this.currentUser.data.user.info.avatar) {
      this.currentUser.data.user.info.avatar.url = url;
    } else if (url && name) {
      this.currentUser.data.user.info.avatar = { name, url };
    }
  }

  @action
  setUserMfaMode(mfaMode) {
    if (this.currentUser) {
      this.currentUser.data.user.mfaMode = mfaMode;
    }
  }

  @computed get getUserMfaMode() {
    const mfaMode = (this.currentUser.data && this.currentUser.data.user
      && toJS(this.currentUser.data.user.mfaMode)) || 'EMAIL';
    return mfaMode;
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
  setUserAccDetails = (investmentAccType) => {
    if (!isEmpty(this.userDetails)) {
      // bankAccountStore.resetLinkBank();
      if (investmentAccType === 'ira') {
        iraAccountStore.populateData(this.userDetails);
      } else if (investmentAccType === 'individual') {
        individualAccountStore.populateData(this.userDetails);
      } else if (investmentAccType === 'entity') {
        entityAccountStore.populateData(this.userDetails);
      }
      investorProfileStore.populateData(this.userDetails);
    }
  }

  @action
  mergeUserData = (key, payload, objName, path) => {
    const oldData = { ...this[objName] };
    if (objName === 'currentUser') {
      oldData.data.user[key] = path ? set({ ...oldData.data.user[key], ...payload }, path, payload)
        : { ...oldData.data.user[key], ...payload };
    } else {
      oldData[key] = path ? set({ ...oldData[key], ...payload }, path, payload) : { ...oldData[key], ...payload };
    }
    this[objName] = { ...oldData };
  }

  @action
  setAddressOrPhoneCheck = () => {
    this.isAddressSkip = get(this.getDetailsOfUser, 'skipAddressVerifyCheck') || false;
    this.isPhoneSkip = get(this.getDetailsOfUser, 'skipPhoneVerifyCheck') || false;
  }

  @action
  adminSkipAddressOrPhoneValidationCheck = type => new Promise(async (resolve, reject) => {
    const shouldSkip = type === 'PHONE' ? !this.isPhoneSkip : !this.isAddressSkip;
    const payLoad = { userId: this.selectedUserId, shouldSkip, type };
    client
      .mutate({
        mutation: adminSkipAddressOrPhoneValidationCheck,
        variables: payLoad,
      })
      .then(action((res) => {
        this.setFieldValue(type === 'PHONE' ? 'isPhoneSkip' : 'isAddressSkip', get(res, 'data.adminSkipAddressOrPhoneValidationCheck'));
        resolve();
      })).catch(() => reject());
  });

  @action
  deleteProfile = (isInvestor = false, isHardDelete = false) => new Promise(async (resolve, reject) => {
    uiStore.addMoreInProgressArray('deleteProfile');
    const reason = this.DELETE_MESSAGE_FRM.fields.message.value;
    try {
      const res = await client
        .mutate({
          mutation: !isHardDelete ? deleteProfile : adminUserHardDelete,
          variables: !isInvestor ? { userId: this.selectedUserId, reason } : {},
        });
      uiStore.removeOneFromProgressArray('deleteProfile');
      if (get(res, 'data.deleteInvestorOrIssuerUser.status') || get(res, 'data.adminUserHardDelete.status')) {
        userStore.setFieldValue('confirmDelete', true);
        Helper.toast('User Profile Deleted Successfully!', 'success');
        resolve();
      } else {
        reject(!isHardDelete ? get(res, 'data.deleteInvestorOrIssuerUser.message') : get(res, 'data.adminUserHardDelete.message'));
      }
    } catch (error) {
      uiStore.removeOneFromProgressArray('deleteProfile');
      Helper.toast('Something went wrong, please try again in sometime', 'error');
      reject(error.message);
    }
  });

  @action
  getUser = () => new Promise((res) => {
    this.currentUser = graphql({
      client,
      query: userDetailsQuery,
      fetchPolicy: 'network-only',
      onFetch: (result) => {
        if (!this.currentUser.loading) {
          identityStore.setProfileInfo(this.userDetails);
          accountStore.setInvestmentAccTypeValues(this.validAccTypes);
          if (this.userFirstLoad === false) {
            this.userFirstLoad = true;
          }
          res(result);
          const user = { ...this.currentUser };
          this.currentUser.data
            && this.currentUser.data.user
            && this.currentUser.data.user.roles
            && this.currentUser.data.user.roles.map((role, index) => {
              this.currentUser.data.user.roles[index].name = lowerCase(role.name);
              return this.currentUser;
            });
          if (user && user.data && user.data.user && user.data.user.capabilities) {
            authStore.setCurrentUserCapabilites(user.data.user.capabilities);
          }
        }
      },
    });
  })

  @computed
  get isInvestorAccreditated() {
    let entityAccreditation = null;
    this.currentUser && this.currentUser.data
      && this.currentUser.data.user
      && this.currentUser.data.user.roles.map((role) => {
        if (role.name === 'entity') {
          entityAccreditation = get(role, 'details.accreditation.status') || null;
        }
        return null;
      });
    const accreditation = get(this.currentUser, 'data.user.accreditation.status');
    return (accreditation === 'CONFIRMED' || entityAccreditation === 'CONFIRMED');
  }

  @action
  getUserProfileDetails = userId => new Promise((resolve, rej) => {
    this.detailsOfUser = graphql({
      client,
      query: selectedUserDetailsQuery,
      variables: { userId },
      fetchPolicy: 'network-only',
      onFetch: (data) => {
        if (data) {
          this.setFieldValue('selectedUserId', userId);
          resolve(data);
        }
      },
      onError: () => {
        rej();
      },
    });
  })

  getUserStorageDetails = (userId) => {
    uiStore.setProgress('userBoxAccount');
    return new Promise((resolve, rej) => {
      graphql({
        client,
        query: userDetailsQueryForBoxFolder,
        variables: { userId },
        fetchPolicy: 'network-only',
        onFetch: (data) => {
          if (data) {
            uiStore.setProgress(false);
            resolve(get(data, 'user.storageDetails.rootFolder.id'));
          }
        },
        onError: () => {
          uiStore.setProgress(false);
          Helper.toast('Something went wrong, please try again in sometime', 'error');
          rej();
        },
      });
    });
  }

  @computed get getDetailsOfUserLoading() {
    return this.detailsOfUser.loading;
  }

  @computed get getDetailsOfUser() {
    const details = (this.detailsOfUser && this.detailsOfUser.data
      && this.detailsOfUser.data.user && toJS(this.detailsOfUser.data.user)) || {};
    details.roles && details.roles.map((role, index) => {
      details.roles[index].name = lowerCase(role.name);
      return details;
    });
    return details;
  }

  @action
  updateUserStatus = (status) => {
    if (this.detailsOfUser.data.user.locked) {
      this.detailsOfUser.data.user.locked.lock = status;
    } else {
      this.detailsOfUser.data.user.locked = {
        lock: status,
      };
    }
  }

  @computed get isEntityTrust() {
    const Accdetails = this.currentUser.data.user.roles.find(obj => obj.name === 'entity');

    return (Accdetails && Accdetails.details && Accdetails.details.isTrust) || false;
  }

  @action
  toggleState = (id, accountStatus) => {
    uiStore.addMoreInProgressArray('lock');
    const params = { accountStatus, id };
    client
      .mutate({
        mutation: adminUpdateUserStatus,
        variables: params,
      })
      .then(() => {
        this.updateUserStatus(params.accountStatus);
        userListingStore.initRequest();
        uiStore.removeOneFromProgressArray('lock');
        Helper.toast('User Account status updated successfully.', 'success');
      })
      .catch(() => {
        uiStore.removeOneFromProgressArray('lock');
        Helper.toast('Error while updating user', 'warn');
      });
  }

  @action
  freezeAccountToggle = (userId, accountId, freeze, message = null) => {
    uiStore.setProgress();
    return new Promise((resolve, reject) => {
      client
        .mutate({
          mutation: adminFreezeAccount,
          variables: {
            userId,
            accountId,
            freeze,
            reason: message,
          },
          refetchQueries: [{ query: userDetailsQuery, variables: { userId, includePrefInfo: false } }],
        })
        .then(() => {
          resolve();
          uiStore.setProgress(false);
          Helper.toast('User Account status updated successfully.', 'success');
        })
        .catch(() => { reject(); Helper.toast('Error while updating user', 'warn'); uiStore.setProgress(false); });
    });
  };

  @action
  resetModalForm = () => {
    this.FRM_FREEZE = Validator.prepareFormObject(FREEZE_FORM);
  }

  @action
  resetDeleteUserForm = () => {
    this.DELETE_MESSAGE_FRM = Validator.prepareFormObject(DELETE_MESSAGE);
  }

  @computed get signupStatus() {
    const details = {
      idVerification: 'FAIL',
      roles: [],
      phoneVerification: 'FAIL',
      isMigratedUser: false,
      isMigratedFullAccount: false,
      isCipDoneForMigratedUser: false,
      isEmailConfirmed: false,
    };
    const validAccTypes = ['individual', 'ira', 'entity'];
    details.inActiveAccounts = [];
    const accTypes = [];
    if (this.userDetails) {
      details.idVerification = (this.userDetails.legalDetails
        && this.userDetails.legalDetails.status
      ) ? this.userDetails.legalDetails.status : 'FAIL';
      details.roles = mapValues(this.userDetails.roles, (a) => {
        const data = {
          accountId: get(a, 'details.accountId'),
          name: a.name,
          status: a.details ? a.details.accountStatus : null,
        };
        return data;
      });
      Object.keys(details.roles).map((key) => {
        accTypes.push(details.roles[key].name);
        return true;
      });
      details.inActiveAccounts = difference(validAccTypes, accTypes);
      details.partialAccounts = map(filter(details.roles, a => a.status === 'PARTIAL'), 'name');
      details.activeAccounts = map(filter(details.roles, a => a.status === 'FULL'), 'name');
      details.frozenAccounts = map(filter(details.roles, a => accountStore.isAccFrozen(a.status)), 'name');
      details.softFrozenAccounts = map(filter(details.roles, a => accountStore.isAccSoftFrozen(a.status)), 'name');
      details.hardFrozenAccounts = map(filter(details.roles, a => accountStore.isAccHardFrozen(a.status)), 'name');
      details.processingAccounts = map(filter(details.roles, a => (a.status ? a.status.endsWith('PROCESSING') : null)), 'name');
      details.inprogressAccounts = map(filter(details.roles, a => a.name !== 'investor' && a.status !== 'FULL'), 'name');
      details.phoneVerification = this.userDetails.phone
        && this.userDetails.phone.number
        && this.userDetails.phone.verified
        ? 'DONE' : 'FAIL';
      details.isMigratedUser = (this.userDetails.status && this.userDetails.status.startsWith('MIGRATION'));
      details.isMigratedFullAccount = (this.userDetails.status && this.userDetails.status.startsWith('MIGRATION')
        && this.userDetails.status === 'MIGRATION_FULL');
      details.accStatus = this.userDetails.status;
      details.investorProfileCompleted = this.userDetails.investorProfileData === null
        ? false : this.userDetails.investorProfileData
          ? !this.userDetails.investorProfileData.isPartialProfile : false;
      details.isCipDoneForMigratedUser = this.userDetails.cip && this.userDetails.cip.requestId !== null;
      details.isEmailConfirmed = this.userDetails.email && this.userDetails.email.verified
        && this.userDetails.email.verified !== null;
      details.finalStatus = (details.activeAccounts.length > 2
        && this.validAccStatus.includes(details.idVerification)
        && details.phoneVerification === 'DONE');
      details.isWpUser = get(this.userDetails, 'wpUserId');
      return details;
    }
    return details;
  }

  getStepStatus = (step) => {
    const statusDetails = this.signupStatus;
    let status = '';
    if (statusDetails[step]) {
      if (step === 'idVerification') {
        if (this.validAccStatus.includes(statusDetails[step]) && statusDetails.phoneVerification === 'DONE') {
          status = 'done';
        } else {
          status = 'enable';
        }
      } else if (step === 'accounts') {
        if (this.validAccStatus.includes(statusDetails.idVerification)) {
          if (statusDetails.phoneVerification === 'DONE') {
            if (!isEmpty(statusDetails.roles)) {
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

  checkIfAccountIsAlreadyPresent = accountType => (this.signupStatus.processingAccounts.includes(accountType) || this.signupStatus.frozenAccounts.includes(accountType) || this.signupStatus.activeAccounts.includes(accountType));

  @computed get isUserVerified() {
    const accDetails = this.signupStatus;
    return this.validAccStatus.includes(accDetails.idVerification);
  }

  @computed get isSelectedAccountFull() {
    return get(this.currentActiveAccountDetailsOfSelectedUsers, 'details.accountStatus')
      ? get(this.currentActiveAccountDetailsOfSelectedUsers, 'details.accountStatus') === 'FULL' : null;
  }

  @computed get userHasOneFullAccount() {
    return (this.userDetails.status === 'FULL'
      && (this.signupStatus.activeAccounts.length > 0
        || this.signupStatus.frozenAccounts.length > 0
        || this.signupStatus.processingAccounts.length > 0));
  }

  @computed get hasAnyAccount() {
    return (this.signupStatus.activeAccounts.length > 0 || this.signupStatus.partialAccounts.length > 0 || this.signupStatus.inprogressAccounts.length > 0);
  }

  @computed get isLegalDocsPresent() {
    return get(this.userDetails.legalDetails, 'verificationDocs.addressProof.fileId')
      || get(this.userDetails.legalDetails, 'verificationDocs.idProof.fileId');
  }

  @action
  setDelStatus = (status) => {
    this.deleting = status;
  }

  getIdByAccountType = (type) => {
    const role = this.userDetails.roles.find(i => i.name === type);
    return role ? get(role, 'details.accountId') : '';
  }

  @computed get isCipExpirationInProgress() {
    return get(this.userDetails, 'cip.expiration')
    && this.signupStatus.investorProfileCompleted && !this.isUserVerified && !this.isLegalDocsPresent && this.signupStatus.partialAccounts.length;
  }

  @computed
  get pendingStep() {
    let routingUrl = '/dashboard/setup';
    const selectedAccountType = investmentStore
      && investmentStore.investAccTypes && investmentStore.investAccTypes.value;
    const investorAccountCreatedList = map(filter(this.signupStatus.roles, a => a.name !== 'investor'), 'name');
    if (this.signupStatus.isMigratedUser) {
      if (this.userDetails.email
        && (!this.userDetails.email.verified || this.userDetails.email.verified === null)) {
        this.setSignUpDataForMigratedUser(this.userDetails);
        routingUrl = '/welcome-email';
      } else if (!this.signupStatus.isMigratedFullAccount && !get(this.userDetails, 'cip.requestId')) {
        routingUrl = '/dashboard/setup/identity-verification/0';
      } else if ((get(this.userDetails, 'cip.requestId'))) {
        if (this.signupStatus.phoneVerification !== 'DONE') {
          routingUrl = '/dashboard/setup/identity-verification/3';
        } else if (!this.signupStatus.investorProfileCompleted) {
          routingUrl = '/dashboard/setup/establish-profile';
        }
      }
    } else if (this.isCipExpirationInProgress) {
      routingUrl = `/dashboard/setup/account-creation/${this.signupStatus.partialAccounts[0]}`;
    } else if (!this.validAccStatus.includes(this.signupStatus.idVerification)
      && this.signupStatus.idVerification !== 'OFFLINE'
      && this.signupStatus.activeAccounts.length === 0
      && this.signupStatus.processingAccounts.length === 0) {
      routingUrl = '/dashboard/setup/identity-verification/0';
    } else if (this.signupStatus.phoneVerification !== 'DONE') {
      routingUrl = '/dashboard/setup/identity-verification/3';
    } else if (!this.signupStatus.investorProfileCompleted) {
      routingUrl = '/dashboard/setup/establish-profile';
    } else if (isEmpty(investorAccountCreatedList)) {
      routingUrl = '/dashboard/setup/account-creation';
    } else if (this.partialInvestNowSessionURL && this.signupStatus.partialAccounts.length > 0) {
      const redirectAccount = selectedAccountType || this.signupStatus.partialAccounts[0];
      routingUrl = `/dashboard/setup/account-creation/${redirectAccount}`;
    } else if (this.signupStatus.activeAccounts.length > 0
      || this.signupStatus.frozenAccounts.length > 0 || this.signupStatus.partialAccounts.length > 0) {
      const redirectAccount = this.signupStatus.activeAccounts[0] || this.signupStatus.frozenAccounts[0] || this.signupStatus.partialAccounts[0];
      routingUrl = `/dashboard/account-details/${redirectAccount}/portfolio`;
    } else {
      routingUrl = '/dashboard/setup';
    }
    return routingUrl;
  }

  @computed
  get validAccTypes() {
    const validPanes = [];
    const { inActiveAccounts, partialAccounts } = this.signupStatus;
    const remainingAccounts = concat(partialAccounts, inActiveAccounts);
    const accTypesValues = accountStore.INVESTMENT_ACC_TYPES.fields.accType.values;
    remainingAccounts.map((key) => {
      const acc = find(accTypesValues, { accType: key });
      if (acc) {
        validPanes.push(acc);
      }
      return validPanes;
    });
    return validPanes;
  }

  @computed get isCompleteIndividualAccount() {
    return this.signupStatus.activeAccounts.includes('individual')
      || this.signupStatus.frozenAccounts.includes('individual')
      || this.signupStatus.processingAccounts.includes('individual');
  }

  @action
  setFormData = (form, ref, keepAtLeastOne, validateForm = false, isRemoveSsn = false) => {
    const details = toJS({ ...this.detailsOfUser.data.user });
    if (!details) {
      return false;
    }
    this[form] = Validator.setFormData(this[form], details, ref, keepAtLeastOne);
    if (isRemoveSsn) {
      this.USER_BASIC.fields.ssn.value = '';
    }
    if (validateForm) {
      this[form] = Validator.validateForm(this[form]);
    }
    if (form === 'USER_INVESTOR_PROFILE') {
      if (details.investorProfileData && details.investorProfileData.annualIncome) {
        ['annualIncomeCurrentYear'].map((item, index) => {
          this.USER_INVESTOR_PROFILE.fields[item].value = details.investorProfileData.annualIncome[index].income;
          return true;
        });
      }
      this.USER_INVESTOR_PROFILE.fields.taxFilingAs = get(details, 'investorProfileData.taxFilingAs') || '';
    }
    return false;
  }

  @action
  maskChange = (values, form, field) => {
    const valMap = { ssn: 'value', dateOfBirth: 'formattedValue' };
    const fieldValue = values[valMap[field] || 'floatValue'];
    this[form] = Validator.onChange(
      this[form],
      { name: field, value: fieldValue },
    );
  }

  @action
  formChange = (e, result, form) => {
    if (result && (result.type === 'checkbox')) {
      this[form] = Validator.onChange(
        this[form],
        Validator.pullValues(e, result),
        '',
        true,
        { value: result.checked },
      );
    } else {
      this[form] = Validator.onChange(
        this[form],
        Validator.pullValues(e, result),
      );
    }
  }

  @action
  userEleChange = (e, res, type) => {
    this.USER_BASIC = Validator.onChange(this.USER_BASIC, Validator.pullValues(e, res), type);
  };

  @action
  resetStoreData = () => {
    this.currentUser = {};
    this.userFirstLoad = false;
    this.accountForWhichCipExpired = '';
    this.setPartialInvestmenSession();
  }

  @computed get isCipExpired() {
    if (this.userDetails && this.userDetails.cip) {
      const { expiration } = this.userDetails.cip;
      // const expirationDate = new Date(expiration);
      // const currentDate = new Date();
      // if (expirationDate < currentDate) {
      //   return true;
      // }
      const expirationDate = moment(new Date(expiration)).format('MM/DD/YYYY');
      const currentDate = moment().format('MM/DD/YYYY');
      if (moment(expirationDate).isBefore(moment(currentDate))) {
        return true;
      }
    }
    return false;
  }

  @action
  setAccountForWhichCipExpired = (accountName) => {
    window.sessionStorage.setItem('AccountCipExp', accountName);
    this.accountForWhichCipExpired = accountName;
  }

  @computed get isBasicVerDoneForMigratedFullUser() {
    if (this.signupStatus.phoneVerification === 'DONE'
      && this.signupStatus.isEmailConfirmed
      && this.signupStatus.isCipDoneForMigratedUser) {
      return true;
    }
    return false;
  }

  @computed get isLegaLVerificationDone() {
    return (this.validAccStatus
      .includes(this.signupStatus.idVerification)
      && this.signupStatus.phoneVerification === 'DONE');
  }

  @action
  setSignUpDataForMigratedUser = (userDetails) => {
    if (userDetails.info) {
      authStore.SIGNUP_FRM.fields.givenName.value = userDetails.info.firstName;
      authStore.SIGNUP_FRM.fields.role.value = 'investor';
      authStore.SIGNUP_FRM.fields.familyName.value = userDetails.info.lastName;
    }
  }

  @action setPartialInvestmenSession = (redirectURL = '') => {
    this.partialInvestNowSessionURL = redirectURL;
  }

  @action setUserStatus = (status) => {
    this.userStatus = status || this.userStatus;
  }

  @action sendAdminEmailOfFrozenAccount = (activity, offeringId) => {
    const selectedAccount = this.currentActiveAccountDetails;
    const forzenAccountId = get(selectedAccount, 'details.accountId');
    const payLoad = {
      accountId: forzenAccountId, activity, offeringId,
    };
    client
      .mutate({
        mutation: frozenAccountActivityDetected,
        variables: payLoad,
      })
      .then((res) => {
        if (res.data.frozenAccountActivityDetected) {
          // const offeringId = campaignStore.campaign && campaignStore.campaign.id;
          const offeringDetailObj = { offeringId, isEmailSent: true };
          cookie.save('ADMIN_FROZEN_EMAIL', offeringDetailObj, { maxAge: 3600 });
        }
      });
  }

  @computed
  get pendingStepForPartialAndProcessingAccount() {
    let routingUrl = '/dashboard/setup';
    const selectedAccountType = investmentStore
      && investmentStore.investAccTypes && investmentStore.investAccTypes.value;
    if (this.signupStatus.partialAccounts.length > 0) {
      const redirectAccount = selectedAccountType || this.signupStatus.partialAccounts[0];
      const accValue = findKey(INVESTMENT_ACCOUNT_TYPES, val => val === redirectAccount);
      accountStore.setAccTypeChange(accValue);
      routingUrl = `/dashboard/setup/account-creation/${redirectAccount}`;
    } else if (this.signupStatus.inActiveAccounts.length > 0) {
      const redirectAccount = selectedAccountType || this.signupStatus.inActiveAccounts[0];
      const accValue = findKey(INVESTMENT_ACCOUNT_TYPES, val => val === redirectAccount);
      accountStore.setAccTypeChange(accValue);
      routingUrl = `/dashboard/setup/account-creation/${redirectAccount}`;
    } else {
      routingUrl = '/dashboard/setup';
    }
    return routingUrl;
  }

  @computed
  get getAnalyticsUserId() {
    return this.userDetails
      ? (get(this.userDetails, 'wpUserId') || get(this.userDetails, 'id')) : false;
  }

  @action
  updateUserProfileForSelectedUser = () => {
    const basicData = Validator.evaluateFormData(toJS(this.USER_BASIC.fields));
    const infoAdd = Validator.evaluateFormData(toJS(this.USER_PROFILE_ADD_ADMIN_FRM.fields));
    const preferredInfo = Validator.evaluateFormData(toJS(this.USER_PROFILE_PREFERRED_INFO_FRM.fields));
    const profileDetails = {
      firstName: basicData.firstName,
      lastName: basicData.lastName,
      mailingAddress: { ...infoAdd.legalAddress },
    };
    let { capabilities } = basicData;
    capabilities = capabilities.length ? capabilities : null;
    if (this.detailsOfUser.data.user.info.avatar) {
      profileDetails.avatar = pick(
        get(this.detailsOfUser, 'data.user.info.avatar'),
        ['name', 'url'],
      );
    }
    const legalDetails = basicData ? pick(basicData, ['dateOfBirth', 'legalAddress', 'legalName']) : null;
    if (String(basicData.ssn).length === 9) {
      legalDetails.ssn = basicData.ssn;
    }

    uiStore.setProgress();
    return new Promise((resolve, reject) => {
      client
        .mutate({
          mutation: updateUserProfileData,
          variables: {
            profileDetails,
            legalDetails,
            preferredInfo,
            capabilities,
            targetUserId: get(this.getDetailsOfUser, 'id'),
          },
          refetchQueries: [{ query: userDetailsQuery, variables: { userId: get(this.getDetailsOfUser, 'id'), includePrefInfo: true } }],
        })
        .then(() => {
          Helper.toast('Profile has been updated.', 'success');
          this.setFormData('USER_BASIC', false);
          uiStore.setProgress(false);
          resolve();
        })
        .catch((err) => {
          uiStore.setProgress(false);
          reject(err);
          Helper.toast('Something went wrong, please try again in sometime', 'error');
        });
    });
  }

  @action
  updateUserBasicInfo = () => {
    const basicData = Validator.evaluateFormData(toJS(this.USER_BASIC.fields));
    const capabilities = [...basicData.capabilities];
    const profileDetails = {
      firstName: basicData.firstName,
      lastName: basicData.lastName,
    };
    uiStore.setProgress();
    return new Promise((resolve, reject) => {
      client
        .mutate({
          mutation: updateUserProfileData,
          variables: {
            profileDetails: { ...profileDetails },
            capabilities: [...capabilities],
            targetUserId: get(this.getDetailsOfUser, 'id'),
          },
          refetchQueries: [{ query: userDetailsQuery, variables: { userId: get(this.getDetailsOfUser, 'id'), includePrefInfo: false } }],
        })
        .then(() => {
          Helper.toast('Profile has been updated.', 'success');
          uiStore.setProgress(false);
          resolve();
        })
        .catch((err) => {
          uiStore.setProgress(false);
          reject(err);
          Helper.toast('Something went wrong, please try again in sometime', 'error');
        });
    });
  }

  getInvestorAccountsRoute = (accType) => {
    if (this.signupStatus.activeAccounts.includes(accType) || this.signupStatus.partialAccounts.includes(accType) || this.signupStatus.inprogressAccounts.includes(accType)) {
      return accType;
    }
    return this.signupStatus.activeAccounts[0] || this.signupStatus.partialAccounts[0] || this.signupStatus.inprogressAccounts[0] || false;
  }

  @action
  getEmailList = () => new Promise((resolve, reject) => {
    const variables = {};
    variables.recipientId = get(this.getDetailsOfUser, 'id');
    this.emailListArr = graphql({
      client,
      query: adminFetchEmails,
      variables,
      onFetch: (res) => {
        if (get(res, 'adminFetchEmails.emails') && !this.emailListArr.loading) {
          resolve();
        }
      },
      onError: () => {
        Helper.toast('Something went wrong, please try again later.', 'error');
        reject();
      },
    });
  });

  @computed get emailListOutputLoading() {
    return this.emailListArr.loading;
  }

  @computed get userEmails() {
    return this.emailListArr && this.emailListArr.data.adminFetchEmails && this.emailListArr.data.adminFetchEmails.emails;
  }
}

export default new UserDetailsStore();
