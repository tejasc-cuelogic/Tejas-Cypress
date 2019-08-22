import gql from 'graphql-tag';

export const allBusinessApplicationses = gql`
query allBusinessApplicationses($filters: BusinessApplicationsFilter){
  allBusinessApplicationses(filter: $filters){
    id
    applicationStatus
    businessDetailsStatus
    businessDocumentationStatus
    businessName
    businessPerformanceStatus
    commentContent
    commentDate
    commentUser
    createdDate
    email
    name
    phone
    ratings
    updatedDate
    failedReasons
    status
  }
  _allBusinessApplicationsesMeta(filter: $filters){
    count
  }
}
`;

export const getBusinessApplicationAdmin = gql`
query getBusinessApplicationAdmin($applicationType: ApplicationTypeEnum!, $orderBy: businessapplicationOrderBy, $limit:String, $search: String, $lek: String){
  businessApplicationsAdmin(
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

export const getBusinessApplicationSummary = gql`
query getBusinessApplicationSummary{
  businessApplicationsSummary {
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

export const upsertBusinessApplicationInformationBusinessDetails = gql`
mutation _upsertBusinessApplicationInformationBusinessDetails($applicationId: ID!,
  $isPartialData: Boolean, $applicationStep: BusinessApplicationStepEnum!, $applicationType: BusinessApplicationTypeEnum!
  $businessGoal: BusinessGoalEnum, $businessDetails: BusinessDetailsInput, $targetIssuerId: ID) {
  upsertBusinessApplicationInformation(
    applicationId: $applicationId, isPartialData: $isPartialData,
    applicationStep: $applicationStep, applicationType: $applicationType,
    businessGoal: $businessGoal, businessDetails: $businessDetails, targetIssuerId: $targetIssuerId) {
      applicationId
      applicationStatus
  }
}
`;

export const upsertBusinessApplicationInformationPerformance = gql`
mutation _upsertBusinessApplicationInformationPerformance($applicationId: ID!,
  $isPartialData: Boolean, $applicationStep: BusinessApplicationStepEnum!, $applicationType: BusinessApplicationTypeEnum!
  $businessGoal: BusinessGoalEnum, $businessPerformance: businessPerformanceInput, $targetIssuerId: ID) {
  upsertBusinessApplicationInformation(
    applicationId: $applicationId, isPartialData: $isPartialData,
    applicationStep: $applicationStep, applicationType: $applicationType,
    businessGoal: $businessGoal, businessPerformance: $businessPerformance, targetIssuerId: $targetIssuerId) {
      applicationId
      applicationStatus
  }
}
`;

export const upsertBusinessApplicationInformationDocumentation = gql`
mutation _upsertBusinessApplicationInformationDocumentation($applicationId: ID!,
  $isPartialData: Boolean, $applicationStep: BusinessApplicationStepEnum!, $applicationType: BusinessApplicationTypeEnum!
  $businessGoal: BusinessGoalEnum, $businessDocumentation: BusinessDocumentationInput, $targetIssuerId: ID) {
  upsertBusinessApplicationInformation(
    applicationId: $applicationId, isPartialData: $isPartialData,
    applicationStep: $applicationStep, applicationType: $applicationType,
    businessGoal: $businessGoal, businessDocumentation: $businessDocumentation, targetIssuerId: $targetIssuerId) {
      applicationId
      applicationStatus
  }
}
`;

export const getBusinessApplications = gql`
query _getBusinessApplications {
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
query _getBusinessApplicationById ($id: String!) {
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
      businessModel
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

export const getBusinessApplicationsDetailsAdmin = gql`
query getBusinessApplicationsDetailsAdmin ($applicationId: String!, $userId: String, $applicationType: ViewBusinessApplicationTypeEnum!) {
  businessApplicationsDetailsAdmin(
    applicationId: $applicationId
    applicationType: $applicationType
    userId: $userId
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
) {
  updateBusinessApplicationInformation(
    applicationId: $applicationId
    issuerId: $issuerId
    businessName: $businessName
    signupCode: $signupCode
    utmSource: $utmSource
  ){
    applicationId
    signupCode
    utmSource
  }
}
`;

export const updateApplicationStatusAndReview = gql`
mutation updateApplicationData(
  $applicationId: ID!
  $userId: ID
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
  updateApplicationStatusAndReview(
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

export const updateBusinessApplicationInformationData = gql`
mutation updateBusinessApplicationInformation(
  $applicationId: String!
  $issuerId: String!
  $review: BusinessApplicationReviewInput
  $offers: OffersReviewInput
) {
  updateBusinessApplicationInformation(
    applicationId: $applicationId
    issuerId: $issuerId
    review: $review
    offers: $offers
  ){
    applicationStatus
  }
}
`;

export const getBusinessApplicationOffers = gql`
query _getBusinessApplicationById ($id: String!) {
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
      businessModel
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
mutation _signPortalAgreement($applicationId: String!, $issuerId: String!, $selectedOffer: OfferInput!, $isSelectedOfferChanged: Boolean, $callbackUrl: String){
  signPortalAgreement(
    applicationId: $applicationId
    issuerId: $issuerId
    selectedOffer: $selectedOffer
    isSelectedOfferChanged: $isSelectedOfferChanged
    callbackUrl: $callbackUrl
  )
}
`;

export const getPortalAgreementStatus = gql`
query _getPortalAgreementStatus($applicationId: String!, $issuerId: String!){
  getPortalAgreementStatus(
    applicationId: $applicationId
    issuerId: $issuerId
  )
}
`;

export const createOffering = gql`
mutation _createOffering($applicationId: String!){
  createOffering(
    applicationId: $applicationId
  ){
    id
  }
}
`;

export const generatePortalAgreement = gql`
mutation _generatePortalAgreement($applicationId: String!, $userId: String!){
  generatePortalAgreement(
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

export const exportAllToEmail = gql`
mutation exportAllToEmail($applicationType: ApplicationTypeEnum!) {
  exportAllToEmail(applicationType: $applicationType)
}
`;
