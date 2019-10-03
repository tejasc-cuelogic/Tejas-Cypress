import gql from 'graphql-tag';

export const allRepayments = gql`
  query allRepayments{
    allRepayments {
      id
      createdAt
      status
      indexRS
      indexTL
      amountRepaid
      investorsRepaid
    }
  }
`;

export const allRepaymentDetails = gql`
  query allRepaymentDetails{
    allRepaymentDetails {
      id
      createdAt
      offering
      return
      status
      investors
      principal
      totalPayment
      fees
    }
  }
`;

export const paymentsIssuerList = gql`
  query paymentsIssuerList{
    paymentsIssuerList {
      shorthandBusinessName
      hardCloseDate
      maturityDate
      expectedPaymentDate
      firstPaymentDate
      sinkingFundBalance
      offering {
        id
        offeringStatus
        stage
      }
    }
  }
`;
