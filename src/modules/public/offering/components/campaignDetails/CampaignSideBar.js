import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Header, Icon, Statistic, Button, Menu, Divider } from 'semantic-ui-react';
import { NavItems } from '../../../../../theme/layout/NavigationItems';
import CampaignProgress from './CampaignProgress';

@withRouter
export default class CampaignSideBar extends Component {
  render() {
    const {
      needed, collected, title, address,
    } = this.props.details;
    return (
      <div className="offering-side-menu">
        <div className="offering-intro center-align">
          <Header as="h4" inverted textAlign="center">
            <Link to="/offerings" className="icon-link">
              <Icon name="arrow left" />
            </Link>
            {title}
            <Header.Subheader>{address}</Header.Subheader>
          </Header>
          <CampaignProgress data={{ needed, collected }} />
          <p>
            <Icon name="flag" /> Min reached on 10 days ago
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
          <Button as={Link} to="invest-now" secondary>Invest Now</Button>
        </div>
        <Menu vertical fluid>
          <NavItems sub refLoc="public" location={this.props.location} navItems={this.props.navItems} />
          <Divider />
          <Menu.Item as={Link} to="/" className="watch-deal-menu">
            <Icon name="heart outline" /> Watch Deal
          </Menu.Item>
          <Menu.Item as={Link} to="/" className="watch-deal-menu">
            <Icon name="share alternate" /> Share
          </Menu.Item>
        </Menu>
      </div>
    );
  }
}
