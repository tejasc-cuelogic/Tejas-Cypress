import React, { Component } from 'react';
import { Grid, Segment, Item, Divider, Header, Label, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import Aux from 'react-aux';
import Parser from 'html-react-parser';
import { Image64 } from '../../../../../../theme/shared';


class LatestUpdates extends Component {
  render() {
    const {
      updates, isTabletLand, refLink, companyAvatarUrl, bussinessName,
    } = this.props;
    const update = (updates && updates.length && updates[0]) || null;
    // let UserInfo = update && update.actingUserInfo ? update.actingUserInfo.info : null;
    // UserInfo = UserInfo ? {
    //   firstName: UserInfo.firstName,
    //   lastName: UserInfo.lastName,
    //   roles: ['investor'],
    //   avatarUrl: UserInfo.avatar ? UserInfo.avatar.url : null,
    // } : {
    //   firstName: 'S',
    //   lastName: 'T',
    //   roles: ['investor'],
    //   avatarUrl: null,
    // };
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
          <Item.Group className="campaign-updates">
            <Item>
              <Item.Content>
                <div className="clearfix">
                  {companyAvatarUrl && companyAvatarUrl.length ?
                    <div className="avatar-image pull-left">
                      <Image64 size="mini" srcUrl={companyAvatarUrl} circular />
                    </div> : null
                  }
                  <Item.Header className="neutral-text">
                    <b>{bussinessName && bussinessName.length && `${bussinessName}`}</b>
                  </Item.Header>
                </div>
                {update ?
                  <Aux>
                    <Item.Meta>{moment(update.updated.date).format('ll')}</Item.Meta>
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
                  </Aux>
                    :
                  <Aux>
                    <Divider />
                    <Item.Description className="neutral-text"><b>No updates yet</b></Item.Description>
                  </Aux>
                }
              </Item.Content>
            </Item>
          </Item.Group>
        </Segment>
      </Grid.Column>
    );
  }
}

export default LatestUpdates;
