import React, { Component } from 'react';
import { Button, Icon, Item, Header, Label, Divider } from 'semantic-ui-react';
// import { Link } from 'react-router-dom';
import moment from 'moment';
import { withRouter } from 'react-router-dom';
import Aux from 'react-aux';
import Parser from 'html-react-parser';
import { Image64 } from '../../../../../../theme/shared';

@withRouter
class LatestUpdates extends Component {
  handleViewUpdates = (e) => {
    e.preventDefault();
    this.props.history.push(`${this.props.refLink}/updates`);
  }
  render() {
    const {
      updates, companyAvatarUrl, bussinessName,
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
      <Aux>
        <Header as="h3" className="mb-30" id="updates">Updates
          <Label circular horizontal color="green">{(updates && updates.length) || 0}</Label>
        </Header>
        <Item.Group>
          <Item>
            <Item.Content>
              <div className="campaign-avatar">
                {companyAvatarUrl && companyAvatarUrl.length ?
                  <div className="avatar-image">
                    <Image64 size="mini" srcUrl={companyAvatarUrl} />
                  </div> : null
                }
                <div className="avatar-details">
                  <Item.Header>
                    <b>{bussinessName && bussinessName.length && `${bussinessName}`}</b>
                  </Item.Header>
                  {update &&
                    <Item.Meta>{moment(update.updated.date).format('ll')}</Item.Meta>
                  }
                </div>
              </div>
              <Divider hidden />
              {update ?
                <Aux>
                  <Item.Description className="avatar-description">
                    <Header as="h4">{update.title}</Header>
                    <p>
                      {Parser(update.content || '')}
                    </p>
                    {/* <Link to={`${refLink}/updates`}>View Update</Link> */}
                  </Item.Description>
                </Aux>
                  :
                <Aux>
                  <Item.Description className="neutral-text"><b>No updates yet</b></Item.Description>
                </Aux>
              }
            </Item.Content>
          </Item>
        </Item.Group>
        <Button onClick={this.handleViewUpdates} basic compact className="highlight-text mt-40">
          View Updates
          <Icon size="small" className="ns-chevron-right right" color="white" />
        </Button>
      </Aux>
    );
  }
}

export default LatestUpdates;
