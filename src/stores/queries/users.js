import gql from 'graphql-tag';

// queries, mutations and subscriptions
export const allUsersQuery = gql`
  query allUsers($first: Int!, $skip: Int!, $orderBy: UserOrderBy, $filters: UserFilter) {
    allUsers(first: $first, skip: $skip, orderBy: $orderBy, filter: $filters) {
      id
      firstName
      lastName
      email
      city
      state
      zipCode
      phoneNumber
      accountType
      accredited
      lastLogin
      createdAt
      status
    }
    _allUsersMeta(filter: $filters) {
      count
    }
  }
`;

export const userDetailsQuery = gql`
  query userDetails($id: ID) {
    User(id: $id) {
      id
      firstName
      lastName
      email
      accountType
      accredited
      lastLogin
      createdAt
    }
  }
`;

export const createUserMutation = gql`
  mutation createUser($name: String!, $email: String!, $city: String!, $state: String!, $ssn: String!, $dateOfBirth: DateTime!, ) {
    createUser(name: $name, email: $email, city: $city, state: $state, ssn: $ssn, dateOfBirth: $dateOfBirth) {
      id
      name
      email
      city
      state
      ssn
      dateOfBirth
    }
  }
`;

export const deleteUserMutation = gql`
  mutation deleteUser($id:  ID! ) {
    deleteUser(id: $id) {
      id
    }
  }
`;


export const userSubscription = gql`
  subscription {
    User(filter: { mutation_in: [CREATED, UPDATED, DELETED] }) {
      mutation
      node {
        id
        name
        email
        city
        state
        ssn
        dateOfBirth
      }
    }
  }
`;
