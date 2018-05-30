import { action, observable } from 'mobx';
import _ from 'lodash';
import userStore from '../userStore';
import uiStore from '../uiStore';
import { GqlClient as client } from '../../services/graphql';
import { createUserAccountIndividual, finalizeIndividualAccount } from '../queries/account';

class IndividualAccountStore {
  @observable
  stepToBeRendered = '';

  @action
  setStepToBeRendered(step) {
    this.stepToBeRendered = step;
  }

  /* eslint-disable arrow-body-style */
  createAccount = () => {
    return new Promise((resolve, reject) => {
      client
        .mutate({
          mutation: createUserAccountIndividual,
          variables: {
            userId: userStore.currentUser.sub,
            plaidPublicToken: _.isEmpty(this.plaidAccDetails) ? '' : this.plaidAccDetails.public_token,
            plaidAccountId: _.isEmpty(this.plaidAccDetails) ? '' : this.plaidAccDetails.account_id,
            bankName: _.isEmpty(this.plaidAccDetails) ? '' : this.plaidAccDetails.institution.name,
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
            funds: this.formAddFunds.fields.value.value ? this.formAddFunds.fields.value.value : 0,
          },
        })
        .then(() => resolve())
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
