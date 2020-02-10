import gql from 'graphql-tag';

export const adminBusinessApplications = gql`
query adminBusinessApplications($applicationType: ApplicationTypeEnum!, $orderBy: businessapplicationOrderBy, $limit:String, $search: String, $lek: String){
  adminBusinessApplications(
    applicationType: $applicationType
    orderBy: $orderBy
    limit: $limit
    search: $search
    lek: $lek
  ) {
    resultCount
    totalCount
    businessApplications
    lek
  }  
}
`;

export const adminBusinessApplicationsSummary = gql`
query adminBusinessApplicationsSummary{
  adminBusinessApplicationsSummary {
    prequalFaild
    inProgress
    completed
  }
}
`;


export const createBusinessApplicationPrequalificaiton = gql`
mutation updatePreQualInfo($preQualificationData: PreQualDetailsInput!) {
  updatePrequalification(prequalificationDetails: $preQualificationData) {
    status
    id
    userExists
    partnerStatus {
      partnerId
      status
      failReasons
    }
    userRoles
  }
}
`;

export const createBusinessApplicationBasicInfo = gql`
mutation createBasicInfo($basicInfo: BasicInfoInput!) {
  upsertPreQualBasicInfo(basicInfo: $basicInfo) {
    id
    signupCode
    utmSource
  }
}
`;

export const submitApplication = gql`
mutation submitApplication($applicationId: String!) {
  submitApplication(applicationId: $applicationId) {
    status
    id
  }
}
`;

export const helpAndQuestion = gql`
mutation helpAndQuestion($question: HelpAndQuestionInput!) {
  helpAndQuestion(question: $question)
}
`;

export const upsertBusinessApplicationInformation = gql`
mutation upsertBusinessApplicationInformation($applicationId: ID!,
  $isPartialData: Boolean, $applicationStep: BusinessApplicationStepEnum!, $applicationType: BusinessApplicationTypeEnum!
  $businessGoal: BusinessGoalEnum, $businessDetails: BusinessDetailsInput, $businessPerformance: businessPerformanceInput, $businessDocumentation: BusinessDocumentationInput, $targetIssuerId: String) {
  upsertBusinessApplicationInformation(
    applicationId: $applicationId, isPartialData: $isPartialData,
    applicationStep: $applicationStep, applicationType: $applicationType,
    businessGoal: $businessGoal, businessDetails: $businessDetails,
    businessPerformance: $businessPerformance, businessDocumentation: $businessDocumentation, userId: $targetIssuerId
  ) {
      applicationId
      applicationStatus
  }
}
`;

export const getBusinessApplications = gql`
query getBusinessApplications {
  businessApplications {
    userId
    applicationId
    applicationType
    applicationStatus
    applicationSubmittedDate
    created {
      date
    }
    updated {
      date
    }
    prequalDetails {
      businessGeneralInfo {
        businessName
      }
    }
    offers {
      approved {
        date
      }
    }
    envelopeStatusChangedDateTime
  }
}
`;

