import gql from 'graphql-tag';

export const listCrowdPayUsers = gql`
query listCrowdPayUsers($limit: Int) {
  listCrowdPayUsers(limit: $limit) {
        resultCount
        crowdPayList {
          userId
          accountId
          firstName
          lastName
          email
          accountStatus
          accountType
          phone
          status
          cip {
            failType
            failReason {
              key
              message
            }
          }
          legalDetails {
            verificationStartDate
            verificationDocs {
              idProof {
                fileName
                fileHandle {
                  boxFolderId
                  boxFileId
                }
              }
              addressProof {
                 fileName
                fileHandle {
                  boxFolderId
                  boxFileId
                }
              }
            }
          }
          created {
            by
            date
          }
          updated {
            by
            date
          }
          approved {
            by
            date
          }
          declined {
            by
            date
          }
          deleted {
            by
            date
          }
          storageDetails
          frozen {
            by
            date
          }
          processing {
            gs {
              date
              by
            }
          }
          investorProfileData {
            brokerageFirmName
            publicCompanyTicker
          }
      }
  }
}
`;

export const getCrowdPayUsers = gql`
query getCrowdPayUsers($limit: Int, $page: Int, $search: String, $accountType: InvestorAccountTypeEnum, $accountStatus: [InvestorAccountStatusEnum], $accountCreateFromDate: String, $accountCreateToDate: String) {
  getCrowdPayUsers(limit: $limit,page: $page, search: $search, accountType: $accountType, accountStatus: $accountStatus, accountCreateFromDate: $accountCreateFromDate, accountCreateToDate: $accountCreateToDate) {
        resultCount
        crowdPayList {
          userId
          accountId
          firstName
          lastName
          email
          accountStatus
          accountType
          phone
          status
          cip {
            failType
            failReason {
              key
              message
            }
            expiration
          }
          legalDetails {
            verificationStartDate
            verificationDocs {
              idProof {
                fileName
                fileHandle {
                  boxFolderId
                  boxFileId
                }
              }
              addressProof {
                fileName
                fileHandle {
                  boxFolderId
                  boxFileId
                }
              }
            }
          }
          created {
            by
            date
          }
          updated {
            by
            date
          }
          approved {
            by
            date
          }
          declined {
            by
            date
          }
          deleted {
            by
            date
          }
          storageDetails
          frozen {
            by
            date
          }
          processing {
            gs {
              id
              date
              by
            }
          }
          investorProfileData {
            brokerageFirmName
            publicCompanyTicker
          }
      }
  }
}
`;

export const crowdPayAccountReview = gql`
mutation _crowdPayAccountReview($userId: String!, $accountId: String!, $action: ActionTypeEnum!, $comment: String!) {
  crowdPayAccountReview(
    userId: $userId
    accountId: $accountId
    action: $action
    comment: $comment
  ) {
    status
  }
}
`;

export const crowdPayAccountProcess = gql`
mutation crowdPayAccountProcess($userId: String!, $accountId: String!, $reason:String! ) {
  crowdPayAccountProcess(
    userId: $userId
    accountId: $accountId
    reason: $reason
  )
}
`;

export const crowdPayAccountValidate = gql`
mutation _crowdPayAccountValidate($userId: String!, $accountId: String!) {
  crowdPayAccountValidate(
    userId: $userId
    accountId: $accountId
  )
}
`;

export const createIndividualAccount = gql`
mutation _submitInvestorAccount($userId: String,$accountId: String!, $accountType: InvestorAccountTypeEnum!){
  submitInvestorAccount(
    userId: $userId,
    accountId: $accountId,
    accountType: $accountType
  )
}`;

export const getDecryptedGoldstarAccountNumber = gql`
mutation _getDecryptedGoldstarAccountNumber($userId:String!, $accountId: String!){
  getDecryptedGoldstarAccountNumber(userId: $userId , accountId: $accountId )
}`;

export const crowdPayAccountDecline = gql`
mutation crowdPayAccountDecline($userId:String!, $accountId: String!,$reason: String! ){
  crowdPayAccountDecline(userId: $userId , accountId: $accountId, reason: $reason ) {
    status
    errorMessage
  }
}`;
