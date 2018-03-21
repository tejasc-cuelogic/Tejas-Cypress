import { observable, action, computed, toJS } from 'mobx';

import graphql from 'mobx-apollo';
import { GqlClient as client } from '../api/GqlClient';
import { allUsersQuery, createUserMutation, deleteUserMutation, userSubscription } from './Queries/Users';

export class UserStore {
  @observable usersData = [];

  constructor() {
    this.usersData = graphql({ client, query: allUsersQuery, variables: { first: 10, skip: 0 } });
  }

  @computed get allUsers() {
    return this.usersData;
  }

  @computed get users() {
    return (this.allUsers.data && toJS(this.allUsers.data.allUsers)) || [];
  }

  @computed get error() {
    return (this.allUsers.error && this.allUsers.error.message) || null;
  }

  @computed get loading() {
    return this.allUsers.loading;
  }

  @computed get count() {
    return this.users.length;
  }

  @action
  createUser = (name, email, city, state, ssn, dateOfBirth) =>
    client
      .mutate({
        mutation: createUserMutation,
        variables: { name, email, city, state, ssn, dateOfBirth }
      })
      .then(() => console.warn('Created a new user ..'))
      .catch(error => console.error(error.message));

  loadMore = () => // returns a promise
  this.allUsers.ref.fetchMore({
    variables: { skip: this.users.length },
    updateQuery: (previousResult, { fetchMoreResult }) => ({
      allUsers: [...previousResult.allUsers, ...fetchMoreResult.allUsers]
    })
  }); 
  // reference: https://github.com/sonaye/mobx-apollo/issues/6#issuecomment-328302121

  @action
  subscribe = () => {
    const prop = 'allUsers';
    const node = 'User';
    const document = userSubscription;
    return this[prop].ref.subscribeToMore({
      document,
      updateQuery: (current, { subscriptionData }) => {

        const prev = current[prop];
        const next = subscriptionData.data[node];
        if (next.mutation === 'CREATED')
          return { [prop]: prev.concat([next.node]) };

        if (next.mutation === 'UPDATED') {
          const updated = prev.slice();
          const index = updated.findIndex(({ id }) => id === next.node.id);
          updated[index] = next.node;
          return { [prop]: updated };
        }

        return current;
      }
    });
  };

  @action
  deleteUser = (id) =>
    client
      .mutate({
        mutation: deleteUserMutation,
        variables: { id },
        refetchQueries: [{ query: allUsersQuery, variables: { first: 10, skip: 0 }  }]
      })
      .then(() => console.warn('Deleted user ..'))
      .catch(error => console.error(error.message));
}

export default new UserStore;
