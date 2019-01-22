import React, { Component } from 'react';
import Aux from 'react-aux';
import { inject, observer } from 'mobx-react';
import { withRouter, Route, Link } from 'react-router-dom';
import { get } from 'lodash';
import { Header, Icon, Statistic, Button, Menu, Embed, Responsive, Progress, Divider, Popup } from 'semantic-ui-react';
import { NavItems } from '../../../../../theme/layout/NavigationItems';
import { DataFormatter } from '../../../../../helper';
import Helper from '../../../../../helper/utility';
// import CampaignProgress from './CampaignProgress';
import share from '../campaignDetails/Share';
import { ASSETS_URL } from '../../../../../constants/aws';

const nsvideos = {
  embed: '218642510',
};
const isMobile = document.documentElement.clientWidth < 768;

@inject('campaignStore')
@withRouter
@observer
export default class CampaignSideBar extends Component {
  render() {
    const { className, campaignStore } = this.props;
    const { campaign, navCountData } = campaignStore;
    const collected = campaign && campaign.fundedAmount ? campaign.fundedAmount : 0;
    const minOffering = campaign && campaign.keyTerms &&
      campaign.keyTerms.minOfferingAmount ? campaign.keyTerms.minOfferingAmount : 0;
    const maxOffering = campaign && campaign.keyTerms &&
    campaign.keyTerms.minOfferingAmount ? campaign.keyTerms.maxOfferingAmount : 0;
    const flagStatus = collected >= minOffering;
    const percent = (collected / maxOffering) * 100;
    // const needValue = collected !== 0 && collected > minOffering ? maxOffering : minOffering;
    // const amountType = collected !== 0 && collected > minOffering ? 'max' : 'min';
    const terminationDate = campaign && campaign.offering && campaign.offering.launch
      && campaign.offering.launch.terminationDate;
    const address = campaign && campaign.keyTerms ? `${campaign.keyTerms.city ? campaign.keyTerms.city : '-'},
    ${campaign.keyTerms.state ? campaign.keyTerms.state : '-'}` : '--';
    const diff = DataFormatter.diffDays(terminationDate);
    const rewardsTiers = get(campaign, 'rewardsTiers') || [];
    return (
      <Aux>
        <div className={`${className} offering-side-menu sticky-sidebar`}>
          <div className="offering-intro center-align">
            <Responsive maxWidth={767} as={Aux}>
              <Header as="h4" textAlign="center">
                {campaign && campaign.keyTerms && campaign.keyTerms.shorthandBusinessName}
                <Header.Subheader>{address}</Header.Subheader>
              </Header>
              <Embed
                id={nsvideos.embed}
                placeholder={`${ASSETS_URL}images/636206632.jpg`}
                source="vimeo"
                icon="ns-play"
              />
              <Statistic size="tiny" className="basic mb-0">
                <Statistic.Value>
                  <span className="highlight-text">{Helper.CurrencyFormat(collected)}</span> raised
                </Statistic.Value>
              </Statistic>
              {flagStatus &&
              <p>
                <Icon name="flag" /> Surpassed minimum goal
              </p>
              }
              <Progress percent={percent} size="tiny" color="green">tiny</Progress>
              <Statistic size="tiny" className="basic mb-0">
                <Statistic.Label>{Helper.CurrencyFormat(flagStatus ? maxOffering : minOffering)} {flagStatus ? 'max target' : 'min target'} {' '}
                  <Popup
                    trigger={<Icon name="help circle" color="green" />}
                    content="If the minimum goal is not met by the end of the offering period, any funds you invest will be automatically returned to your NextSeed account."
                    position="top center"
                  />
                </Statistic.Label>
              </Statistic>
              <Statistic.Group widths="three" className="center-align">
                <Statistic size="mini" className="basic">
                  <Statistic.Value>{diff || 0}</Statistic.Value>
                  <Statistic.Label>Days left</Statistic.Label>
                </Statistic>
                <Statistic size="mini" className="basic">
                  <Statistic.Value>
                    {(campaign && campaign.closureSummary &&
                      campaign.closureSummary.totalInvestorCount) || 0}
                  </Statistic.Value>
                  <Statistic.Label>Investors</Statistic.Label>
                </Statistic>
                <Statistic size="mini" className="basic">
                  <Statistic.Value>
                    {(campaign && campaign.keyTerms && campaign.keyTerms.earlyBirdsCount) || 0}
                  </Statistic.Value>
                  <Statistic.Label>Early Birds</Statistic.Label>
                </Statistic>
              </Statistic.Group>
              <Divider hidden />
              <Button compact fluid={isMobile} as={Link} to={`${this.props.match.url}/invest-now`} secondary>Invest Now</Button>
              <p>
                ${(campaign && campaign.keyTerms && campaign.keyTerms.minInvestAmt)
                  || 0} min investment
              </p>
            </Responsive>
            {isMobile &&
              <Button.Group compact widths="2" className="mt-30">
                <Button basic color="green">
                  <Icon name="heart outline" /> Watch Deal
                </Button>
                <Button basic color="green" as={Link} to={`${this.props.match.url}/share`}>
                  <Icon name="share alternate" /> Share
                </Button>
              </Button.Group>
            }
          </div>
          {!isMobile &&
            <Aux>
              <Menu vertical>
                <NavItems sub refLoc="public" refLink={this.props.match.url} location={this.props.location} navItems={this.props.navItems} countData={navCountData} bonusRewards={rewardsTiers.length} />
              </Menu>
              {/* <Button.Group widths="2">
                <Button compact basic inverted color="green">
                  <Icon name="heart outline" /> Watch Deal
                </Button>
                <Button compact basic inverted color="green" as={Link}
                to={`${this.props.match.url}/share`}>
                  <Icon name="share alternate" /> Share
                </Button>
              </Button.Group> */}
            </Aux>
          }
          <Route path={`${this.props.match.url}/share`} component={share} />
        </div>
      </Aux>
    );
  }
}
