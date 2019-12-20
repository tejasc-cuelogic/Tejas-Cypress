import gql from 'graphql-tag';

export const updateAccreditation = gql`
  mutation updateAccreditation($accountId: String!, $accountType: InvestorAccountTypeEnum!, $hasVerifier: Boolean, $userAccreditationDetails: UserAccreditationInput) {
  updateAccreditation (
    accountId: $accountId
    accountType: $accountType
    hasVerifier: $hasVerifier
    userAccreditationDetails: $userAccreditationDetails
  )
}
`;

export const approveOrDeclineForAccreditationRequest = gql`
  mutation approveOrDeclineForAccreditationRequest($userId: String!, $accountId: String, $accountType: InvestorAccountTypeEnum, $action: AccreditationStatus!, $justification: String, $expiration: String!, $message: String, $adminJustificationDocs: [FileInfoInput] ) {
    approveOrDeclineForAccreditationRequest (
    userId: $userId
    accountId: $accountId
    accountType: $accountType
    action: $action
    justification: $justification
    expiration: $expiration
    message: $message
    adminJustificationDocs: $adminJustificationDocs
  )
}
`;

export const listAccreditation = gql`
  query listAccreditation(
    $page: Int, $search: String, $method: FilterAccreditationMethodEnum,
    $type: UserAccreditationMethodEnum, $accountCreateFromDate: String,
    $accountCreateToDate: String, $status: AccreditationStatus, $limit: Int,
    $sortBy: AccreditationFilterSortByEnum,
    $sortType: UserFilterSortTypeEnum) {
  listAccreditation (
    page: $page
    search: $search
    method: $method
    type: $type
    accountCreateFromDate: $accountCreateFromDate
    accountCreateToDate: $accountCreateToDate
    status: $status
    limit: $limit
    sortBy: $sortBy,
    sortType: $sortType
  ) {
    accreditation {
      userId
      accountId
      firstName
      lastName
      status
      accountType
      expiration
      accreditationStatus
      requestDate
      reviewed {
        date
      }
      promotionCredits
      method
      netWorth
      grantorName
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

export const notifyVerifierForAccreditationRequestByEmail = gql`
mutation notifyVerifierForAccreditationRequestByEmail($userId: String!, $accountId: String, $accountType: InvestorAccountTypeEnum!) {
  notifyVerifierForAccreditationRequestByEmail(
     userId: $userId
     accountId: $accountId
     accountType: $accountType
   )
 }`;
