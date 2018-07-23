import gql from 'graphql-tag';

export const createBusinessApplicationPrequalificaiton = gql`
mutation _submitBusinessApplicationPreQualStepSuccessScenario($preQualificationData: PrequalDetailsInput!) {
  createBusinessApplicationPrequalification(prequalificationDetails: $preQualificationData) {
    status
    id
    partnerStatus {
      partnerId
      status
      failReasons
    }
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

export const upsertBusinessApplicationInformationBusinessDetails = gql`
mutation _upsertBusinessApplicationInformationBusinessDetails($applicationId: ID!,
  $isPartialData: Boolean, $applicationStep: BusinessApplicationStepEnum!,
  $businessGoal: BusinessGoalEnum!, $businessDetails: BusinessDetailsInput) {
  upsertBusinessApplicationInformation(
    applicationId: $applicationId, isPartialData: $isPartialData,
    applicationStep: $applicationStep,
    businessGoal: $businessGoal, businessDetails: $businessDetails) {
      applicationId
      applicationStatus
  }
}
`;

export const upsertBusinessApplicationInformationPerformance = gql`
mutation _upsertBusinessApplicationInformationPerformance($applicationId: ID!,
  $isPartialData: Boolean, $applicationStep: BusinessApplicationStepEnum!,
  $businessGoal: BusinessGoalEnum!, $businessPerformance: businessPerformanceInput) {
  upsertBusinessApplicationInformation(
    applicationId: $applicationId, isPartialData: $isPartialData,
    applicationStep: $applicationStep,
    businessGoal: $businessGoal, businessPerformance: $businessPerformance) {
      applicationId
      applicationStatus
  }
}
`;

export const upsertBusinessApplicationInformationDocumentation = gql`
mutation _upsertBusinessApplicationInformationDocumentation($applicationId: ID!,
  $isPartialData: Boolean, $applicationStep: BusinessApplicationStepEnum!,
  $businessGoal: BusinessGoalEnum!, $businessDocumentation: BusinessDocumentationInput) {
  upsertBusinessApplicationInformation(
    applicationId: $applicationId, isPartialData: $isPartialData,
    applicationStep: $applicationStep,
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
    applicationStatus
    createdDate
    updatedDate
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
    applicationId
    applicationStatus
    lendio {
      status
      failReasons
    }
    createdDate
    updatedDate
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
      providePersonalGurantee
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

export const submitPartneredWithLendio = gql`
mutation submitPartneredWithLendio(
  $applicationId: String!,
  $preQualificationQuestions: PreQualificationQuestionsInput!,
  $customerInformation: CustomerInformationInput!,
  $agreeConditions: Boolean,
  $sendDataToLendio: Boolean
) {
  submitPartneredWithLendio(
    applicationId: $applicationId,
    preQualificationQuestions: $preQualificationQuestions,
    customerInformation: $customerInformation,
    agreeConditions: $agreeConditions,
    sendDataToLendio: $sendDataToLendio
  ) {
    status
    url
  }
}
`;
