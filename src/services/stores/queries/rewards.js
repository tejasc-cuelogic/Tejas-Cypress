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


export const getUserRewardBalance = gql`
  query _getUserRewardBalance($userId: String!, $dateFilterStart: String, $dateFilterStop: String){
    getUserRewardBalance(
      userId: $userId
      dateFilterStart: $dateFilterStart
      dateFilterStop: $dateFilterStop
    ) 
  }
`;
