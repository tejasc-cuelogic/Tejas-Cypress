import {
  PLAID_ENV, PLAID_URL, PLAID_PUBLIC_KEY,
} from '../../../constants/account';
import apiService from '../../../api/restApi';
import { bankAccountStore, individualAccountStore, accountStore, uiStore } from '../../stores';
import Helper from '../../../helper/utility';

const sharedPayload = { key: PLAID_PUBLIC_KEY };
const sharedPublicPayload = { public_key: PLAID_PUBLIC_KEY };
export class BankAccount {
  bankSearch = (e) => {
    if (e.charCode === 13) {
      uiStore.setProgress();
      const { value } = bankAccountStore.formBankSearch.fields.bankName;
      if (value !== '') {
        const payload = {
          ...sharedPublicPayload,
          query: value,
          products: ['auth'],
          options: {
            include_display_data: true,
            limit: 9,
          },
        };
        apiService.postNoAuth(`${PLAID_URL}/institutions/search`, payload)
          .then(data => bankAccountStore.setBankListing(data.body.institutions))
          .finally(() => uiStore.setProgress(false));
      } else {
        bankAccountStore.setBankListing();
        uiStore.setProgress(false);
      }
    }
  }

  getById = (institutionId, accountType) => {
    const payload = {
      ...sharedPublicPayload,
      institution_id: institutionId,
      options: { include_display_data: true },
    };
    return new Promise((resolve, reject) => {
      apiService.postNoAuth(`${PLAID_URL}/institutions/get_by_id`, payload)
        // .then(data => resolve(data.body.institution))
        .then((data) => {
          if (accountType && accountType === 'pending') {
            bankAccountStore.setPendingeBankPlaidLogo(data.body.institution.logo);
          } else {
            bankAccountStore.setActiveBankPlaidLogo(data.body.institution.logo);
          }
        })
        .catch(() => reject())
        .finally(() => { });
    });
  }

  bankSelect = (institutionId, action = 'investorAccCreation') => {
    /* eslint-disable no-undef */
    const linkHandler = Plaid.create({
      env: PLAID_ENV,
      clientName: 'NS',
      ...sharedPayload,
      product: ['auth, transactions'],
      onLoad: () => {
        // The Link module finished loading.
      },
      onSuccess: (publicToken, metadata) => {
        bankAccountStore.setPlaidAccDetails(metadata);
        bankAccountStore.setNewPlaidBankDetails(metadata);
        Helper.toast(`Account with Bank ${metadata.institution.name} successfully linked.`, 'success');
        if (action === 'change') {
          // bankAccountStore.changeBankPlaid();
          bankAccountStore.setPlaidBankVerificationStatus(true);
        } else {
          if (accountStore.INVESTMENT_ACC_TYPES.fields.accType.value === 0) {
            individualAccountStore.setStepToBeRendered(1);
          }
          bankAccountStore.setShowAddFunds();
        }
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
