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
        regulation
        offering {
          id
          stage
          offeringSlug
          keyTerms {
            shorthandBusinessName
            securities
            industry
            city
            state
            maturity
            investmentMultiple
            interestRate
            regulation
            minOfferingAmount506
            maxOfferingAmount506
            minOfferingAmount506C
            maxOfferingAmount506C
            minOfferingAmountCF
            maxOfferingAmountCF
          }
          offering {
            launch {
              terminationDate
            }
          }
          closureSummary {
            processingDate
            hardCloseDate
            disbursement {
              date
            }
            keyTerms {
              maturityDate
            }
          }
        }
      }
      active {
        investedAmount
        investmentDate
        regulation
        netPaymentsReceived
        offering {
          id
          stage
          keyTerms {
            shorthandBusinessName
            securities
            industry
            city
            state
            maturity
            investmentMultiple
            interestRate
            regulation
            minOfferingAmount506
            maxOfferingAmount506
            minOfferingAmount506C
            maxOfferingAmount506C
            minOfferingAmountCF
            maxOfferingAmountCF
          }
          offering {
            launch {
              terminationDate
            }
          }
          closureSummary {
            processingDate
            hardCloseDate
            disbursement {
              date
            }
            keyTerms {
              maturityDate
            }
          }
        }
      }
      completed {
        investedAmount
        investmentDate
        regulation
        netPaymentsReceived
        offering {
          id
          stage
          keyTerms {
            shorthandBusinessName
            securities
            industry
            city
            state
            maturity
            investmentMultiple
            interestRate
            regulation
            minOfferingAmount506
            maxOfferingAmount506
            minOfferingAmount506C
            maxOfferingAmount506C
            minOfferingAmountCF
            maxOfferingAmountCF
          }
          offering {
            launch {
              terminationDate
            }
          }
          closureSummary {
            processingDate
            hardCloseDate
            disbursement {
              date
            }
            keyTerms {
              maturityDate
            }
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
  mutation cancelAgreement($agreementId: Int!, $userId: String, $voidReason: String, $voidType: AgreementVoidTypeEnum, $sendNotification: Boolean) {
    cancelAgreement(agreementId: $agreementId, userId: $userId, voidReason: $voidReason, voidType: $voidType, sendNotification: $sendNotification)
  }`;

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
  query getUserAccountSummary($userId: String) {
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
