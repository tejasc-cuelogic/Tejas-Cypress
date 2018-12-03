/* eslint-disable no-underscore-dangle */
import { observable, computed, action, toJS } from 'mobx';
import graphql from 'mobx-apollo';
import isArray from 'lodash/isArray';
import { GqlClient as clientStub } from '../../../../api/gcoolApi';
import { GqlClient as client } from '../../../../api/gqlApi';
import { FormValidator as Validator } from '../../../../helper';
import { allTransactions, requestOptForTransaction, addFundMutation, withdrawFundMutation } from '../../queries/transaction';
import { getInvestorAvailableCash } from '../../queries/investNow';
import { requestOtp, verifyOtp } from '../../queries/profile';
import { TRANSFER_FUND, VERIFY_OTP } from '../../../constants/transaction';
import { uiStore, userDetailsStore, userStore } from '../../index';
import Helper from '../../../../helper/utility';

export class TransactionStore {
  @observable data = [];
  @observable filters = false;
  @observable requestState = {
    search: {},
    page: 1,
    perPage: 10,
    skip: 0,
  };
  @observable TRANSFER_FRM = Validator.prepareFormObject(TRANSFER_FUND);
  @observable OTP_VERIFY_META = Validator.prepareFormObject(VERIFY_OTP);
  @observable cash = null;
  @observable showConfirmPreview = false;
  @observable reSendVerificationCode = null;
  @observable transactionOtpRequestId = null;
  @observable transactionDisplayPhoneNumber = null;
  @observable confirmEmailAdress = '';
  @action
  initRequest = (props) => {
    const { first, skip, page } = props ||
      {
        first: this.requestState.perPage,
        skip: this.requestState.skip,
        page: this.requestState.page,
      };
    const filters = toJS({ ...this.requestState.search });
    const params = {};
    if (filters.transactionType && filters.transactionType.length > 0) {
      params.transactionType_in = toJS(filters.transactionType);
    }
    this.requestState.page = page || this.requestState.page;
    this.requestState.perPage = first || this.requestState.perPage;
    this.requestState.skip = skip || this.requestState.skip;
    this.data = graphql({
      client: clientStub,
      query: allTransactions,
      variables: { filters: params, first: first || this.requestState.perPage, skip },
    });
  }

  @computed get getAllTransactions() {
    return (this.data && this.data.data.allTransactions &&
      toJS(this.data.data.allTransactions)) || [];
  }

  @computed get totalRecords() {
    return (this.data && this.data.data._allTransactionsMeta &&
      this.data.data._allTransactionsMeta.count) || 0;
  }

  @computed get loading() {
    return this.data.loading;
  }

  @computed get error() {
    return (this.data && this.data.error && this.data.error.message) || null;
  }

  @action
  transact = (amount, operation) => {
    if (operation) {
      this.cash = this.cash + parseFloat(operation === 'add' ? amount : -amount);
      this.cash = !this.cash ? 0.00 : this.cash;
    } else {
      this.cash = parseFloat(amount);
      this.cash = !this.cash ? 0.00 : this.cash;
    }
  }

  @action
  initiateSearch = (srchParams) => {
    this.requestState.search = srchParams;
    this.initRequest();
  }

  @action
  setInitiateSrch = (name, value) => {
    const srchParams = { ...this.requestState.search };
    if ((isArray(value) && value.length > 0) || (typeof value === 'string' && value !== '')) {
      srchParams[name] = value;
    } else {
      delete srchParams[name];
    }
    this.initiateSearch(srchParams);
  }

  @action
  TransferChange = (values, field, formName = 'TRANSFER_FRM') => {
    this[formName] = Validator.onChange(
      this[formName],
      { name: field, value: values.floatValue },
    );
  };

