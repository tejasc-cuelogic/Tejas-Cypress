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
          id
          offeringStatus
          keyTerms {
            shorthandBusinessName
            securities
            industry
            terminationDate
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
          id
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
          id
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
  }`;
