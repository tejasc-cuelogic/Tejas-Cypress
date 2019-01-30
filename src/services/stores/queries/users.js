import gql from 'graphql-tag';

// queries, mutations and subscriptions , limit: "10"
export const allUsersQuery = gql`
  query listUsers($accountType: [UserFilterTypeEnum], $accountStatus: [UserFilterStatusEnum], $search: String, $accountCreateFromDate: String, $accountCreateToDate: String, $page: Int) {
    listUsers (accountType: $accountType, accountStatus: $accountStatus, search: $search, accountCreateFromDate: $accountCreateFromDate, accountCreateToDate: $accountCreateToDate, page: $page) {
      resultCount
      users {
        id
        email {
          address
        }
        locked {
          lock
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
            zipCode
          }
        }
        phone {
          number
        }
        roles {
          scope
          name
          
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
      status
      saasquatch {
        signupCode
        referredBy
        userId
        accountId
      }
      skipAddressVerifyCheck
      cip {
        expiration
        failType
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
        verified
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
            taxStatements {
              fileId
              fileName
              year
              formType
            }
            name
            taxId
            entityType
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
            initialDepositAmount
            linkedBank {
              bankName
              plaidAccountId
              plaidItemId
              plaidInstitutionId
              accountNumber
              routingNumber
              plaidAccessToken
              dateLinked
              pendingUpdate
              changeRequest {
                accountNumber
                bankName
                plaidAccessToken
                plaidAccountId
                plaidItemId
                plaidInstitutionId
                dateRequested
                status
              }
            }
            created {
              date
            }
            accountStatus
          }
        }
      }
      locked {
        lock
      }
      created {
        date
      }
      lastLoginDate
      phone {
        number
        type
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

export const userAccreditationQuery = gql`
  query userAccreditationQuery($userId: ID!) {
    user(id: $userId) {
      id
      roles {
        name
        scope
        status
        details {
          ... on Investor {
            accreditation {
              status
              expiration
              requestDate
              reviewed {
                id
                by
                date
                comment
              }
              update {
                id
                by
                date
              }
              method
              netWorth
              grantorName
              assetsUpload {
                type
                fileInfo {
                  fileId
                  fileName
                }
              }
              verifier {
                role
                email
              }
            }
            name
            isTrust
            accountId
            accountStatus
            }
          }
        }
      accreditation {
        status
        expiration
        requestDate
        reviewed {
          id
          by
          date
          comment
        }
        update {
          id
          by
          date
        }
        method
        netWorth
        grantorName
        assetsUpload {
          type
          fileInfo {
            fileId
            fileName
          }
        }
        verifier {
          role
          email
        }
      }
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
  mutation updateUserStatus($id: String!, $accountStatus: profileLockEnum!) {
    updateUserStatus(userId: $id, accountStatus:$accountStatus) {
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

export const skipAddressValidation = gql`
mutation skipAddressValidationCheck($userId: String!, $shouldSkip: Boolean!) {
  skipAddressValidationCheck(
     userId: $userId
     shouldSkip: $shouldSkip
   )
 }`;
