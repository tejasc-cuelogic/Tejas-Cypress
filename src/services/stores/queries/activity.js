import gql from 'graphql-tag';

export const allActivities = gql`
  query fetchActivityHistoryByFilters ($resourceId: String!, $activityType: ActivityTypeEnum, $scope: ActivityHistoryScopeEnum, $orderBy: activityhistoryOrderBy, $startDate: String, $endDate: String, $subType: String) {
  filterActivityHistories (
    resourceId: $resourceId
    activityType: $activityType
    scope: $scope
    orderBy: $orderBy
    startDate: $startDate
    endDate: $endDate
    subType: $subType
  ){
    activityHistory {
      resourceId
      activityDate
      activityTitle
      activityType
      activity
      createdUserInfo {
        id
        roles {
          scope
          name
        }
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
