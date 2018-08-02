import gql from 'graphql-tag';

export const allAgreements = gql`
  query allAgreements {
    allAgreements{
      id
      title
      shortName
      url
    }
  }
`;
