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
        accountType
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
      status
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
export const createIndividualGoldStarInvestor = gql`
  mutation createIndividualGoldStarInvestor($userId: String!, $accountId: String!) {
    createIndividualGoldStarInvestor(
      userId: $userId
      accountId: $accountId
    )
  }
`;

export const getInvestorCloseAccounts = gql`
query getInvestorCloseAccounts($userId: String!) {
  getInvestorCloseAccounts(
    userId: $userId
  ){
    userId
    accountId
    name
    skipAddressVerifyCheck
    accountType
    accountStatus
    closed{
      date
      reason
      by
    }
    taxStatement{
      fileId
      fileName
      year
      formType
    }
    created{
      date
    }
    accountStatus
    linkedBank{
      bankName
      accountNumber
    }
    initialDepositAmount
    goldstar{
      contactId investorKey 
      accountId
    }
  }
}`;

export const closeInvestorAccount = gql`
mutation _closeInvestorAccount($userId: String!, $accountId: String!, $accountType: InvestorAccountTypeEnum!, $reason: String) {
  closeInvestorAccount (
    userId: $userId
    accountId: $accountId
    accountType: $accountType
    reason: $reason
  )
  {
   errorMessage
   status
 }
}`;
