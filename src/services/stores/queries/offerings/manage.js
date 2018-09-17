import gql from 'graphql-tag';

export const allOfferings = gql`
  query _getOfferings($stage: OfferingStageEnumType){
    getOfferings(filters: { stage: $stage }){
      id
      keyTerms {
        legalBusinessName
      }
      offering {
        launch {
          targetDate
        }
      }
      applicationId
      issuerId
      lead {
        id
        name
      }
      stage
      created{
        id
        date
      }
      updated{
        id
        date
      }
    }
  }
`;

export const deleteOffering = gql`
  mutation deleteOffering($id: String!) {
    deleteOffering(id: $id) {
      id
    }
  }
`;

export const getOfferingDetails = gql`
  query _getOfferingById($id: String!) {
    getOfferingById(id: $id) {
      id
      referralCode
      keyTerms {
        legalBusinessName
        shorthandBusinessName
        industry
        maturity
        frequencyOfPayments
        terminationDate
        securities
        securityInterest
        investmentMultiple
        revSharePercentage
        interestRate
        minOfferingAmount
        maxOfferingAmount
        legalBusinessType
        nsMinFees
        nsMaxFees
        gsFees
        stateOfFormation
        city
        state
        minInvestAmt
        maxInvestAmt
        stockType
        offeringExpTarget
        offeringExpMax
        revShareSummary
        nsFeeCalcDescription
        isNewBusiness
        isHealthcare
        isFood
        isAlcohol
      }
      contingencies {
        launch {
          index
          contingency
          acceptance
        }
        close {
          index
          contingency
          acceptance
        }
      }
      offering {
        overview {
          elevatorPitch
          tombstoneDescription
          highlight
          social {
            type
            url
            shareLink
            blurb
          }
          issuerWebsite
        }
        about {
          theCompany
          history {
            date
            description
          }
          businessModel
          locationAnalysis
        }
        launch {
          targetDate
          terminationDate
          expectedOpsDate
          issuerApprovedDate
          escrowKey
          escrowNumber
          edgarLink
          
        }
      }
      legal {
        general {
          websiteUrl
          monthLaunch
          offeringDeadline
          employmentIdNumber
          numOfEmployees
          businessStreet
          businessCity
          businessState
          businessZip
          businessPhone {
            countryCode
            number
          }
          bankName
          bankRoutingNumber
          accountNumber
          businessCapitalization
          useOfProceeds {
            reachedMinOfferingGoal
            reachedMaxOfferingGoal
          }
          rightsOfEqShareHolders
        }
        riskFactors {
          businessRisk
          financingRisk
          developmentRisk
          reputationalRisk
          competitionRisk
          marketRisk
          terrorismRisk
          managementRisk
          personnelRisk
          laborSupplyRisk
          privacyRisk
          otherRisk
        }
      }
      closureSummary {
        disbursementDate
        disbursementAmount
        totalRepayment
        totalCommittedAmount
        totalInvestorCount
      }
      applicationId
      issuerId
      lead {
        id
        name
      }
      stage
      rewardsTierIds
      created{
        id
        date
      }
      updated{
        id
        date
      }
      deleted{
        id
        date
      }
    }
  }
`;
