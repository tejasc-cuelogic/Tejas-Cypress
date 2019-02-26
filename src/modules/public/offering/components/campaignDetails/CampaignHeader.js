import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import Aux from 'react-aux';
import { get } from 'lodash';
import { withRouter, Link } from 'react-router-dom';
import { Responsive, Icon, Header, Container, Progress, Popup, Statistic, Grid, Button } from 'semantic-ui-react';
import { DataFormatter } from '../../../../../helper';
import { CAMPAIGN_KEYTERMS_SECURITIES, CAMPAIGN_KEYTERMS_SECURITIES_ENUM } from '../../../../../constants/offering';
import { Image64 } from '../../../../../theme/shared';
import Helper from '../../../../../helper/utility';

@inject('campaignStore')
@withRouter
@observer
export default class CampaignHeader extends Component {
  render() {
    const { campaignStore } = this.props;
    const { campaign, offerStructure } = campaignStore;
    const terminationDate = campaign && campaign.offering && campaign.offering.launch
    && campaign.offering.launch.terminationDate;
    const diff = DataFormatter.diffDays(terminationDate);
    const collected = get(campaign, 'closureSummary.totalInvestmentAmount') || 0;
    const minOffering = campaign && campaign.keyTerms &&
      campaign.keyTerms.minOfferingAmount ? campaign.keyTerms.minOfferingAmount : 0;
    const maxOffering = get(campaign, 'keyTerms.maxOfferingAmount') || 0;
    const minFlagStatus = collected >= minOffering;
    const maxFlagStatus = (collected && maxOffering) && collected >= maxOffering;
    const percent = (collected / maxOffering) * 100;
    const address = campaign && campaign.keyTerms ?
      `${campaign.keyTerms.city ? campaign.keyTerms.city : '-'}, ${campaign.keyTerms.state ? campaign.keyTerms.state : '-'}` : '--';
    const isClosed = campaign.stage !== 'LIVE';
    return (
      <Aux>
        <div className="campaign-banner">
          {get(campaign, 'media.heroBackground.url') &&
            <Image64 bg className="campaign-details-banner" srcUrl={get(campaign, 'media.heroBackground.url')} />
          }
          <section className="banner">
            <Responsive minWidth={768} as={Container}>
              <Grid relaxed stackable>
                <Grid.Column width={10}>
                  <div className="video-wrapper campaign">
                    {campaign && campaign.media &&
                      campaign.media.heroVideo && campaign.media.heroVideo.url ?
                        <Link to={`${this.props.match.url}/overview/herovideo`}>
                          <Image64
                            bg
                            srcUrl={get(campaign, 'media.heroImage.url')}
                            imgType="heroImage"
                          />
                          <Icon className="ns-play play-icon" />
                        </Link>
                        :
                        <Image64
                          bg
                          srcUrl={get(campaign, 'media.heroImage.url')}
                          imgType="heroImage"
                        />
                    }
                    <div className="offer-stats">
                      <Statistic.Group>
                        <Statistic size="mini" className="basic">
                          <Statistic.Value>{diff || 0}</Statistic.Value>
                          <Statistic.Label>Days left</Statistic.Label>
                        </Statistic>
                        <Statistic size="mini" className="basic">
                          <Statistic.Value>
                            {get(campaign, 'closureSummary.totalInvestorCount') || 0}
                          </Statistic.Value>
                          <Statistic.Label>Investors</Statistic.Label>
                        </Statistic>
                        <Statistic size="mini" className="basic">
                          <Statistic.Value>
                            {(campaign && campaign.keyTerms && campaign.keyTerms.earlyBirdsCount)
                              || 0}
                          </Statistic.Value>
                          <Statistic.Label>Early Bird Rewards</Statistic.Label>
                        </Statistic>
                      </Statistic.Group>
                    </div>
                  </div>
                  <div className="clearfix social-links mt-10">
                    {campaign && get(campaign, 'offering.overview.social') ?
                      campaign.offering.overview.social.map(site => (
                        <Aux>
                          {site.url &&
                            <a target="_blank" rel="noopener noreferrer" href={site.url.includes('http') ? site.url : `http://${site.url}`}><Icon disabled name={site.type.toLowerCase()} /></a>
                          }
                        </Aux>
                      )) : ''}
                    <Link to={`${this.props.match.url}/overview/photogallery`} onClick={this.handleViewGallery} className="pull-right">
                      View gallery <Icon size="small" className="ns-chevron-right" />
                    </Link>
                  </div>
                </Grid.Column>
                <Grid.Column width={6} verticalAlign="middle">
                  <Header as="h3" inverted>
                    {campaign && campaign.keyTerms && campaign.keyTerms.shorthandBusinessName}
                    <Header.Subheader>{address}</Header.Subheader>
                  </Header>
                  <Statistic inverted size="tiny" className="basic mb-0">
                    <Statistic.Value>
                      <span className="highlight-text">{Helper.CurrencyFormat(collected)}</span> raised
                    </Statistic.Value>
                    {minFlagStatus &&
                      <Statistic.Label className="flag-status">
                        <Icon name="flag" /> Surpassed minimum goal
                      </Statistic.Label>
                    }
                  </Statistic>
                  <Progress inverted percent={percent} size="tiny" color="green" />
                  <p>{Helper.CurrencyFormat(minFlagStatus ? maxOffering : minOffering)} {minFlagStatus ? 'max target' : 'min target'} {' '}
                    <Popup
                      trigger={<Icon name="help circle" color="green" />}
                      content="If the minimum goal is not met by the end of the offering period, any funds you invest will be automatically returned to your NextSeed account."
                      position="top center"
                    />
                  </p>
                  {CAMPAIGN_KEYTERMS_SECURITIES[offerStructure] &&
                    <p className="raise-type mt-30">
                      <b>{CAMPAIGN_KEYTERMS_SECURITIES[offerStructure]}</b>{' '}
                      <Popup
                        hoverable
                        trigger={<Icon name="help circle" color="green" />}
                        content={
                          <span>To learn more about how {CAMPAIGN_KEYTERMS_SECURITIES[offerStructure]} works, check out the <Link to="/resources/education-center">Education Center</Link>.</span>
                        }
                        position="top center"
                      />
                    </p>
                  }
                  <p className="mb-half">
                    {offerStructure === CAMPAIGN_KEYTERMS_SECURITIES_ENUM.TERM_NOTE &&
                      <Aux>
                      Interest Rate : { get(campaign, 'keyTerms.interestRate') ? (get(campaign, 'keyTerms.interestRate').includes('%') ? get(campaign, 'keyTerms.interestRate') : `${get(campaign, 'keyTerms.interestRate')}%`) : '-' }
                      </Aux>
                    }
                    {offerStructure === CAMPAIGN_KEYTERMS_SECURITIES_ENUM.REVENUE_SHARING_NOTE &&
                      <Aux>
                        Investment Multiple: { get(campaign, 'keyTerms.investmentMultiple') ? `${get(campaign, 'keyTerms.investmentMultiple')}` : '-'}
                      </Aux>
                    }
                    {offerStructure !== CAMPAIGN_KEYTERMS_SECURITIES_ENUM.PREFERRED_EQUITY_506C ?
                      <Aux>
                        Maturity: {get(campaign, 'keyTerms.maturity') || '-'} Months
                      </Aux> :
                      <Aux>
                        <p>
                        Pre-Money Valuation: {get(campaign, 'keyTerms.premoneyValuation') ? Helper.CurrencyFormat(get(campaign, 'keyTerms.premoneyValuation')) : '-'}
                        </p>
                        <p>
                        Share Price Valuation: {get(campaign, 'keyTerms.unitPrice') ? Helper.CurrencyFormat(get(campaign, 'keyTerms.premoneyValuation')) : '-'}
                        </p>
                      </Aux>
                    }
                  </p>
                  <div className="center-align">
                    {!isClosed &&
                      <Button fluid secondary content={`${maxFlagStatus ? 'Fully Reserved' : 'Invest Now'}`} disabled={maxFlagStatus} as={Link} to={`${this.props.match.url}/invest-now`} />
                    }
                    <small>
                      ${(campaign && campaign.keyTerms && campaign.keyTerms.minInvestAmt)
                        || 0} min investment
                    </small>
                  </div>
                </Grid.Column>
              </Grid>
            </Responsive>
          </section>
        </div>
      </Aux>
    );
  }
}
