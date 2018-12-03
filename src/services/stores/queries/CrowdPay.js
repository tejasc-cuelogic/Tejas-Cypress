import gql from 'graphql-tag';

export const listCrowdPayUsers = gql`
query listCrowdPayUsers($page: Int, $limit: Int!, $search: String, $accountType: InvestorAccountTypeEnum, $accountStatus: [InvestorAccountStatusEnum] $accountCreateFromDate: String, $accountCreateToDate: String) {
  listCrowdPayUsers(page: $page, limit: $limit search: $search, accountType: $accountType, accountStatus: $accountStatus,
      accountCreateFromDate: $accountCreateFromDate, accountCreateToDate: $accountCreateToDate) {
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
            id
            by
            date
          }
          updated {
            id
            by
            date
          }
          approved {
            id
            by
            date
          }
          declined {
            id
            by
            date
          }
          deleted {
            id
            by
            date
          }
          frozen {
            id
            by
            date
          }
          processing {
            gs {
              date
              by
            }
          }
      }
  }
}
`;

export const crowdPayAccountReview = gql`
mutation _crowdPayAccountReview($userId: String!, $accountId: String!, $action: ActionTypeEnum!) {
  crowdPayAccountReview(
    userId: $userId
    accountId: $accountId
    action: $action
  ) {
    status
  }
}
`;

export const crowdPayAccountProcess = gql`
mutation crowdPayAccountProcess($userId: String!, $accountId: String!) {
  crowdPayAccountProcess(
    userId: $userId
    accountId: $accountId
  )
}
`;
