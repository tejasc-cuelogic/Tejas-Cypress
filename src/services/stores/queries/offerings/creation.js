import gql from 'graphql-tag';

export const allOfferings = gql`
  query allOffering2s($filters: Offering2Filter,$first:Int,$skip:Int) {
    allOffering2s( first:$first, skip:$skip, orderBy: createdAt_DESC, filter: $filters){
      id
      campaignName
      createdAt
      launchedDate
      lead
      pocEmail
      pocName
      pocPhone
      status
    }
    _allOffering2sMeta(filter: $filters){
      count
    }
  }
`;

export const deleteOffering = gql`
  mutation deleteOffering2($id: ID!) {
    deleteOffering2(id: $id) {
      id
    }
  }
`;
