import gql from 'graphql-tag';

const common = {
  offeringBasics: `id
  isAvailablePublicly
  keyTerms {
    legalBusinessName
    shorthandBusinessName
    securities
    regulation
  }
  leadDetails {
    email {
      address
    }
    info {
      firstName
      lastName
    }
    phone {
      number
    }
  }
  issuerDetails {
    email {
      address
    }
    info {
      firstName
      lastName
    }
    phone {
      number
    }
  }
  offering {
    launch {
      targetDate
    }
  }
  issuerId
  stage
  created {
    date
  }
  closureSummary {
    processingDate
    hardCloseDate
    repayment {
      currentRepaidAmount
      count
    }
  }
  order`,
};
export const allOfferingsCompact = gql`
  query _getOfferings($stage: [OfferingStageEnumType], $issuerId: String){
    getOfferings(filters: { stage: $stage, issuerId: $issuerId }){
      id
      keyTerms {
        legalBusinessName
        shorthandBusinessName
      }
      stage
      created {
        id
        date
      }
      order
    }
  }
`;

export const allOfferings = gql`
  query _getOfferings($stage: [OfferingStageEnumType]){
    getOfferings(filters: { stage: $stage }){
      ${common.offeringBasics}
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
      previewPassword
      regulation
      leadDetails {
        id
        email {
          address
        }
        info {
          firstName
          lastName
        }
        phone {
          number
        }
      }
      issuerDetails {
        id
        email {
          address
        }
        info {
          firstName
          lastName
        }
       phone {
        number
      }
      }
      keyTerms {
        unitPrice
        roundType
        premoneyValuation
        additionalKeyterms {
          label
          description
        }
        startupPeriod
        revSharePercentageDescription
        useOfProceedFootnote
        currentFinancialStatements
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
        minOfferingAmountCF
        minOfferingAmount506
        maxOfferingAmountCF
        maxOfferingAmount506
        minOfferingAmount506C
        maxOfferingAmount506C
        legalBusinessType
        nsMinFees
        nsMaxFees
        stateOfFormation
        city
        state
        minInvestAmt
        appendixATitle
        investmentMultipleSummary
        stockType
        offeringDisclaimer
        revShareSummary
        nsFeeCalcDescription
        isNewBusiness
        isHealthcare
        isFood
        isAlcohol
        totalProjectCost
        raisedThroughSaleOfEquity
        nsFeePercentage
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
              aliasId: id
              by
              date
            }
            updated {
              aliasId: id
              by
              date
            }
            deleted {
              aliasId: id
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
      contingencies {
        launch {
          contingency
          acceptance
          accepted {
            status
            aliasId: id
            by
            date
            comment
          }
        }
        close {
          contingency
          acceptance
          accepted {
            aliasId: id
            status
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
            featuredImageUpload {
              id
              url
              fileName
              isPublic
            }
          }
          issuerWebsite
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
        misc {
          additionalBonusRewardsContent
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
        misc {
          additionalBonusRewardsContent
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
        launch {
          targetDate
          terminationDate
          expectedOpsDate
          issuerApprovedDate
          escrowKey
          escrowNumber
          edgarLink
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
            offeringExpenseAmount
            offeringExpenseAmountDescription
          }
          equityShareholderRights
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
        riskFactors {
          businessRisks
          financingRisks
          developmentRisks
          reputationalRisks
          competitionRisks
          marketRisks
          workStoppagesRisks
          managementRisks
          personnelRisks
          laborSupplyRisks
          privacyRisks
          realEstateRisks
          supplyRisks
          foodSafetyRisks
          nutritionalDisclosureRisks
          foodRisks
          alcoholSalesRisks
          alcoholInvestmentRisks
          industryRisks
          healthcareRisks
          legalRisks
          environmentalRisks
          itRisks
          accountingRisks
          ipRisks
          regulatoryRisks
          regulatoryFoodRisks
          taxRisks
          limitedRepaymentRisks
          relatingForecastsRisks
          debtFinancingRisks
          conflictOfInterestRisks
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
        dataroom {
          documents {
            name
            upload {
              fileId
              fileName
            }
            accreditedOnly
          }
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
        documentation {
          issuer {
            formID {
              fileId
              fileName
              fileHandle {
                id
                created {
                  date
                  by
                }
                updated {
                  date
                  by
                }
              }
            }
            corpFormation {
              fileId
              fileName
              fileHandle {
                id
                created {
                  date
                  by
                }
                updated {
                  date
                  by
                }
              }
            }
            issuerFinancials {
              fileId
              fileName
              fileHandle {
                id
                created {
                  date
                  by
                }
                updated {
                  date
                  by
                }
              }
            }
            leaseAgreement {
              fileId
              fileName
              fileHandle {
                id
                created {
                  date
                  by
                }
                updated {
                  date
                  by
                }
              }
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
          admin {
            escrow {
              fileId
              fileName
              fileHandle {
                id
                created {
                  date
                  by
                }
                updated {
                  date
                  by
                }
              }
            }
            resolutionOfBorrowing {
              fileId
              fileName
              fileHandle {
                id
                created {
                  date
                  by
                }
                updated {
                  date
                  by
                }
              }
            }
            formC {
              fileId
              fileName
              fileHandle {
                id
                created {
                  date
                  by
                }
                updated {
                  date
                  by
                }
              }
            }
            npa {
              fileId
              fileName
              fileHandle {
                id
                created {
                  date
                  by
                }
                updated {
                  date
                  by
                }
              }
            }
            disclosure {
              fileId
              fileName
              fileHandle {
                id
                created {
                  date
                  by
                }
                updated {
                  date
                  by
                }
              }
            }
            securityAgreement {
              fileId
              fileName
              fileHandle {
                id
                created {
                  date
                  by
                }
                updated {
                  date
                  by
                }
              }
            }
            personalGuarantee {
              fileId
              fileName
              fileHandle {
                id
                created {
                  date
                  by
                }
                updated {
                  date
                  by
                }
              }
            }
            promissoryNote {
              fileId
              fileName
              fileHandle {
                id
                created {
                  date
                  by
                }
                updated {
                  date
                  by
                }
              }
            }
            edgar
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
          admin {
            escrow {
              fileId
              fileName
            }
            resolutionOfBorrowing {
              fileId
              fileName
            }
            formC {
              fileId
              fileName
            }
            npa {
              fileId
              fileName
            }
            disclosure {
              fileId
              fileName
            }
            securityAgreement {
              fileId
              fileName
            }
            personalGuarantee {
              fileId
              fileName
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
      closureSummary {
        processingDate
        hardCloseDate
        launchDate
        disbursement {
          date
          amount
        }
        keyTerms {
          multiple
          revSharePercentage
          interestRate
          businessOpenDate
        }
        repayment {
          startDate
          completeDate
          currentRepaidAmount
          count
        }
        totalCommittedAmount
        totalInvestorCount
        totalInvestmentAmount
        failedDate
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
          aliasId: id
          by
          date
        }
        updated {
          aliasId: id
          by
          date
        }
        deleted {
          aliasId: id
          by
          date
        }
      }
      applicationId
      issuerId
      lead {
        id
      }
      stage
      rewardsTiers
      earlyBird {
        quantity
        amount
      }
      created{
        aliasId: id
        by
        date
      }
      updated{
        aliasId: id
        by
        date
      }
      deleted{
        aliasId: id
        by
        date
      }
      order
    }
  }
`;

