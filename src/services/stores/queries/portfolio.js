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
        location
        investmentDate
        investedAmount
        status
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
