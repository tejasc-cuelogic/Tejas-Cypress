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
      sinkingFundBalance
      offering {
        id
        offeringStatus
        stage
        keyTerms {
          securities
          shorthandBusinessName
          securities
        }
        closureSummary {
          hardCloseDate
          operationsDate
          keyTerms {
            maturityDate
            expectedPaymentDate: anticipatedPaymentStartDate
          }
          repayment {
            firstPaymentDate: startDate
          }
        }
        offering {
          launch {
            expectedOpsDate
          }
        }
      }
    }
  }
`;

export const updatePaymentIssuer = gql`
  mutation updatePaymentIssuer($offeringId: String!, $paymentIssuerDetailsInput: PaymentIssuerInput!){
    updatePaymentIssuer(offeringId: $offeringId, paymentIssuerDetailsInput: $paymentIssuerDetailsInput) {
      id
      offeringStatus
      stage
      keyTerms {
        securities
        shorthandBusinessName
        securities
      }
      closureSummary {
        hardCloseDate
        operationsDate
        keyTerms {
          maturityDate
          anticipatedPaymentStartDate
        }
        repayment {
          startDate
        }
      }
      offering {
        launch {
          expectedOpsDate
        }
      }
    }
  }  
`;
