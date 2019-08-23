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
      order
      offering {
        about {
          theCompany
        }
        overview {
          tombstoneDescription
        }
        launch {
          targetDate
        }
      }
      closureSummary {
        processingDate
        launchDate
        hardCloseDate
        totalInvestmentAmount
        totalInvestorCount
        keyTerms {
          multiple
        }
      }
      keyTerms {
        regulation
        minOfferingAmountCF
        maxOfferingAmountCF
        minOfferingAmount506
        maxOfferingAmount506
        minOfferingAmount506C
        maxOfferingAmount506C
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
      stage
      offeringSlug
      referralCode
      order
    }
  }
`;

export const getOfferingById = gql`
  query getOfferingDetailsBySlug($id: String) {
    getOfferingDetailsBySlug (offeringSlug: $id) {
      issuerId
      id
      isAvailablePublicly
      stage
    }
  }
`;

export const isValidInvestorInOffering = gql`
  query isValidInvestorInOffering ($offeringId: String!, $userId: String!, $offeringStage: OfferingStageEnumType!) {
    isValidInvestorInOffering (offeringId: $offeringId, userId: $userId, offeringStage: $offeringStage)
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
      revShareSummaryUpload {
        id
        url
        isPublic
      }
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
      minOfferingAmount506
      maxOfferingAmount506
      minOfferingAmount506C
      maxOfferingAmount506C
      minInvestAmt
      revShareSummary
      investmentMultipleSummary
      state
      city
      nsFeePercentage
    }
    bonusRewards {
      id
      title
      description
      earlyBirdQuantity
      tiers
      created {
        by
        date
      }
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
        targetDate
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
      launchDate
      totalInvestmentAmount
      totalInvestmentAmountCf
      totalInvestmentAmount506C
      totalInvestorCount
      repayment {
        count
      }
      keyTerms {
        multiple
      }
    }
    earlyBirdsCount
  }
}
`;

export const campaignDetailsAdditionalQuery = gql`
  query getOfferingDetailsBySlug($id: String) {
    getOfferingDetailsBySlug (offeringSlug: $id) {
    id
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
          avatar{
            url
            name
          }
        }
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
    isAvailablePublicly
    stage
    closureSummary {
      processingDate
      hardCloseDate
      totalInvestmentAmount
      totalInvestmentAmountCf
      totalInvestmentAmount506C
      repayment {
        completeDate
      }
      keyTerms {
        supplementalAgreements {
          documents {
            name
            isVisible
            upload {
              fileId
              fileName
              fileHandle {
                boxFileId
              }
            }
          }
        }
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
      minOfferingAmount506
      maxOfferingAmount506
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

export const validateOfferingPreviewPassword = gql`
query _validateOfferingPreviewPassword($offeringId: String!, $previewPassword: String!) {
  validateOfferingPreviewPassword (offeringId: $offeringId, previewPassword: $previewPassword)
}`;
