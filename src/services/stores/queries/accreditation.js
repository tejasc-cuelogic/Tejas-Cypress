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
    users {
      id
      info {
        firstName
        lastName
      }
      
    }
    resultCount
  }
}
`;
