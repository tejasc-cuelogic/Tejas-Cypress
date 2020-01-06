import gql from 'graphql-tag';

export const adminFilterActivityHistories = gql`
  query adminFilterActivityHistories ($resourceId: String!, $activityType: ActivityTypeEnum, $scope: ActivityHistoryScopeEnum, $orderBy: activityhistoryOrderBy, $startDate: String, $endDate: String, $subType: String) {
  adminFilterActivityHistories (
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
      documents {
        fileId
        fileName
        fileHandle {
          boxFileId
        }
      }
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

export const createActivityHistory = gql`
  mutation createActivityHistory ($activityHistoryDetails: ActivityHistoryInput!){
    createActivityHistory(activityHistoryDetails: $activityHistoryDetails) {
      resourceId
    }
  }
`;
