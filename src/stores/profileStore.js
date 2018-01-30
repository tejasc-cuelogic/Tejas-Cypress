import { observable, action } from 'mobx';
import api from '../ns-api';
import uiStore from './uiStore';

export class ProfileStore {
  @observable profile = undefined;

  @action loadProfile(username) {
    uiStore.setProgress(true);
    api.User.get(username)
      .then(action((profile) => { this.profile = profile; }))
      .finally(action(() => { uiStore.setProgress(false); }));
  }
}

export default new ProfileStore();
