import validationActions from '../actions/validation';
import {
  PLAID_URL,
} from '../constants/common';
import ExternalApiService from '../services/externalApi';
import indAccountStore from '../stores/user/individualAccountStore';

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

  bankSearch = () => {
    console.log('in call');
    const params = {
      url: PLAID_URL,
      payload: {
        public_key: 'ca61661fcb15b5e735eabae68771b6',
        query: indAccountStore.formBankSearch.fields.bankName.value,
        products: ['auth'],
        options: {
          include_display_data: true,
        },
      },
      contentType: 'application/json',
    };
    ExternalApiService.post(params)
      .then(data => console.log(data))
      .catch(err => console.log(err));
  }
}

export default new Account();
