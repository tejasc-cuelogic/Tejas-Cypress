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
        verificationDate
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
        street
        city
        state
        zipCode
      }
      cipStatus {
        status
      }
    }
    accounts {
      userId
      accountId
      accountType
      accountDetails
      finishedDate
      status
    }
    address {
      mailing {
        street
        city
        state
        zipCode
      }
    }
    avatar {
      name
      url
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
