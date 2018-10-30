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
      offeringSlug
      referralCode
      keyTerms {
        legalBusinessName
        shorthandBusinessName
        industry
        maturity
        regulation
        frequencyOfPayments
        securities
        securityInterest
        securitiesOwnershipPercentage
        locationRiskFactors
        investmentMultiple
        revSharePercentage
        interestRate
        minOfferingAmount
        maxOfferingAmount
        legalBusinessType
        nsMinFees
        nsMaxFees
        stateOfFormation
        city
        state
        minInvestAmt
        maxInvestAmt
        investmentMultipleSummary
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
          fileHandle {
            id
            boxFileId
            fileExtension
            fileStatus
            fileType
            stepName
            userId
            created {
              id
              by
              date
            }
            updated {
              id
              by
              date
            }
            deleted {
              id
              by
              date
            }
          }
        }
      }
      media {
        heroImage {
          id
          url
          isPublic
          fileName
        }
        tombstoneImage {
          id
          url
          isPublic
          fileName
        }
        locationHeroImage {
          id
          url
          isPublic
          fileName
        }
        location {
          id
          url
          isPublic
          fileName
        }
        gallery {
          id
          url
          isPublic
          fileName
        }
        logo {
          id
          url
          isPublic
          fileName
        }
        heroVideo {
          id
          url
          isPublic
          fileName
        }
        issuerSubmitted
          submitted {
            id
            by
            date
          }
          approved {
            id
            by
            date
            status
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
          issuerSubmitted
          submitted {
            id
            by
            date
          }
          approved {
            id
            by
            date
            status
          }
        }
        about {
          theCompany
          history {
            date
            description
          }
          businessModel
          locationAnalysis
          issuerSubmitted
          submitted {
            id
            by
            date
          }
          approved {
            id
            by
            date
            status
          }
        }
        misc {
          additionalBonusRewardsContent
          submitted {
            id
            by
            date
          }
          approved {
            id
            by
            date
            status
          }
        }
        launch {
          targetDate
          terminationDate
          expectedOpsDate
          issuerApprovedDate
          escrowKey
          escrowNumber
          edgarLink
          submitted {
            id
            by
            date
          }
          approved {
            id
            by
            date
            status
          }
          gsFees
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
          issuerSubmitted
          submitted {
            id
            by
            date
          }
          approved {
            id
            by
            date
            status
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
          issuerSubmitted
          submitted {
            id
            by
            date
          }
          approved {
            id
            by
            date
            status
          }
        }
        documentation {
          issuer {
            formID {
              fileId
              fileName
              fileHandle {
                id
              }
            }
            corpFormation {
              fileId
              fileName
              fileHandle {
                id
              }
            }
            issuerFinancials {
              fileId
              fileName
              fileHandle {
                id
              }
            }
            leaseAgreement {
              fileId
              fileName
              fileHandle {
                id
              }
            }
            issuerSubmitted
            submitted {
              id
              by
              date
            }
            approved {
              id
              by
              date
              status
            }
          }
          admin {
            escrow {
              fileId
              fileName
              fileHandle {
                id
              }
            }
            resolutionOfBorrowing {
              fileId
              fileName
              fileHandle {
                id
              }
            }
            formC {
              fileId
              fileName
              fileHandle {
                id
              }
            }
            npa {
              fileId
              fileName
              fileHandle {
                id
              }
            }
            disclosure {
              fileId
              fileName
              fileHandle {
                id
              }
            }
            securityAgreement {
              fileId
              fileName
              fileHandle {
                id
              }
            }
            personalGuarantee {
              fileId
              fileName
              fileHandle {
                id
              }
            }
            edgar
            submitted {
              id
              by
              date
            }
            approved {
              id
              by
              date
              status
            }
          }
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
          countryCode
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
            id
            url
            fileName
            isPublic
          }
          heroImage {
            id
            url
            fileName
            isPublic
          }
          license {
            id
            url
            fileName
            isPublic
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
        issuerSubmitted
        submitted {
          id
          by
          date
        }
        approved {
          id
          by
          date
          status
        }
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
        tiers {
          amount
          earlyBirdQuantity
          created {
            id
            by
            date
          }
        }
        created {
          id
          by
          date
        }
        updated {
          id
          by
          date
        }
        deleted {
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

export const updateOffering = gql`
mutation _updateOffering($id: String! $offeringDetails: OfferingInputType!) {
  updateOffering(id: $id offeringDetails: $offeringDetails) {
    id
  }
}
`;

export const upsertOffering = gql`
mutation upsertOffering($id: String, $offeringDetails: OfferingInputType!) {
  upsertOffering(id: $id, offeringDetails: $offeringDetails) {
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
      status
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
