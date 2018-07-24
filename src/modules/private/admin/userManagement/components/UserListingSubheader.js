import React from 'react';
import { Link } from 'react-router-dom';
import Aux from 'react-aux';
import { Grid, Button, Form, Icon, List } from 'semantic-ui-react';
import { ByKeyword, DropdownFilter, DateRangeFilter, AppliedFilters } from '../../../../../theme/form/Filters';
import { FILTER_META } from '../../../../../constants/user';

export const P1 = props => <ByKeyword {...props} w={[5]} placeholder="Type user’s name, e-mail address, city, state, zip code or phone number" />;

export const P2 = props => (
  <Grid.Column width={3} textAlign="center">
    <span className="filter-count">{Object.keys(props.requestState.search).length}</span>
    <Button icon color="green" onClick={props.toggleSearch} className="link-button">
      Filters <Icon className="ns-caret-down" />
    </Button>
  </Grid.Column>
);

export const P3 = () => (
  <Grid.Column width={3} textAlign="right">
    <Button color="green" as={Link} floated="right" to="/app/users/new">+ Add new user</Button>
  </Grid.Column>
);

export const P5 = props => (
  <Aux>
    <div className={`search-filters ${props.filters ? '' : 'collapsed'}`}>
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
  </Aux>
);
