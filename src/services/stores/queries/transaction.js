import gql from 'graphql-tag';

export const allTransactions = gql`
  query getAccountTransactions($userId: String!, $accountId: String!) {
    getAccountTransactions(userId: $userId, accountId: $accountId) {
      date
      description
      type
      status
      amount
      offering
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
