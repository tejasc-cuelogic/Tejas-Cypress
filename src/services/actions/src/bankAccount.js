import {
  PLAID_ENV, PLAID_URL, PLAID_PUBLIC_KEY,
} from '../../../constants/account';
import apiService from '../../../api/restApi';
import { bankAccountStore, accountStore, uiStore } from '../../stores';
import Helper from '../../../helper/utility';
import { validationActions } from '../../../services/actions';


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
          resolve();
        })
        .catch(() => {
          bankAccountStore.setFieldValue('loadingState', false);
          reject();
        })
        .finally(() => { });
    });
  }

  bankSelect = (institutionId, action = 'investorAccCreation') => {
    /* eslint-disable no-undef */
    const linkHandler = Plaid.create({
      env: PLAID_ENV,
      clientName: 'NS',
      apiVersion: 'v2',
      ...sharedPayload,
      product: ['auth'],
      onLoad: () => {
        // The Link module finished loading.
        bankAccountStore.setLinkBankSummary(false);
        uiStore.setProgress(false);
        const accountValue = accountStore.INVESTMENT_ACC_TYPES.fields.accType.value;
        const renderStep = accountValue !== 0 ?
          accountStore.ACC_TYPE_MAPPING[accountValue].location : 0;
        accountStore.ACC_TYPE_MAPPING[accountValue].store
          .setStepToBeRendered(renderStep);
      },
      onSuccess: (publicToken, metadata) => {
        bankAccountStore.setPlaidAccDetails(metadata);
        bankAccountStore.setNewPlaidBankDetails(metadata);
        if (action === 'change') {
          // bankAccountStore.changeBankPlaid();
          bankAccountStore.setPlaidBankVerificationStatus(true);
        } else {
          // Helper.toast(`Account with Bank ${metadata.institution.name}
          // successfully linked.`, 'success');
          const accountValue = accountStore.INVESTMENT_ACC_TYPES.fields.accType.value;
          const currentStep = {
            name: 'Link bank',
            stepToBeRendered: accountStore.ACC_TYPE_MAPPING[accountValue].location,
            validate: validationActions.validateLinkBankForm,
          };
          bankAccountStore.resetAddFundsForm();
          accountStore.ACC_TYPE_MAPPING[accountValue].store.createAccount(currentStep);
          accountStore.ACC_TYPE_MAPPING[accountValue].store
            .setStepToBeRendered(accountStore.ACC_TYPE_MAPPING[accountValue].location);
        }
        bankAccountStore.setLinkBankSummary();
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