export const updateOffering = gql`
mutation _updateOffering($id: String!, $issuerId: String, $adminId: String, $offeringDetails: OfferingInputType!) {
  updateOffering(id: $id, issuerId: $issuerId, adminId: $adminId, offeringDetails: $offeringDetails) {
    ${common.offeringBasics}
  }
}
`;

export const upsertOffering = gql`
mutation upsertOffering($id: String, $offeringDetails: OfferingInputType!) {
  upsertOffering(id: $id, offeringDetails: $offeringDetails) {
    ${common.offeringBasics}
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

export const upsertBonusReward = gql`
mutation _upsertBonusReward($id: String, $bonusRewardDetails: BonusRewardInputType!){
  upsertBonusReward(id: $id, bonusRewardDetails: $bonusRewardDetails){
    id
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
    earlyBirdQuantity
    tiers
    created{
      by
      date
    }
    updated{
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
  }
}
`;

export const getTotalAmount = gql`
query getTotalAmount{
  getNSOfferingAmountRaised
    {
    amountRaisedUS
    amountRaisedTX
    totalInvestorsUS
  }
  }
  `;

export const offerClose = gql`
  mutation _offeringClose($process: OfferingCloseProcessEnum!, $queueLimit: Int,  $offeringId: String!, $payload: OfferingClosePayloadInputType) {
    offeringClose(process: $process, queueLimit: $queueLimit, offeringId: $offeringId, payload: $payload)
  }
`;

export const setOrderForOfferings = gql`
  mutation setOrderForOfferings($offeringOrderDetails:[OfferingOrderInput]){
    setOrderForOfferings(offeringOrderDetails: $offeringOrderDetails)
  }
`;
