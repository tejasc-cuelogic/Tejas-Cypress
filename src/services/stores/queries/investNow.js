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
    $userId: String, $accountId: String, $includeInFlight: String,
    $includeInterest: String, $includeReferralCredit: String, $dateFilterStart: String
    $dateFilterStop: String, $txOnly: String,
    ){ 
    getInvestorAvailableCash(
      userId: $userId
      accountId: $accountId
      includeInFlight: $includeInFlight
      includeInterest: $includeInterest
      includeReferralCredit: $includeReferralCredit
      dateFilterStart: $dateFilterStart
      dateFilterStop: $dateFilterStop
      txOnly: $txOnly
    )
  }
`;

export const getUserRewardBalance = gql`
  query _getUserRewardBalance($userId: String, $dateFilterStart: String, $dateFilterStop: String){
    getUserRewardBalance(
      userId: $userId
      dateFilterStart: $dateFilterStart
      dateFilterStop: $dateFilterStop
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
  }
`;

export const validateInvestmentAmount = gql`
  query validateInvestmentAmount(
    $userId: Float, $accountId: String, $offeringId: String, $investmentAmount: String,
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

export const addFunds = gql`
  mutation _addFunds($userId: String, $accountId: String, $amount: Float, $accountId: String, $agreementId: Int){
    addFunds(
      userId: $userId
      accountId: $accountId
      amount: $amount
      description: $description
      agreementId: $agreementId
    )
  }
`;

export const generateAgreement = gql`
  mutation _generateAgreement($userId: String, $accountId: String, $offeringId: String, $investmentAmount: Float, $transferAmount: Float){
    generateAgreement(
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
    }
  }
`;

export const finishInvestment = gql`
  mutation _finishInvestment($userId: String, $accountId: String, $offeringId: String, $investmentAmount: Float, $agreementId: String){
    finishInvestment(
      userId: $userId
      accountId: $accountId
      offeringId: $offeringId
      investmentAmount: $investmentAmount
      agreementId: $agreementId
    )
  }
`;

export const transferFundsForInvestment = gql`
  mutation _transferFundsForInvestment($userId: String, $accountId: String, $transferAmount: Float){
    transferFundsForInvestment(
      userId: $userId
      accountId: $accountId
      transferAmount: $transferAmount
    )
  }
`;
