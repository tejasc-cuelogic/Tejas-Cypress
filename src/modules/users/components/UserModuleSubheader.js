import React from 'react';
import { Link } from 'react-router-dom';
import { Grid, List, Icon } from 'semantic-ui-react';

const userModuleSubheader = () => (
  <div className="page-header-section webcontent-spacer">
    <Grid>
      <Grid.Row>
        <Grid.Column width={16}>
          <h3>
            <Link to="/app/users" className="back-link"><Icon name="long arrow left" /></Link>
            James Wright
          </h3>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column width={16}>
          <List horizontal link>
            <List.Item as="a" href="/app/users/1/UserDetails" className="active">Profile</List.Item>
            <List.Item as="a" href="/app/users/1/UserAccounts">Accounts</List.Item>
            <List.Item as="a" href="/app/users/new">Activity</List.Item>
            <List.Item as="a" href="/app/users/new">Investments</List.Item>
            <List.Item as="a" href="/app/users/new">Transactions</List.Item>
            <List.Item as="a" href="/app/users/new">Statements</List.Item>
            <List.Item as="a" href="/app/users/new">Referrals</List.Item>
            <List.Item as="a" href="/app/users/new">Messages</List.Item>
          </List>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  </div>
);

export default userModuleSubheader;
