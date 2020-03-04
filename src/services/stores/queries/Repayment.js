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
          paymentStartDateCalc
          minPaymentStartDateCalc
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
        paymentStartDateCalc
        minPaymentStartDateCalc
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

export const adminPaymentSendIssuerDraftNotice = gql`
  mutation adminPaymentSendIssuerDraftNotice{
    adminPaymentSendIssuerDraftNotice
  }
`;

export const adminPaymentSendGoldStarDraftInstructions = gql`
  mutation adminPaymentSendGoldStarDraftInstructions{
    adminPaymentSendGoldStarDraftInstructions
  }
`;

export const adminPaymentGenerateAdminSummary = gql`
  mutation adminPaymentGenerateAdminSummary($date: String!){
    adminPaymentGenerateAdminSummary(date: $date)
  }
`;
