import gql from 'graphql-tag';

export const allOfferings = gql`
query getOfferingList($filters: OfferingListFilterInputType){
    getOfferingList(filters: $filters) {
      id
      isAvailablePublicly
      watchListStatus
      offeringSlug
      stage
      updated {
        date
      }
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
          interestRate
          priceCalculation
        }
        hardCloseDate
        repayment {
          count
          currentRepaidAmount
        }
      }
      keyTerms {
        minInvestAmt
        priceCopy
        premoneyValuation
        maturity
        interestRate
        investmentMultiple
        valuationCap
        equityUnitType
        discount
        offeringSize
        preferredReturn
        targetInvestmentPeriod
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
        equityClass
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
query getOfferingList($filters: OfferingListFilterInputType){
    getOfferingList(filters: $filters) {
      id
      stage
      offeringSlug
      referralCode
      order
    }
  }
`;

export const offeringWatchList = gql`
query offeringWatchList($offeringId: String){
  offeringWatchList(offeringId: $offeringId) {
    userId
    status
    offeringId
    lastUpdated
    userInfo {
      email {
        address
      }
    info {
      firstName
      lastName
    }
    }
  }
}
`;

export const getOfferingById = gql`
  query getOfferingDetailsBySlug($id: String!) {
    getOfferingDetailsBySlug (offeringSlug: $id) {
      issuerId
      id
      investmentSummary {
        isInvestedInOffering
        tranche
      }
      isAvailablePublicly
      stage
    }
  }
`;

export const getOfferingIdBySlug = gql`
  query getOfferingDetailsBySlug($id: String!) {
    getOfferingDetailsBySlug (offeringSlug: $id) {
      id
    }
  }
`;

export const campaignDetailsQuery = gql`
  query getOfferingDetailsBySlug($id: String!, $isValid: Boolean) {
    getOfferingDetailsBySlug (offeringSlug: $id, isValid: $isValid) {
    id
    investmentSummary {
      isInvestedInOffering
      tranche
    }
    isAvailablePublicly
    watchListStatus
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
      priceCopy
      discount
      valuationCap
      totalRoundSize
      equityClass
      equityUnitType
      roundType
      offeringSize
      preferredReturn
      targetInvestmentPeriod
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
        expectedOpsDate
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
    investNow {
      template
      page {
        title
        page
        regulation
        toc {
          label
          order
          account
          required
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
        priceCalculation
        revSharePercentage
      }
    }
    earlyBirdsCount
  }
}
`;

export const campaignDetailsAdditionalQuery = gql`
  query getOfferingDetailsBySlug($id: String!, $isValid: Boolean) {
    getOfferingDetailsBySlug (offeringSlug: $id, isValid: $isValid) {
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
      threadComments {
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
      postUpdateAs
      title
      content
      scope
      updatedDate
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
query getOfferingDetailsBySlug($id: String!, $isValid: Boolean) {
  getOfferingDetailsBySlug (offeringSlug: $id, isValid: $isValid) {
    id
    regulation
    offeringSlug
    isAvailablePublicly
    stage
    investNow {
      template
      page {
        title
        page
        regulation
        toc {
          label
          order
          account
          required
        }
      }
    }
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
        priceCalculation
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
      equityUnitType
      frequencyOfPayments
      priceCopy
      premoneyValuation
      equityClass
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
        expectedOpsDate
        terminationDate
        edgarLink
      }
    }
    legal {
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
      postUpdateAs
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

export const getOfferingMedia = gql`
  query getOfferingDetailsBySlug($id: String!, $isValid: Boolean) {
    getOfferingDetailsBySlug(offeringSlug: $id, isValid: $isValid) {
      id
      offeringSlug
      referralCode
      previewPassword
      regulation
      rootFolderId
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
        avatar {
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
        heroBackground {
          id
          url
          isPublic
          fileName
        }
        useOfProceeds {
          id
          url
          isPublic
          fileName
        }
        businessModelImage {
          id
          url
          isPublic
          fileName
        }
        issuerSubmitted
        submitted {
          aliasId: id
          by
          date
        }
        approved {
          aliasId: id
          by
          date
          status
        }
      }
    }
  }
`;

export const validateOfferingPreviewPassword = gql`
query validateOfferingPreviewPassword($offeringSlug: String!, $previewPassword: String!) {
  validateOfferingPreviewPassword (offeringSlug: $offeringSlug, previewPassword: $previewPassword)
}`;

export const addUserToOfferingWatchlist = gql`
  mutation addUserToOfferingWatchlist($userId: String, $offeringId: String, $isInvestment: Boolean){
    addUserToOfferingWatchlist(userId: $userId, offeringId: $offeringId, isInvestment: $isInvestment)
  }
`;

export const removeUserFromOfferingWatchlist = gql`
  mutation removeUserFromOfferingWatchlist($userId: String, $offeringId: String){
    removeUserFromOfferingWatchlist(userId: $userId, offeringId: $offeringId)
  }
`;
