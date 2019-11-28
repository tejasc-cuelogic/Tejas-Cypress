import gql from 'graphql-tag';
import { ELIGIBLE_TAGS } from '../../../constants/common';

// queries, mutations and subscriptions , limit: "10"
export const allUsersQuery = gql`
  query listUsers($accountType: [UserFilterTypeEnum], $accountStatus: [UserFilterStatusEnum], $search: String, $accountCreateFromDate: String, $accountCreateToDate: String, $page: Int, $limit: Int, $sortBy: UserFilterSortByEnum, $sortType: UserFilterSortTypeEnum) {
    listUsers (accountType: $accountType, accountStatus: $accountStatus, search: $search, accountCreateFromDate: $accountCreateFromDate, accountCreateToDate: $accountCreateToDate, page: $page, limit: $limit, sortBy: $sortBy, sortType: $sortType) {
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

export const userDetailsQueryForBoxFolder = gql`
  query getUserDetails($userId: ID!) {
    user(id: $userId) {
      id
      storageDetails
    }
  }
`;

export const userDetailsQuery = gql`
  query getUserDetails($userId: ID!) {
    user(id: $userId) {
      id
      userHash
      wpUserId
      status
      accreditation {
        status
      }
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
        requestId
        failReason {
          key
          message
        }
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
          streetTwo
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
            accreditation {
              status
            }
            limits {
              income
              netWorth
              otherContributions
              limit
            }
            taxStatement {
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
              streetTwo
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
              accountType
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
          salutation
          firstLegalName
          lastLegalName
        }
        dateOfBirth
        ssn
        verificationDocs {
          addressProof {
            fileId
            fileName
          }
          idProof {
            fileId
            fileName
          }
        }
        legalAddress {
          street
          city
          state
          zipCode
          streetTwo
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

export const selectedUserDetailsQuery = gql`
  query getUserDetails($userId: ID!) {
    user(id: $userId) {
      id
      skipAddressVerifyCheck
      skipPhoneVerifyCheck
      userHash
      wpUserId
      status
      accreditation {
        status
      }
      saasquatch {
        signupCode
        userId
        referredBy
        accountId
        status
      }
      cip {
        expiration
        failType
        failReason {
          key
          message
        }
        requestId
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
          streetTwo
        }
        avatar {
          name
          url
        }
        preferred {
          name
          street
          streetTwo
          city
          state
          zipCode
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
            goldstar {
              accountNumber
              contactId
            }
            frozen {
              by
              date
              reason
              previousStatus
            }
            accreditation {
              status
            }
            limits {
              income
              netWorth
              otherContributions
              limit
            }
            taxStatement {
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
              streetTwo
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
              accountType
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
        by
        date
        comment
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
          salutation
          firstLegalName
          lastLegalName
        }
        dateOfBirth
        ssn
        verificationCompletionDate
        legalAddress {
          street
          city
          state
          zipCode
          streetTwo
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
      tags { ${ELIGIBLE_TAGS.join(' ')} }
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
                by
                date
                justification
                message
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
                  fileHandle {
                    boxFolderId
                  }
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
          justification
          message
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
            fileHandle {
              boxFolderId
            }
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

export const resetPasswordExpirationForCognitoUser = gql`
  mutation _resetPasswordExpirationDurationForCognitoUser($emailAddress: String!) {
    resetPasswordExpirationDurationForCognitoUser (emailAddress: $emailAddress)
  }
`;

export const toggleUserAccount = gql`
  mutation updateUserStatus($id: String!, $accountStatus: profileLockEnum!) {
    updateUserStatus(userId: $id, accountStatus:$accountStatus) {
      id
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

export const skipAddressOrPhoneValidationCheck = gql`
mutation skipAddressOrPhoneValidationCheck($userId: String!, $shouldSkip: Boolean!, $type : SkipValidationTypeEnum!) {
  skipAddressOrPhoneValidationCheck(
     userId: $userId
     shouldSkip: $shouldSkip
     type: $type
   )
 }`;

export const deleteProfile = gql`
mutation adminDeleteInvestorOrIssuerUser($userId: String, $reason: String) {
  adminDeleteInvestorOrIssuerUser(
     cognitoUUId: $userId
     reason: $reason
  ) {
    status
    message
  }
 }`;

export const adminHardDeleteUser = gql`
mutation adminHardDeleteUser($userId: String!, $reason: String) {
  adminHardDeleteUser(
     cognitoUUId: $userId
     reason: $reason
  ) {
    status
    message
  }
 }`;

export const frozenEmailToAdmin = gql`
mutation notifyAdminFrozenAccountActivity($userId: String!, $accountId: String!, $activity: FreezeAccountActivityEnum!, $offeringId: String!) {
  notifyAdminFrozenAccountActivity(
     userId: $userId
     accountId: $accountId
     activity: $activity
     offeringId: $offeringId
   )
 }`;

export const freezeAccount = gql`
mutation freezeAccount($userId: String!, $accountId: String!, $freeze: FreezeAccountStatus!, $reason: String) {
  freezeAccount(
     userId: $userId
     accountId: $accountId
     freeze: $freeze
     reason: $reason
   )
 }`;

export const investorAccountDeleteProcess = gql`
query investorAccountDeleteProcess {
  investorAccountDeleteProcess {
    totalBalance
    validAgreement
  }
}
`;

export const getEmailList = gql`
query _fetchEmails ($recipientId: String!, $subject: String, $fromDate: String, $toDate: String, $limit: Int, $lek: String){
  fetchEmails(
    recipientId: $recipientId
    subject: $subject
    fromDate: $fromDate
    toDate: $toDate
    limit: $limit
    lek: $lek
    )
  {
    emails{
      recipientId
      fromName
      fromEmail
      toFirstName
      toEmail
      subject
      requestDate
      emailContent
      attachments {
        content
      }
      mergeVars {
        content
        name
      }
    }
    resultCount
    totalCount
    lek
  }
}
`;
