import gql from 'graphql-tag';

// queries, mutations and subscriptions , limit: "10"
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
        avatar {
          name
          url
        }
        accountStatus
      }
      
    }
  }
`;

export const userDetailsQuery = gql`
  query getUserDetails($userId: ID!) {
    user(id: $userId) {
      id
      info {
        firstName
        lastName
        mailingAddress {
          street
          city
          state
          zipCode
        }
        avatar {
          name
          url
        }
      }
      email {
        address
      }
      roles {
        name
        scope
        status
        details {
          ... on Investor {
            accountId
            annualIncome
            netWorth
            netAssets
            cfInvestment {
              dateOfInvestment
              amount
            }
            linkedBank {
              bankName
              plaidAccountId
              plaidItemId
              accountNumber
              routingNumber
              plaidAccessToken
            }
          }
        }
      }
      locked {
        lock
      }
      accreditation {
        status
      }
      created {
        date
      }
      lastLoginDate
      phone {
        number
        verified
      }
      legalDetails {
        legalName {
          firstLegalName
          lastLegalName
        }
        dateOfBirth
        ssn
        legalAddress {
          street
          city
          state
          zipCode
        }
        status
      }
      investorProfileData {
        isPartialProfile
        employmentStatusInfo {
          employmentStatus
          employer
          currentPosition
        }
        investorProfileType
        financialInfo {
          netWorth
          annualIncomeThirdLastYear
          annualIncomeLastYear
          annualIncomeCurrentYear
          directorShareHolderOfCompany
          employedOrAssoWithFINRAFirmName
        }
        investmentExperienceInfo {
          investmentExperienceLevel
          readyInvestingInLimitedLiquiditySecurities
          readyForRisksInvolved
        }
      }
      mfaMode
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

export const toggleUserAccount = gql`
  mutation updateUserStatus($id: String!, $status: profileEnum!) {
    updateUserStatus(userId: $id, accountStatus:$status) {
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
