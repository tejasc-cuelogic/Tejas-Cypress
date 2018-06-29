import validationActions from './validation';
import {
  PLAID_ENV, PLAID_URL, PLAID_PUBLIC_KEY,
} from '../../../constants/account';
import ExternalApiService from '../../../api/externalApi';
import { accountStore, individualAccountStore, uiStore } from '../../stores';
import Helper from '../../../helper/utility';

export class Account {
  /**
   * @todo To create a common method for getting different address components
   * from google autocomplete address
   */
  setAddressFieldsOnGoogleAutocomplete = (place) => {
    const componentsForAddress = ['route', 'sublocality_level_3', 'sublocality_level_2', 'sublocality_level_1'];
    const componentsForCity = ['locality'];
    const componentForState = ['administrative_area_level_1'];
    const componentForZipCode = ['postal_code'];

    const residentalStreet = [];
    const city = [];
    const state = [];
    const zipCode = [];

    /* eslint-disable no-plusplus */
    for (let i = 0; i < place.address_components.length; i++) {
      const component = place.address_components[i];
      const addressType = component.types[0];

      if (componentsForAddress.includes(addressType)) {
        residentalStreet.push(component.long_name);
      }
      if (componentsForCity.includes(addressType)) {
        city.push(component.long_name);
      }
      if (componentForState.includes(addressType)) {
        state.push(component.long_name);
      }
      if (componentForZipCode.includes(addressType)) {
        zipCode.push(component.long_name);
      }
    }

    validationActions.validateEntityAccountField('street', residentalStreet.join(''));
    validationActions.validateEntityAccountField('city', city.join(''));
    validationActions.validateEntityAccountField('state', state.join(''));
    validationActions.validateEntityAccountField('zipCode', zipCode.join(''));
  }

  bankSearch = (e) => {
    if (e.charCode === 13) {
      uiStore.setProgress();
      const { value } = accountStore.formBankSearch.fields.bankName;
      if (value !== '') {
        const params = {
          url: PLAID_URL,
          payload: {
            public_key: PLAID_PUBLIC_KEY,
            query: value,
            products: ['auth'],
            options: {
              include_display_data: true,
              limit: 9,
            },
          },
          contentType: 'application/json',
        };
        ExternalApiService.post(params)
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
        // accountStore.createAccount();
        accountStore.getPlaidAccountData().then(() => {
        })
          .catch(() => { });
        // Individual link bank account; move code from indaccstore to accountstore
        // Send the public_token to your app server here.
        // The metadata object contains info about the institution the
        // user selected and the account ID, if selectAccount is enabled.
        Helper.toast(`Bank ${metadata.institution.name} with account id ${Helper.encryptNumber(metadata.account_id)} successfully linked.`, 'success');
        individualAccountStore.setStepToBeRendered(1);
      },
      onExit: (err) => {
        // The user exited the Link flow.
        if (err != null) {
          // The user encountered a Plaid API error prior to exiting.
          Helper.toast('Something went wrong.', 'error');
        }
        // metadata contains information about the institution
        // that the user selected and the most recent API request IDs.
        // Storing this information can be helpful for support.
      },
    });
    linkHandler.open(institutionId);
  }
}

export default new Account();
