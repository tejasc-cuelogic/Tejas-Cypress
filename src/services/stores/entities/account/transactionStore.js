/* eslint-disable no-underscore-dangle */
import { observable, computed, action, toJS } from 'mobx';
import graphql from 'mobx-apollo';
import isArray from 'lodash/isArray';
import { GqlClient as client } from '../../../../api/gqlApi';
import { FormValidator as Validator, DataFormatter } from '../../../../helper';
import { allTransactions, paymentHistory, investmentsByOfferingId, requestOptForTransaction, addFundMutation, withdrawFundMutation } from '../../queries/transaction';
import { getInvestorAvailableCash } from '../../queries/investNow';
import { requestOtp, verifyOtp } from '../../queries/profile';
import { TRANSFER_FUND, VERIFY_OTP } from '../../../constants/transaction';
import { uiStore, userDetailsStore, userStore, offeringCreationStore } from '../../index';
import Helper from '../../../../helper/utility';

export class TransactionStore {
  @observable data = [];
  @observable statementDate = [];
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
  @observable paymentHistoryData = [];
  @observable investmentsByOffering = [];
  @observable investmentOptions = [];
  @observable selectedInvestment = '';

  @action
  initRequest = (props) => {
    const {
      first, skip, page,
    } = {
      first: (props && props.first) || this.requestState.perPage,
      skip: (props && props.skip) || this.requestState.skip,
      page: (props && props.page) || this.requestState.page,
    };
    const filters = toJS({ ...this.requestState.search });
    const params = {};
    if (filters.transactionType && filters.transactionType.length > 0) {
      params.transactionDirection = toJS(filters.transactionType);
    }
    if (filters.dateRange) {
      const todayDate = new Date().toISOString();
      params.dateFilterStart = DataFormatter.getDateFromNow(filters.dateRange);
      params.dateFilterStop = todayDate;
    }
    this.requestState.page = page || this.requestState.page;
    this.requestState.perPage = first || this.requestState.perPage;
    this.requestState.skip = skip || this.requestState.skip;
    const account = userDetailsStore.currentActiveAccountDetails;
    const { userDetails } = userDetailsStore;

    this.data = graphql({
      client,
      query: allTransactions,
      variables: {
        ...params,
        offset: page || 1,
        accountId: account.details.accountId,
        userId: userDetails.id,
        orderBy: (props && props.orderBy) || 'ASC',
        limit: (props && props.limitData) || 10,
      },
      fetchPolicy: 'network-only',
      onFetch: (data) => {
        if (props && props.statement) {
          console.log(data);
          this.setFirstTransaction(data);
        }
      },
    });
  }

  @action
  setFirstTransaction = (t) => {
    this.statementDate = t ? t.getAccountTransactions.transactions[0].date : '';
  }

  @computed get getAllTransactions() {
    return (this.data && this.data.data.getAccountTransactions &&
      toJS(this.data.data.getAccountTransactions)) || [];
  }

  @computed get totalRecords() {
    return this.getAllTransactions.totalCount || 0;
  }

  @computed get loading() {
    return this.data.loading;
  }

  @computed get error() {
    return (this.data && this.data.error && this.data.error.message) || null;
  }

  @action
  transact = (amount, operation) => {
    this.cash = operation ? (this.cash + parseFloat(operation === 'add' ? amount : -amount)) :
      parseFloat(amount);
    this.cash = !this.cash ? 0.00 : this.cash;
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
    this.requestState.page = 1;
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

  @action
  getPaymentHistory = () => new Promise((resolve, reject) => {
    this.paymentHistoryData = graphql({
      client,
      query: paymentHistory,
      variables: {
        investmentId: this.selectedInvestment,
        offeringId: offeringCreationStore.currentOfferingId,
      },
      onFetch: (data) => {
        if (data) {
          resolve();
        }
      },
      onError: () => {
        Helper.toast('Something went wrong, please try again later.', 'error');
        reject();
      },
      fetchPolicy: 'network-only',
    });
  })

  @action
  getInvestmentsByOfferingId = () => new Promise((resolve, reject) => {
    this.investmentsByOffering = graphql({
      client,
      query: investmentsByOfferingId,
      variables: {
        offeringId: offeringCreationStore.currentOfferingId,
      },
      onFetch: (data) => {
        if (data) {
          this.setInvestmentOptions(data.getInvestmentsByOfferingId);
          if (data.getInvestmentsByOfferingId[0]) {
            this.setInvestment(data.getInvestmentsByOfferingId[0].investmentId);
          }
          resolve();
        }
      },
      onError: () => {
        Helper.toast('Something went wrong, please try again later.', 'error');
        reject();
      },
      fetchPolicy: 'network-only',
    });
  })

  @action
  setInvestmentOptions = (investments) => {
    const options = [];
    investments.map((elem) => {
      const obj = { text: `${Helper.CurrencyFormat(elem.amount)} (#${elem.investmentId})`, value: elem.investmentId };
      options.push(obj);
      return null;
    });
    this.investmentOptions = options;
  }

  @action
  setInvestment = (value) => {
    this.selectedInvestment = value;
    this.getPaymentHistory();
  }
}

export default new TransactionStore();
