/* eslint-disable no-underscore-dangle */
import { observable, computed, action, toJS } from 'mobx';
import graphql from 'mobx-apollo';
import moment from 'moment';
import money from 'money-math';
import { get, includes, orderBy, isArray } from 'lodash';
import { GqlClient as client } from '../../../../api/gqlApi';
import { FormValidator as Validator, DataFormatter } from '../../../../helper';
import { allTransactions, paymentHistory, getInvestmentsByUserIdAndOfferingId, requestOptForTransaction, addFundMutation, withdrawFundMutation, viewLoanAgreement } from '../../queries/transaction';
import { getInvestorAvailableCash } from '../../queries/investNow';
import { requestOtp, verifyOtp } from '../../queries/profile';
import { getInvestorAccountPortfolio } from '../../queries/portfolio';
import { TRANSFER_FUND, VERIFY_OTP } from '../../../constants/transaction';
import { uiStore, userDetailsStore, userStore, offeringCreationStore } from '../../index';
import Helper from '../../../../helper/utility';

export class TransactionStore {
  @observable data = [];
  @observable hasError = false;
  @observable statementDate = [];
  @observable filters = false;
  @observable requestState = {
    search: {},
    page: 1,
    perPage: 25,
    skip: 0,
  };
  @observable TRANSFER_FRM = Validator.prepareFormObject(TRANSFER_FUND);
  @observable OTP_VERIFY_META = Validator.prepareFormObject(VERIFY_OTP);
  @observable cash = null;
  @observable cashAvailable = {};
  @observable showConfirmPreview = false;
  @observable reSendVerificationCode = null;
  @observable transactionOtpRequestId = null;
  @observable transactionDisplayPhoneNumber = null;
  @observable confirmEmailAdress = '';
  @observable paymentHistoryData = [];
  @observable investmentsByOffering = [];
  @observable investmentOptions = [];
  @observable selectedInvestment = '';
  @observable validWithdrawAmt = false;
  @observable availableWithdrawCash = null;
  @observable aggrementId = '';
  @observable loanAgreementData = {};
  @observable isAdmin = false;

  @action
  setFieldValue = (field, value) => {
    this[field] = value;
  }

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
    if (filters.dateRange && filters.dateRange !== 'all') {
      const todayDate = new Date().toISOString();
      params.dateFilterStart = DataFormatter.getDateFromNow(filters.dateRange);
      params.dateFilterStop = todayDate;
    }
    this.requestState.page = page || this.requestState.page;
    this.requestState.perPage = first || this.requestState.perPage;
    this.requestState.skip = skip || this.requestState.skip;
    const account = this.isAdmin ? userDetailsStore.currentActiveAccountDetailsOfSelectedUsers :
      userDetailsStore.currentActiveAccountDetails;
    const { userDetails, getDetailsOfUser } = userDetailsStore;

