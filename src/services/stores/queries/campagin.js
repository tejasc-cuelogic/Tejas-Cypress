import gql from 'graphql-tag';

export const allCampaigns = gql`
  query allCampaigns {
    allCampaigns{
      id
      createdAt
      title
      address
      description
      flagged
      label
      image
    }
  }
`;

// export const campaignDetailsQuery = gql`
//   query campaignDetailsQuery($id: ID!) {
//     Campaign(id: $id) {
//       id
//       createdAt
//       title
//       address
//       description
//       collected
//       needed
//       flagged
//       label
//       industry
//       investmentType
//     }
//   }
// `;

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
    }
    leadership {
      firstName
      lastName
      companyPosition
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
      tombstoneImage {
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
        userInfo {
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
        userInfo {
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
