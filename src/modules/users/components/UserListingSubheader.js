import React from 'react';
import { Link } from 'react-router-dom';
import { Grid, Button, Form, Input, Icon, List, Dropdown } from 'semantic-ui-react';

// TODO: This is mock data for dropdown
const accountType = [
  {
    text: 'Admin',
    value: 'Admin',
  },
  {
    text: 'Business',
    value: 'Business',
  },
  {
    text: 'IRA',
    value: 'IRA',
  },
  {
    text: 'Individual',
    value: 'Individual',
  },
  {
    text: 'Entity',
    value: 'Entity',
  },
];
const status = [
  {
    text: 'Unlocked',
    value: 'Unlocked',
  },
  {
    text: 'Locked',
    value: 'Locked',
  },
];
const accridiation = [
  {
    text: 'Accridiated',
    value: 'Accridiated',
  },
  {
    text: 'Non-Accridiated',
    value: 'Non-Accridiated',
  },
];
const city = [
  {
    text: 'Alabama',
    value: 'Alabama',
  },
  {
    text: 'New York',
    value: 'New York',
  },
];

const userListingSubheader = props => (
  <div className="page-header-section">
    <div className="webcontent-spacer">
      <Grid stackable>
        <Grid.Row>
          <Grid.Column width={4}>
            <h1>Manage Users</h1>
          </Grid.Column>
          <Grid.Column width={5}>
            <Form inverted>
              <Input fluid inverted icon="search" iconPosition="left" placeholder="Type user’s name, e-mail address or ID number" />
            </Form>
          </Grid.Column>
          <Grid.Column width={2} textAlign="center">
            <span className="filter-count">0</span>
            <Button icon color="green" onClick={props.toggleSearch} className="link-button">
              FILTERS <Icon name="caret down" />
            </Button>
          </Grid.Column>
          <Grid.Column width={3} textAlign="right">
            <Button circular color="green" as={Link} floated="right" to="/app/users/new">+ Add new user</Button>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={16}>
            <List horizontal relaxed>
              <List.Item>Showing <strong>{props.summary.total}</strong> records.</List.Item>
              <List.Item as="a" to="/users/new">No filters applied.</List.Item>
              {
                Object.keys(props.summary.byType).map(igKey => (
                  <List.Item key={igKey}>
                    {props.summary.byType[igKey]} {igKey}
                  </List.Item>
                ))
              }
            </List>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
    {props.currState.filters &&
      <div className="search-filters webcontent-spacer">
        <Grid stackable>
          <Grid.Row>
            <Grid.Column width={3}>
              <h5>Account Type</h5>
              <Dropdown className="inverted" placeholder="Select Filter" fluid multiple selection options={accountType} />
            </Grid.Column>
            <Grid.Column width={3}>
              <h5>Status</h5>
              <Dropdown className="inverted" placeholder="Select Filter" fluid multiple selection options={status} />
            </Grid.Column>
            <Grid.Column width={3}>
              <h5>Accridiation</h5>
              <Dropdown className="inverted" placeholder="Select Filter" fluid multiple selection options={accridiation} />
            </Grid.Column>
            <Grid.Column width={4}>
              <h5>Creation date</h5>
              <Form>
                <Form.Group widths="equal">
                  <Form.Field>
                    <Input fluid icon="calendar outline" iconPosition="left" placeholder="01/01/2017" />
                  </Form.Field>
                  <Form.Field>
                    <Input fluid icon="calendar outline" iconPosition="left" placeholder="01/01/2018" />
                  </Form.Field>
                </Form.Group>
              </Form>
            </Grid.Column>
            <Grid.Column width={3}>
              <h5>City</h5>
              <Dropdown className="inverted" placeholder="Select Filter" fluid multiple selection options={city} />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    }
  </div>
);

export default userListingSubheader;
