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
  mutation createBeneficiary($firstName: String!, $lastName: String!, $relationship: String!, $residentalStreet: String!, $city: String!, $state: String!, $zipCode: Int!, $dob: String!, ) {
    createBeneficiary(firstName: $firstName, lastName: $lastName, relationship: $relationship, residentalStreet: $residentalStreet, city: $city, state: $state, zipCode: $zipCode, dob: $dob) {
      id
      firstName
      lastName
      relationship
      residentalStreet
      city
      state
      zipCode
      dob
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
