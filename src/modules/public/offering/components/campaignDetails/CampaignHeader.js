import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import Aux from 'react-aux';
import { get } from 'lodash';
import { withRouter, Link } from 'react-router-dom';
import { Responsive, Icon, Header, Container, Progress, Popup, Statistic, Grid, Button } from 'semantic-ui-react';
import { DataFormatter } from '../../../../../helper';
import { CAMPAIGN_KEYTERMS_SECURITIES } from '../../../../../constants/offering';
import { Image64 } from '../../../../../theme/shared';
import Helper from '../../../../../helper/utility';

@inject('campaignStore')
@withRouter
@observer
export default class CampaignHeader extends Component {
  render() {
    const { campaignStore } = this.props;
    const { campaign } = campaignStore;
    const { offerStructure } = campaign;
    const terminationDate = campaign && campaign.offering && campaign.offering.launch
    && campaign.offering.launch.terminationDate;
    const diff = DataFormatter.diffDays(terminationDate);
    const collected = campaign && campaign.fundedAmount ? campaign.fundedAmount : 0;
    const minOffering = campaign && campaign.keyTerms &&
      campaign.keyTerms.minOfferingAmount ? campaign.keyTerms.minOfferingAmount : 0;
    const maxOffering = campaign && campaign.keyTerms &&
    campaign.keyTerms.minOfferingAmount ? campaign.keyTerms.maxOfferingAmount : 0;
    const minFlagStatus = collected >= minOffering;
    const maxFlagStatus = (collected && maxOffering) && collected >= maxOffering;
    const percent = (collected / maxOffering) * 100;
    const address = campaign && campaign.keyTerms ?
      `${campaign.keyTerms.city ? campaign.keyTerms.city : '-'}, ${campaign.keyTerms.state ? campaign.keyTerms.state : '-'}` : '--';
    return (
      <Aux>
        <section className="campaign-details-banner banner">
          <Responsive minWidth={768} as={Container}>
            <Grid relaxed stackable>
              <Grid.Column width={10}>
                <div className="video-wrapper">
                  {campaign && campaign.media &&
                    campaign.media.heroVideo && campaign.media.heroVideo.url ?
                      <Link to={`${this.props.match.url}/overview/herovideo`}>
                        <Image64
                          srcUrl={get(campaign, 'media.heroImage.url')}
                          imgType="heroImage"
                        />
                        <Icon className="ns-play play-icon" />
                      </Link>
                      :
                      <Image64
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
                          {get(campaign, 'keyTerms.earlyBirdsCount')
                        || 0}
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
                  <div className="pull-left">
                    <a href="/" target="_blank" rel="noopener noreferrer">
                      <Icon color="white" name="instagram" />
                    </a>
                    <a href="/" target="_blank" rel="noopener noreferrer">
                      <Icon color="white" name="twitter" />
                    </a>
                    <a href="/" target="_blank" rel="noopener noreferrer">
                      <Icon color="white" name="facebook" />
                    </a>
                  </div>
                  <Link to={`${this.props.match.url}/overview/photogallery`} onClick={this.handleViewGallery} className="pull-right">
                    View gallery <Icon size="small" className="ns-chevron-right" />
                  </Link>
                </div>
              </Grid.Column>
              <Grid.Column width={6}>
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
                {/* <Header as="h3" inverted>
                  <span className="highlight-text">$35,000</span> raised
                  <Header.Subheader>of $50,000 min{' '}
                    <Popup
                      trigger={<Icon name="help circle" color="green" />}
                      content="Lorem Ipsum"
                      position="top center"
                    />
                  </Header.Subheader>
                </Header> */}
                {CAMPAIGN_KEYTERMS_SECURITIES[offerStructure] &&
                <p className="raise-type mt-30">
                  <b>{CAMPAIGN_KEYTERMS_SECURITIES[offerStructure]}</b>{' '}
                  <Popup
                    hoverable
                    trigger={<Icon name="help circle" color="green" />}
                    content={(<span>To learn more about how Revenue Sharing works, check out the <Link to="/resources/education-center">Education Center</Link>.</span>)}
                    position="top center"
                  />
                </p>
                }
                <p className="mb-half">
                Investment Multiple: {get(campaign, 'keyTerms.investmentMultiple')}
                </p>
                <p>
                  Maturity: {get(campaign, 'keyTerms.maturity')} Months
                </p>
                <div className="center-align">
                  <Button fluid secondary content={`${maxFlagStatus ? 'Fully Reserved' : 'Invest Now'}`} disabled={maxFlagStatus} as={Link} to={`${this.props.match.url}/invest-now`} />
                  <small>
                    ${(campaign && campaign.keyTerms && campaign.keyTerms.minInvestAmt)
                      || 0} min investment
                  </small>
                </div>
              </Grid.Column>
            </Grid>
          </Responsive>
        </section>
      </Aux>
    );
  }
}