    this.data = graphql({
      client,
      query: allTransactions,
      variables: {
        ...params,
        offset: page || 1,
        accountId: account.details.accountId,
        userId: this.isAdmin ? getDetailsOfUser.id : userDetails.id,
        orderBy: (props && props.order) || 'DESC',
        limit: (props && props.limitData) || 25,
      },
      fetchPolicy: 'network-only',
      onFetch: (data) => {
        if (props && props.statement && !this.data.loading) {
          this.setFirstTransaction(data);
          this.hasError = false;
        }
      },
      onError: () => {
        this.hasError = true;
      },
    });
  }

  @action
  setFirstTransaction = (t) => {
    this.statementDate = get(t.getAccountTransactions, 'transactions[0].date');
  }

  @computed get getAllTransactions() {
    return (this.data && this.data.data && this.data.data.getAccountTransactions &&
      toJS(this.data.data.getAccountTransactions)) || [];
  }

  @computed get totalRecords() {
    return this.getAllTransactions.totalCount || 0;
  }
  @computed get allPaymentHistoryData() {
    return this.paymentHistoryData.data &&
      this.paymentHistoryData.data.getPaymentHistory
      ? orderBy(this.paymentHistoryData.data.getPaymentHistory, o => (o.completeDate ? moment(new Date(o.completeDate)).unix() : ''), ['desc']) : [];
  }
  @computed get loading() {
    return this.data.loading || this.investmentsByOffering.loading ||
    this.paymentHistoryData.loading || this.loanAgreementData.loading;
  }

  @computed get error() {
    return (this.data && this.data.error && this.data.error.message) || null;
  }

  @computed get getValidWithdrawAmt() {
    return this.validWithdrawAmt;
  }

  @action
  transact = (amount) => {
    this.cash = amount ? money.format('USD', amount.replace(/,/g, '')) : 0.00;
    // this.cash = operation ? money.add(`${this.cash}`, money.format('USD', money.floatToAmount
    // (`${(operation === 'add' ? amount : -amount)}`))) : amount;
    // this.cash = this.cash ? money.format('USD', this.cash.replace(/,/g, '')) : 0.00;
    // if (!includeInFlight) {
    //   this.availableWithdrawCash = amount ? money.format('USD', amount.replace(/,/g, '')) : 0.00;
    // }
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
  resetTransferForm = () => {
    this.TRANSFER_FRM = Validator.prepareFormObject(TRANSFER_FUND);
  }

  @action
  TransferChange = (values, field, formName = 'TRANSFER_FRM', checkWithdrawAmt = false) => {
    uiStore.clearErrors();
    const errorMessage = 'Please enter a valid amount to deposit.';
    this[formName] = Validator.onChange(
      this[formName],
      { name: field, value: values.floatValue },
    );
    if (formName === 'TRANSFER_FRM' && values.floatValue <= 0) {
      uiStore.setErrors(errorMessage);
      if (values.floatValue === 0) {
        this.resetTransferForm();
      }
    }
    if (checkWithdrawAmt && values.floatValue !== undefined) {
      // this.validWithdrawAmt = money.cmp(this.availableWithdrawCash, money.format
      // ('USD', money.floatToAmount(values.floatValue))) >= 0 && values.floatValue > 0;
      this.validWithdrawAmt = money.cmp(this.cash, money.format('USD', money.floatToAmount(values.floatValue))) >= 0 && values.floatValue > 0;
    }
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
          refetchQueries: [{
            query: getInvestorAccountPortfolio,
            variables: { userId: userDetails.id, accountId: account.details.accountId },
          }],
        })
        .then(() => {
          this.setInitialLinkValue(true);
          // this.transact(amount, 'add');
          resolve();
        })
        .catch((error) => {
          if (includes(error.message, 'at least $1')) {
            uiStore.setErrors(error.message);
          } else {
            Helper.toast('Something went wrong, please try again later.', 'error');
          }
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
    const otpType = userDetails.mfaMode === 'PHONE' ? userDetails.phone.type || 'TEXT' : 'EMAIL';
    const { number } = userDetails.phone;
    const { address } = userDetails.email;
    return new Promise((resolve, reject) => {
      client
        .mutate({
          mutation: requestOtp,
          variables: {
            userId: userStore.currentUser.sub,
            type: otpType,
            address: otpType === 'EMAIL' ? address : '',
          },
        })
        .then((result) => {
          const requestMode = otpType === 'EMAIL' ? `code sent to ${address}` : (otpType === 'CALL' ? `call to ${Helper.phoneNumberFormatter(number)}` : `code texted to ${Helper.phoneNumberFormatter(number)}`);
          this.transactionOtpRequestId = result.data.requestOtp;
          if (userDetails.mfaMode === 'PHONE') {
            this.setPhoneNumber(number);
          } else {
            this.setConfirmEmailAddress(address);
          }
          Helper.toast(`Verification ${requestMode}.`, 'success');
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
  confirmAccountLinking = (setProgress = true) => {
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
          if (setProgress) {
            uiStore.setProgress(false);
          }
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
          refetchQueries: [{
            query: getInvestorAccountPortfolio,
            variables: { userId: userDetails.id, accountId: account.details.accountId },
          }],
        })
        .then(() => {
          this.setInitialLinkValue(true);
          // this.transact(amount, 'withdraw');
          resolve();
        })
        .catch((error) => {
          if (includes(error.message, 'at least $0.01')) {
            uiStore.setErrors(error.message);
          } else {
            Helper.toast('Something went wrong, please try again later.', 'error');
          }
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
  getInvestorAvailableCash = (includeInFlight = true) => {
    const account = userDetailsStore.currentActiveAccountDetails;
    const { userDetails } = userDetailsStore;
    return new Promise((resolve, reject) => {
      this.cashAvailable = graphql({
        client,
        query: getInvestorAvailableCash,
        variables: {
          userId: userDetails.id,
          accountId: account.details.accountId,
          includeInFlight,
        },
        onFetch: (data) => {
          if (data && !this.cashAvailable.loading) {
            this.transact(data.getInvestorAvailableCash);
            // this.transact(data.getInvestorAvailableCash, null, includeInFlight);
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
        if (data && !this.paymentHistoryData.loading) {
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
      query: getInvestmentsByUserIdAndOfferingId,
      variables: {
        offeringId: offeringCreationStore.currentOfferingId,
        userId: get(userDetailsStore, 'userDetails.id'),
      },
      onFetch: (data) => {
        if (data && !this.investmentsByOffering.loading) {
          this.setInvestmentOptions(data.getInvestmentsByUserIdAndOfferingId);
          if (data.getInvestmentsByUserIdAndOfferingId[0]) {
            this.setInvestment(data.getInvestmentsByUserIdAndOfferingId[0].investmentId);
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
      const obj = { text: `${Helper.CurrencyFormat(elem.amount, 0)} (#${elem.investmentId})`, value: elem.investmentId };
      options.push(obj);
      return null;
    });
    this.investmentOptions = options;
  }

  @action
  setInvestment = (value) => {
    this.selectedInvestment = value;
    const ob = this.investmentsByOffering.data.getInvestmentsByUserIdAndOfferingId
      .find(obj => obj.investmentId === value);
    this.aggrementId = get(ob, 'agreement.agreementId') || '';
    this.getPaymentHistory();
  }

  @action
  getDocuSignViewURL = aggrementId => new Promise((resolve, reject) => {
    this.loanAgreementData = graphql({
      client,
      query: viewLoanAgreement,
      variables: {
        agreementId: aggrementId || this.aggrementId,
        callbackUrl: `${window.location.origin}/secure-gateway`,
      },
      fetchPolicy: 'network-only',
      onFetch: (data) => {
        if (!this.loanAgreementData.loading) {
          resolve(data.viewLoanAgreement.docuSignViewURL);
        }
      },
      onError: () => {
        Helper.toast('Something went wrong, please try again later.', 'error');
        reject();
      },
    });
  });
}

export default new TransactionStore();
