import {
  PLAID_ENV, PLAID_URL, PLAID_PUBLIC_KEY,
} from '../../../constants/account';
import apiService from '../../../api/restApi';
import { bankAccountStore, individualAccountStore, uiStore } from '../../stores';
import Helper from '../../../helper/utility';

export class BankAccount {
  bankSearch = (e) => {
    if (e.charCode === 13) {
      uiStore.setProgress();
      const { value } = bankAccountStore.formBankSearch.fields.bankName;
      if (value !== '') {
        const payload = {
          public_key: PLAID_PUBLIC_KEY,
          query: value,
          products: ['auth'],
          options: {
            include_display_data: true,
            limit: 9,
          },
        };
        apiService.postNoAuth(PLAID_URL, payload)
          .then(data => bankAccountStore.setBankListing(data.body.institutions))
          .finally(() => uiStore.setProgress(false));
      } else {
        bankAccountStore.setBankListing();
        uiStore.setProgress(false);
      }
    }
  }

  bankSelect = (institutionId) => {
    /* eslint-disable no-undef */
    const linkHandler = Plaid.create({
      env: PLAID_ENV,
      clientName: 'NS',
      key: PLAID_PUBLIC_KEY,
      product: ['auth, transactions'],
      onLoad: () => {
        // The Link module finished loading.
      },
      onSuccess: (publicToken, metadata) => {
        bankAccountStore.setPlaidAccDetails(metadata);
        Helper.toast(`Account with Bank ${metadata.institution.name} successfully linked.`, 'success');
        individualAccountStore.setStepToBeRendered(1);
        bankAccountStore.setShowAddFunds();
      },
      onExit: (err) => {
        // The user exited the Link flow.
        if (err != null) {
          // The user encountered a Plaid API error prior to exiting.
          Helper.toast('Something went wrong.', 'error');
        }
      },
    });
    linkHandler.open(institutionId);
  }
}

export default new BankAccount();
