import gql from 'graphql-tag';
import { ELIGIBLE_TAGS } from '../../../constants/common';

// queries, mutations and subscriptions , limit: "10"
export const adminListUsers = gql`
  query adminListUsers($accountType: [UserFilterTypeEnum], $accountStatus: [UserFilterStatusEnum], $search: String, $accountCreateFromDate: String, $accountCreateToDate: String, $page: Int, $limit: Int, $sortBy: UserFilterSortByEnum, $sortType: UserFilterSortTypeEnum) {
    adminListUsers (accountType: $accountType, accountStatus: $accountStatus, search: $search, accountCreateFromDate: $accountCreateFromDate, accountCreateToDate: $accountCreateToDate, page: $page, limit: $limit, sortBy: $sortBy, sortType: $sortType) {
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
  query getUserDetails($userId: String) {
    user(userId: $userId) {
      id
      storageDetails
    }
  }
`;

export const bankChangeRequestQuery = gql`
  query getUserDetails($userId: String) {
    user(userId: $userId) {
      id
      roles {
        name
        scope
        status
        details {
          ... on Investor {
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
          }
        }
      }
    }
  }
`;

export const userDetailsQuery = gql`
  query getUserDetails($userId: String) {
    user(userId: $userId) {
      id
      userHash
      wpUserId
      status
      accreditation {
        status
        expiration
        self {
          offering
        }
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
              expiration
            }
            goldstar {
              accountNumber              
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
  query getUserDetails($userId: String) {
    user(userId: $userId) {
      id
      skipAddressVerifyCheck
      skipPhoneVerifyCheck
      userHash
      wpUserId
      status
      accreditation {
        status
        self {
          offering
          document
          date
        }
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
  query userAccreditationQuery($userId: String) {
    user(userId: $userId) {
      id
      roles {
        name
        scope
        status
        details {
          ... on Investor {
            accreditation {
              status
              filingStatus
              estimateIncome
              previousEstimateIncome
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
        filingStatus
        estimateIncome
        previousEstimateIncome
        expiration
        requestDate
        self {
          offering
        }
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
  mutation resetPasswordExpirationDurationForCognitoUser($emailAddress: String!) {
    resetPasswordExpirationDurationForCognitoUser (emailAddress: $emailAddress)
  }
`;

export const adminUpdateUserStatus = gql`
  mutation adminUpdateUserStatus($id: String!, $accountStatus: profileLockEnum!) {
    adminUpdateUserStatus(userId: $id, accountStatus:$accountStatus) {
      id
    }
  }
`;

export const adminCreateUser = gql`
  mutation adminCreateUser($userDetails: UserInputObjectType! ){
    adminCreateUser(userDetails: $userDetails) {
        id
      }
  }
`;

export const adminSkipAddressOrPhoneValidationCheck = gql`
mutation adminSkipAddressOrPhoneValidationCheck($userId: String!, $shouldSkip: Boolean!, $type : SkipValidationTypeEnum!) {
  adminSkipAddressOrPhoneValidationCheck(
     userId: $userId
     shouldSkip: $shouldSkip
     type: $type
   )
 }`;

export const deleteProfile = gql`
mutation deleteInvestorOrIssuerUser($userId: String, $reason: String) {
  deleteInvestorOrIssuerUser(
     userId: $userId
     reason: $reason
  ) {
    status
    message
  }
 }`;

export const adminUserHardDelete = gql`
mutation adminUserHardDelete($userId: String!, $reason: String) {
  adminUserHardDelete(
     userId: $userId
     reason: $reason
  ) {
    status
    message
  }
 }`;

export const frozenAccountActivityDetected = gql`
mutation frozenAccountActivityDetected($accountId: String!, $activity: FreezeAccountActivityEnum!, $offeringId: String!) {
  frozenAccountActivityDetected(
     accountId: $accountId
     activity: $activity
     offeringId: $offeringId
   )
 }`;

export const adminFreezeAccount = gql`
mutation adminFreezeAccount($userId: String!, $accountId: String!, $freeze: FreezeAccountStatus!, $reason: String) {
  adminFreezeAccount(
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

export const adminFetchEmails = gql`
query adminFetchEmails ($recipientId: String, $emailIdentifier: String, $subject: String, $fromDate: String, $toDate: String, $limit: Int, $lek: String){
  adminFetchEmails(
    recipientId: $recipientId
    emailIdentifier: $emailIdentifier
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
      emailIdentifier
      emailContent
      attachments {
        content
        name
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

export const adminValidateCreateAdminUser = gql`
  mutation adminValidateCreateAdminUser($email: String!, $action: String){
  adminValidateCreateAdminUser(
    email: $email
    action: $action
  )
}`;

export const fetchAdminListEmailTypesAndIdentifier = gql`
  query fetchAdminListEmailTypesAndIdentifier {
  adminListEmailType
  adminListEmailPluginsByIndex {
    emailIdentifier
    config {
      note
      description
      pluginInputs{   
        label
        type
        key
        value
        rule
        defaultValue
       }
    }
  }
}
`;
