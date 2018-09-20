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
query getBusinessApplicationAdmin($applicationType: ApplicationTypeEnum!, $orderBy: businessapplicationOrderBy, $limit:String, $search: String, $lek: DecryptedString){
  businessApplicationsAdmin(
    applicationType: $applicationType
    orderBy: $orderBy
    limit: $limit
    search: $search
    lek: $lek
    
  ) {
    lek
    resultCount
    totalCount
    businessApplications {
      userId
      applicationId
      prequalDetails {
        businessGeneralInfo {
          businessName
        }
        failReasons
      }
      businessDetails {
        stepStatus
      }
      businessPerformance {
        stepStatus
      }
      businessDocumentation {
        stepStatus
      }
      primaryPOC {
        userId
        firstName
        lastName
        phone
        email
      }
      created {
        date
      }
      updated {
        date
      }
      applicationStatus
      applicationSubmittedDate
    }
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
mutation helpAndQuestion($question: helpAndQuestionInput!) {
  helpAndQuestion(question: $question)
}
`;

export const upsertBusinessApplicationInformationBusinessDetails = gql`
mutation _upsertBusinessApplicationInformationBusinessDetails($applicationId: ID!,
  $isPartialData: Boolean, $applicationStep: BusinessApplicationStepEnum!, $applicationType: BusinessApplicationTypeEnum!
  $businessGoal: BusinessGoalEnum, $businessDetails: BusinessDetailsInput) {
  upsertBusinessApplicationInformation(
    applicationId: $applicationId, isPartialData: $isPartialData,
    applicationStep: $applicationStep, applicationType: $applicationType,
    businessGoal: $businessGoal, businessDetails: $businessDetails) {
      applicationId
      applicationStatus
  }
}
`;

export const upsertBusinessApplicationInformationPerformance = gql`
mutation _upsertBusinessApplicationInformationPerformance($applicationId: ID!,
  $isPartialData: Boolean, $applicationStep: BusinessApplicationStepEnum!, $applicationType: BusinessApplicationTypeEnum!
  $businessGoal: BusinessGoalEnum, $businessPerformance: businessPerformanceInput) {
  upsertBusinessApplicationInformation(
    applicationId: $applicationId, isPartialData: $isPartialData,
    applicationStep: $applicationStep, applicationType: $applicationType,
    businessGoal: $businessGoal, businessPerformance: $businessPerformance) {
      applicationId
      applicationStatus
  }
}
`;

export const upsertBusinessApplicationInformationDocumentation = gql`
mutation _upsertBusinessApplicationInformationDocumentation($applicationId: ID!,
  $isPartialData: Boolean, $applicationStep: BusinessApplicationStepEnum!, $applicationType: BusinessApplicationTypeEnum!
  $businessGoal: BusinessGoalEnum, $businessDocumentation: BusinessDocumentationInput) {
  upsertBusinessApplicationInformation(
    applicationId: $applicationId, isPartialData: $isPartialData,
    applicationStep: $applicationStep, applicationType: $applicationType,
    businessGoal: $businessGoal, businessDocumentation: $businessDocumentation) {
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
            countryCode
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
) {
  updateBusinessApplicationInformation(
    applicationId: $applicationId
    issuerId: $issuerId
    businessName: $businessName
    signupCode: $signupCode
  ){
    applicationId
    signupCode
  }
}
`;

export const updateApplicationStatusAndReview = gql`
mutation updateApplicationData(
  $applicationId: String
  $userId: String
  $actionType: String
  $applicationSource: String
  $review: String
) {
  updateApplicationStatusAndReview(
    applicationId: $applicationId
    userId: $userId
    actionType: $actionType
    applicationSource: $applicationSource
    review: $review
  ){
    updated {
      id
      by
      date
    }
  }
}
`;

export const updateBusinessApplicationInformationData = gql`
mutation updateBusinessApplicationInformation(
  $applicationId: String!
  $issuerId: String!
  $review: BusinessApplicationReviewInput
) {
  updateBusinessApplicationInformation(
    applicationId: $applicationId
    issuerId: $issuerId
    review: $review
  ){
    applicationStatus
  }
}
`;
