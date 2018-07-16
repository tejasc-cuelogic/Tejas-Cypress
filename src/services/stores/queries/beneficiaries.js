import gql from 'graphql-tag';

export const allBeneficiaries = gql`
  query allBeneficiaries {
    allBeneficiaries{
      id
      firstName
      lastName
      relationship
      residentalStreet
      city
      state
      zipCode
      dob
      status
    }
  }
`;

export const getBeneficiaries = gql`
  query getBeneficiaries {
    beneficiaries {   
        accountId   
        accountType
        status
        updatedDate
        createdDate   
        beneficiary {     
            requestStatus    
            recipients {     
                firstName    
                lastName    
                dob     
                relationship     
                shares     
                address {     
                    street    
                    city     
                    state     
                    zipCode    
                }     
            }    
        }    
    }     
  }
`;

export const createBeneficiaryMutation = gql`
mutation _createBeneficiaries($requestId: String!, $verificationCode: String!, $accountId: String!, $beneficiaries: [BeneficiaryRecipientInput]!) {
  createBeneficiaries(requestId: $requestId, accountId: $accountId, verificationCode: $verificationCode, beneficiaries: $beneficiaries) {
    userId
    accountId
    beneficiary {
      requestedDate
      requestStatus
      recipients {
        firstName
        lastName
        dob
        relationship
        shares
        address {
          street
          city
          state
          zipCode
        }
      }
    }
  }
}
`;

export const deleteBeneficiary = gql`
  mutation deleteBeneficiary($id:  ID! ) {
    deleteBeneficiary(id: $id) {
      id
    }
  }
`;

export const requestOptForBeneficiaries = gql`
  mutation _requestOtp($scopeType: mfaEnum!, $method: PhoneVerificationMethodsEnum!) {
    requestOtp(scopeType: $scopeType, method: $method) {
      requestId
      phoneNumber
    }
  }
`;
