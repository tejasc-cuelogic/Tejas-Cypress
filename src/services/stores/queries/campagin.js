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
    applicationId
    issuerId
    offeringSlug
    referralCode
    regulation
    selectedOffer {
      structure
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
      minOfferingAmount
      maxOfferingAmount
      industry
      minInvestAmt
      appendixATitle
      revShareSummary
      investmentMultipleSummary
      locationRiskFactors
      isTX
      state
      city
    }
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
    rewardsTiers
    earlyBird {
      quantity
      amount
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
      useOfProceeds{
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
      avatar  {
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
      totalInvestmentAmount
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
        by
        date
      }
      deleted {
        id
        by
        date
      }
      created {
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
        roles {
          name
        }
      }
      threadComment {
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
          by
          date
        }
        created {
          by
          date
        }
        deleted {
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
          roles {
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
    earlyBirdsCount
  }
}
`;
export const campaignDetailsForInvestmentQuery = gql`
query getOfferingById($id: ID) {
  getOfferingDetailsById (id: $id) {
    id
    offeringSlug
    closureSummary {
      totalInvestmentAmount
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
      minOfferingAmount
      maxOfferingAmount
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
