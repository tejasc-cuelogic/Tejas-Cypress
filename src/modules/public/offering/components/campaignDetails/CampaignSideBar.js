import React, { Component } from 'react';
import Aux from 'react-aux';
import { inject, observer } from 'mobx-react';
import { withRouter, Route, Link } from 'react-router-dom';
import { get } from 'lodash';
import { Header, Icon, Statistic, Button, Menu, Embed, Responsive, Progress, Popup, Divider } from 'semantic-ui-react';
import { NavItems } from '../../../../../theme/layout/NavigationItems';
import { DataFormatter } from '../../../../../helper';
import Helper from '../../../../../helper/utility';
import share from '../campaignDetails/Share';
import { ASSETS_URL } from '../../../../../constants/aws';
import { CAMPAIGN_KEYTERMS_SECURITIES } from '../../../../../constants/offering';

const nsvideos = {
  embed: '218642510',
};
const isMobile = document.documentElement.clientWidth < 991;

@inject('campaignStore')
@withRouter
@observer
export default class CampaignSideBar extends Component {
  render() {
    const { className, campaignStore } = this.props;
    const { campaign, navCountData } = campaignStore;
    const collected = get(campaign, 'closureSummary.totalInvestmentAmount') || 0;
    const minOffering = campaign && campaign.keyTerms &&
      campaign.keyTerms.minOfferingAmount ? campaign.keyTerms.minOfferingAmount : 0;
    const maxOffering = campaign && campaign.keyTerms &&
    campaign.keyTerms.minOfferingAmount ? campaign.keyTerms.maxOfferingAmount : 0;
    const minFlagStatus = collected >= minOffering;
    const maxFlagStatus = (collected && maxOffering) && collected >= maxOffering;
    const percent = (collected / maxOffering) * 100;
    const terminationDate = campaign && campaign.offering && campaign.offering.launch
      && campaign.offering.launch.terminationDate;
    const address = campaign && campaign.keyTerms ? `${campaign.keyTerms.city ? campaign.keyTerms.city : '-'},
    ${campaign.keyTerms.state ? campaign.keyTerms.state : '-'}` : '--';
    const diff = DataFormatter.diffDays(terminationDate);
    const rewardsTiers = get(campaign, 'rewardsTiers') || [];
    const { offerStructure } = campaign;
    const isClosed = campaign.stage !== 'LIVE';
    return (
      <Aux>
        <div className={`${className} offering-side-menu sticky-sidebar`}>
          <Responsive maxWidth={991} as={Aux}>
            <div className="offering-intro center-align">
              <Header as="h4" inverted>
                {campaign && campaign.keyTerms && campaign.keyTerms.shorthandBusinessName}
                <Header.Subheader>{address}</Header.Subheader>
              </Header>
              <Embed
                id={nsvideos.embed}
                placeholder={`${ASSETS_URL}images/636206632.jpg`}
                source="vimeo"
                icon="ns-play"
              />
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
              <Progress className="mb-0" inverted percent={percent} size="tiny" color="green" />
              <p>{Helper.CurrencyFormat(minFlagStatus ? maxOffering : minOffering)} {minFlagStatus ? 'max target' : 'min target'} {' '}
                <Popup
                  trigger={<Icon name="help circle" color="green" />}
                  content="If the minimum goal is not met by the end of the offering period, any funds you invest will be automatically returned to your NextSeed account."
                  position="top center"
                />
              </p>
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
                      {get(campaign, 'keyTerms.earlyBirdsCount')
                        || 0}
                    </Statistic.Value>
                    <Statistic.Label>Early Bird Rewards</Statistic.Label>
                  </Statistic>
                </Statistic.Group>
              </div>
              {CAMPAIGN_KEYTERMS_SECURITIES[offerStructure] &&
              <p className="raise-type mt-20 mb-0">
                <b>{CAMPAIGN_KEYTERMS_SECURITIES[offerStructure]}</b>{' '}
                <Popup
                  hoverable
                  trigger={<Icon name="help circle" color="green" />}
                  content={(<span>To learn more about how Revenue Sharing works, check out the <Link to="/resources/education-center">Education Center</Link>.</span>)}
                  position="top center"
                />
              </p>
              }
              <p className="mb-half mt-half">
              Investment Multiple: {get(campaign, 'keyTerms.investmentMultiple')}
              </p>
              <p className="mt-half">
                Maturity: {get(campaign, 'keyTerms.maturity')} Months
              </p>
              <Divider hidden />
              {!isClosed &&
                <Button compact fluid={isMobile} as={Link} to={`${this.props.match.url}/invest-now`} disabled={maxFlagStatus} secondary>{`${maxFlagStatus ? 'Fully Reserved' : 'Invest Now'}`}</Button>
              }
              <p>
                ${(campaign && campaign.keyTerms && campaign.keyTerms.minInvestAmt)
                  || 0} min investment
              </p>
            </div>
          </Responsive>
          {!isMobile &&
            <Aux>
              <Menu vertical>
                <NavItems sub refLoc="public" refLink={this.props.match.url} location={this.props.location} navItems={this.props.navItems} countData={navCountData} bonusRewards={rewardsTiers.length} />
              </Menu>
            </Aux>
          }
          <Route path={`${this.props.match.url}/share`} component={share} />
        </div>
      </Aux>
    );
  }
}
