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

export const CreateTransaction = gql`
mutation CreateTransaction($transactionType: String!, $description: String!, $amount: Float!){
    createTransaction(
      transactionType: $transactionType,
      description: $description,
      amount:$amount
    ) {
      id
      createdAt
      amount,
      description
      transactionType
    }
  } 
`;

export const addFundMutation = gql`
  mutation _addFunds($userId: String!, $amount: Float!, $accountId: String!, $description: String, $agreementId: Int) {
    addFunds(userId: $userId, amount: $amount, accountId: $accountId, description: $description, agreementId: $agreementId)
  }
`;

export const requestOptForTransaction = gql`
  mutation _requestOtp($scopeType: mfaEnum!, $method: PhoneVerificationMethodsEnum!) {
    requestOtp(scopeType: $scopeType, method: $method) {
      requestId
      phoneNumber
    }
  }
`;

export const withdrawFundMutation = gql`
  mutation _withdrawFunds($userId: String!, $amount: Float!, $accountId: String!, $description: String, $agreementId: Int) {
    withdrawFunds(userId: $userId, amount: $amount, accountId: $accountId, description: $description, agreementId: $agreementId)
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

export const investmentsByOfferingId = gql`
  query _getInvestmentsByOfferingId($offeringId: String!) {
    getInvestmentsByOfferingId(offeringId: $offeringId) {
      investmentId
      accountId
      status
      amount
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

export const transferRequestAdminDecline = gql`
  mutation transferRequestAdminDecline($id: Int!, $reason: String){
    transferRequestAdminDecline(
    id: $id
    reason: $reason
    )
  }`;

export const transferRequestAdminVerified = gql`
  mutation transferRequestAdminVerified($id: Int!){
    transferRequestAdminVerified(
    id: $id
    )
  }`;

export const transactionFailed = gql`
  mutation transactionFailed($id: Int!, $reason: String){
    transactionFailed(
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
