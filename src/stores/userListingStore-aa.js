/* eslint-disable class-methods-use-this, object-curly-newline, max-len */
import { toJS, observable, computed, action } from 'mobx';
import graphql from 'mobx-apollo';
import { GqlClient as client } from '../services/graphql';
import { allUsersQuery, createUserMutation, deleteUserMutation, userSubscription } from './queries/users';

export class UserListingStore {
  @observable allUsers = [];
  @observable filterData = {
    filterName: '',
    filterEmail: '',
  }
  @observable sortingDirection = 'ASC';

  constructor() {
    this.allUsers = graphql({ client, query: allUsersQuery, variables: { first: 5, skip: 0 } });
    this.subscribe();
  }

  @action
  setFilterValues(field, value) {
    this.filterData[field] = value;
  }

  @action
  resetFilterValues() {
    this.filterData.filterName = '';
    this.filterData.filterEmail = '';
  }

  get allUsers() {
    return graphql({ client, query: allUsersQuery, variables: { first: 5, skip: 0 } });
  }

  setAllUsers(users) {
    this.allUsers = users;
  }

  @computed get users() {
    return (this.allUsers.data && toJS(this.allUsers.data.allUsers)) || [];
  }

  @computed get loading() {
    return this.allUsers.loading;
  }

  @computed get error() {
    return (this.allUsers.error && this.allUsers.error.message) || null;
  }

  @computed get count() {
    return this.users.length;
  }

  setSortingDirection(direction) {
    this.sortingDirection = direction;
  }

  subscribe = () => {
    const prop = 'allUsers';
    const node = 'User';
    const document = userSubscription;

    return this[prop].ref.subscribeToMore({
      document,
      updateQuery: (current, { subscriptionData }) => {
        const prev = current[prop];
        const next = subscriptionData.data[node];

        if (next.mutation === 'CREATED') {
          return { [prop]: prev.concat([next.node]) };
        }

        if (next.mutation === 'UPDATED') {
          const updated = prev.slice();
          const index = updated.findIndex(({ id }) => id === next.node.id);
          updated[index] = next.node;
          return { [prop]: updated };
        }

        return current;
      },
    });
  };

  createUser = (name, email, city, state, ssn, dateOfBirth) =>
    client
      .mutate({
        mutation: createUserMutation,
        variables: { name, email, city, state, ssn, dateOfBirth },
        refetchQueries: [{ query: allUsersQuery }],
      })
      .then(() => console.warn('Created a new user ..'))
      .catch(error => console.error(error.message));

  loadMore = () => // returns a promise
    this.allUsers.ref.fetchMore({
      variables: { skip: this.users.length },
      updateQuery: (previousResult, { fetchMoreResult }) => ({
        allUsers: [...previousResult.allUsers, ...fetchMoreResult.allUsers],
      }),
    });
  // reference: https://github.com/sonaye/mobx-apollo/issues/6#issuecomment-328302121
  deleteUser = id =>
    client
      .mutate({
        mutation: deleteUserMutation,
        variables: { id },
        refetchQueries: [{ query: allUsersQuery }],
      })
      .then(() => console.warn('Deleted user ..'))
      .catch(error => console.error(error.message));

  filterUsers = () => {
    const filteredUsers = graphql({
      client,
      query: allUsersQuery,
      variables: { first: 5, skip: 0, columnName: this.filterData.filterName, columnEmail: this.filterData.filterEmail },
    });
    this.setAllUsers(filteredUsers);
  }
  // this.allUsers.data.allUsers = data.data.allUsers
  resetUsers = () =>
    client
      .query({
        query: allUsersQuery,
        variables: { first: 5, skip: 0 },
        refetchQueries: [{ query: allUsersQuery }],
      })
      .then(data => console.log(data))
      .catch(error => console.error(error.message));

  sortUsers = (clickedColumn) => {
    let direction;
    if (this.sortingDirection === 'ASC') {
      direction = 'ASC';
      this.setSortingDirection('DESC');
    } else {
      direction = 'DESC';
      this.setSortingDirection('ASC');
    }
    const sortedUsers = graphql({ client, query: allUsersQuery, variables: { first: 5, skip: 0, orderByColumn: `${clickedColumn}_${direction}` } });
    this.setAllUsers(sortedUsers);
  }
}

export default new UserListingStore();
