import React from 'react';
import { Feed, Image, Transition } from 'semantic-ui-react';
import { InlineLoader } from '../../../../../theme/shared/';
import defaultLeaderProfile from '../../../../../assets/images/leader-placeholder.jpg';
import DateTimeFormat from '../../../../../theme/shared/src/DateTimeFormat';

const ActivityFeed = ({ loading, activities }) => (
  <Transition.Group animation="glow" className="activities" as={Feed} duration={900}>
    {loading ? <InlineLoader /> : (
      activities.length === 0 ? <InlineLoader text="No activity to display" /> :
        activities.map(a => (
          <Feed.Event>
            <Feed.Label>
              <Image
                src={a.createdUserInfo && a.createdUserInfo.info && a.createdUserInfo.info.avatar &&
                  a.createdUserInfo.info.avatar.url ? a.createdUserInfo.info.avatar.url :
                  defaultLeaderProfile}
              />
            </Feed.Label>
            <Feed.Content>
              <Feed.Meta>
                {a.createdUserInfo && a.createdUserInfo.info && a.createdUserInfo.info.firstName} {a.createdUserInfo && a.createdUserInfo.info && a.createdUserInfo.info.lastName} <DateTimeFormat format="(M/D/YYYY   |   h:mm a)" datetime={a.activityDate} />
              </Feed.Meta>
              <Feed.Summary>{a.activityTitle}</Feed.Summary>
              <Feed.Extra text>{a.activity}</Feed.Extra>
            </Feed.Content>
          </Feed.Event>
        ))
    )}
  </Transition.Group>
);

export default ActivityFeed;
