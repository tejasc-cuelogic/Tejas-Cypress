import gql from 'graphql-tag';

export const allOfferings = gql`
  query _getOfferings($stage: OfferingStageEnumType){
    getOfferings(filters: { stage: $stage }){
      id
      keyTerms {
        legalBusinessName
      }
      offering {
        launch {
          targetDate
        }
      }
      applicationId
      issuerId
      lead {
        id
        name
      }
      stage
      created{
        id
        date
      }
      updated{
        id
        date
      }
    }
  }
`;

export const deleteOffering = gql`
  mutation deleteOffering($id: String!) {
    deleteOffering(id: $id) {
      id
    }
  }
`;

export const getOffering = gql`
  query _getOfferingById($id: String!) {
    getOfferingById(id: $id) {
      id
      selectedOffer {
        structure
      }
      applicationId
      issuerId
      lead {
        id
        name
      }
      stage
      rewardsTierIds
      created{
        id
        date
      }
      updated{
        id
        date
      }
      deleted{
        id
        date
      }
    }
  }
`;
