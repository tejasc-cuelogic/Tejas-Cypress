import React from 'react';
import { Link } from 'react-router-dom';
import { Grid, List, Icon, Responsive } from 'semantic-ui-react';

const userModuleSubheader = () => (
  <div>
    <div className="page-header-section">
      <Grid>
        <Grid.Row>
          <Grid.Column width={16}>
            <h1>
              <Responsive {...Responsive.onlyComputer}>
                <Link to="/app/users" className="back-link"><Icon name="ns-arrow-left" /></Link>
              </Responsive>
              James Wright
            </h1>
          </Grid.Column>
        </Grid.Row>
        {/* <Grid.Row>
          <Grid.Column width={16}>
          </Grid.Column>
        </Grid.Row> */}
      </Grid>
    </div>
    <div className="secondary-menu">
      <List celled horizontal inverted>
        <List.Item as="a" href="/app/users/1/UserDetails" active>Profile</List.Item>
        <List.Item as="a" href="/app/users/1/UserAccounts">Accounts</List.Item>
        <List.Item as="a" href="/app/users/new">Activity</List.Item>
        <List.Item as="a" href="/app/users/new">Investments</List.Item>
        <List.Item as="a" href="/app/users/new">Transactions</List.Item>
        <List.Item as="a" href="/app/users/new">Statements</List.Item>
        <List.Item as="a" href="/app/users/new">Referrals</List.Item>
        <List.Item as="a" href="/app/users/new">Messages</List.Item>
      </List>
    </div>
  </div>
);

export default userModuleSubheader;
