import React, { Component } from 'react';
import { Button, Icon, Item, Header, Divider } from 'semantic-ui-react';
import { orderBy, camelCase } from 'lodash';
import { withRouter } from 'react-router-dom';
import * as moment from 'moment';
import HtmlEditor from '../../../../../shared/HtmlEditor';
import { Image64, UserAvatar } from '../../../../../../theme/shared';

const isMobile = document.documentElement.clientWidth < 768;
const isTablet = document.documentElement.clientWidth < 992;

@withRouter
class LatestUpdates extends Component {
  handleViewUpdates = (e) => {
    e.preventDefault();
    this.props.history.push(`${this.props.refLink}/updates`);
  }

  render() {
    const {
      updates, companyAvatarUrl, bussinessName, newLayout,
    } = this.props;
    const update = (updates && updates.length && updates[updates.length - 1]) || null;
    const postUpdateObj = orderBy(updates, o => (o.updated.date ? moment(new Date(o.updated.date)).unix() : ''), ['desc'])[0];
    const isNextseedUpdatedPost = postUpdateObj && postUpdateObj.postUpdateAs === 'NEXTSEED';
    const userAvatarObj = {
      name: isNextseedUpdatedPost ? 'NextSeed' : bussinessName || '',
      avatarUrl: isNextseedUpdatedPost ? 'logo-icon.svg' : '',
    };
    return (
      <>
        <Header as="h3" className={`${newLayout && isMobile ? 'mt-40' : newLayout ? 'mt-40' : 'mt-20'} ${isMobile ? 'mb-20' : 'mb-30'} anchor-wrap`}>
          {this.props.title || 'Updates'}
          <span className="anchor" id={this.props.title ? camelCase(this.props.title) : 'updates'} />
        </Header>
        <Item.Group className="update-items">
          <Item>
            <Item.Content>
              <div className={`${newLayout ? 'campaign-avatar-v2' : ''} campaign-avatar`}>
                <div className="ui image avatar-image">
                  {companyAvatarUrl && companyAvatarUrl.length && !isNextseedUpdatedPost
                    ? <Image64 srcUrl={companyAvatarUrl} circular />
                    : <UserAvatar UserInfo={userAvatarObj} />
                }
                </div>
                <div className="avatar-details">
                  <Item.Header as={(newLayout && isMobile) ? 'h6' : 'h5'} className={newLayout ? 'ui grey-header mb-0' : ''}>
                    <b> {userAvatarObj.name}</b>
                  </Item.Header>
                  {update
                    && <Item.Meta>{update.updatedDate ? moment(update.updatedDate).format('LL') : '-'}</Item.Meta>
                  }
                </div>
              </div>
              {!newLayout && !isMobile
                ? <Divider hidden />
                : null }
              {update
                ? (
                  <>
                    <Item.Description className={newLayout && isMobile ? 'avatar-description-v2' : 'avatar-description'}>
                      <Header as="h4" className={`${newLayout && isMobile ? 'mb-10' : ''} grey-header`}>{update.title}</Header>
                      <HtmlEditor readOnly content={update.content || ''} />
                    </Item.Description>
                  </>
                )
                : (
                  <>
                    <Item.Description className="neutral-text"><b>No updates yet</b></Item.Description>
                  </>
                )
              }
            </Item.Content>
          </Item>
        </Item.Group>
        {!newLayout
        && (
          <Button fluid={isTablet} onClick={this.handleViewUpdates} basic compact className="highlight-text mt-40">
            View Updates
            <Icon size="small" className="ns-chevron-right right" color="white" />
          </Button>
        )}
      </>
    );
  }
}

export default LatestUpdates;
