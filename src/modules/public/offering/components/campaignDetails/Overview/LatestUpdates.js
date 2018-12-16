import React, { Component } from 'react';
import { Grid, Segment, Item, Divider, Header, Label, Icon, Image } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import Aux from 'react-aux';
import Parser from 'html-react-parser';
import { UserAvatar } from '../../../../../../theme/shared';

class LatestUpdates extends Component {
  render() {
    const { updates, isTabletLand, refLink } = this.props;
    const update = (updates && updates.length && updates[0]) || null;
    let UserInfo = update && update.actingUserInfo ? update.actingUserInfo.info : null;
    UserInfo = UserInfo ? {
      firstName: UserInfo.firstName,
      lastName: UserInfo.lastName,
      roles: ['investor'],
      avatarUrl: UserInfo.avatar ? UserInfo.avatar.url : null,
    } : {
      firstName: 'T',
      lastName: 'T',
      roles: ['investor'],
      avatarUrl: null,
    };
    return (
      <Grid.Column className={isTabletLand && 'mt-30'}>
        <Segment padded>
          <Header as="h4">
            {updates && updates.length ?
              <Link to={`${refLink}/updates`}>
                Updates
                <Label circular horizontal color="blue">{(updates && updates.length) || 0}</Label>
                <Icon className="ns-chevron-right" color="green" />
              </Link>
              :
              <Aux>
                Updates
                <Label circular horizontal color="blue">{(updates && updates.length) || 0}</Label>
                <Icon className="ns-chevron-right" color="green" />
              </Aux>
            }
          </Header>
          {update ?
            <Item.Group className="campaign-updates">
              <Item>
                <Item.Content>
                  <Image floated="left" size="mini">
                    <UserAvatar UserInfo={UserInfo} />
                  </Image>
                  <Item.Header>{update.actingUserInfo && update.actingUserInfo.info && `${update.actingUserInfo.info.firstName} ${update.actingUserInfo.info.lastName}`}</Item.Header>
                  <Item.Meta>{moment(update.updated.date).format('LL')}</Item.Meta>
                  <Divider />
                  <Item.Description>
                    <div className="segment-container mini">
                      <p><b>{update.title}</b></p>
                      <p>
                        {Parser(update.content || '')}
                      </p>
                    </div>
                    <Link to={`${refLink}/updates`}>View Update</Link>
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
