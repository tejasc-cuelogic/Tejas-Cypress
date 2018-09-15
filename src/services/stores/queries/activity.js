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
        firstName
        lastName
        avatar {
          url
        }
      }
    }
  }
}
`;

export const addActivity = gql`
  mutation createActivityHistory ($activityHistoryDetails: ActivityHistoryInput!){
    createActivityHistory(activityHistoryDetails: $activityHistoryDetails)
  }
`;
