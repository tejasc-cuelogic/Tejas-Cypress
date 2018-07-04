import React from 'react';
import { Link } from 'react-router-dom';
import { Header, Icon, Statistic, Button, Menu, Label, Divider } from 'semantic-ui-react';

const CampaignSideBar = () => (
  <div className="offering-side-menu">
    <div className="offering-intro">
      <Header as="h4" inverted textAlign="center">
        <Link to="/">
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
      <Button secondary compact>Invest Now</Button>
    </div>
    <Menu vertical>
      <Menu.Item name="inbox" active>
        <Icon name="home" />
        Overview
      </Menu.Item>
      <Menu.Item name="inbox">
        <Icon name="home" />
        About the Company
      </Menu.Item>
      <Menu.Item name="inbox">
        <Icon name="home" />
        Investment Details
      </Menu.Item>
      <Menu.Item name="inbox">
        <Icon name="home" />
        <Label circular color="blue" key="blue">49</Label>
        Bonus Rewards
      </Menu.Item>
      <Menu.Item name="inbox">
        <Icon name="home" />
        Disclosures
      </Menu.Item>
      <Menu.Item name="inbox">
        <Icon name="home" />
        <Label circular color="blue" key="blue">11</Label>
        Comments
      </Menu.Item>
      <Menu.Item name="inbox">
        <Icon name="share alternate" />
        Share
      </Menu.Item>
      <Divider />
      <Menu.Item name="inbox" className="watch-deal-menu">
        <Icon name="heart outline" />
        Watch Deal
      </Menu.Item>
    </Menu>
  </div>
);

export default CampaignSideBar;
