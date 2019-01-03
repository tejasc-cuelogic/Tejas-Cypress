import gql from 'graphql-tag';

export const getInvestorAccountPortfolio = gql`
query getInvestorAccountPortfolio($userId: String!, $accountId: String!, $InFlight: Boolean, $includeInterest: Boolean) {
  getInvestorAccountPortfolio(
    userId: $userId,
    accountId: $accountId,
    includeInFlight: $InFlight,
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
          stage
          keyTerms {
            shorthandBusinessName
            securities
            industry
          }
          offering {
            launch {
              terminationDate
            }
          }
        }
      }
      active {
        investedAmount
        investmentDate
        offering {
          id
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
query getInvestmentDetails($userId: String!, $accountId: String!, $offeringId: String!) {
  getInvestmentDetails(
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

export const getMonthlyPaymentsToInvestorByOffering = gql`
query _getMonthlyPaymentsToInvestorByOffering($userId:String, $accountId:String!, $offeringId:String!) {
  getMonthlyPaymentsToInvestorByOffering (
    userId: $userId
    accountId: $accountId
    offeringId: $offeringId
  ) {
    payment
    yearMonth
    paidToDate
  }
}

`;

export const getUserAccountSummary = gql`
  query _getUserAccountSummary($userId: String!) {
    getUserAccountSummary (userId: $userId) {
      totalInvested
      pendingInvestments
      paidToDate
      tnar
      cashMovement {
        payment
        invested
        paidToDate
        yearMonth
      }
    }
  }
`;
