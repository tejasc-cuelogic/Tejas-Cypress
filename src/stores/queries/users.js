import gql from 'graphql-tag';

// queries, mutations and subscriptions
export const allUsersQuery = gql`
  query getUsers($search: String, $orderBy: userOrderBy, $filters: [UserFilter]) {
    users(search: $search, orderBy: $orderBy, filters: $filters) {
      resultCount
      totalCount
      lek {
        id
      }
      users {
        id
        firstName
        lastName
        email
        accountType
        accreditation
        createdDate
        lastLoginDate
        contactDetails {
          phone {
            number
          }
        }
        legalDetails {
          legalAddress {
            city
            state
            zipCode
          }
        }
        accountStatus
      }
      
    }
  }
`;

export const userDetailsQuery = gql`
query getUserDetails($id: ID!) {
  user(id: $id) {
    id
    firstName
    lastName
    email
    accountType
    accountStatus
    accreditation
    createdDate
    lastLoginDate
    contactDetails {
      phone {
        number
      }
    }
    legalDetails {
      legalName {
        firstLegalName
        lastLegalName
      }
      dateOfBirth
      ssn
      legalAddress {
        street1
        street2
        city
        state
        zipCode
      }
    }
    accounts {
      userId
      accountId
      accountType
      finishedDate
      status
    }
    accountStatus 
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
