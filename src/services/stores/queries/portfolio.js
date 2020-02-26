import gql from 'graphql-tag';

export const getInvestorAccountPortfolio = gql`
query getInvestorAccountPortfolio($userId: String, $accountId: String!, $InFlight: Boolean, $includeInterest: Boolean) {
  getInvestorAccountPortfolio(
    userId: $userId,
    accountId: $accountId,
    includeInFlight: $InFlight,
    includeInterest: $includeInterest,
  ) {
    totalAccountValue
    outstandingPortfolioValue
    pendingInvestments
    availableCash
    rewardsBalance
    totalDeposit
    lifetimePaymentsReceived
    lifetimeInvestments
    cashInvestments
    reinvestedEarnings
    creditsApplied
    tnar
    realizedRoiOnLifetimeInvestments
    realizedRoiOnCashInvestments
    investments {
      pending {
        tranche
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
            equityClass
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
        remainingPrincipal
        remainingPayment
        realizedMultiple
        offering {
          id
          stage
          offeringSlug
          keyTerms {
            shorthandBusinessName
            securities
            equityClass
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
              multiple
            }
          }
        }
      }
      completed {
        investedAmount
        investmentDate
        regulation
        netPaymentsReceived
        realizedMultiple
        offering {
          id
          stage
          offeringSlug
          keyTerms {
            shorthandBusinessName
            securities
            equityClass
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
              multiple
              maturityDate
            }
          }
        }
      }
    }
  }
}
`;

export const getInvestmentDetails = gql`
query getInvestmentDetails($userId: String, $accountId: String!, $offeringId: String!) {
  getInvestmentDetails(
    userId: $userId,
    accountId: $accountId,
    offeringId: $offeringId,
    ) {
      totalRaisedAmount
      remainingPayment
      remainingPrincipal
      fundedDate
      myInvestment
      netPaymentsReceived
      netAnnualizedReturn
  }
}
`;

export const investNowCancelAgreement = gql`
  mutation investNowCancelAgreement($agreementId: Int!, $userId: String, $voidReason: String, $voidType: AgreementVoidTypeEnum, $sendNotification: Boolean) {
    investNowCancelAgreement(agreementId: $agreementId, userId: $userId, voidReason: $voidReason, voidType: $voidType, sendNotification: $sendNotification)
  }`;

export const getMonthlyPaymentsToInvestorByOffering = gql`
query getMonthlyPaymentsToInvestorByOffering($userId:String, $accountId:String!, $offeringId:String!) {
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
