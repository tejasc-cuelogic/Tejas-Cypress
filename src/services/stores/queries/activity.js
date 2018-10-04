import gql from 'graphql-tag';

export const allActivities = gql`
  query fetchActivityHistoryByFilters ($resourceId: String!, $activityType: ActivityTypeEnum, $scope: ActivityHistoryScopeEnum) {
  filterActivityHistories (
    resourceId: $resourceId
    activityType: $activityType
    scope: $scope
  ){
    activityHistory {
      resourceId
      activityDate
      activityTitle
      activity
      createdUserInfo {
        id
        info {
          firstName
          lastName
          avatar {
            url
            name
          }
        }
      }    
    }
  }
}
`;

export const addActivity = gql`
  mutation createActivityHistory ($activityHistoryDetails: ActivityHistoryInput!){
    createActivityHistory(activityHistoryDetails: $activityHistoryDetails) {
      resourceId
    }
  }
`;
