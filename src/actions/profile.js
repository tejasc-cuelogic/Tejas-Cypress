import profileStore from '../stores/profileStore';
import Helper from '../helper/utility';

export class Profile {
  setAddressFieldsOnGoogleAutocomplete = (place) => {
    const data = Helper.gAddressClean(place);
    profileStore.onFieldChange('verifyIdentity01', 'residentalStreet', data.residentalStreet);
    profileStore.onFieldChange('verifyIdentity01', 'city', data.city);
    profileStore.onFieldChange('verifyIdentity01', 'state', data.state);
    profileStore.onFieldChange('verifyIdentity01', 'zipCode', data.zipCode);
  }
}

export default new Profile();
