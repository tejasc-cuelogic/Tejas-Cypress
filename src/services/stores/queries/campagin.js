import gql from 'graphql-tag';

export const allOfferings = gql`
query getOfferingList($filters: OfferingFilterInputType){
    getOfferingList(filters: $filters) {
      id
      offeringSlug
      stage
      media {
        tombstoneImage {
          id
          url
          isPublic
          fileName
        }
      }

      offering {
        about {
          theCompany
        }
        overview {
          tombstoneDescription
        }
      }
      closureSummary {
        processingDate
        hardCloseDate
        totalInvestmentAmount
        totalInvestorCount
      }
      keyTerms {
        regulation
        offeringDisclaimer
        shorthandBusinessName
        legalBusinessName
        securities
        industry
        state
        city
      }
      regulation
    }
  }
`;

export const checkIfEarlyBirdExist = gql`
query checkEarlyBirdByInvestorAccountAndOfferingId($offeringId: String!, $accountId: String!) {
  checkEarlyBirdByInvestorAccountAndOfferingId(offeringId: $offeringId, accountId: $accountId)
}`;

export const getOfferingsReferral = gql`
query getOfferingList($filters: OfferingFilterInputType){
    getOfferingList(filters: $filters) {
      id
      offeringSlug
      referralCode
    }
  }
`;

export const getOfferingById = gql`
  query getOfferingDetailsBySlug($id: String) {
    getOfferingDetailsBySlug (offeringSlug: $id) {
      issuerId
      previewPassword
    }
  }
`;

export const campaignDetailsQuery = gql`
  query getOfferingDetailsBySlug($id: String) {
    getOfferingDetailsBySlug (offeringSlug: $id) {
    id
    stage
    offeringSlug
    issuerId
    regulation
    created {
      id
    }
    keyTerms {
      unitPrice
      roundType
      premoneyValuation
      additionalKeyterms {
        label
        description
      }
      regulation
      startupPeriod
      offeringDisclaimer
      legalBusinessName
      shorthandBusinessName
      maturity
      frequencyOfPayments
      securities
      securityInterest
      securitiesOwnershipPercentage
      investmentMultiple
      revSharePercentage
      revSharePercentageDescription
      interestRate
      minOfferingAmountCF
      maxOfferingAmountCF
      minOfferingAmount506C
      maxOfferingAmount506C
      minInvestAmt
      revShareSummary
      investmentMultipleSummary
      state
      city
    }
    bonusRewards{
      id
      title
      description
      earlyBirdQuantity
      tiers
    }
    rewardsTiers
    earlyBird {
      quantity
      amount
      available
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
          featuredImageUpload {
            url
          }
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
      }
      launch {
        edgarLink
      }
      misc {
        additionalBonusRewardsContent
      }
    }
    leadership {
      firstName
      lastName
      companyPosition
      isPublic
      uploads {
        headshot {
          id
          url
        }
      }
      bio
      social {
        twitter
        website
        facebook
        linkedin
      }
    }
    media {
      heroImage {
        id
        url
        isPublic
      }
      heroBackground {
        id
        url
        isPublic
      }
      heroVideo {
        id
        url
        fileName
        isPublic
      }
      gallery  {
        id
        url
        isPublic
      }
      avatar  {
        id
        url
        isPublic
      }
    }
    legal {
      general {
        useOfProceeds {
          offeringExpenseAmountDescription
        }
      }
      dataroom {
        documents {
          name
          accreditedOnly
          upload {
            fileId
            fileName
            fileHandle {
              boxFileId
            }
          }
        }
      }
    }
    closureSummary {
      processingDate
      hardCloseDate
      totalInvestmentAmount
      totalInvestorCount
      repayment {
        count
      }
    }
    comments {
      id
      scope
      comment
      approved {
        date
      }
      updated {
        date
      }
      created {
        date
      }
      createdUserInfo {
        id
        info {
          firstName
          lastName
        }
        roles {
          name
        }
      }
      threadComment {
        id
        scope
        comment
        approved {
          date
        }
        updated {
          date
        }
        created {
          date
        }
        createdUserInfo {
          id
          info {
            firstName
            lastName
          }
          roles {
            name
          }
        }
      }
    }
    updates {
      id
      title
      content
      scope
      updated {
        date
      }
      actingUserInfo {
        id
        info {
          firstName
          lastName
        }
      }
    }
    earlyBirdsCount
  }
}
`;
export const campaignDetailsForInvestmentQuery = gql`
query getOfferingById($id: ID) {
  getOfferingDetailsById (id: $id) {
    id
    offeringSlug
    isAvailablePublicly
    stage
    closureSummary {
      processingDate
      hardCloseDate
      totalInvestmentAmount
      repayment {
        completeDate
      }
      keyTerms {
        multiple
        revSharePercentage
        interestRate
        businessOpenDate
      }
    }
    keyTerms {
      regulation
      startupPeriod
      offeringDisclaimer
      legalBusinessName
      shorthandBusinessName
      maturity
      frequencyOfPayments
      securities
      securityInterest
      securitiesOwnershipPercentage
      investmentMultiple
      revSharePercentage
      interestRate
      minOfferingAmountCF
      maxOfferingAmountCF
      minOfferingAmount506C
      maxOfferingAmount506C
      industry
      minInvestAmt
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
        edgarLink
        terminationDate
      }
    }
    selectedOffer {
      structure
    }
    earlyBirdsCount
    bonusRewards{
      id
      offeringId
      title
      description
      rewardStatus
      expirationDate
      earlyBirdQuantity
      tiers
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
    }
    updates {
      id
      offeringId
      title
      content
      status
      scope
      tiers
      isEarlyBirdOnly
      notificationSent {
        by
        date
        to
      }
      approved {
        by
        date
      }
      updated {
        by
        date
      }
      deleted {
        by
        date
      }
      actingUserInfo {
        id
        info {
          firstName
          lastName
          avatar {
            url
            name
          }
        }
      }
    }
    rewardsTiers
    earlyBird {
      quantity
      amount
    }
  }
}
`;
