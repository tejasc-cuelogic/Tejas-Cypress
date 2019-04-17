import React, { Component } from 'react';
import { Button, Icon, Item, Header, Label, Divider } from 'semantic-ui-react';
import moment from 'moment';
import { withRouter } from 'react-router-dom';
import Aux from 'react-aux';
import HtmlEditor from '../../../../../shared/HtmlEditor';
import { Image64, UserAvatar } from '../../../../../../theme/shared';

const isTablet = document.documentElement.clientWidth < 991;

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
    return (
      <Aux>
        <Header as="h3" className="mb-30 anchor-wrap">
          Updates
          <Label circular horizontal color="green">{(updates && updates.length) || 0}</Label>
          <span className="anchor" id="updates" />
        </Header>
        <Item.Group>
          <Item>
            <Item.Content>
              <div className="campaign-avatar">
                <div className="ui image avatar-image">
                  {companyAvatarUrl && companyAvatarUrl.length ?
                    <Image64 srcUrl={companyAvatarUrl} circular />
                    : <UserAvatar UserInfo={{}} />
                }
                </div>
                {/* {companyAvatarUrl && companyAvatarUrl.length ?
                  <div className="avatar-image">
                    <Image64 size="mini" srcUrl={companyAvatarUrl} />
                  </div> : null
                } */}
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
                    <Header as="h4" className="grey-header">{update.title}</Header>
                    <HtmlEditor readOnly content={update.content || ''} />
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
        <Button fluid={isTablet} onClick={this.handleViewUpdates} basic compact className="highlight-text mt-40">
          View Updates
          <Icon size="small" className="ns-chevron-right right" color="white" />
        </Button>
      </Aux>
    );
  }
}

export default LatestUpdates;
