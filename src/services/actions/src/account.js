import validationActions from './validation';
import {
  PLAID_ENV, PLAID_URL, PLAID_PUBLIC_KEY,
} from '../../../constants/account';
import apiService from '../../../api/restApi';
import { accountStore, individualAccountStore, uiStore } from '../../stores';
import Helper from '../../../helper/utility';

export class Account {
  /**
   * @todo To create a common method for getting different address components
   * from google autocomplete address
   */
  setAddressFieldsOnGoogleAutocomplete = (place) => {
    const data = Helper.gAddressClean(place);
    validationActions.validateEntityAccountField('street', data.residentalStreet);
    validationActions.validateEntityAccountField('city', data.city);
    validationActions.validateEntityAccountField('state', data.state);
    validationActions.validateEntityAccountField('zipCode', data.zipCode);
  }

  bankSearch = (e) => {
    if (e.charCode === 13) {
      uiStore.setProgress();
      const { value } = accountStore.formBankSearch.fields.bankName;
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
          .then(data => accountStore.setBankListing(data.body.institutions))
          .finally(() => uiStore.setProgress(false));
      } else {
        accountStore.setBankListing();
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
        accountStore.setPlaidAccDetails(metadata);
        accountStore.getPlaidAccountData().then(() => {
        })
          .catch(() => { });
        Helper.toast(`Bank ${metadata.institution.name} with account id ${Helper.encryptNumber(metadata.account_id)} successfully linked.`, 'success');
        individualAccountStore.setStepToBeRendered(1);
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

export default new Account();
