import React from 'react';
import { Feed, Image, Transition } from 'semantic-ui-react';
import { InlineLoader } from '../../../../../theme/shared/';
import UserOne from '../../../../../assets/images/owner-1.jpg';
import DateTimeFormat from '../../../../../theme/shared/src/DateTimeFormat';

const ActivityFeed = ({ loading, activities }) => (
  <Transition.Group animation="glow" className="activities" as={Feed} duration={900}>
    {loading ? <InlineLoader /> : (
      activities.length === 0 ? <InlineLoader text="No activity to display" /> :
        activities.map(a => (
          <Feed.Event>
            <Feed.Label>
              <Image
                src={a.createdUserInfo.avatar && a.createdUserInfo.avatar.url ?
                  a.avatar.url : UserOne}
              />
            </Feed.Label>
            <Feed.Content>
              <Feed.Meta>
                {a.createdUserInfo.firstName} {a.createdUserInfo.lastName} <DateTimeFormat format="(M/D/YYYY   |   h:mm a)" datetime={a.activityDate} />
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
