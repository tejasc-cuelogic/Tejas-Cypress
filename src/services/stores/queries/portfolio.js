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
        investmentDate
        investedAmount
        offering {
          id
          offeringStatus
          stage
          keyTerms {
            shorthandBusinessName
            securities
            industry
            terminationDate
          }
        }
      }
      active {
        investedAmount
        investmentDate
        offering {
          id
          offeringStatus
          stage
          keyTerms {
            shorthandBusinessName
            securities
            industry
          }
          closureSummary {
            disbursementDate
          }
        }
      }
      completed {
        investedAmount
        investmentDate
        offering {
          id
          offeringStatus
          stage
          keyTerms {
            shorthandBusinessName
            securities
            industry
          }
          closureSummary {
            disbursementDate
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

export const cancelAgreement = gql`
  mutation cancelAgreement($agreementId: Int!) {
    cancelAgreement(agreementId: $agreementId)
  }`;
export const withdrawFunds = gql`
  mutation withdrawFunds($amount:  Float!, $accountId: String! ) {
    withdrawFunds(amount: $amount, accountId: $accountId)
  }`;
export const addFunds = gql`
  mutation addFunds($amount:  Float!, $accountId: String! ) {
    addFunds(amount: $amount, accountId: $accountId)
  }
`;
