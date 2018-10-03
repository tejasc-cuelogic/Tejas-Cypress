import gql from 'graphql-tag';

export const allOfferingsCompact = gql`
  query _getOfferings($stage: [OfferingStageEnumType]){
    getOfferings(filters: { stage: $stage }){
      id
      keyTerms {
        legalBusinessName
      }
      stage
      created{
        id
        date
      }
    }
  }
`;

export const allOfferings = gql`
  query _getOfferings($stage: [OfferingStageEnumType]){
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
      offeringUrl
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
        securitiesOwnershipPercentage
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
          accepted {
            comment
          }
        }
        close {
          index
          contingency
          acceptance
          accepted {
            comment
          }
        }
      }
      offering {
        overview {
          elevatorPitch
          tombstoneDescription
          highlight
          googleMeta
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
        issuerBacId
        affiliatedIssuerBacId
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
          security {
            class
            votingRights
            securitiesAuthorized
            securitiesOutstanding
            limitDiluteQualify
          }
          exemptOfferings {
            dateOfOffering
            securitiesExemption
            securitiesOffered
            amountSold
            useOfProceeds
          }
          materialIndebtedness {
            creditorName
            amountOutstanding
            interestRate
            maturityDate
            paymentSchedule
            otherTerms
          }
          affiliatedTransactions {
            name
            relationship
            amountTransaction
            description
          }
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
      leadership {
        firstName
        lastName
        email
        phone {
          number
        }
        dob
        ssn
        citizenship
        percentOwned
        companyPosition
        dateOfService
        address {
          street
          city
          state
          zip
        }
        bio
        uploads {
          headshot {
            fileId
            fileName
          }
          heroImage {
            fileId
            fileName
          }
          license {
            fileId
            fileName
          }
        }
        social {
          website
          facebook
          linkedin
          twitter
        }
        otherEntities
        promoters
      }
      closureSummary {
        disbursementDate
        disbursementAmount
        totalRepayment
        totalCommittedAmount
        totalInvestorCount
      }
      bonusRewards{
        id
        offeringId
        title
        description
        rewardStatus
        expirationDate
        tiers{
          amount
          earlyBirdQuantity
        }
        created{
          id
          by
          date
        }
        updated{
          id
          by
          date
        }
      }
  
      applicationId
      issuerId
      lead {
        id
        name
      }
      stage
      rewardsTierIds {
        amount
        earlyBirdQuantity
        created {
          id
          by
          date
        }
      }
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

export const updateOffering = gql`
mutation _updateOffering($id: String! $offeringDetails: OfferingInputType!) {
  updateOffering(id: $id offeringDetails: $offeringDetails) {
    id
  }
}
`;

export const getOfferingBac = gql`
query _getOfferingBac($offeringId: String! $bacType: OfferingBacTypeEnumType){
  getOfferingBac(
    offeringId: $offeringId
    filters: {
      bacType: $bacType
    }
  ) {
    id
    offeringId
    controlPersonQuestionnaire
    residenceTenYears
    legalName
    email
    bac1
    bac2
    bac3
    bac4
    bac5
    bac6
    bac7
    bac8
    civilLawsuit
    ofac
    onlineReputation
    judgements
    issuerDiligence
    certificateFormation
    operatingAgreement
    evidenceGoodStanding
    executiveTeam
    isControlDiligence
    isAffiliatedDiligence
    submitted{
      id
      by
      date
    }
    approved{
      id
      by
      date
      reportGeneratedDate
    }
    created{
      id
      by
      date
    }
    updated{
      id
      by
      date
    }
    deleted{
      id
      by
      date
    }
  }
}
`;

export const createBac = gql`
mutation _createBAC($offeringBacDetails: OfferingBacInputType!) {
  createOfferingBac(offeringBacDetails: $offeringBacDetails) {
    id
  }
}
`;

export const updateBac = gql`
mutation _updateBac($id: String! $offeringBacDetails: OfferingBacInputType!) {
  updateOfferingBac(id: $id offeringBacDetails: $offeringBacDetails) {
    id
  }
}
`;

export const deleteBac = gql`
mutation _deleteBac($id: String! $offeringId: String!){
  deleteOfferingBac(id: $id  offeringId: $offeringId) {
    id
  }
}
`;

export const createBonusRewardsTier = gql`
mutation _createBonusRewardTier($bonusRewardTierDetails: BonusRewardTierInputType!){
  createBonusRewardTier(bonusRewardTierDetails: $bonusRewardTierDetails) {
    amount
    earlyBirdQuantity
    created{
      id
      date
      by
    }
  }
}
`;

export const getBonusRewardsTiers = gql`
query _getBonusRewardTiers{
  getBonusRewardTiers {
    amount
    earlyBirdQuantity
    created{
      id
      date
      by
    }
  }
}
`;

export const createBonusReward = gql`
mutation _createBonusReward($bonusRewardDetails: BonusRewardInputType!){
  createBonusReward(
    bonusRewardDetails: $bonusRewardDetails
  ){
    id
    offeringId
    title
    description
    rewardStatus
    expirationDate
    tiers{
      amount
      earlyBirdQuantity
    }
    created{
      id
      by
      date
    }
    updated{
      id
      by
      date
    }
  }
}
`;

export const deleteBonusRewardsTierByOffering = gql`
mutation _deleteBonusRewardTiersByOffering{
  deleteBonusRewardsByTierId(
    offeringId: "8a65cb20-b80e-11e8-a4aa-87285e168369",
    bonusRewardTierId: {
      amount: 50,
      earlyBirdQuantity: 0
    }
  ) {
    id
    rewardsTierIds{
      amount
      earlyBirdQuantity
    }
  }
}
`;

export const getBonusRewards = gql`
query _getBonusRewards($offeringId: String!){
  getBonusRewards(offeringId: $offeringId){
    id
    offeringId
    title
    description
    rewardStatus
    expirationDate
    tiers{
      amount
      earlyBirdQuantity
    }
    created{
      id
      by
      date
    }
    updated{
      id
      by
      date
    }
  }
}
`;
