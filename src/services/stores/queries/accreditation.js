import gql from 'graphql-tag';

export const updateAccreditation = gql`
  mutation _updateAccreditation($id: String!, $accountId: String!, $accountType: InvestorAccountTypeEnum!, $userAccreditationDetails: UserAccreditationInput) {
  updateAccreditation (
    id: $id
    accountId: $accountId
    accountType: $accountType
    userAccreditationDetails: $userAccreditationDetails
  )
}
`;
