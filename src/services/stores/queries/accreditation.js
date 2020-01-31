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

export const adminAccreditedStatusApproveDeclineRequest = gql`
  mutation adminAccreditedStatusApproveDeclineRequest($userId: String!, $accountId: String, $accountType: InvestorAccountTypeEnum, $action: AccreditationStatus!, $justification: String, $expiration: String!, $message: String, $adminJustificationDocs: [FileInfoInput] ) {
    adminAccreditedStatusApproveDeclineRequest (
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

export const adminListAccreditation = gql`
  query adminListAccreditation(
    $page: Int, $search: String, $method: FilterAccreditationMethodEnum,
    $type: UserAccreditationMethodEnum, $accountCreateFromDate: String,
    $accountCreateToDate: String, $status: AccreditationStatus, $limit: Int,
    $sortBy: AccreditationFilterSortByEnum,
    $sortType: UserFilterSortTypeEnum) {
  adminListAccreditation (
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

export const adminAccreditedStatusNotifyVerify = gql`
mutation adminAccreditedStatusNotifyVerify($userId: String!, $accountId: String, $accountType: InvestorAccountTypeEnum!) {
  adminAccreditedStatusNotifyVerify(
     userId: $userId
     accountId: $accountId
     accountType: $accountType
   )
 }`;

export const investorSelfVerifyAccreditedStatus = gql`
mutation investorSelfVerifyAccreditedStatus($offeringId: String!, $documentId: String!) {
  investorSelfVerifyAccreditedStatus(
      offeringId: $offeringId
      documentId: $documentId
   )
 }`;
