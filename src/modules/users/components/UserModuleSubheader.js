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
            <List.Item as="a" to="/app/users/1/details" className="active">Profile</List.Item>
            <List.Item as="a" to="/users/new">Accounts</List.Item>
            <List.Item as="a" to="/users/new">Activity</List.Item>
            <List.Item as="a" to="/users/new">Investments</List.Item>
            <List.Item as="a" to="/users/new">Transactions</List.Item>
            <List.Item as="a" to="/users/new">Statements</List.Item>
            <List.Item as="a" to="/users/new">Referrals</List.Item>
            <List.Item as="a" to="/users/new">Messages</List.Item>
          </List>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  </div>
);

export default userModuleSubheader;
