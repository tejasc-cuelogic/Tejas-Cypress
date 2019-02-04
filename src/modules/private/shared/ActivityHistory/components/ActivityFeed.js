import React from 'react';
import { get } from 'lodash';
import { Feed, Image, Transition } from 'semantic-ui-react';
import { InlineLoader, UserAvatar } from '../../../../../theme/shared/';
import DateTimeFormat from '../../../../../theme/shared/src/DateTimeFormat';
import { ASSETS_URL } from '../../../../../constants/aws';

const ActivityFeed = ({ loading, activities }) => (
  <Transition.Group animation="glow" className="activities" as={Feed} duration={900}>
    {loading ? <InlineLoader /> : (
      activities.length === 0 ? <InlineLoader text="No activity to display" /> :
        activities.map(a => (
          <Feed.Event>
            <Feed.Label>
              {a.createdUserInfo ?
                <UserAvatar
                  UserInfo={{
                    firstName: get(a.createdUserInfo, 'info.firstName') || '',
                    lastName: get(a.createdUserInfo, 'info.lastName') || '',
                    avatarUrl: get(a.createdUserInfo, 'info.avatar.url') || '',
                    roles: get(a.createdUserInfo, 'roles').map(r => r.scope),
                  }}
                  base64url
                /> :
                <Image src={`${ASSETS_URL}images/logo-icon.svg`} />
              }
            </Feed.Label>
            <Feed.Content>
              <Feed.Meta>
                { a.createdUserInfo ?
                `${a.createdUserInfo && a.createdUserInfo.info && a.createdUserInfo.info.firstName} 
                ${a.createdUserInfo && a.createdUserInfo.info && a.createdUserInfo.info.lastName}`
                : 'NextSeed Notifications' }
                <DateTimeFormat format="(M/D/YYYY   |   h:mm a)" datetime={a.activityDate} />
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
