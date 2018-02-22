import React from 'react';
import { Link } from 'react-router-dom';
import { Grid, Button, Form, Input, Icon } from 'semantic-ui-react';

const userListingSubheader = () => (
  <div className="page-header-section">
    <div className="webcontent-spacer">
      <Grid stackable>
        <Grid.Row>
          <Grid.Column width={4}>
            <h3>Manage Users</h3>
          </Grid.Column>
          <Grid.Column width={6}>
            <Form inverted>
              <Input fluid inverted icon="search" iconPosition="left" placeholder="Type user’s name, e-mail address or ID number" />
            </Form>
          </Grid.Column>
          <Grid.Column width={3} textAlign="center">
            <span className="filter-count">0</span>
            <Button as={Link} to="/app" inverted icon color="green" className="link-button">
              FILTERS <Icon name="caret down" />
            </Button>
          </Grid.Column>
          <Grid.Column width={3} textAlign="right">
            <Button color="green" as={Link} floated="right" className="rounded" to="/app/users/new">+ Add new user</Button>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  </div>
);

export default userListingSubheader;
