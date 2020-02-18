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
          maturity
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
        maturity
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
`;
