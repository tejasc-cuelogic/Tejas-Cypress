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
            id
            date
            by
            comment
          }
        }
        close {
          index
          contingency
          acceptance
          accepted {
            id
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

export const createBonusRewardTier = gql`
mutation _createBonusRewardTier{
  createBonusRewardTier(
    bonusRewardTierDetails: {
      amount:500
      earlyBirdQuantity: 0
    }
  ) {
    amount
    earlyBirdQuantity
    created{
      id
      date
      name
    }
  }
}
`;

export const getBonusRewardTiers = gql`
query _getBonusRewardTiers{
  getBonusRewardTiers {
    amount
    earlyBirdQuantity
    created{
      id
      date
      name
    }
  }
}
`;

export const getBonusRewardTierByKey = gql`
query _getBonusRewardTierByKey{
  getBonusRewardTierByKey(
    amount: 0
    earlyBirdQuantity: 0
  ) {
    amount
    earlyBirdQuantity
    created{
      id
      date
      name
    }
  }
}

`;

export const createBonusReward = gql`
mutation _createBonusReward{
  createBonusReward(
    bonusRewardDetails: {
      offeringId: "b99c9a6b-edf2-46fa-89fc-1a28032d2d99"
      title: "5 Class Series + 5 Free Shoe Rentals"
      description: "5 Class Series + 5 Free Shoe Rentals"
      rewardStatus: "In Review"
      expirationDate: "2018-10-05"
      tiers:[
        {
          amount: 500
          earlyBirdQuantity:0
        }
      ]
    }
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
      name
      date
    }
    updated{
      id
      name
      date
    }
  }
}
`;

export const updateBonusReward = gql`
mutation _updateBonusReward{
  updateBonusReward(
    id: "c6cf3540-b1b7-11e8-a3a8-cde2aa7135a5"
    bonusRewardDetails: {
      offeringId: "b99c9a6b-edf2-46fa-89fc-1a28032d2d99"
      title: "5 Class Series + 5 Free Shoe Rentals"
      description: "5 Class Series + 5 Free Shoe Rentals"
      rewardStatus: "Submitted"
      expirationDate: "2018-10-05"
      tiers:[
        {
          amount: 500
          earlyBirdQuantity:0
        }
      ]
    }
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
      name
      date
    }
    updated{
      id
      name
      date
    }
  }
}
`;

export const deleteBonusReward = gql`
mutation _deleteBonusReward{
  deleteBonusReward(
    id: "c6cf3540-b1b7-11e8-a3a8-cde2aa7135a5"
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
      name
      date
    }
    updated{
      id
      name
      date
    }
    deleted{
      id
      name
      date
    }
  }
}
`;

export const approveBonusReward = gql`
mutation _approveBonusReward{
  approveBonusReward(
    id: "c6cf3540-b1b7-11e8-a3a8-cde2aa7135a5"
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
      name
      date
    }
    updated{
      id
      name
      date
    }
    approved{
      id
      name
      date
    }
  }
}
`;

export const getBonusRewardById = gql`
query _getBonusRewardById{
  getBonusRewardById(
    id: "26a6a4e0-b1c1-11e8-a3a8-cde2aa7135a5"
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
      name
      date
    }
    updated{
      id
      name
      date
    }
    deleted{
      id
      name
      date
    }
    approved{
      id
      name
      date
    }
  }
}
`;

export const getBonusRewards = gql`
query _getBonusRewards{
  getBonusRewards(
    filters: {
      offeringId: "b99c9a6b-edf2-46fa-89fc-1a28032d2d00"
      approved: false
    }
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
      name
      date
    }
    updated{
      id
      name
      date
    }
    approved{
      id
      name
      date
    }
  }
}
`;
