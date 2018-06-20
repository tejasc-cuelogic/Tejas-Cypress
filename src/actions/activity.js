import ApiService from '../services/api';
import { REACT_APP_DEPLOY_ENV, REACT_APP_PROTECTION_API } from '../constants/common';

const commonParams = { env: REACT_APP_DEPLOY_ENV, url: window.location.hostname };

export class Activity {
  log = (payload) => {
    const params = { ...commonParams, ...payload, aditionalInfo: {} };
    ApiService.post(`${REACT_APP_PROTECTION_API}/log`, params)
      .then(res => console.log(res))
      .catch(err => console.log(err));
  }

  devAppLogin = (payload) => {
    const params = { url: window.location.hostname, ...payload };
    return new Promise((res, rej) => {
      ApiService.post(`${REACT_APP_PROTECTION_API}/password-protected`, params)
        .then(data => res(data))
        .catch(err => rej(err));
    });
  }
}

export default new Activity();
