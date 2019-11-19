import React from 'react';
import { get } from 'lodash';
import { Link } from 'react-router-dom';
import { Feed, Transition, List } from 'semantic-ui-react';
import { InlineLoader, UserAvatar } from '../../../../../theme/shared';
import DateTimeFormat from '../../../../../theme/shared/src/DateTimeFormat';
import NSImage from '../../../../shared/NSImage';
import { DataFormatter } from '../../../../../helper';
import { NEXTSEED_BOX_URL } from '../../../../../constants/common';

const ActivityFeed = ({ loading, activities, classes }) => (
  <Transition.Group animation="glow" className={`activities ${classes}`} as={Feed} duration={900}>
    {loading ? <InlineLoader /> : (
      activities.length === 0 ? <InlineLoader text="No activity to display" />
        : activities.map(a => (
          <Feed.Event>
            <Feed.Label>
              {a.createdUserInfo
                ? (
                  <UserAvatar
                    UserInfo={{
                      firstName: get(a.createdUserInfo, 'info.firstName') || '',
                      lastName: get(a.createdUserInfo, 'info.lastName') || '',
                      avatarUrl: get(a.createdUserInfo, 'info.avatar.url') || '',
                      roles: get(a.createdUserInfo, 'roles').map(r => r.scope),
                    }}
                    base64url
                  />
                )
                : <NSImage path="logo-icon.svg" />
              }
            </Feed.Label>
            <Feed.Content>
              <Feed.Meta>
                {a.createdUserInfo
                  ? `${a.createdUserInfo && a.createdUserInfo.info && a.createdUserInfo.info.firstName}
                ${a.createdUserInfo && a.createdUserInfo.info && a.createdUserInfo.info.lastName}`
                  : 'NextSeed Notifications'}
                <DateTimeFormat isCSTFormat datetime={DataFormatter.getDateAsPerTimeZone((a.activityDate), true, false, false, 'MM/DD/YYYY  |  HH:mm:ssA')} />
              </Feed.Meta>
              <Feed.Summary>{a.activityTitle}</Feed.Summary>
              <Feed.Extra text>{a.activity}</Feed.Extra>
              {a.documents && a.documents.length
                ? a.documents.map(d => get(d, 'fileHandle.boxFileId') && (
                  <List horizontal>
                    <List.Item className="mr-10">
                      <List.Content className="mr-10">
                         <Link to="/" onClick={(e) => { e.preventDefault(); window.open(`${NEXTSEED_BOX_URL}file/${get(d, 'fileHandle.boxFileId')}`, '_blank'); }}>{get(d, 'fileName')}</Link>
                      </List.Content>
                    </List.Item>
                  </List>
                )) : null}
            </Feed.Content>
          </Feed.Event>
        ))
    )}
  </Transition.Group>
);

export default ActivityFeed;
