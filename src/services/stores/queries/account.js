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
      linkedBank {
        accountNumber
        routingNumber
        bankName
      }
      type
    }
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
      linkedBank {
        accountNumber
        routingNumber
        bankName
      }
      type
    }
  }`;

export const crowdPayAccountNotifyGs = gql`
  mutation _crowdPayAccountNotifyGS($userId: String, $accountId: String!) {
    crowdPayAccountNotifyGS(
      userId: $userId
      accountId: $accountId
    )
  }`;
