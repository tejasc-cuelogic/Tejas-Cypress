import { observable, action } from 'mobx';
import agent from '../agent';

export class ProfileStore {

  @observable profile = undefined;
  @observable isLoadingProfile = false;

  @action loadProfile(username) {
    this.isLoadingProfile = true;
    agent.User.get(username)
      .then(action((profile) => { this.profile = profile; }))
      .finally(action(() => { this.isLoadingProfile = false; }))
  }
}

export default new ProfileStore();
