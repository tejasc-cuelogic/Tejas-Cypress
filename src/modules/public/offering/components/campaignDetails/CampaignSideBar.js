import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Header, Icon, Statistic, Button, Menu } from 'semantic-ui-react';
import { NavItems } from '../../../../../theme/layout/NavigationItems';

@withRouter
export default class CampaignSideBar extends Component {
  render() {
    return (
      <div className="offering-side-menu">
        <div className="offering-intro">
          <Header as="h4" inverted textAlign="center">
            <Link to="/offerings">
              <Icon name="arrow left" />
            </Link>
            Account Settings
            <Header.Subheader>Manage your preferences</Header.Subheader>
          </Header>
          <div className="progress-bar" />
          <p>
            <Icon name="flag" /> Min reached on 10 days ago
          </p>
          <Statistic.Group widths="three">
            <Statistic size="mini">
              <Statistic.Value>28</Statistic.Value>
              <Statistic.Label>Days left</Statistic.Label>
            </Statistic>
            <Statistic size="mini">
              <Statistic.Value>106</Statistic.Value>
              <Statistic.Label>Investors</Statistic.Label>
            </Statistic>
            <Statistic size="mini">
              <Statistic.Value>49</Statistic.Value>
              <Statistic.Label>Early Birds</Statistic.Label>
            </Statistic>
          </Statistic.Group>
          <Button secondary>Invest Now</Button>
        </div>
        <Menu vertical fluid>
          <NavItems sub refLoc="public" location={this.props.location} navItems={this.props.navItems} />
        </Menu>
      </div>
    );
  }
}
