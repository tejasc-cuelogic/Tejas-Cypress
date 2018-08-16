import gql from 'graphql-tag';

export const allAccounts = gql`
  query allCrowdPayAccounts{
    allCrowdPayAccounts {
      id
      createdAt
      name
      email
      phoneNumber
      status
      failReason
      documents
    }
  }
`;
