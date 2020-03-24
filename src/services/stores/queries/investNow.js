import gql from 'graphql-tag';

export const getInvestorAvailableCash = gql`
  query getInvestorAvailableCash(
    $userId: String, $accountId: String!, $includeInFlight: Boolean,
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

export const investNowSubmit = gql`
  mutation investNowSubmit($accountId: String!, $offeringId: String!, $investmentAmount: String!, $agreementId: Int!, $transferAmount: String, $uncheckedToc: [String]){
    investNowSubmit(
      accountId: $accountId
      offeringId: $offeringId
      investmentAmount: $investmentAmount
      agreementId: $agreementId
      transferAmount: $transferAmount
      uncheckedToc: $uncheckedToc
    )
    {
      status
      message
    }
  }
`;

export const investNowGeneratePurchaseAgreement = gql`
mutation investNowGeneratePurchaseAgreement(
  $accountId: String!,
  $offeringId: String!,
  $investmentAmount: String!,
  $transferAmount: String,
  $callbackUrl: String
) {
  investNowGeneratePurchaseAgreement(
    accountId: $accountId,
    offeringId: $offeringId,
    investmentAmount: $investmentAmount,
    transferAmount: $transferAmount,
    callbackUrl: $callbackUrl
  ) {
      agreementId
      envelopeId
      status
      message
      flag
    }
  }
`;

export const investNowGetInvestmentAgreement = gql`
query investNowGetInvestmentAgreement(
  $accountId: String!,
  $offeringId: String!,
  $agreementId: Int!
) {
  investNowGetInvestmentAgreement(
    accountId: $accountId,
    offeringId: $offeringId,
    agreementId: $agreementId
  ) {
      agreementId
      docuSignViewURL
      npaViewUrl
    }
  }
`;
