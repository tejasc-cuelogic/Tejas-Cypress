import gql from 'graphql-tag';

export const getAmountInvestedInCampaign = gql`
  query _getAmountInvestedInCampaign($offeringId: String, $userId: String, $accountId: String){
    getAmountInvestedInCampaign(
      offeringId: $offeringId
      userId: $userId
      accountId: $accountId
    )
  }
`;

export const getInvestorAvailableCash = gql`
  query _getInvestorAvailableCash(
    $userId: String!, $accountId: String!, $includeInFlight: Boolean,
    $includeInterest: Boolean, $dateFilterStart: String
    $dateFilterStop: String, $txOnly: Boolean,
    ){
    getInvestorAvailableCash(
      userId: $userId
      accountId: $accountId
      includeInFlight: $includeInFlight
      includeInterest: $includeInterest
      dateFilterStart: $dateFilterStart
      dateFilterStop: $dateFilterStop
      txOnly: $txOnly
    )
  }
`;

export const validateInvestmentAmountInOffering = gql`
  query _validateInvestmentAmountInOffering($investmentAmount: Float!, $offeringId: String!, $userId: String!, $accountId: String!){
    validateInvestmentAmountInOffering(
      investmentAmount: $investmentAmount
      offeringId: $offeringId
      userId: $userId
      accountId: $accountId
    )
    {
      status
      message
    }
  }
`;

export const validateInvestmentAmount = gql`
  query validateInvestmentAmount(
    $userId: String!, $accountId: String!, $offeringId: String!, $investmentAmount: Float!,
    $autoDraftDeposit: Float, $creditToSpend: Float,
    ){
    validateInvestmentAmount(
      userId: $userId
      accountId: $accountId
      offeringId: $offeringId
      investmentAmount: $investmentAmount
      autoDraftDeposit: $autoDraftDeposit
      creditToSpend: $creditToSpend
    )
    {
      status
      message
    }
  }
`;

export const getInvestorInFlightCash = gql`
  query _getInvestorInFlightCash($userId: String, $accountId: String, $isAutoDraft: String){
    getInvestorInFlightCash(
      userId: $userId
      accountId: $accountId
      isAutoDraft: $isAutoDraft
    )
  }
`;

export const generateAgreement = gql`
  mutation _generateAgreement($callbackUrl: String, $userId: String!, $accountId: String!, $offeringId: String!, $investmentAmount: Float!, $transferAmount: Float){
    generateAgreement(
      callbackUrl: $callbackUrl
      userId: $userId
      accountId: $accountId
      offeringId: $offeringId
      investmentAmount: $investmentAmount
      transferAmount: $transferAmount
    )
    {
      agreementId
      envelopeId
      docuSignViewURL
      npaViewUrl
    }
  }
`;

export const finishInvestment = gql`
  mutation _finishInvestment($userId: String!, $accountId: String!, $offeringId: String!, $investmentAmount: Float!, $agreementId: Int!, $transferAmount: Float){
    finishInvestment(
      userId: $userId
      accountId: $accountId
      offeringId: $offeringId
      investmentAmount: $investmentAmount
      agreementId: $agreementId
      transferAmount: $transferAmount
    )
    {
      status
      message
    }
  }
`;

export const transferFundsForInvestment = gql`
  mutation _transferFundsForInvestment($userId: String!, $accountId: String!, $transferAmount: Float!){
    transferFundsForInvestment(
      userId: $userId
      accountId: $accountId
      transferAmount: $transferAmount
    )
  }
`;

export const updateInvestmentLimits = gql`
  mutation _updateInvestmentLimits($userId: String, $accountId: String!, $annualIncome: Float, $netWorth: Float, $otherRegCfInvestments: Float){
    updateInvestmentLimits(
      userId: $userId
      accountId: $accountId
      annualIncome: $annualIncome
      netWorth: $netWorth
      otherRegCfInvestments: $otherRegCfInvestments
    )
    {
      investmentLimit
    }
  }
`;

export const investNowGeneratePurchaseAgreement = gql`
mutation investNowGeneratePurchaseAgreement($userId: String!,
  $accountId: String!,
  $offeringId: String!,
  $investmentAmount: Float!,
  $transferAmount: Float,
  $callbackUrl: String
) {
  investNowGeneratePurchaseAgreement(
    userId: $userId,
    accountId: $accountId,
    offeringId: $offeringId,
    investmentAmount: $investmentAmount,
    transferAmount: $transferAmount,
    callbackUrl: $callbackUrl
  ) {
      agreementId
      envelopeId
      docuSignViewURL
      npaViewUrl
      status
      message
      flag
    }
  }
`;
