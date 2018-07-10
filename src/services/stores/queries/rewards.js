import gql from 'graphql-tag';

export const allRewards = gql`
  query allRewards {
    allOfferings{
      id
      name
      rewards{
        id
        name
        description
        expiry
        status
        redeemDate
      }
    }
  }
`;
