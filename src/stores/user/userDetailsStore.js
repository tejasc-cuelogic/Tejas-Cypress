/* eslint-disable class-methods-use-this */
import { toJS, observable, computed, action } from 'mobx';
import graphql from 'mobx-apollo';
import { GqlClient as client } from '../../services/GqlClient2';
import { userDetailsQuery } from '../queries/users';
import { RANDOM_USER } from '../../constants/user';
import Helper from '../../helper/utility';

export class UserDetailsStore {
  @observable currentUser = {};
  @observable userDetail = RANDOM_USER();
  @observable editCard = 0;

  @computed get userDetails() {
    return (this.currentUser.data && toJS(this.currentUser.data.User)) || {};
  }

  @action
  setEditCard = (cardIndex) => {
    this.editCard = cardIndex || 0;
  }

  @action
  save = () => {
    this.editCard = 0;
    Helper.toast('User details updated sucessfully', 'success');
  }

  @action
  getUser = (id) => {
    this.currentUser = graphql({
      client,
      query: userDetailsQuery,
      variables: {
        id,
      },
    });
  }
}

export default new UserDetailsStore();
