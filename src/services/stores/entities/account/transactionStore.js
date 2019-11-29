/* eslint-disable no-underscore-dangle */
import { observable, computed, action, toJS } from 'mobx';
import graphql from 'mobx-apollo';
import moment from 'moment';
import cleanDeep from 'clean-deep';
import money from 'money-math';
import { get, orderBy, isArray, filter, forEach } from 'lodash';
import { GqlClient as client } from '../../../../api/gqlApi';
import { ClientDb, FormValidator as Validator, DataFormatter } from '../../../../helper';
import { allTransactions, paymentHistory, getInvestmentsByUserIdAndOfferingId, addFundMutation, withdrawFundMutation, viewLoanAgreement } from '../../queries/transaction';
import { getInvestorAvailableCash } from '../../queries/investNow';
import { requestOtp, verifyOtp } from '../../queries/profile';
import { getInvestorAccountPortfolio } from '../../queries/portfolio';
import { TRANSFER_FUND, VERIFY_OTP, ADD_WITHDRAW_FUND } from '../../../constants/transaction';
import { uiStore, userDetailsStore, userStore, offeringCreationStore } from '../../index';
import Helper from '../../../../helper/utility';

export class TransactionStore {
  @observable data = [];

  @observable inProgress = [];

  @observable hasError = false;

  @observable statementDate = [];

  @observable filters = false;

  @observable requestState = {
    search: {},
    page: 1,
    perPage: 25,
    skip: 0,
    displayTillIndex: 25,
  };

  @observable TRANSFER_FRM = Validator.prepareFormObject(TRANSFER_FUND);

  @observable ADD_WITHDRAW_FUND_FRM = Validator.prepareFormObject(ADD_WITHDRAW_FUND);

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

  @observable db = [];

  @observable apiCall = false;

  @observable agreementIds = [];

  @action
  setFieldValue = (field, value) => {
    this[field] = value;
  }

  @action
  operateInProgress = (setVal, remove = false) => {
    if (remove) {
      this.inProgress = filter(this.inProgress, e => e !== setVal);
    } else {
      this.inProgress.push(setVal);
    }
  }

