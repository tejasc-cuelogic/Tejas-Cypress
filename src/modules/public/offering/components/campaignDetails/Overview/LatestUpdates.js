import React, { Component } from 'react';
import { Grid, Segment, Breadcrumb, Item, Divider } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { UserAvatar } from '../../../../../../theme/shared';

class LatestUpdates extends Component {
  render() {
    const { updates, isTabletLand, refLink } = this.props;
    const update = (updates && updates.length && updates[0]) || null;
    let UserInfo = update ? update.actingUserInfo.info : null;
    UserInfo = UserInfo ? {
      firstName: UserInfo.firstName,
      lastName: UserInfo.lastName,
      roles: ['investor'],
      avatarUrl: UserInfo.avatar ? UserInfo.avatar.url : null,
    } : null;
    return (
      <Grid.Column className={isTabletLand && 'mt-30'}>
        <Segment padded>
          <Breadcrumb>
            <Breadcrumb.Section as={Link} to={`${refLink.url}/updates`}><b>Latest Update</b></Breadcrumb.Section>
            <Breadcrumb.Divider icon={{ className: 'ns-chevron-right', color: 'green' }} />
          </Breadcrumb>
          {update ?
            <Item.Group className="campaign-updates">
              <Item>
                <Item.Content>
                  <UserAvatar UserInfo={UserInfo} size="mini" />
                  <Item.Header>{update.actingUserInfo && update.actingUserInfo.info && `${update.actingUserInfo.info.firstName} ${update.actingUserInfo.info.lastName}`}</Item.Header>
                  <Item.Meta>{moment(update.updated.date).format('LL')}</Item.Meta>
                  <Divider />
                  <Item.Description>
                    <p><b>{update.title}</b></p>
                    <p dangerouslySetInnerHTML={{ __html: update.content }} />
                    <Link to={`${refLink.url}/updates`}>View Update</Link>
                  </Item.Description>
                </Item.Content>
              </Item>
            </Item.Group>
          : <p>No Updates are available</p>
          }
        </Segment>
      </Grid.Column>
    );
  }
}

export default LatestUpdates;
