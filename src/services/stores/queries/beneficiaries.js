import gql from 'graphql-tag';

export const getBeneficiaries = gql`
  query getBeneficiaries {
    beneficiaries {   
        accountId   
        type
        status
        updated {
          id
          by
          date
        }
        created {
          id
          by
          date
        }  
        beneficiary {     
            request {
              status
            }
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
      request {
        status
        date
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
}
`;

export const requestOptForBeneficiaries = gql`
  mutation requestOtp($scopeType: mfaEnum!, $method: PhoneVerificationMethodsEnum!) {
    requestOtp(scopeType: $scopeType, method: $method) {
      requestId
      phoneNumber
    }
  }
`;
