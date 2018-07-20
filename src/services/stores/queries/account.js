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
  mutation _updateAccount($userId: String! $accountId: String! $accountAttributes: AccountInputType! $status: AccountCreationStatusEnum! $accountType: UserAccountTypeEnum!) {
    updateInvestorAccount(
      userId: $userId
      accountId: $accountId
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

export const getPlaidAccountdata = gql`
  mutation _getPlaidAccountData($userId: String! $plaidPublicToken: String! $plaidAccountId: String! $bankName: String! $accountType: UserAccountTypeEnum!) {
    plaidGetValidatedAccountData(
    userId: $userId
    plaidPublicToken: $plaidPublicToken
    plaidAccountId: $plaidAccountId
    bankName: $bankName
    accountType: $accountType
    ) {
    bankName
    accountNumber
    routingNumber
    plaidAccountId
    plaidAccessToken
    plaidItemId
    }
  }`;

export const updateInvestorProfileData = gql`
  mutation _updateInvestorProfileData($employmentStatusInfo: EmploymentStatusInput $investorProfileType: InvestorProfileTypeEnum $financialInfo: InvestorFinInfoInput $investmentExperienceInfo: InvestmentExperienceInput) {
    createInvestorProfile(
      employmentStatusInfo: $employmentStatusInfo
      investorProfileType: $investorProfileType
      financialInfo: $financialInfo
      investmentExperienceInfo: $investmentExperienceInfo
    ) {
      id
      investorProfileData {
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
