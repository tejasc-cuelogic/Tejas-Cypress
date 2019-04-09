import gql from 'graphql-tag';

export const updateInvestmentLimits = gql`
  mutation _updateInvestmentLimits($userId: String, $accountId: String!, $annualIncome: Float, $netWorth: Float, $otherRegCfInvestments: Float){
    updateInvestmentLimits(
      userId: $userId
      accountId: $accountId
      annualIncome: $annualIncome
      netWorth: $netWorth
      otherRegCfInvestments: $otherRegCfInvestments
    )
    {
      investmentLimit
    }
  }
`;

export const getInvestorInvestmentLimit = gql`
  query getInvestorInvestmentLimit($userId: String!, $accountId: String!) {
    getInvestorInvestmentLimit(userId: $userId, accountId: $accountId)
  }
`;

export const getInvestorAmountInvested = gql`
  query getInvestorAmountInvested($userId: String, $accountId: String, $dateFilterStart: String, $dateFilterStop: String) {
    getInvestorAmountInvested(
      userId: $userId
      accountId: $accountId
      dateFilterStart: $dateFilterStart
      dateFilterStop: $dateFilterStop
    )
  }
`;

export const getInvestNowHealthCheck = gql`
  query investNowHealthCheck($userId: String!, $accountId: String!, $offeringId: String!) {
    investNowHealthCheck(userId: $userId, accountId: $accountId, offeringId: $offeringId)
    {
      investmentLimit
      availableCash
      rewardBalance
      previousAmountInvested
      bankNameAndAccountNumber
      availabilityForNPAInOffering
      previousInvestmentCredit
      currentInflightLimit
    }
  }
`;
