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
      social {
        twitter
      }
    }
    rewardsTierIds{
      amount
      earlyBirdQuantity
    }
    bonusRewards{
      id
      title
      description
      tiers{
        amount
        earlyBirdQuantity
      }
    }
  }
}
`;
