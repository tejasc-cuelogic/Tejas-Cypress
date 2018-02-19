import React from 'react';
import { Link } from 'react-router-dom';
import { Grid, List, Button, Icon } from 'semantic-ui-react';

const userModuleSubheader = () => (
  <div className="page-header-section webcontent-spacer">
    <Grid>
      <Grid.Row>
        <Grid.Column width={6}>
          <h3>James Wright</h3>
        </Grid.Column>
        <Grid.Column width={6}>
          search panel
        </Grid.Column>
        <Grid.Column width={4} textAlign="right">
          <Button color="green" as={Link} floated="right" className="rounded" to="/app/users/new"><Icon name="plus" />Add new user</Button>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column width={16}>
          <List horizontal link>
            <List.Item as="a" to="/users/new">Account data</List.Item>
            <List.Item as="a" to="/users/new">Activity</List.Item>
            <List.Item as="a" to="/users/new">Investments</List.Item>
            <List.Item as="a" to="/users/new">Forms</List.Item>
            <List.Item as="a" to="/users/new">Referrals</List.Item>
            <List.Item as="a" to="/users/new">Messages</List.Item>
          </List>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  </div>
);

export default userModuleSubheader;
