import gql from 'graphql-tag';

export const allOfferings = gql`
query getOfferingList($filters: OfferingFilterInputType){
    getOfferingList(filters: $filters) {
      id
      offeringSlug
      stage
      media {
        tombstoneImage {
          url
          isPublic
          fileName
        }
      }

      offering {
        about {
          theCompany
        }
      }
      closureSummary {
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
    }
  }
`;

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
  query getOfferingById($id: ID!) {
    getOfferingDetailsById(id: $id) {
      issuerId
    }
  }
`;

export const campaignDetailsQuery = gql`
  query getOfferingDetailsBySlug($id: String) {
    getOfferingDetailsBySlug (offeringSlug: $id) {
    id
    stage
    applicationId
    issuerId
    offeringSlug
    referralCode
    selectedOffer {
      structure
    }
    keyTerms {
      regulation
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
      minOfferingAmount
      maxOfferingAmount
      industry
      minInvestAmt
      maxInvestAmt
      appendixATitle
      revShareSummary
      investmentMultipleSummary
      locationRiskFactors
      isTX
      state
      city
    }
    rewardsTierIds {
      amount
      earlyBirdQuantity
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
        googleMeta
        issuerWebsite
        submitted {
          id
          by
          date
        }
        approved {
          id
          by
          date
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
        submitted {
          id
          by
          date
        }
        approved {
          id
          by
          date
        }
      }
      launch {
        targetDate
        terminationDate
        expectedOpsDate
        issuerApprovedDate
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
        }
        gsFees
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
          fileName
          url
          isPublic
        }
        heroImage {
          id
          fileName
          url
          isPublic
        }
        license {
          id
          fileName
          url
          isPublic
        }
      }
      bio
      social {
        twitter
        website
        facebook
        linkedin
      }
      approved {
        id
        by
        date
      }
    }
    media {
      heroImage {
        url
        isPublic
      }
      heroVideo {
        url
        isPublic
      }
      tombstoneImage {
        id
        url
        isPublic
      }
      locationHeroImage {
        id
        url
        isPublic
      }
      location  {
        id
        url
        isPublic
      }
      gallery  {
        id
        url
        isPublic
      }
      logo  {
        id
        url
        isPublic
      }
      businessModelImage {
        id
        url
        isPublic
      }
    }
    legal {
      general {
        websiteUrl
        useOfProceeds {
          minOfferingExpenseAmount
          minOfferingExpenseAmountDescription
          maxOfferingExpenseAmount
          maxOfferingExpenseAmountDescription
        }
        approved {
          id
          by
          date
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
      totalInvestorCount
    }
    comments {
      id
      offeringId
      thread
      scope
      comment
      approved {
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
      createdUserInfo {
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
    updates {
      id
      offeringId
      title
      content
      status
      scope
      tiers {
        amount
        earlyBirdQuantity
      }
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
    earlyBirdsCount
    bonusRewards{
      id
      offeringId
      title
      rewardStatus
      description
      expirationDate
      tiers{
        amount
        earlyBirdQuantity
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
    }
  }
}
`;
export const campaignDetailsForInvestmentQuery = gql`
query getOfferingById($id: ID) {
  getOfferingDetailsById (id: $id) {
    id
    offeringSlug
    keyTerms {
      regulation
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
      }
    }
    earlyBirdsCount
    bonusRewards{
      id
      offeringId
      title
      rewardStatus
      description
      expirationDate
      tiers{
        amount
        earlyBirdQuantity
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
    }
    updates {
      id
      offeringId
      title
      content
      status
      scope
      tiers {
        amount
        earlyBirdQuantity
      }
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
    rewardsTierIds {
      amount
      earlyBirdQuantity
    }
  }
}
`;
