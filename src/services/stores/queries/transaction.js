import gql from 'graphql-tag';

export const allTransactions = gql`
  query getAccountTransactions($userId: String, $accountId: String!, $transactionDirection: [TransactionDirectionEnum], $dateFilterStart: String, $dateFilterStop: String, $offset: Int, $orderBy: OrderStatusEnum, $limit: Int) {
    getAccountTransactions(
      userId: $userId,
      accountId: $accountId,
      transactionDirection: $transactionDirection
      dateFilterStart: $dateFilterStart
      dateFilterStop: $dateFilterStop
      offset: $offset
      order: $orderBy
      limit: $limit
    ) {
      transactions {
        date
        description
        type
        status
        amount
        offering
      }
      totalCount
    }
  }
`;

export const addFundMutation = gql`
  mutation addFunds($userId: String, $amount: Float!, $accountId: String!, $description: String, $agreementId: Int, $sendInvestorNotification: Boolean) {
    addFunds(userId: $userId, amount: $amount, accountId: $accountId, description: $description, agreementId: $agreementId, sendInvestorNotification: $sendInvestorNotification)
  }
`;

export const withdrawFundMutation = gql`
  mutation withdrawFunds($userId: String, $amount: Float!, $accountId: String!, $description: String, $agreementId: Int, $sendInvestorNotification: Boolean) {
    withdrawFunds(userId: $userId, amount: $amount, accountId: $accountId, description: $description, agreementId: $agreementId, sendInvestorNotification: $sendInvestorNotification)
  }
`;

export const paymentHistory = gql`
  query getPaymentHistory($investmentId: Int!, $offeringId: String!){
    getPaymentHistory(
      investmentId: $investmentId,
      offeringId: $offeringId
    )
    {
      completeDate
      grossTotalAmount
      feeTotalAmount
      netTotalAmount
      remainingAmountDue
      interestGrossAmount
      principalGrossAmount
      remainingPrincipalDue
    }
  }
`;

export const getInvestmentsByUserIdAndOfferingId = gql`
  query getInvestmentsByUserIdAndOfferingId($offeringId: String!, $userId: String) {
    getInvestmentsByUserIdAndOfferingId(offeringId: $offeringId, userId: $userId) {
      investmentId
      accountId
      status
      amount
      agreement {
        agreementId
      }
    }
  }
`;

export const adminGetTransactions = gql`
query adminGetTransactions($status: [TransactionStatusEnum], $offset: Int, $direction: TransactionDirectionEnum, $limit: Int, $minAmount: Int, $maxAmount: Int, $dateFilterStart: String, $dateFilterStop: String) {
  adminGetTransactions(
    status: $status, 
    offset: $offset, 
    direction: $direction,
    limit: $limit, 
    maxAmount: $maxAmount, 
    minAmount: $minAmount, 
    dateFilterStart: $dateFilterStart, 
    dateFilterStop: $dateFilterStop 
    ) {
    transactions {
      requestId
      status
      startDate
      amount
      accountId
      gsTransactionId
      gsProcessId
      type
      investorAccountInfo {
        accountType
        accountStatus
      }
      userInfo {
        id
        info {
          firstName
          lastName
        }
      }
      direction
      estDateAvailable
      agreement {
        agreementId
      }
      failDate
      failDesc
      autodraft
    }
    transactionCount {
      pendingCount
      processingCount
      completedCount
      failedCount
      voidCount
      searchCount
    }
  }
}
`;


export const adminTransferRequestApprove = gql`
  mutation adminTransferRequestApprove($id: Int!){
    adminTransferRequestApprove(
    id: $id
    )
  }`;

export const adminTransferRequestVerified = gql`
  mutation adminTransferRequestVerified($id: Int!){
    adminTransferRequestVerified(
    id: $id
    )
  }`;

export const adminDeclineTransferRequest = gql`
  mutation adminDeclineTransferRequest($id: Int!, $reason: String, $cancelInvestment: Boolean){
    adminDeclineTransferRequest(
    id: $id
    reason: $reason
    cancelInvestment: $cancelInvestment
    )
  }`;

export const adminTransferRequestSync = gql`
mutation adminTransferRequestSync($id: Int!){
  adminTransferRequestSync(
  id: $id
  )
}`;

export const viewLoanAgreement = gql`
  query viewLoanAgreement($agreementId: Int!, $callbackUrl: String) {
    viewLoanAgreement(agreementId: $agreementId, callbackUrl: $callbackUrl) {
      agreementId
      envelopeId
      docuSignViewURL
      npaViewUrl
    }
  }
`;
