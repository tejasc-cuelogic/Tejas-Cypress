import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { get } from 'lodash';
import { withRouter, Link } from 'react-router-dom';
import { Responsive, Icon, Header, Container, Progress, Popup, Statistic, Grid, Button } from 'semantic-ui-react';
import { CAMPAIGN_KEYTERMS_SECURITIES, CAMPAIGN_KEYTERMS_SECURITIES_ENUM } from '../../../../../constants/offering';
import { Image64 } from '../../../../../theme/shared';
import Helper from '../../../../../helper/utility';

const isMobile = document.documentElement.clientWidth < 992;
@inject('campaignStore')
@withRouter
@observer
export default class CampaignHeader extends Component {
  handleInvestNowClick = () => {
    this.props.campaignStore.setFieldValue('isInvestBtnClicked', true);
    this.props.history.push(`${this.props.match.url}/invest-now`);
  }

  render() {
    const { campaignStore } = this.props;
    const { campaign, offerStructure, campaignStatus } = campaignStore;
    const {
      diff, isClosed, isCreation, isEarlyBirdRewards, isInProcessing, collected, minFlagStatus,
      minOffering, maxFlagStatus, maxOffering, earlyBird, bonusRewards, address, percent,
      percentBefore, diffForProcessing,
    } = campaignStatus;
    return (
      <>
        <div className="campaign-banner">
          {get(campaign, 'media.heroBackground.url')
            && <Image64 bg className="campaign-details-banner" srcUrl={get(campaign, 'media.heroBackground.url')} />
          }
          <section className="banner">
            <Responsive minWidth={768} as={Container}>
              <Grid relaxed stackable>
                <Grid.Column width={10}>
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
                        {isClosed && get(campaign, 'closureSummary.repayment.count') > 0
                          && (
                          <Statistic size="mini" className="basic">
                            <Statistic.Value>
                              {get(campaign, 'closureSummary.repayment.count') || 0}
                            </Statistic.Value>
                            <Statistic.Label>Payments made</Statistic.Label>
                          </Statistic>
                          )
                        }
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
                  </div>
                  <div className="clearfix social-links mt-10">
                    {campaign && get(campaign, 'offering.overview.social')
                      ? campaign.offering.overview.social.map(site => (
                        <React.Fragment key={site.type}>
                          {site.url
                            && <a target="_blank" rel="noopener noreferrer" href={site.url.includes('http') ? site.url : `http://${site.url}`}><Icon disabled name={site.type.toLowerCase()} /></a>
                          }
                        </React.Fragment>
                      )) : ''}
                    <Link to={`${this.props.match.url}/overview/photogallery`} onClick={this.handleViewGallery} className="pull-right">
                      View gallery
                      {' '}
                      <Icon size="small" className="ns-chevron-right" />
                    </Link>
                  </div>
                </Grid.Column>
                <Grid.Column width={6}>
                  <Header as="h3" inverted>
                    {campaign && campaign.keyTerms && campaign.keyTerms.shorthandBusinessName}
                    <Header.Subheader>{address}</Header.Subheader>
                  </Header>
                  <Statistic inverted size="tiny" className={`${isMobile && 'mt-40'} basic mb-0`}>
                    <Statistic.Value>
                      <span className="highlight-text">{Helper.CurrencyFormat(collected, 0)}</span>
                      {' '}
raised
                    </Statistic.Value>
                    {minFlagStatus
                      && (
                      <Statistic.Label className="flag-status">
                        <Icon name="flag" />
                        {' '}
Surpassed minimum goal
                      </Statistic.Label>
                      )
                    }
                  </Statistic>
                  {!isClosed
                    ? <Progress percent={minFlagStatus ? percent : 0} size="tiny" color="green"><span className="sub-progress" style={{ width: `${minFlagStatus ? percentBefore : percent}%` }} /></Progress>
                    : <Progress percent="100" size="tiny" color="green" />
                  }
                  <p>
                    {Helper.CurrencyFormat(minFlagStatus ? maxOffering : minOffering, 0)}
                    {' '}
                    {minFlagStatus ? 'max target' : 'min target'}
                    {' '}
                    {' '}
                    <Popup
                      trigger={<Icon name="help circle" color="green" />}
                      content={!minFlagStatus ? 'If the minimum goal is not met by the end of the offering period, any funds you invest will be automatically returned to your NextSeed account.' : 'The offering will remain open until the issuer raises the maximum goal or the offering period ends. As long as the raise exceeds the minimum goal, the issuer will receive the funds.'}
                      position="top center"
                    />
                  </p>
                  {CAMPAIGN_KEYTERMS_SECURITIES[offerStructure]
                    && (
                    <p className="raise-type mb-0">
                      <b>{CAMPAIGN_KEYTERMS_SECURITIES[offerStructure]}</b>
                      {' '}
                      <Popup
                        hoverable
                        trigger={<Icon name="help circle" color="green" />}
                        content={(
                          <span>
To learn more about how
                            {CAMPAIGN_KEYTERMS_SECURITIES[offerStructure]}
                            {' '}
works, check out the
                            <Link to="/resources/education-center">Education Center</Link>
.
                          </span>
)}
                        position="top center"
                      />
                    </p>
                    )
                  }
                  {offerStructure === CAMPAIGN_KEYTERMS_SECURITIES_ENUM.TERM_NOTE
                    && (
                    <p className="mb-0">
                      Interest Rate :
                      {' '}
                      { get(campaign, 'keyTerms.interestRate') ? (get(campaign, 'keyTerms.interestRate').includes('%') ? get(campaign, 'keyTerms.interestRate') : `${get(campaign, 'keyTerms.interestRate')}%`) : '-' }
                    </p>
                    )
                  }
                  {offerStructure === CAMPAIGN_KEYTERMS_SECURITIES_ENUM.REVENUE_SHARING_NOTE
                    && (
                    <p className="mb-0">
                      Investment Multiple:
                      {' '}
                      { get(campaign, 'keyTerms.investmentMultiple') ? get(campaign, 'keyTerms.investmentMultiple') : '-'}
                    </p>
                    )
                  }
                  {offerStructure !== CAMPAIGN_KEYTERMS_SECURITIES_ENUM.PREFERRED_EQUITY_506C
                    ? (
                      <p className="mb-0">
                      Maturity:
                        {' '}
                        {get(campaign, 'keyTerms.maturity') || '-'}
                        {' '}
months
                      </p>
                    )
                    : (
                      <p className="mb-0">
                      Share Price:
                        {' '}
                        {get(campaign, 'keyTerms.unitPrice') ? Helper.CurrencyFormat(get(campaign, 'keyTerms.unitPrice')) : '-'}
                      </p>
                    )
                  }
                  <div className="center-align mt-20">
                    {isCreation
                      ? <Button fluid secondary={diffForProcessing !== 0} content="Coming Soon" disabled />
                      : ''
                    }
                    {!isClosed
                      && (
                      <>
                        <Button
                          fluid
                          secondary={!isInProcessing}
                          disabled={maxFlagStatus || isInProcessing}
                          onClick={this.handleInvestNowClick}
                        >
                          {`${isInProcessing ? 'Processing' : maxFlagStatus ? 'Fully Reserved' : 'Invest Now'}`}
                        </Button>
                        <small>
                          {Helper.CurrencyFormat(get(campaign, 'keyTerms.minInvestAmt'), 0)}
                          {' '}
min investment
                        </small>
                      </>
                      )
                    }
                  </div>
                </Grid.Column>
              </Grid>
            </Responsive>
          </section>
        </div>
      </>
    );
  }
}
