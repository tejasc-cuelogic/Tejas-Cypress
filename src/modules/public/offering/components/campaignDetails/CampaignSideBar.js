import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter, Route, Link } from 'react-router-dom';
import { get } from 'lodash';
import { Header, Icon, Statistic, Button, Menu, Responsive, Progress, Popup, Divider } from 'semantic-ui-react';
import { NavItems } from '../../../../../theme/layout/NavigationItems';
import Helper from '../../../../../helper/utility';
import share from './Share';
import { Image64 } from '../../../../../theme/shared';
import { CAMPAIGN_KEYTERMS_SECURITIES, CAMPAIGN_KEYTERMS_SECURITIES_ENUM } from '../../../../../constants/offering';

const isMobile = document.documentElement.clientWidth < 992;

@inject('campaignStore')
@withRouter
@observer
export default class CampaignSideBar extends Component {
  handleInvestNowClick = () => {
    this.props.campaignStore.setFieldValue('isInvestBtnClicked', true);
    this.props.history.push(`${this.props.match.url}/invest-now`);
  }

  render() {
    const { campaignStore } = this.props;
    const {
      campaign, navCountData, campaignSideBarShow, offerStructure, campaignStatus,
    } = campaignStore;
    const {
      diff, isClosed, isCreation, isInProcessing, collected, minFlagStatus, isBonusReward,
      minOffering, maxFlagStatus, maxOffering, address, percent, percentBefore, diffForProcessing,
      earlyBird, isEarlyBirdRewards, bonusRewards,
    } = campaignStatus;
    return (
      <>
        <div className={`${campaignSideBarShow ? '' : 'collapse'} ${isMobile ? 'mobile-campain-header' : 'sticky-sidebar'} offering-side-menu `}>
          <Responsive maxWidth={991} as={React.Fragment}>
            <div className="offering-intro center-align">
              <Header as="h4" inverted>
                {campaign && campaign.keyTerms && campaign.keyTerms.shorthandBusinessName}
                <Header.Subheader>{address}</Header.Subheader>
              </Header>
              <div className="video-wrapper campaign">
                {campaign && campaign.media
                  && campaign.media.heroVideo && campaign.media.heroVideo.url
                  ? (
<Link to={`${this.props.match.url}/overview/herovideo`}>
                      <Image64
                        bg
                        srcUrl={get(campaign, 'media.heroImage.url')}
                        imgType="heroImage"
                      />
                      <Icon className="ns-play play-icon" />
                    </Link>
                  )
                  : (
<Image64
  bg
  srcUrl={get(campaign, 'media.heroImage.url')}
  imgType="heroImage"
/>
                  )
                }
              </div>
              <Statistic inverted size="tiny" className={`${isMobile && 'mt-30'} basic mb-0`}>
                <Statistic.Value>
                  <span className="highlight-text">{Helper.CurrencyFormat(collected, 0)}</span> raised
                </Statistic.Value>
                {minFlagStatus
                  && (
<Statistic.Label className="flag-status">
                    <Icon name="flag" /> Surpassed minimum goal
                  </Statistic.Label>
                  )
                }
              </Statistic>
              {!isClosed
                ? <Progress className="mb-0" percent={minFlagStatus ? percent : 0} size="tiny" color="green"><span className="sub-progress" style={{ width: `${minFlagStatus ? percentBefore : percent}%` }} /></Progress>
                : <Progress percent="100" size="tiny" color="green" />
              }
              <p>{Helper.CurrencyFormat(minFlagStatus ? maxOffering : minOffering, 0)} {minFlagStatus ? 'max target' : 'min target'} {' '}
                <Popup
                  trigger={<Icon name="help circle" color="green" />}
                  content="If the minimum goal is not met by the end of the offering period, any funds you invest will be automatically returned to your NextSeed account."
                  position="top center"
                />
              </p>
              <div className="offer-stats">
                <Statistic.Group>
                  {!isClosed && diff > 0
                    && (
<Statistic size="mini" className="basic">
                      <Statistic.Value>{diff}</Statistic.Value>
                      <Statistic.Label>Days left</Statistic.Label>
                    </Statistic>
                    )
                  }
                  <Statistic size="mini" className="basic">
                    <Statistic.Value>
                      {get(campaign, 'closureSummary.totalInvestorCount') || 0}
                    </Statistic.Value>
                    <Statistic.Label>Investors</Statistic.Label>
                  </Statistic>
                  {earlyBird && earlyBird.available > 0
                  && isEarlyBirdRewards && !isClosed
                  && bonusRewards
                    ? (
<Statistic size="mini" className="basic">
                      <Statistic.Value>
                        {get(campaign, 'earlyBird.available') || 0}
                      </Statistic.Value>
                      <Statistic.Label>Early Bird Rewards</Statistic.Label>
                    </Statistic>
                    ) : ''
                  }
                </Statistic.Group>
              </div>
              {CAMPAIGN_KEYTERMS_SECURITIES[offerStructure]
              && (
<p className="raise-type mt-20 mb-0">
                <b>{CAMPAIGN_KEYTERMS_SECURITIES[offerStructure]}</b>{' '}
                <Popup
                  hoverable
                  trigger={<Icon name="help circle" color="green" />}
                  content={(<span>To learn more about how {CAMPAIGN_KEYTERMS_SECURITIES[offerStructure]} works, check out the <Link to="/resources/education-center">Education Center</Link>.</span>)}
                  position="top center"
                />
              </p>
              )
              }
              {offerStructure === CAMPAIGN_KEYTERMS_SECURITIES_ENUM.TERM_NOTE
                && (
<p className="mb-0">
                  Interest Rate : { get(campaign, 'keyTerms.interestRate') ? (get(campaign, 'keyTerms.interestRate').includes('%') ? get(campaign, 'keyTerms.interestRate') : `${get(campaign, 'keyTerms.interestRate')}%`) : '-' }
                </p>
                )
              }
              {offerStructure === CAMPAIGN_KEYTERMS_SECURITIES_ENUM.REVENUE_SHARING_NOTE
                && (
<p className="mb-0">
                  Investment Multiple: { get(campaign, 'keyTerms.investmentMultiple') ? get(campaign, 'keyTerms.investmentMultiple') : '-'}
                </p>
                )
              }
              {offerStructure !== CAMPAIGN_KEYTERMS_SECURITIES_ENUM.PREFERRED_EQUITY_506C
                ? (
<p className="mb-0">
                  Maturity: {get(campaign, 'keyTerms.maturity') || '-'} months
                </p>
                )
                : (
<p className="mb-0">
                  Share Price: {get(campaign, 'keyTerms.unitPrice') ? Helper.CurrencyFormat(get(campaign, 'keyTerms.unitPrice')) : '-'}
                </p>
                )
              }
              <Divider hidden />
              {isCreation
                ? <Button fluid secondary={diffForProcessing !== 0} content="Coming Soon" disabled />
                : ''
              }
              {!isClosed
                && (
                <>
                  <Button
                    compact
                    fluid={isMobile}
                    secondary={!isInProcessing}
                    disabled={maxFlagStatus || isInProcessing}
                    onClick={this.handleInvestNowClick}
                  >
                    {`${isInProcessing ? 'Processing' : maxFlagStatus ? 'Fully Reserved' : 'Invest Now'}`}
                  </Button>
                  <p>
                    {Helper.CurrencyFormat(get(campaign, 'keyTerms.minInvestAmt'), 0)} min investment
                  </p>
                </>
                )
              }
            </div>
          </Responsive>
          {!isMobile
            && (
            <>
              <Menu vertical>
                <NavItems sub refLoc="public" refLink={this.props.match.url} location={this.props.location} navItems={this.props.navItems} countData={navCountData} bonusRewards={isBonusReward} isBonusReward={isBonusReward} />
              </Menu>
            </>
            )
          }
          <Route path={`${this.props.match.url}/share`} component={share} />
        </div>
      </>
    );
  }
}
