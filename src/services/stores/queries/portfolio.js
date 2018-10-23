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
        investmentDate
        status
        daysToClose
        offering {
          offeringStatus
          keyTerms {
            shorthandBusinessName
            securities
            industry
          }
        }
      }
      active {
        offeringId
        offeringName
        location
        investedAmount
        investmentDate
        status
        closeDate
        offering {
          offeringStatus
          keyTerms {
            shorthandBusinessName
            securities
            industry
          }
        }
      }
      completed {
        offeringId
        offeringName
        location
        investedAmount
        investmentDate
        status
        closeDate
        offering {
          offeringStatus
          keyTerms {
            shorthandBusinessName
            securities
            industry
          }
        }
      }
    }
  }
}
`;

export const getInvestorDetailsById = gql`
query getInvestmentDetailsOverview($userId: String!, $accountId: String!, $offeringId: String!) {
  getInvestmentDetailsOverview(
    userId: $userId,
    accountId: $accountId,
    offeringId: $offeringId,
    ) {
      totalRaisedAmount
      fundedDate
      myInvestment
      netPaymentsReceived
      netAnnualizedReturn
  }
}
`;
