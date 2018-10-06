import React, { Component } from 'react';
import Aux from 'react-aux';
import moment from 'moment';
import { inject, observer } from 'mobx-react';
import { Link, withRouter, Route } from 'react-router-dom';
import { Header, Icon, Statistic, Button, Menu, Embed, Responsive, Progress } from 'semantic-ui-react';
import { NavItems } from '../../../../../theme/layout/NavigationItems';
import CampaignProgress from './CampaignProgress';
import share from '../campaignDetails/Share';
import videoPoster from '../../../../../assets/images/636206632.jpg';

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
    const collected = 100;
    const address = 'Houston, TX';
    const { campaign } = campaignStore;
    const terminationDate = campaign && campaign.offering && campaign.offering.launch
      && campaign.offering.launch.terminationDate;
    const d1 = moment().format('MM/DD/YYYY');
    const d2 = terminationDate ? moment(terminationDate).format('MM/DD/YYYY') : null;
    const diff = d2 ? moment(d2, 'MM/DD/YYYY').diff(moment(d1, 'MM/DD/YYYY'), 'days') : null;
    return (
      <Aux>
        <div className={`${className} offering-side-menu`}>
          <div className="offering-intro center-align">
            {isMobile &&
              <Embed
                id={nsvideos.embed}
                placeholder={videoPoster}
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
              {campaign && campaign.keyTerms && campaign.keyTerms.legalBusinessName}
              <Header.Subheader>{address}</Header.Subheader>
            </Header>
            <Responsive minWidth={768} as={Aux}>
              <CampaignProgress
                data={
                  {
                    needed: (campaign && campaign.keyTerms &&
                      campaign.keyTerms.maxOfferingAmount) || 0,
                    collected: collected || 0,
                  }}
              />
            </Responsive>
            <p>
              <Icon name="flag" /> Surpassed minimum goal
            </p>
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
            <Button fluid={isMobile} as={Link} to="invest-now" secondary>Invest Now</Button>
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
                <NavItems sub refLoc="public" location={this.props.location} navItems={this.props.navItems} />
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
