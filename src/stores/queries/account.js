import gql from 'graphql-tag';

export const verifyCIPUser = gql`
mutation _createUserAccountIndividual(){
  createIndividualAccount(
    userId: "2cf937b5-a97c-4617-b015-ace054bfa3f7",
    plaidPublicToken: "public-sandbox-56870703-0c2e-440f-a1dd-0abdcbce8666",
    plaidAccountId: "R36yKm44nxTD6MlX9EbeCqPPjrx3vWCRk6qpA",
    bankName: "Chase",
    userId: "49d20a2b-c409-4bb6-ad31-de4bc0c5bfcf",
    accountNumber: "0222111111113333", 
    routingNumber: "533901011",
    accountType: individual
  ) {
    ...userAccountInfo
  }
}`;
