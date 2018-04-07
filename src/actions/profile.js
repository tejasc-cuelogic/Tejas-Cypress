import profileStore from '../stores/profileStore';

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

    profileStore.setProfileDetails('residentalStreet', residentalStreet);
    profileStore.setProfileDetails('city', city);
    profileStore.setProfileDetails('state', state);
    profileStore.setProfileDetails('zipCode', zipCode);
  }
}

export default new Profile();
