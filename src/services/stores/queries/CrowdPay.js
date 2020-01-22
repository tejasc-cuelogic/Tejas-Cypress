import gql from 'graphql-tag';

export const adminGetCrowdPayUsers = gql`
query adminGetCrowdPayUsers($limit: Int, $page: Int, $search: String, $accountType: InvestorAccountTypeEnum, $accountStatus: [InvestorAccountStatusEnum], $accountCreateFromDate: String, $accountCreateToDate: String) {
  adminGetCrowdPayUsers(limit: $limit,page: $page, search: $search, accountType: $accountType, accountStatus: $accountStatus, accountCreateFromDate: $accountCreateFromDate, accountCreateToDate: $accountCreateToDate) {
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

export const adminCrowdPayReview = gql`
mutation adminCrowdPayReview($userId: String!, $accountId: String!, $action: ActionTypeEnum!, $comment: String!) {
  adminCrowdPayReview(
    userId: $userId
    accountId: $accountId
    action: $action
    comment: $comment
  ) {
    status
  }
}
`;

export const adminCrowdPayProcess = gql`
mutation adminCrowdPayProcess($userId: String!, $accountId: String!, $reason:String! ) {
  adminCrowdPayProcess(
    userId: $userId
    accountId: $accountId
    reason: $reason
  )
}
`;

export const adminCrowdPayValidate = gql`
mutation adminCrowdPayValidate($userId: String!, $accountId: String!, $skipCip: Boolean) {
  adminCrowdPayValidate(
    userId: $userId
    accountId: $accountId
    skipCip: $skipCip
  )
}
`;

export const adminDecrypteGoldstarAccountNumber = gql`
mutation adminDecrypteGoldstarAccountNumber($userId:String!, $accountId: String!){
  adminDecrypteGoldstarAccountNumber(userId: $userId , accountId: $accountId )
}`;

export const adminCrowdPayDecline = gql`
mutation adminCrowdPayDecline($userId:String!, $accountId: String!,$reason: String! ){
  adminCrowdPayDecline(userId: $userId , accountId: $accountId, reason: $reason ) {
    status
    errorMessage
  }
}`;
