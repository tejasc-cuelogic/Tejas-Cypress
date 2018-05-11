import { action, observable } from 'mobx';
import Validator from 'validatorjs';
import mapValues from 'lodash/mapValues';
import _ from 'lodash';
import userStore from '../userStore';
import uiStore from '../uiStore';
import {
  IND_ADD_FUND,
  IND_BANK_ACC_SEARCH,
  IND_LINK_BANK_MANUALLY,
} from '../../constants/account';
import { GqlClient as client } from '../../services/graphql';
import { createUserAccountIndividual, finalizeIndividualAccount } from '../queries/account';

class IndividualAccountStore {
  @observable bankLinkInterface = 'list';

  @observable
  formLinkBankManually = {
    fields: { ...IND_LINK_BANK_MANUALLY }, meta: { isValid: false, error: '' },
  }

  @observable
  formAddFunds = {
    fields: { ...IND_ADD_FUND }, meta: { isValid: false, error: '' },
  };

  @observable
  formBankSearch = {
    fields: { ...IND_BANK_ACC_SEARCH }, meta: { isValid: false, error: '' },
  };

  @observable
  bankListing = [];

  @observable
  plaidAccDetails = {};

  @observable
  nsAccId = '';

  @action
  setBankLinkInterface(mode) {
    this.bankLinkInterface = mode;
  }

  @action
  addFundChange = (e, { name, value }) => {
    this.onFieldChange('formAddFunds', name, value);
  };

  @action
  bankSearchChange = (e, { name, value }) => {
    this.onFieldChange('formBankSearch', name, value);
  };

  @action
  linkBankManuallyChange = (e, { name, value }) => {
    this.onFieldChange('formLinkBankManually', name, value);
  };

  @action
  onFieldChange = (currentForm, field, value) => {
    const form = currentForm || 'formAddFunds';
    this[form].fields[field].value = value;
    const validation = new Validator(
      mapValues(this[form].fields, f => f.value),
      mapValues(this[form].fields, f => f.rule),
    );
    this[form].meta.isValid = validation.passes();
    this[form].fields[field].error = validation.errors.first(field);
  };

  @action
  setBankListing = (bankData) => {
    this.bankListing = bankData;
  }

  @action
  setPlaidAccDetails = (plaidAccDetails) => {
    this.plaidAccDetails = plaidAccDetails;
  }

  @action
  setNsAccId = (nsAccId) => {
    this.nsAccId = nsAccId;
  }

  /* eslint-disable arrow-body-style */
  createAccount = () => {
    return new Promise((resolve, reject) => {
      client
        .mutate({
          mutation: createUserAccountIndividual,
          variables: {
            userId: userStore.currentUser.sub,
            plaidPublicToken: _.isEmpty(this.accountDetails) ? '' : this.accountDetails.public_token,
            plaidAccountId: _.isEmpty(this.accountDetails) ? '' : this.accountDetails.account_id,
            bankName: _.isEmpty(this.accountDetails) ? '' : this.accountDetails.institution.name,
            accountNumber: this.formLinkBankManually.fields.bankAccountNumber.value,
            routingNumber: this.formLinkBankManually.fields.bankRoutingNumber.value,
            accountType: 'individual',
          },
        })
        .then(result => this.setNsAccId(result.data.createIndividualAccount.accountId), resolve())
        .catch(action((err) => {
          uiStore.setErrors(this.simpleErr(err));
          reject();
        }));
    });
  }

  finalizeAccount = () => {
    return new Promise((resolve, reject) => {
      client
        .mutate({
          mutation: finalizeIndividualAccount,
          variables: {
            userId: userStore.currentUser.sub,
            accountId: this.nsAccId,
            funds: this.formAddFunds.fields.value.value,
          },
        })
        .then(data => console.log(data), resolve())
        .catch(action((err) => {
          uiStore.setErrors(this.simpleErr(err));
          reject();
        }));
    });
  }

  simpleErr = err => ({
    statusCode: err.statusCode,
    code: err.code,
    message: err.message,
  });
}
export default new IndividualAccountStore();
