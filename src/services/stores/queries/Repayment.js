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
  mutation adminPaymentSendIssuerDraftNotice($date: String!, $scope: String, $sendEmail: Boolean){
    adminPaymentSendIssuerDraftNotice(date: $date, scope: $scope, sendEmail: $sendEmail)
  }
`;

export const adminPaymentSendGoldStarDraftInstructions = gql`
  mutation adminPaymentSendGoldStarDraftInstructions($date: String!, $scope: String, $sendEmail: Boolean){
    adminPaymentSendGoldStarDraftInstructions(date: $date, scope: $scope, sendEmail: $sendEmail)
  }
`;

// export const adminPaymentGenerateAdminSummary = gql`
//   mutation adminPaymentGenerateAdminSummary($date: String!, $scope: String, $sendEmail: Boolean){
//     adminPaymentGenerateAdminSummary(date: $date, scope: $scope, sendEmail: $sendEmail)
//   }
// `;

export const adminPaymentSendIssuerFirstNotice = gql`
  mutation adminPaymentSendIssuerFirstNotice($date: String!, $scope: String, $sendEmail: Boolean){
    adminPaymentSendIssuerFirstNotice(date: $date, scope: $scope, sendEmail: $sendEmail)
  }
`;

export const adminPaymentSendIssuerSecondNotice = gql`
  mutation adminPaymentSendIssuerSecondNotice($date: String!, $scope: String, $sendEmail: Boolean){
    adminPaymentSendIssuerSecondNotice(date: $date, scope: $scope, sendEmail: $sendEmail)
  }
`;