  @action
  initRequest = (props) => {
    this.resetData();
    const account = this.isAdmin ? userDetailsStore.currentActiveAccountDetailsOfSelectedUsers
      : userDetailsStore.currentActiveAccountDetails;
    const { getDetailsOfUser } = userDetailsStore;
    let variables = {
      accountId: account.details.accountId,
      orderBy: (props && props.order) || 'DESC',
    };
    variables = this.isAdmin ? { ...variables, userId: getDetailsOfUser.id } : { ...variables };
    this.data = graphql({
      client,
      query: allTransactions,
      variables,
      fetchPolicy: 'network-only',
      onFetch: (data) => {
        if (props && props.statement && !this.data.loading) {
          this.setFirstTransaction(data);
          this.hasError = false;
        }
        if (!this.data.loading) {
          this.setData();
        }
        this.setFieldValue('apiCall', true);
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
    const transactions = this.db || [];
    return transactions.slice(
      this.requestState.skip,
      this.requestState.displayTillIndex,
    );
  }

  @computed get totalRecords() {
    return this.db.length;
  }

  @computed get allPaymentHistoryData() {
    return this.paymentHistoryData.data
      && this.paymentHistoryData.data.getPaymentHistory
      ? orderBy(this.paymentHistoryData.data.getPaymentHistory, o => (o.completeDate ? moment(new Date(o.completeDate)).unix() : ''), ['desc']) : [];
  }

  @computed get loading() {
    return this.data.loading || this.investmentsByOffering.loading
      || this.paymentHistoryData.loading || this.loanAgreementData.loading;
  }

  @computed get error() {
    return (this.data && this.data.error && this.data.error.message) || null;
  }

  @computed get accountTransactions() {
    let transactions = (this.data.data && toJS(this.data.data.getAccountTransactions
      && this.data.data.getAccountTransactions.transactions)) || [];
    transactions = transactions.map(t => ({ ...t, date: DataFormatter.getDateAsPerTimeZone(t.date, false, false, false) }));
    return this.sortBydate(transactions);
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
    this.initiateFilters();
  }

  @action
  setData = () => {
    this.setDb(this.accountTransactions);
  }

  @action
  setDb = (data) => {
    this.db = ClientDb.initiateDb(data, false, false, 'refId', true);
  }

  sortBydate = data => orderBy(data, o => (o.date ? moment(new Date(o.date)).unix() : ''), ['desc'])

  @action
  initiateFilters = () => {
    this.resetPagination();
    this.setData();
    const { transactionType, dateRange } = this.requestState.search;
    if (transactionType) {
      ClientDb.filterData('type', transactionType);
    }
    if (dateRange && dateRange !== 'all') {
      // const sDate = moment(new Date()).subtract(dateRange, 'days');
      // const eDate = moment(new Date());
      const sDate = DataFormatter.getCurrentCSTMoment().subtract(dateRange, 'days');
      const eDate = DataFormatter.getCurrentCSTMoment();
      ClientDb.filterByDate(sDate, eDate, 'date', null, true);
    }
    this.db = ClientDb.getDatabase();
  }

  @action
  resetPagination = () => {
    this.requestState.skip = 0;
    this.requestState.page = 1;
    this.requestState.perPage = 25;
    this.requestState.displayTillIndex = 25;
  }

  @action
  resetData = () => {
    this.requestState.search = {};
    this.resetPagination();
    this.data = [];
    this.db = [];
    this.setDb([]);
  }

  @action
  pageRequest = ({ skip, page }) => {
    const pageWiseCount = this.requestState.perPage * page;
    this.requestState.displayTillIndex = pageWiseCount;
    this.requestState.page = page;
    this.requestState.skip = (skip === pageWiseCount)
      ? pageWiseCount - this.requestState.perPage : skip;
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
  resetAddWithdrawFunds = () => {
    uiStore.clearErrors();
    this.ADD_WITHDRAW_FUND_FRM = Validator.prepareFormObject(ADD_WITHDRAW_FUND);
  }

  @action
  checkedChange = (value, field, formName) => {
    uiStore.clearErrors();
    this[formName].fields[field].value = value;
    if (field === 'showAgreementId' && !value) {
      this[formName].fields.agreementId.value = '';
    }
  };

  @action
  formChange = (values, field, formName, mask = false) => {
    uiStore.clearErrors();
    this[formName] = Validator.onChange(this[formName], {
      name: field,
      value: mask ? values.floatValue : values,
    });
  };

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
  addWithdrawFunds = (userId, accountId, actionType) => new Promise((resolve, reject) => {
    this.operateInProgress(actionType);
    const variables = cleanDeep(Validator.evaluateFormData(this.ADD_WITHDRAW_FUND_FRM.fields));
    client
      .mutate({
        mutation: actionType === 'addfunds' ? addFundMutation : withdrawFundMutation,
        variables: {
          userId,
          accountId,
          ...variables,
        },
      })
      .then(() => {
        Helper.toast(`Funds ${actionType === 'addfunds' ? 'added' : 'withdraw'} successfully.`, 'success');
        this.operateInProgress(actionType, true);
        this.initRequest();
        resolve();
      })
      .catch((error) => {
        uiStore.setErrors(error.message);
        Helper.toast('Something went wrong, please try again later.', 'error');
        this.operateInProgress(actionType, true);
        reject();
      });
  });

  @action
  addFunds = (amount, description) => {
    uiStore.setProgress(true);
    const account = userDetailsStore.currentActiveAccountDetails;
    return new Promise((resolve, reject) => {
      client
        .mutate({
          mutation: addFundMutation,
          variables: {
            amount,
            accountId: account.details.accountId,
            description,
          },
          refetchQueries: [{
            query: getInvestorAccountPortfolio,
            variables: { accountId: account.details.accountId },
          }],
        })
        .then(() => {
          this.setInitialLinkValue(true);
          // this.transact(amount, 'add');
          resolve();
        })
        .catch((error) => {
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
  requestOtpForManageTransactions = (isLinkedBankChange = false) => {
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
            isLinkedBankChange,
            address: otpType === 'EMAIL' ? address : number,
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
          if (response.data.verifyOtp) {
            resolve();
          } else {
            uiStore.setErrors('OTP verificaton failed.');
            uiStore.setProgress(false);
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
    return new Promise((resolve, reject) => {
      client
        .mutate({
          mutation: withdrawFundMutation,
          variables: {
            amount,
            accountId: account.details.accountId,
            description,
          },
          refetchQueries: [{
            query: getInvestorAccountPortfolio,
            variables: { accountId: account.details.accountId },
          }],
        })
        .then(() => {
          this.setInitialLinkValue(true);
          // this.transact(amount, 'withdraw');
          resolve();
        })
        .catch((error) => {
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
  getInvestorAvailableCash = (includeInFlight = true, isAdmin = false) => {
    const account = !isAdmin ? userDetailsStore.currentActiveAccountDetails
      : userDetailsStore.currentActiveAccountDetailsOfSelectedUsers;
    const { userDetails, getDetailsOfUser } = userDetailsStore;
    return new Promise((resolve, reject) => {
      this.cashAvailable = graphql({
        client,
        query: getInvestorAvailableCash,
        variables: {
          userId: !isAdmin ? userDetails.id : getDetailsOfUser.id,
          accountId: account.details.accountId,
          includeInFlight,
        },
        onFetch: (data) => {
          if (data && !this.cashAvailable.loading) {
            if (!isAdmin) {
              this.transact(data.getInvestorAvailableCash);
            }
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
  getInvestmentsByOfferingId = isAdmin => new Promise((resolve, reject) => {
    const investorDetail = userDetailsStore.getDetailsOfUser;
    const userDetailId = isAdmin ? investorDetail.id : null;
    let params = {
      offeringId: offeringCreationStore.currentOfferingId,
    };
    params = userDetailId ? { ...params, userId: userDetailId } : { ...params };
    this.agreementIds = [];
    this.investmentsByOffering = graphql({
      client,
      query: getInvestmentsByUserIdAndOfferingId,
      variables: params,
      onFetch: (data) => {
        if (data && !this.investmentsByOffering.loading) {
          const account = !isAdmin ? userDetailsStore.currentActiveAccountDetails
            : userDetailsStore.currentActiveAccountDetailsOfSelectedUsers;
          const accountId = get(account, 'details.accountId');
          const investmentsByUserIdAndOfferingId = filter(data.getInvestmentsByUserIdAndOfferingId, e => e.accountId === accountId);
          this.setInvestmentOptions(investmentsByUserIdAndOfferingId);
          if (get(investmentsByUserIdAndOfferingId, '[0]')) {
            this.setInvestment(get(investmentsByUserIdAndOfferingId, '[0].investmentId'));
          }
          this.setAgreementIds(data.getInvestmentsByUserIdAndOfferingId);
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

  @action
  setAgreementIds(investmentsByUser) {
    forEach(investmentsByUser, (investment) => {
      this.agreementIds.push(get(investment, 'agreement.agreementId'));
    });
  }
}

export default new TransactionStore();
