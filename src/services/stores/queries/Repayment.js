import gql from 'graphql-tag';

export const adminPaymentsIssuerList = gql`
  query adminPaymentsIssuerList{
    adminPaymentsIssuerList {
      sinkingFundBalance
      offering {
        id
        contact {
          payments
        }
        offeringStatus
        offeringSlug
        stage
        keyTerms {
          securities
          shorthandBusinessName
          securities
        }
        payment {
          inDefault
          sendNotification
          amountDue
          draftDate
        }
        closureSummary {
          startupPeriod
          hardCloseDate
          operationsDate
          anticipatedOpenDate
          keyTerms {
            maturityDate
            expectedPaymentDate: anticipatedPaymentStartDate
            monthlyPayment
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
          monthlyPayment
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
