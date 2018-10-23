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
      offering {
        id
        offeringStatus
        selectedOffer {
          structure
          amount
          minimumAmount
          maturity
          interestRate
          amortizationAmount
          mthRevenueSharing
          personalGuarantee
          businessBlanket
          expirationDate
          multiple
          totalCapital
          isAccepted
        }
        offeringSlug
        applicationId
        issuerId
        keyTerms {
          legalBusinessName
          shorthandBusinessName
          legalBusinessType
          maturity
          frequencyOfPayments
          securities
          securityInterest
          securitiesOwnershipPercentage
          investmentMultiple
          revSharePercentage
          interestRate
          minOfferingAmount
          maxOfferingAmount
          industry
          minInvestAmt
          maxInvestAmt
          revShareSummary
          investmentMultipleSummary
          locationRiskFactors
          isTX
          state
          city
        }
        offering {
          launch {
            targetDate
            terminationDate
            expectedOpsDate
            issuerApprovedDate
          }
        }
      }
  }
}
`;
