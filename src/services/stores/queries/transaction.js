import gql from 'graphql-tag';

export const allTransactions = gql`
  query getAccountTransactions($userId: String!, $accountId: String!, $transactionDirection: [TransactionDirectionEnum], $dateFilterStart: String, $dateFilterStop: String, $offset: Int, $orderBy: OrderStatusEnum, $limit: Int) {
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
  mutation _addFunds($userId: String, $amount: Float!, $accountId: String!, $description: String, $agreementId: Int, $sendInvestorNotification: Boolean) {
    addFunds(userId: $userId, amount: $amount, accountId: $accountId, description: $description, agreementId: $agreementId, sendInvestorNotification: $sendInvestorNotification)
  }
`;

export const withdrawFundMutation = gql`
  mutation _withdrawFunds($userId: String, $amount: Float!, $accountId: String!, $description: String, $agreementId: Int, $sendInvestorNotification: Boolean) {
    withdrawFunds(userId: $userId, amount: $amount, accountId: $accountId, description: $description, agreementId: $agreementId, sendInvestorNotification: $sendInvestorNotification)
  }
`;

export const paymentHistory = gql`
  query _getPaymentHistory($investmentId: Int!, $offeringId: String!){
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
  query getInvestmentsByUserIdAndOfferingId($offeringId: String!, $userId: String!) {
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

export const getTransactions = gql`
query _getTransactions($status: [TransactionStatusEnum], $offset: Int, $direction: TransactionDirectionEnum, $limit: Int, $minAmount: Int, $maxAmount: Int, $dateFilterStart: String, $dateFilterStop: String) {
  getTransactions(
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


export const transferRequestAdminApprove = gql`
  mutation transferRequestAdminApprove($id: Int!){
    transferRequestAdminApprove(
    id: $id
    )
  }`;

export const transferRequestAdminVerified = gql`
  mutation transferRequestAdminVerified($id: Int!){
    transferRequestAdminVerified(
    id: $id
    )
  }`;

export const declineTransferRequest = gql`
  mutation declineTransferRequest($id: Int!, $reason: String){
    declineTransferRequest(
    id: $id
    reason: $reason
    )
  }`;

export const transferRequestAdminSync = gql`
mutation transferRequestAdminSync($id: Int!){
  transferRequestAdminSync(
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
