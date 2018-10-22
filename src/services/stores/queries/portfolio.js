import gql from 'graphql-tag';

export const getInvestorAccountPortfolio = gql`
query getInvestorAccountPortfolio($userId: String!, $accountId: String!, $InFlight: Boolean, $includeInterest: Boolean) {
  getInvestorAccountPortfolio(
    userId: $userId,
    accountId: $accountId,
    InFlight: $InFlight,
    includeInterest: $includeInterest,
  ) {
    totalBalance
    totalDeposit
    netPayments
    tnar
    investments {
      pending {
        agreementId
        offeringName
        location
        investmentType
        investedAmount
        investmentDate
        status
        daysToClose
      }
      active {
        offeringId
        offeringName
        location
        investmentType
        investedAmount
        investmentDate
        status
        closeDate
      }
      completed {
        offeringId
        offeringName
        location
        investmentType
        investedAmount
        investmentDate
        status
        closeDate
      }
    }
  }
}
`;
