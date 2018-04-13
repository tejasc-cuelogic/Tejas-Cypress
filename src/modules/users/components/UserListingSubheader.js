import React from 'react';
import { Link } from 'react-router-dom';
import { Grid, Button, Form, Input, Icon, List } from 'semantic-ui-react';
import { DropdownFilter, DateRangeFilter, AppliedFilters } from './widgets/Filters';
import { FILTER_META } from './../../../constants/user';

const userListingSubheader = props => (
  <div>
    <div className="page-header-section">
      <Grid stackable>
        <Grid.Row>
          <Grid.Column width={4}>
            <h1>Manage Users</h1>
          </Grid.Column>
          <Grid.Column width={5}>
            <Form inverted>
              <Input fluid onKeyPress={props.executeSearch} inverted icon="search" iconPosition="left" placeholder="Type user’s name, e-mail address or ID number" />
            </Form>
          </Grid.Column>
          <Grid.Column width={3} textAlign="center">
            <span className="filter-count">0</span>
            <Button icon color="green" onClick={props.toggleSearch} className="link-button">
              FILTERS <Icon name="caret down" />
            </Button>
          </Grid.Column>
          <Grid.Column width={4} textAlign="right">
            <Button color="green" as={Link} floated="right" to="/app/users/new">+ Add new user</Button>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
    {/* <Transition.Group animation="slide down" duration="500">
      {props.filters && */}
    {/* <div className={props.filters ? 'demo' : 'demo collapsed'}> */}
    <div style={{ display: props.filters ? '' : 'none' }} className="search-filters">
      <Form inverted>
        <Grid stackable>
          <Grid.Row>
            <DropdownFilter value={props.requestState.search.accountType} name="Account Type" change={props.setSearchParam} options={FILTER_META.accountType} />
            <DropdownFilter value={props.requestState.search.status} name="Status" change={props.setSearchParam} options={FILTER_META.status} />
            <DropdownFilter value={props.requestState.search.accredited} name="Accridiation" keyName="accredited" change={props.setSearchParam} options={FILTER_META.accredited} />
            <DateRangeFilter label="Date Range" name="createdAt" change={props.dateFilter} />
            <DropdownFilter value={props.requestState.search.city} name="City" change={props.setSearchParam} options={FILTER_META.city} />
          </Grid.Row>
        </Grid>
      </Form>
    </div>
    {/* </div> */}
    {/* }
    </Transition.Group> */}
    <div className="filter-meta">
      <Grid stackable>
        <Grid.Row>
          <Grid.Column width={16}>
            <List horizontal relaxed>
              <List.Item>
                {`Showing ${props.summary.count} filtered records out of total ${props.summary.total}.`}
              </List.Item>
              <AppliedFilters filters={props.requestState.search} click={props.removeFilter} />
            </List>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  </div>
);

export default userListingSubheader;
