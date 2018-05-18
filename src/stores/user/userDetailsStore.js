/* eslint-disable class-methods-use-this */
import { toJS, observable, computed, action } from 'mobx';
import graphql from 'mobx-apollo';
import { GqlClient as client } from '../../services/graphql';

import { userDetailsQuery } from '../queries/users';
import { allBeneficiaries, createBeneficiaryMutation } from '../queries/beneficiaries';
import Helper from '../../helper/utility';

export class UserDetailsStore {
  @observable currentUser = {};
  @observable beneficiariesData = [];
  @observable editCard = 0;

  @computed get userDetails() {
    const details = (this.currentUser.data && toJS(this.currentUser.data.user)) || {};
    return details;
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

  @action
  getBeneficiaries = () => {
    this.beneficiariesData = graphql({
      client,
      query: allBeneficiaries,
    });
  }

  @computed get beneficiaries() {
    return (this.beneficiariesData.data
      && this.beneficiariesData.data.beneficiaries
      && toJS(this.beneficiariesData.data.beneficiaries.beneficiaries)
    ) || [];
  }

  @computed get bErr() {
    return (this.beneficiariesData.error && this.beneficiariesData.error.message) || null;
  }

  @computed get bLoading() {
    return this.beneficiariesData.loading;
  }

  @action
  createBeneficiary = (name, email, city, state, ssn, dateOfBirth) =>
    client
      .mutate({
        mutation: createBeneficiaryMutation,
        variables: {
          name, email, city, state, ssn, dateOfBirth,
        },
      })
      .then(() => console.warn('Created a new user ..'))
      .catch(error => console.error(error.message));
}

export default new UserDetailsStore();
