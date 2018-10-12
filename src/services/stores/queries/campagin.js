import gql from 'graphql-tag';

export const allOfferings = gql`
query getOfferingList($filters: OfferingFilterInputType){
    getOfferingList(filters: $filters) {
      id
      stage
      media {
        tombstoneImage {
        url
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

export const getOfferingById = gql`
  query getOfferingById($id: ID!) {
    getOfferingDetailsById(id: $id) {
      issuerId
    }
  }
`;

export const campaignDetailsQuery = gql`
  query getOfferingById($id: ID) {
  getOfferingDetailsById (id: $id) {
    id
    stage
    applicationId
    issuerId
    offeringUrl
    referralCode
    selectedOffer {
      structure
    }
    keyTerms {
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
    rewardsTierIds {
      amount
      earlyBirdQuantity
    }
    offering {
      overview {
        elevatorPitch
        slug
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
      }
      misc
    }
    leadership {
      firstName
      lastName
      companyPosition
      isPublic
      uploads {
        headshot {
          fileId
          fileName
          url
          isPublic
        }
        heroImage {
          fileId
          fileName
          url
          isPublic
        }
        license {
          fileId
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
        id
        url
        isPublic
      }
      heroVideo {
        id
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
    }
    legal {
      general {
        websiteUrl
        useOfProceeds {
          reachedMinOfferingGoal
          reachedMaxOfferingGoal
        }
        approved {
          id
          by
          date
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
        id
        by
        date
        to
      }
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
