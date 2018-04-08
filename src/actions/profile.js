import validationActions from '../actions/validation';

export class Profile {
  setAddressFieldsOnGoogleAutocomplete = (place) => {
    console.log(place.address_components);
    const residentalStreet = `${place.address_components[0].long_name}, ${place.address_components[1].long_name}, ${place.address_components[2].long_name}, ${place.address_components[3].long_name}`;
    let city = '';
    let state = '';
    let zipCode = '';

    if (typeof place.address_components[4].short_name !== 'undefined') {
      city = place.address_components[4].short_name;
    }

    if (typeof place.address_components[6] !== 'undefined') {
      state = place.address_components[6].short_name;
    }

    if (typeof place.address_components[8] !== 'undefined') {
      zipCode = place.address_components[8].short_name;
    }

    validationActions.validateProfileDetailsField('residentalStreet', residentalStreet);
    validationActions.validateProfileDetailsField('city', city);
    validationActions.validateProfileDetailsField('state', state);
    validationActions.validateProfileDetailsField('zipCode', zipCode);
  }
}

export default new Profile();
