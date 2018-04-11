import validationActions from '../actions/validation';

export class Profile {
  setAddressFieldsOnGoogleAutocomplete = (place) => {
    /* eslint-disable no-var */
    var case1 = false;
    var case2 = false;
    var case3 = false;

    let residentalStreet = '';
    let city = '';
    let state = '';
    let zipCode = '';

    /* eslint-disable no-plusplus */
    for (let i = 0; i < place.address_components.length; i++) {
      const component = place.address_components[i];
      const addressType = component.types[0];

      switch (addressType) {
        case 'route':
          residentalStreet = component.long_name;
          case1 = true;
          break;
        case 'sublocality_level_3':
          case2 = true;
          residentalStreet += case1 === true ? `, ${component.long_name}` : component.long_name;
          break;
        case 'sublocality_level_2':
          case3 = true;
          residentalStreet += case2 === true ? `, ${component.long_name}` : component.long_name;
          break;
        case 'sublocality_level_1':
          residentalStreet += case3 === true ? `, ${component.long_name}` : component.long_name;
          break;
        case 'locality':
          city = component.long_name;
          break;
        case 'administrative_area_level_1':
          state = component.long_name;
          break;
        case 'postal_code':
          zipCode = component.long_name;
          break;
        default:
          break;
      }
    }

    validationActions.validateProfileDetailsField('residentalStreet', residentalStreet);
    validationActions.validateProfileDetailsField('city', city);
    validationActions.validateProfileDetailsField('state', state);
    validationActions.validateProfileDetailsField('zipCode', zipCode);
  }
}

export default new Profile();
