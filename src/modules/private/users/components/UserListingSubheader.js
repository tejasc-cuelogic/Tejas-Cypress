import React from 'react';
import { Link } from 'react-router-dom';
import { Header, Grid, Button, Form, Input, Icon, List } from 'semantic-ui-react';
import { DropdownFilter, DateRangeFilter, AppliedFilters } from '../../../../theme/form/Filters';
import { FILTER_META } from '../../../../constants/user';

const userListingSubheader = props => (
  <div>
    <div className="page-header-section">
      <Grid stackable>
        <Grid.Row>
          <Grid.Column width={4}>
            <Header as="h1">Manage Users</Header>
          </Grid.Column>
          <Grid.Column width={5}>
            <Form inverted>
              <Input fluid onKeyPress={props.executeSearch} inverted icon={{ className: 'ns-search' }} iconPosition="left" placeholder="Type user’s name, e-mail address, city, state, zip code or phone number" />
            </Form>
          </Grid.Column>
          <Grid.Column width={3} textAlign="center">
            <span className="filter-count">{Object.keys(props.requestState.search).length}</span>
            <Button icon color="green" onClick={props.toggleSearch} className="link-button">
              Filters <Icon className="ns-caret-down" />
            </Button>
          </Grid.Column>
          <Grid.Column width={3} textAlign="right">
            <Button color="green" as={Link} floated="right" to="/app/users/new">+ Add new user</Button>
          </Grid.Column>
          <Grid.Column floated="right" textAlign="right">
            <span className="item notification">
              <Icon className="ns-bell" />
              <span className="unread-count">3</span>
            </span>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
    <div style={{ display: props.filters ? '' : 'none' }} className="search-filters">
      <Form inverted>
        <Grid stackable>
          <Grid.Row>
            <Grid.Column width={3}>
              <DropdownFilter value={props.requestState.search.accountType} name="Account Type" change={props.setSearchParam} options={FILTER_META.accountType} isMultiple />
            </Grid.Column>
            <Grid.Column width={3}>
              <DropdownFilter value={props.requestState.search.accountStatus} name="Status" keyName="accountStatus" change={props.setSearchParam} options={FILTER_META.accountStatus} />
            </Grid.Column>
            <Grid.Column width={3}>
              <DropdownFilter value={props.requestState.search.accreditation} name="Accreditation" change={props.setSearchParam} options={FILTER_META.accreditation} />
            </Grid.Column>
            <Grid.Column width={4}>
              <DateRangeFilter filters={props.requestState.search} label="Creation date" name="createdAt" changeStart={props.dateFilterStart} changeEnd={props.dateFilterEnd} />
            </Grid.Column>
            <Grid.Column width={3}>
              <DropdownFilter isMultiple value={props.requestState.search.city} name="City" change={props.setSearchParam} options={FILTER_META.city} />
            </Grid.Column>
          </Grid.Row>
          {/* <Grid.Row>
            <DropdownFilter value={props.requestState.search.state} name="State"
            change={props.setSearchParam} options={FILTER_META.state} isMultiple />
            <FormInput type="text" name="zip code" fielddata={zipCode} />
            <DropdownFilter value={props.requestState.search.accreditation} name="Accreditation"
            change={props.setSearchParam} options={FILTER_META.accreditation} />
          </Grid.Row> */}
        </Grid>
      </Form>
    </div>
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
