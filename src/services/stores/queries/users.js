import gql from 'graphql-tag';

// queries, mutations and subscriptions , limit: "10"
export const allUsersQuery = gql`
  query listUsers($accountType: [String], $accountStatus: [String], $search: String, $accountCreateFromDate: String, $accountCreateToDate: String, $page: Int) {
    listUsers (accountType: $accountType, accountStatus: $accountStatus, search: $search, accountCreateFromDate: $accountCreateFromDate, accountCreateToDate: $accountCreateToDate, page: $page) {
      resultCount
      users {
        id
        email {
          address
        }
        info {
          firstName
          lastName
          avatar {
            url
            name
          }
          mailingAddress {
            city
          }
        }
        phone {
          number
        }
        roles {
          scope
        }
        lastLoginDate
        created {
          date
        }
      }
    }
  }
`;

export const userDetailsQuery = gql`
  query getUserDetails($userId: ID!) {
    user(id: $userId) {
      id
      cip {
        expiration
      }
      limits {
        income
        netWorth
        otherContributions
        limit
      }
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
      capabilities
      roles {
        name
        scope
        status
        details {
          ... on Investor {
            limits {
              income
              netWorth
              otherContributions
              limit
            }
            name
            taxId
            address {
              street
              city
              state
              zipCode
            }
            isTrust
            trustDate
            legalInfo {
              legalFirstName
              legalLastName
              title
              legalDocUrl {
                fileId
                fileName
                fileHandle
              }
            }
            accountId
            iraAccountType
            fundingType
            identityDoc {
              fileId
              fileName
              fileHandle
            }
            legalDocs {
              formationDoc {
                fileId
                fileName
                fileHandle
              }
              operatingAgreementDoc {
                fileId
                fileName
                fileHandle
              }
              einVerificationDoc {
                fileId
                fileName
                fileHandle
              }
            }
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
            created {
              date
            }
            status
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
        employment {
          status
          employer
          position
        }
        brokerageFirmName
        publicCompanyTicker
        taxFilingAs
        netWorth
        annualIncome {
          year
          income
        }
        experienceLevel
        isRiskTaker
        isComfortable
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

export const adminAddUser = gql`
  mutation _createUser($userDetails: UserInputObjectType! ){
    createUser(userDetails: $userDetails) {
        id
      }
  }
`;
