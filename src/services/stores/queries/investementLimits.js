import gql from 'graphql-tag';

export const updateInvestmentLimits = gql`
  mutation updateInvestmentLimits($accountId: String!, $annualIncome: Float, $netWorth: Float, $otherRegCfInvestments: Float){
    updateInvestmentLimits(
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
  query getInvestorInvestmentLimit($accountId: String!) {
    getInvestorInvestmentLimit(accountId: $accountId)
  }
`;

export const getInvestorTotalAmountInvested = gql`
  query getInvestorTotalAmountInvested($userId: String, $accountId: String, $dateFilterStart: String, $dateFilterStop: String, $closeDateFilter: String, $includeTx: Boolean) {
    getInvestorTotalAmountInvested(
      userId: $userId
      accountId: $accountId
      dateFilterStart: $dateFilterStart
      dateFilterStop: $dateFilterStop
      closeDateFilter: $closeDateFilter
      includeTx: $includeTx
    )
  }
`;

export const getInvestNowHealthCheck = gql`
  query investNowHealthCheck($accountId: String!, $offeringId: String!) {
    investNowHealthCheck(accountId: $accountId, offeringId: $offeringId)
    {
      investmentLimit
      availableCash
      rewardBalance
      previousAmountInvested
      bankNameAndAccountNumber
      availabilityForNPAInOffering
      previousInvestmentCredit
      currentInflightLimit
      investorTotalAmountInvested
    }
  }
`;