  @action
  addFunds = (amount, description) => {
    uiStore.setProgress(true);
    const account = userDetailsStore.currentActiveAccountDetails;
    const { userDetails } = userDetailsStore;
    return new Promise((resolve, reject) => {
      client
        .mutate({
          mutation: addFundMutation,
          variables: {
            userId: userDetails.id,
            amount,
            accountId: account.details.accountId,
            description,
          },
        })
        .then(() => {
          this.setInitialLinkValue(true);
          this.transact(amount, 'add');
          resolve();
        })
        .catch((error) => {
          Helper.toast('Something went wrong, please try again later.', 'error');
          uiStore.setErrors(error.message);
          this.setInitialLinkValue(false);
          reject();
        })
        .finally(() => {
          uiStore.setProgress(false);
        });
    });
  }
  @action
  setInitialLinkValue = (boolValue) => {
    this.showConfirmPreview = boolValue;
  }
  @action
  setInitialFundValue = () => {
    Validator.resetFormData(this.TRANSFER_FRM);
  }
  @action
  verifyVerificationCodeChange = (value) => {
    this.OTP_VERIFY_META = Validator.onChange(
      this.OTP_VERIFY_META,
      { name: 'code', value },
    );
  };
  @action
  setReSendVerificationCode(value) {
    this.reSendVerificationCode = value;
  }
  @action
  requestOtpForManageAddWithdrawTransactions = () => {
    uiStore.setProgress();
    return new Promise((resolve, reject) => {
      client
        .mutate({
          mutation: requestOptForTransaction,
          variables: {
            scopeType: 'TRANSFER',
            method: 'sms',
          },
        })
        .then((result) => {
          this.transactionOtpRequestId = result.data.requestOtp.requestId;
          this.setPhoneNumber(result.data.requestOtp.phoneNumber);
          resolve();
        })
        .catch((error) => {
          uiStore.setErrors(error.message);
          reject(error);
        })
        .finally(() => {
          uiStore.setProgress(false);
        });
    });
  }
  @action
  requestOtpForManageTransactions = () => {
    uiStore.setProgress();
    const { userDetails } = userDetailsStore;
    const otpType = userDetails.mfaMode === 'PHONE' ? userDetails.phone.type : 'EMAIL';
    return new Promise((resolve, reject) => {
      client
        .mutate({
          mutation: requestOtp,
          variables: {
            userId: userStore.currentUser.sub,
            type: otpType,
          },
        })
        .then((result) => {
          this.transactionOtpRequestId = result.data.requestOtp;
          if (userDetails.mfaMode === 'PHONE') {
            this.setPhoneNumber(userDetails.phone.number);
          } else {
            this.setConfirmEmailAddress(userDetails.email.address);
          }
          resolve();
        })
        .catch((error) => {
          uiStore.setErrors(error.message);
          reject(error);
        })
        .finally(() => {
          uiStore.setProgress(false);
        });
    });
  }
  confirmAccountLinking = () => {
    uiStore.setProgress();
    return new Promise((resolve, reject) => {
      client
        .mutate({
          mutation: verifyOtp,
          variables: {
            resourceId: this.transactionOtpRequestId,
            verificationCode: this.OTP_VERIFY_META.fields.code.value,
          },
        })
        .then((response) => {
          // this.updateUserPhoneDetails();
          if (response.data.verifyOtp) {
            resolve();
          } else {
            uiStore.setErrors('OTP verificaton failed.');
            reject();
          }
        })
        .catch(action((err) => {
          uiStore.setErrors(JSON.stringify(err.message));
          reject(err);
        }))
        .finally(() => {
          uiStore.setProgress(false);
        });
    });
  }
  @action
  resetFormData(form) {
    this[form] = Validator.resetFormData(this[form]);
  }
  @action
  setPhoneNumber(phoneNumberVal) {
    this.transactionDisplayPhoneNumber = phoneNumberVal;
  }
  @action
  setConfirmEmailAddress(emailVal) {
    this.confirmEmailAdress = emailVal;
  }
  @action
  withdrawFunds = (amount, description) => {
    uiStore.setProgress(true);
    const account = userDetailsStore.currentActiveAccountDetails;
    const { userDetails } = userDetailsStore;
    return new Promise((resolve, reject) => {
      client
        .mutate({
          mutation: withdrawFundMutation,
          variables: {
            userId: userDetails.id,
            amount,
            accountId: account.details.accountId,
            description,
          },
        })
        .then(() => {
          this.setInitialLinkValue(true);
          this.transact(amount, 'withdraw');
          resolve();
        })
        .catch((error) => {
          Helper.toast('Something went wrong, please try again later.', 'error');
          uiStore.setErrors(error.message);
          this.setInitialLinkValue(false);
          reject();
        })
        .finally(() => {
          uiStore.setProgress(false);
        });
    });
  }
  @action
  getInvestorAvailableCash = () => {
    const account = userDetailsStore.currentActiveAccountDetails;
    const { userDetails } = userDetailsStore;
    return new Promise((resolve, reject) => {
      this.cashAvailable = graphql({
        client,
        query: getInvestorAvailableCash,
        variables: {
          userId: userDetails.id,
          accountId: account.details.accountId,
          includeInFlight: true,
        },
        onFetch: (data) => {
          if (data) {
            this.transact(data.getInvestorAvailableCash, null);
            resolve(data);
          }
        },
        onError: () => {
          Helper.toast('Something went wrong, please try again later.', 'error');
          reject();
        },
        fetchPolicy: 'network-only',
      });
    });
  }
}

export default new TransactionStore();