export const getBusinessApplicationsById = gql`
query getBusinessApplicationById ($id: String!) {
  businessApplication(
    applicationId: $id
  ){
    userId
    applicationId
    applicationType
    applicationStatus
    applicationStage
    created {
      date
    }
    updated {
      date
    }
    prequalDetails {
      # businessModel
      businessGoal
      businessGeneralInfo {
        businessName
        address {
          street
          city
          state
          zipCode
        }
        website
        contactDetails {
          phone {
            number
          }
        }
      }
      industryTypes
      investmentType
      realEstateTypes
      ownOrOperateProperty
      target { 
        investorIRR
        annualInvestorRoi
        holdTimeInYears
       }
      existingBusinessInfo {
        ageYears
        ageMonths
      }
      businessEntityStructure
      companyTaxed
      legalConfirmations {
        label
        value
      }
      franchiseHolder
      businessExperience{
        industryExperience
        estimatedCreditScore
        totalProjectCost
        amountNeeded
      }
      fundUsage
      performanceSnapshot {
        nextYearSnapshot {
          grossSales
          cogSold
          operatingExpenses
          netIncome
        }
        pastYearSnapshot {
          grossSales
          cogSold
          operatingExpenses
          netIncome
        }
      }
      businessSecurities
    }
    businessDetails {
      planDocs {
        fileId
        fileName
      }
      debts {
        amount
        interestExpenses
        remainingPrincipal
        term
        termStartDate
        creditorName
        existingLienOnBusiness
        maturityDate
      }
      owners {
        fullLegalName
        yearsOfExp
        ssn
        companyOwnerShip
        linkedInUrl
        dateOfService
        title
        resume {
          fileId
          fileName
        }
      }
      sources {
        name
        amount
      }
      uses {
        name
        amount
      }
      stepStatus
    }
    businessPerformance {
      financialStatements {
        priorToThreeYear {
          fileId
          fileName
        }
        ytd {
          fileId
          fileName
        }
        fiveYearProjection{
          fileId
          fileName
        }
      }
      sourcesAndUses {
        fileId
        fileName
        fileHandle
      }
      performance {
        nextYearSnapshot {
          grossSales
          cogSold
          operatingExpenses
          netIncome
        }
        pastYearSnapshot {
          grossSales
          cogSold
          operatingExpenses
          netIncome
        }
      }
      submittedDate
      stepStatus
    }
    businessDocumentation {
      dueDiligence {
        fileId
        fileName
      }
      legalDocs {
        fileId
        fileName
      }
      bankStatements {
        fileId
        fileName
      }
      leaseAgreementsOrLOIs {
        fileId
        fileName
      }
      personalTaxReturns {
        fileId
        fileName
      }
      businessTaxReturns {
        fileId
        fileName
      }
      blanketLien
      providePersonalGuarantee
      personalGuarantee {
        fileId
        fileName
      }
      stepStatus
      submittedDate
    }
  }
}
`;

export const adminBusinessApplicationsDetails = gql`
query adminBusinessApplicationsDetails ($applicationId: String!, $applicationType: ViewBusinessApplicationTypeEnum!) {
  adminBusinessApplicationsDetails(
    applicationId: $applicationId
    applicationType: $applicationType
  )
}
`;

export const getPreQualificationById = gql`
query getPreQualificationById ($id: ID!) {
  getPreQualificationById(preQualId: $id){
    id
    email
    firstName
    lastName
  }
}
`;

export const getPrequalBusinessApplicationsById = gql`
query getprequalInfo ($id: ID!) {
  getPreQualificationById(preQualId: $id){
    id
    email
    firstName
    lastName
    prequalStatus
    lendio {
      status
      failReasons
    }
    businessGeneralInfo {
      businessName
      contactDetails {
        phone {
          number
        }
      }
    }
    existingBusinessInfo {
      ageYears
      ageMonths
    }
    performanceSnapshot {
      nextYearSnapshot {
        grossSales
        cogSold
        operatingExpenses
        netIncome
      }
      pastYearSnapshot {
        grossSales
        cogSold
        operatingExpenses
        netIncome
      }
    }
    businessExperience{
      estimatedCreditScore
      amountNeeded
    }
  }
}
`;

export const submitPartneredWithLendio = gql`
mutation lendioDetails ($lendioApplication: ApplicationInfoInput!) {
  submitPartneredWithLendio(applicationDetails:$lendioApplication) {
    status
    url
  }
}
`;

export const updateBusinessApplicationInformation = gql`
mutation updateBusinessApplicationInformation(
  $applicationId: String!
  $issuerId: String!
  $businessName: String
  $signupCode: String
  $utmSource: String
  $rating: Int
  $agreements: [AgreementsInput]
) {
  updateBusinessApplicationInformation(
    applicationId: $applicationId
    issuerId: $issuerId
    businessName: $businessName
    signupCode: $signupCode
    utmSource: $utmSource
    rating: $rating
    agreements: $agreements
  ){
    applicationId
    signupCode
    utmSource
    rating
  }
}
`;

