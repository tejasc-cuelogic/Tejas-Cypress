import React, { Component } from 'react';
import Aux from 'react-aux';
import { inject, observer } from 'mobx-react';
import { Link, withRouter, Route } from 'react-router-dom';
import { get } from 'lodash';
import { Header, Icon, Statistic, Button, Menu, Embed, Responsive, Progress, Divider } from 'semantic-ui-react';
import { NavItems } from '../../../../../theme/layout/NavigationItems';
import { DataFormatter } from '../../../../../helper';
import CampaignProgress from './CampaignProgress';
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
    const { campaign } = campaignStore;
    const collected = campaign && campaign.fundedAmount ? campaign.fundedAmount : 0;
    const minOffering = campaign && campaign.keyTerms &&
      campaign.keyTerms.minOfferingAmount ? campaign.keyTerms.minOfferingAmount : 0;
    const maxOffering = campaign && campaign.keyTerms &&
      campaign.keyTerms.maxOfferingAmount ? campaign.keyTerms.maxOfferingAmount : 0;
    const needValue = collected !== 0 && collected > minOffering ? maxOffering : minOffering;
    const amountType = collected !== 0 && collected > minOffering ? 'max' : 'min';
    const terminationDate = campaign && campaign.offering && campaign.offering.launch
      && campaign.offering.launch.terminationDate;
    const updatesCount = campaign && campaign.updates &&
      campaign.updates.length ? campaign.updates.length : 0;
    const commentsCount = campaign && campaign.comments &&
      campaign.comments.length ? campaign.comments.length : 0;
    const navCountData = { updates: updatesCount, comments: commentsCount };
    const address = campaign && campaign.keyTerms ?
      `${campaign.keyTerms.city ? campaign.keyTerms.city : '-'}, ${campaign.keyTerms.state ? campaign.keyTerms.state : '-'}` : '--';
    const diff = DataFormatter.diffDays(terminationDate);
    const rewardsTiers = get(campaign, 'rewardsTiers') || [];
    // campaign && campaign.rewardsTierIds &&
    //   campaign.rewardsTierIds.length && orderBy(campaign.rewardsTierIds,
    // ['earlyBirdQuantity', 'amount'], ['desc', 'asc']);
    const flagStatus = collected >= minOffering;
    return (
      <Aux>
        <div className={`${className} offering-side-menu`}>
          <div className="offering-intro center-align">
            {isMobile &&
              <Embed
                id={nsvideos.embed}
                placeholder={`${ASSETS_URL}images/636206632.jpg`}
                source="vimeo"
                icon="ns-play"
              />
            }
            <Header as="h4" inverted textAlign="center">
              {/* {!isMobile &&
                <Link to="/offerings" className="icon-link">
                  <Icon name="arrow left" />
                </Link>
              } */}
              {campaign && campaign.keyTerms && campaign.keyTerms.shorthandBusinessName}
              <Header.Subheader>{address}</Header.Subheader>
            </Header>
            <Responsive minWidth={768} as={Aux}>
              <CampaignProgress
                data={
                  {
                    needed: needValue,
                    collected,
                  }}
                amountType={amountType}
                maxOffering={maxOffering}
              />
            </Responsive>
            {flagStatus &&
            <p>
              <Icon name="flag" /> Surpassed minimum goal
            </p>
            }
            <Responsive maxWidth={767} as={Aux}>
              <Progress percent={90} size="tiny" color="green">tiny</Progress>
            </Responsive>
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
            {isMobile &&
              <Button.Group compact widths="2" className="mt-30">
                <Button basic inverted color="green">
                  <Icon name="heart outline" /> Watch Deal
                </Button>
                <Button basic inverted color="green" as={Link} to={`${this.props.match.url}/share`}>
                  <Icon name="share alternate" /> Share
                </Button>
              </Button.Group>
            }
          </div>
          {!isMobile &&
            <Aux>
              <Menu vertical fluid>
                <NavItems sub refLoc="public" location={this.props.location} navItems={this.props.navItems} countData={navCountData} bonusRewards={rewardsTiers.length} />
                {/* <Divider />
                <Menu.Item as={Link} to="/" className="secondary-item">
                  <Icon name="heart outline" /> Watch Deal
                </Menu.Item>
                <Menu.Item as={Link} to={`${this.props.match.url}/share`}
                className="secondary-item">
                  <Icon name="share alternate" /> Share
                </Menu.Item> */}
              </Menu>
              <Button.Group widths="2">
                <Button compact basic inverted color="green">
                  <Icon name="heart outline" /> Watch Deal
                </Button>
                <Button compact basic inverted color="green" as={Link} to={`${this.props.match.url}/share`}>
                  <Icon name="share alternate" /> Share
                </Button>
              </Button.Group>
            </Aux>
          }
          <Route path={`${this.props.match.url}/share`} component={share} />
        </div>
      </Aux>
    );
  }
}
