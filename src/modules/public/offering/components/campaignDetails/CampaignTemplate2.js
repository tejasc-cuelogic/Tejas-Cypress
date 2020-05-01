import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { orderBy, get } from 'lodash';
import * as moment from 'moment';
import { Divider, Button, Icon } from 'semantic-ui-react';
import InvestmentDetails from './InvestmentDetails';
import LatestUpdates from './Overview/LatestUpdates';
import Updates from './Updates';
import BonusRewards from './BonusRewards';
import Documents from './documents';
import Comments from './Comments';
import Gallery from './AboutCompany/Gallery';
import CustomContent from './CustomContent';

@inject('campaignStore')
@observer
class CampaignTemplate2 extends Component {
  state = {
    expandUpdate: false,
    expandComments: false,
  }

  handleCollapseExpand = (name, processAction) => {
    this.setState({ [name]: !this.state[name] });
    document.querySelector(processAction).scrollIntoView(true);
  }

  render() {
    const { isTabletLand, isTablet, refLink, processScroll } = this.props;
    const { campaign, campaignStatus, dataRoomDocs } = this.props.campaignStore;
    let updates = campaign && campaign.updates;
    updates = orderBy(updates, o => get(o, 'updatedDate') && moment(new Date(o.updatedDate)).unix(), ['asc']);
    const postedComments = get(campaign, 'comments') || [];
    const content = campaignStatus.templateNavs || [];
    return (
      <>
        {content.map(c => (
          c.contentType === 'INVESTMENT_DETAILS'
            ? <InvestmentDetails title={c.title} newLayout />
            : c.contentType === 'BONUS_REWARDS'
              ? (campaignStatus.isBonusReward
                ? (
                  <>
                    <BonusRewards title={c.title} newLayout />
                    <Divider hidden section />
                  </>
                ) : null)
              : c.contentType === 'DATA_ROOM'
                ? ((dataRoomDocs.length && ['LIVE', 'CREATION'].includes(get(campaign, 'stage')))
                  ? (
                    <>
                      <Documents title={c.title} newLayout />
                      <Divider hidden section />
                    </>
                  ) : null)
                : c.contentType === 'GALLERY'
                  ? (
                    <Gallery
                      processScroll={processScroll}
                      newLayout
                      galleryUrl={refLink}
                      title={c.title}
                    />
                  ) : c.contentType === 'COMMENTS'
                    ? (
                      <>
                        <>{!campaignStatus.isFund && <Comments title={c.title} refLink={refLink} newLayout showOnlyOne={!this.state.expandComments} />}</>
                        <>
                          {postedComments.length > 1
                            && (
                              <Button onClick={() => this.handleCollapseExpand('expandComments', '#comments')} className="link-button highlight-text mt-40">
                                {this.state.expandComments ? 'Collapse' : 'Expand'} All Comments
                                <Icon className={`ns-caret-${this.state.expandComments ? 'up' : 'down'} right`} />
                              </Button>
                            )}
                        </>
                      </>
                    ) : c.contentType === 'UPDATES'
                      ? (campaignStatus.updates !== 0
                        && (
                          <>
                            {this.state.expandUpdate
                              ? <Updates title={c.title} newLayout handleUpdateCollapseExpand={this.handleUpdateCollapseExpand} />
                              : (
                                <LatestUpdates
                                  title={c.title}
                                  newLayout
                                  handleUpdateCollapseExpand={this.handleUpdateCollapseExpand}
                                  updates={updates}
                                  refLink={this.props.refLink}
                                  isTabletLand={isTabletLand}
                                  companyAvatarUrl={campaign && campaign.media && campaign.media.avatar && campaign.media.avatar.url ? `${campaign.media.avatar.url}` : ''}
                                  bussinessName={campaign && campaign.keyTerms
                                    && campaign.keyTerms.shorthandBusinessName}
                                />
                              )
                            }
                            {campaign && campaign.updates && campaign.updates.length > 1 ? (
                              <Button onClick={() => this.handleCollapseExpand('expandUpdate', '#updates')} className={`${!isTablet ? 'mt-20' : ''} link-button highlight-text`}>
                                {this.state.expandUpdate ? 'Collapse' : 'Expand'} All Updates
                                <Icon className={`ns-caret-${this.state.expandUpdate ? 'up' : 'down'} right`} />
                              </Button>
                            ) : null
                            }
                            <Divider hidden section />
                          </>
                        ))
                      : ['CUSTOM', 'ISSUER_STATEMENT'].includes(c.contentType)
                        ? <CustomContent title={c.title} content={c.customValue} isTablet={isTablet} />
                        : null
        ))}
      </>
    );
  }
}

export default CampaignTemplate2;