export const adminUpdateApplicationStatusAndReview = gql`
mutation adminUpdateApplicationStatusAndReview(
  $applicationId: ID!
  $userId: String
  $actionType: AdminApplicationActionTypeEnum!
  $applicationFlag: BusinessApplicationUpdateStatusEnum
  $applicationStatus: ApplicationStatusEnum
  $applicationReviewAction: AdminApplicationActionTypeEnum
  $applicationSource: ViewBusinessApplicationTypeEnum!
  $review: BusinessApplicationReviewInput
  $offers: OffersReviewInput
  $comments: [BusinessApplicationCommentInput]
  $approvedStatus: ApprovedStatusEnum
  $temporaryPassword: String
) {
  adminUpdateApplicationStatusAndReview(
    applicationId: $applicationId
    userId: $userId
    actionType: $actionType
    applicationFlag: $applicationFlag
    applicationStatus: $applicationStatus
    applicationReviewAction: $applicationReviewAction
    applicationSource: $applicationSource
    review: $review
    offers: $offers
    comments: $comments
    approvedStatus: $approvedStatus
    temporaryPassword: $temporaryPassword
  )
}
`;

export const getBusinessApplicationOffers = gql`
query getBusinessApplicationById ($id: String!) {
  businessApplication(
    applicationId: $id
  ){
    userId
    applicationId
    applicationStatus
    created {
      date
    }
    updated {
      date
    }
    prequalDetails {
      # businessModel
      businessGoal
      businessGeneralInfo {
        businessName
      }
    }
    offers {
      offer {
        structure
        amount
        minimumAmount
        maturity
        interestRate
        amortizationAmount
        mthRevenueSharing
        personalGuarantee
        businessBlanket
        expirationDate
        multiple
        totalCapital
        isAccepted
        additionalTerms
      }
      expectedAnnualRevenue {
        label
        year
      }
    }  
  }
}
`;

export const signPortalAgreement = gql`
mutation signPortalAgreement($applicationId: String!, $selectedOffer: OfferInput!, $isSelectedOfferChanged: Boolean, $callbackUrl: String){
  signPortalAgreement(
    applicationId: $applicationId
    selectedOffer: $selectedOffer
    isSelectedOfferChanged: $isSelectedOfferChanged
    callbackUrl: $callbackUrl
  )
}
`;

export const getPortalAgreementStatus = gql`
query getPortalAgreementStatus($applicationId: String!){
  getPortalAgreementStatus(
    applicationId: $applicationId
  )
}
`;

export const createOffering = gql`
mutation createOffering($applicationId: String!){
  createOffering(
    applicationId: $applicationId
  ){
    id
  }
}
`;

export const adminGeneratePortalAgreement = gql`
mutation adminGeneratePortalAgreement($applicationId: String!, $userId: String!){
  adminGeneratePortalAgreement(
    applicationId: $applicationId
    userId: $userId
  )
}
`;

export const applicationDeclinedByIssuer = gql`
mutation applicationDeclinedByIssuer($applicationId: String!, $comments: [BusinessApplicationCommentInput]){
  applicationDeclinedByIssuer(
    applicationId: $applicationId
    comments: $comments
  )
}
`;

export const adminExportAllToEmail = gql`
mutation adminExportAllToEmail($applicationType: ApplicationTypeEnum!) {
  adminExportAllToEmail(applicationType: $applicationType)
}
`;

export const adminCreateOffering = gql`
mutation adminCreateOffering($issuerId: String!, $applicationId: String!, $offeringDetailsInput: OfferingInputType!) {
  adminCreateOffering(issuerId: $issuerId, applicationId: $applicationId, offeringDetailsInput: $offeringDetailsInput)
  {
    id
 }
}
`;
