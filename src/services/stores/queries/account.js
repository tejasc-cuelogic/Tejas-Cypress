import gql from 'graphql-tag';

export const createAccount = gql`
  mutation _createAccount($userId: String! $accountAttributes: AccountInputType! $status: AccountCreationStatusEnum! $accountType: UserAccountTypeEnum!) {
    createInvestorAccount(
      userId: $userId
      accountAttributes: $accountAttributes
      status: $status
      accountType: $accountType
    ) {
      userId
      accountId
      accountType
      status
      startedDate
      finishedDate
      accountDetails
    }
  }`;

export const updateAccount = gql`
  mutation _updateAccount($userId: String! $accountId: String! $accountAttributes: AccountInputType! $status: AccountCreationStatusEnum! $accountType: InvestorAccountTypeEnum!) {
    updateInvestorAccount(
      userId: $userId
      accountId: $accountId
      accountAttributes: $accountAttributes
      status: $status
      type: $accountType
    ) {
      userId
      accountId
      type
    }
  }`;

export const updateInvestorProfileData = gql`
  mutation _updateInvestorProfileData($isPartialProfile: Boolean! $employmentStatusInfo: EmploymentStatusInput $investorProfileType: InvestorProfileTypeEnum $financialInfo: InvestorFinInfoInput $investmentExperienceInfo: InvestmentExperienceInput) {
    createInvestorProfile(
      employmentStatusInfo: $employmentStatusInfo
      investorProfileType: $investorProfileType
      financialInfo: $financialInfo
      investmentExperienceInfo: $investmentExperienceInfo
      isPartialProfile: $isPartialProfile
    ) {
      id
      investorProfileData {
        isPartialProfile
        employmentStatusInfo {
          employmentStatus
          employer
          currentPosition
        }

        investorProfileType
        financialInfo {
          netWorth
          annualIncomeThirdLastYear
          annualIncomeLastYear
          annualIncomeCurrentYear
          directorShareHolderOfCompany
          employedOrAssoWithFINRAFirmName
        }

        investmentExperienceInfo {
          investmentExperienceLevel
          readyInvestingInLimitedLiquiditySecurities
          readyForRisksInvolved
        }
      }
    }
  }`;

export const checkEntityTaxIdCollision = gql`
query checkEntityTaxIdCollision($taxId: String!) {
  checkEntityTaxIdCollision(taxId: $taxId) {
    alreadyExists
  }
}`;

export const createIndividual = gql`
  mutation createIndividiaul($userId: String!, $accountAttributes: AccountInputType!, $status: AccountCreationStatusEnum!, $accountType: InvestorAccountTypeEnum!){
    createInvestorAccount(userId: $userId, accountAttributes: $accountAttributes, status: $status, type: $accountType){
      userId
      accountId
      type
    }
  }`;
