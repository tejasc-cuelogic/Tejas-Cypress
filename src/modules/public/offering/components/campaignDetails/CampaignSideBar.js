import React, { Component } from 'react';
import Aux from 'react-aux';
import { Link, withRouter, Route } from 'react-router-dom';
import { Header, Icon, Statistic, Button, Menu, Divider, Embed } from 'semantic-ui-react';
import { NavItems } from '../../../../../theme/layout/NavigationItems';
import CampaignProgress from './CampaignProgress';
import share from '../campaignDetails/Share';
import videoPoster from '../../../../../assets/images/636206632.webp';

const nsvideos = {
  embed: '218642510',
};
const isMobile = document.documentElement.clientWidth < 768;
@withRouter
export default class CampaignSideBar extends Component {
  render() {
    const {
      needed, collected, title, address,
    } = this.props.details;
    const { className } = this.props;
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
              {!isMobile &&
                <Link to="/offerings" className="icon-link">
                  <Icon name="arrow left" />
                </Link>
              }
              {title}
              <Header.Subheader>{address}</Header.Subheader>
            </Header>
            <CampaignProgress data={{ needed, collected }} />
            <p>
              <Icon name="flag" /> Surpassed minimum goal
            </p>
            <Statistic.Group widths="three" className="center-align">
              <Statistic size="mini" className="basic">
                <Statistic.Value>28</Statistic.Value>
                <Statistic.Label>Days left</Statistic.Label>
              </Statistic>
              <Statistic size="mini" className="basic">
                <Statistic.Value>106</Statistic.Value>
                <Statistic.Label>Investors</Statistic.Label>
              </Statistic>
              <Statistic size="mini" className="basic">
                <Statistic.Value>49</Statistic.Value>
                <Statistic.Label>Early Birds</Statistic.Label>
              </Statistic>
            </Statistic.Group>
            <Button fluid={isMobile} as={Link} to="invest-now" secondary>Invest Now</Button>
            <p>$100 min investment</p>
            {isMobile &&
              <Button.Group compact fluid widths="2" className="mt-30">
                <Button basic color="grey">
                  <Icon name="heart outline" /> Watch Deal
                </Button>
                <Button basic color="grey">
                  <Icon name="share alternate" /> Share
                </Button>
              </Button.Group>
            }
          </div>
          {!isMobile &&
            <Menu vertical fluid>
              <NavItems sub refLoc="public" location={this.props.location} navItems={this.props.navItems} />
              <Divider />
              <Menu.Item as={Link} to="/" className="watch-deal-menu">
                <Icon name="heart outline" /> Watch Deal
              </Menu.Item>
              <Menu.Item as={Link} to={`${this.props.match.url}/share`} className="watch-deal-menu">
                <Icon name="share alternate" /> Share
              </Menu.Item>
            </Menu>
          }
          <Route path={`${this.props.match.url}/share`} component={share} />
        </div>
      </Aux>
    );
  }
}
