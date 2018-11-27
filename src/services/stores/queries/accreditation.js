import gql from 'graphql-tag';

export const updateAccreditation = gql`
  mutation _updateAccreditation($id: String!, $accountId: String!, $accountType: InvestorAccountTypeEnum!, $hasVerifier: Boolean, $userAccreditationDetails: UserAccreditationInput) {
  updateAccreditation (
    id: $id
    accountId: $accountId
    accountType: $accountType
    hasVerifier: $hasVerifier
    userAccreditationDetails: $userAccreditationDetails
  )
}
`;

export const approveOrDeclineForAccreditationRequest = gql`
  mutation _approveOrDeclineForAccreditationRequest($userId: String!, $accountId: String, $accountType: InvestorAccountTypeEnum, $action: AccreditationStatus!, $comment: String) {
    approveOrDeclineForAccreditationRequest (
    userId: $userId
    accountId: $accountId
    accountType: $accountType
    action: $action
    comment: $comment
  )
}
`;

export const listAccreditation = gql`
  query listAccreditation($page: Int, $search: String, $method: FilterAccreditationMethodEnum, $type: UserAccreditationMethodEnum, $accountCreateFromDate: String, $accountCreateToDate: String) {
  listAccreditation (
    page: $page
    search: $search
    method: $method
    type: $type
    accountCreateFromDate: $accountCreateFromDate
    accountCreateToDate: $accountCreateToDate
  ) {
    accreditation {
      userId
      accountId
      firstName
      lastName
      status
      accountType
      accreditationStatus
      requestDate
      method
      netWorth
      assetsUpload {
        type
        fileInfo {
          fileId
          fileName
          fileHandle {
            boxFileId
            boxFolderId
          }
        }
      }
      verifier {
        role
        email
      }
    }
    resultCount
  }
}
`;
