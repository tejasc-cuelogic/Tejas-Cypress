import gql from 'graphql-tag';

export const allTransactions = gql`
query allTransactions($filters: TransactionFilter,$first:Int,$skip:Int) {
    allTransactions( first:$first, skip:$skip, orderBy: createdAt_DESC, filter: $filters){
      id
      createdAt
      amount,
      description
      transactionType
    }
    _allTransactionsMeta(filter: $filters){
      count
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

export const addFunds = gql`
  mutation addFunds($userId: String!, $amount: Float!, $accountId: String!, $description: String, $agreementId: Int!) {
    addFunds(userId: $userId, amount: $amount, accountId: $accountId, description: $description, agreementId: $agreementId)
  }
`;
