import { observable, action, reaction } from 'mobx';
import graphql from 'mobx-apollo';
import { getBoxFileDetails } from '../queries/common';
import { GqlClient as client } from '../../../api/gqlApi';

export class CommonStore {
  @observable appName = 'NextSeed';
  @observable token = window.localStorage.getItem('jwt');
  @observable appLoaded = false;

  constructor() {
    reaction(
      () => this.token,
      (token) => {
        if (token) {
          window.localStorage.setItem('jwt', token);
        } else {
          window.localStorage.removeItem('jwt');
        }
      },
    );
  }

  getBoxFileDetails = fileId => new Promise((resolve) => {
    graphql({
      client,
      query: getBoxFileDetails,
      variables: {
        fileId,
      },
      onFetch: (data) => {
        if (data) {
          resolve(data);
        }
      },
    });
  });

  @action
  setToken(token) {
    this.token = token;
  }

  @action
  setAppLoaded() {
    this.appLoaded = true;
  }
}

export default new CommonStore();
