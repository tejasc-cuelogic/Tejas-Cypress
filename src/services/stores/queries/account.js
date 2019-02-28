import gql from 'graphql-tag';

export const createAccount = gql`
  mutation _createAccount($accountAttributes: AccountInputType! $accountStatus: InvestorAccountStatusEnum! $accountType: UserAccountTypeEnum!) {
    createInvestorAccount(
      accountAttributes: $accountAttributes
      accountStatus: $accountStatus
      accountType: $accountType
    ) {
      accountId
      accountType
      accountStatus
      startedDate
      finishedDate
      accountDetails
    }
  }`;

export const upsertInvestorAccount = gql`
  mutation _upsertInvestorAccount($accountId: String $accountAttributes: AccountInputType! $accountType: InvestorAccountTypeEnum!) {
    upsertInvestorAccount(
      accountId: $accountId
      accountAttributes: $accountAttributes
      accountType: $accountType
    ) {
      accountId
      linkedBank {
        accountNumber
        routingNumber
        bankName
      }
      accountType
    }
  }`;

export const submitinvestorAccount = gql`
  mutation _submitInvestorAccount($accountId: String!, $accountType: InvestorAccountTypeEnum!){
    submitInvestorAccount(
      accountId: $accountId,
      accountType: $accountType
    )
  }`;

export const updateInvestorProfileData = gql`
  mutation _updateInvestorProfileData($isPartialProfile: Boolean! $employment: EmploymentStatusInput $brokerageFirmName: String $publicCompanyTicker: String $netWorth: Int $annualIncome: [InvestorAnnualIncome] $experienceLevel: InvestorExperienceLevelTypeEnum $isRiskTaker: Boolean $isComfortable: Boolean $taxFilingAs: InvestorProfileTypeEnum) {
    createInvestorProfile(
      employmentStatusInfo: $employment
      brokerageFirmName: $brokerageFirmName
      publicCompanyTicker: $publicCompanyTicker
      netWorth: $netWorth
      annualIncome: $annualIncome
      experienceLevel: $experienceLevel
      isRiskTaker: $isRiskTaker
      isComfortable: $isComfortable
      taxFilingAs: $taxFilingAs
      isPartialProfile: $isPartialProfile
    ) {
      id
    }
  }`;

export const isUniqueTaxId = gql`
query isUniqueTaxId($taxId: String!) {
  isUniqueTaxId(taxId: $taxId) {
    alreadyExists
  }
}`;

export const createIndividual = gql`
  mutation createIndividiaul($accountAttributes: AccountInputType!, $accountStatus: InvestorAccountStatusEnum!, $accountType: InvestorAccountTypeEnum!){
    createInvestorAccount(accountAttributes: $accountAttributes, accountStatus: $accountStatus, accountType: $accountType){
      userId
      accountId
      linkedBank {
        accountNumber
        routingNumber
        bankName
      }
      accountType
    }
  }`;

export const crowdPayAccountNotifyGs = gql`
  mutation _crowdPayAccountNotifyGS($userId: String, $accountId: String!) {
    crowdPayAccountNotifyGS(
      userId: $userId
      accountId: $accountId
    )
  }`;
