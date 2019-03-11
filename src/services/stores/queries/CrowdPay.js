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

export const crowdPayAccountValidate = gql`
mutation _crowdPayAccountValidate($userId: String!, $accountId: String!) {
  crowdPayAccountValidate(
    userId: $userId
    accountId: $accountId
  )
}
`;
