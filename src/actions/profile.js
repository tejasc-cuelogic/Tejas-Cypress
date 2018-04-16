import validationActions from '../actions/validation';

export class Profile {
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

    validationActions.validateProfileDetailsField('residentalStreet', residentalStreet.join(', '));
    validationActions.validateProfileDetailsField('city', city.join(''));
    validationActions.validateProfileDetailsField('state', state.join(''));
    validationActions.validateProfileDetailsField('zipCode', zipCode.join(''));
  }
}

export default new Profile();
