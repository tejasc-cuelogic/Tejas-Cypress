import gql from 'graphql-tag';

export const allOfferingsCompact = gql`
  query _getOfferings($stage: [OfferingStageEnumType], $issuerId: String){
    getOfferings(filters: { stage: $stage, issuerId: $issuerId }){
      id
      keyTerms {
        legalBusinessName
      }
      stage
      created {
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
      created {
        id
        date
      }
      updated {
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
        uploadProformas {
          fileId
          fileName
        }
      }
      media {
        heroImage {
          url
          isPublic
          fileName
        }
        tombstoneImage {
          url
          isPublic
          fileName
        }
        location {
          url
          isPublic
          fileName
        }
        gallery {
          url
          isPublic
          fileName
        }
        logo {
          url
          isPublic
          fileName
        }
        heroVideo {
          url
          isPublic
          fileName
        }
      }
      contingencies {
        launch {
          contingency
          acceptance
          accepted {
            by
            date
            comment
          }
        }
        close {
          contingency
          acceptance
          accepted {
            date
            by
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
        employer {
          name
          type
          description
          title
          dateOfService
        }
        isPublic
        firstName
        lastName
        email
        leaderBacId
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
            url
            fileName
          }
          heroImage {
            url
            fileName
          }
          license {
            url
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

export const createOffer = gql`
  mutation _createOffering($applicationId: String!){
    createOffering(applicationId: $applicationId) {
      id
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
}`;

export const getOfferingFilingList = gql`
  query _getOfferingFilingList($offeringId: ID! $orderByBusinessFilingSubmission: businessfilingsubmissionOrderBy) {
    businessFilings(offeringId: $offeringId ) {
      offeringId
      filingId
      filingFolderName
      created
      folderId
      lockedStatus
      submissions (orderBy: $orderByBusinessFilingSubmission) {
        xmlSubmissionId
        created
        xmlSubmissionDownloadUrl
        folderName
        xmlSubmissionStatus
        lockedStatus
      }
    }
  }
`;

export const generateBusinessFiling = gql`
  mutation _createBusinessFiling ($offeringId: String!) {
    createBusinessFiling(offeringId: $offeringId) {
      filingId
      offeringId
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
mutation _deleteBonusRewardTiersByOffering($offeringId: String! $bonusRewardTierId: BonusRewardTierInputType! ){
  deleteBonusRewardsByTierId(offeringId: $offeringId bonusRewardTierId: $bonusRewardTierId) {
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

export const deleteBonusReward = gql`
mutation _deleteBonusReward($id: String! $offeringId: String!){
  deleteBonusReward(id: $id offeringId: $offeringId
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
    deleted{
      id
      by
      date
    }
  }
}
`;

export const updateBonusReward = gql`
mutation _updateBonusReward($id: String! $bonusRewardDetails: BonusRewardInputType!){
  updateBonusReward(id: $id bonusRewardDetails: $bonusRewardDetails){
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

export const unlinkTiersFromBonusRewards = gql`
mutation _unlinkTiersFromBonusRewards($bonusRewardId: String! $offeringId: String! $bonusRewardTierId: BonusRewardTierInputType!){
  unlinkTiersFromBonusRewards(
    bonusRewardId: $bonusRewardId
    offeringId: $offeringId
    bonusRewardTierId: $bonusRewardTierId
  ) {
    id
    rewardsTierIds{
      amount
      earlyBirdQuantity
    }
  }
}
`;
