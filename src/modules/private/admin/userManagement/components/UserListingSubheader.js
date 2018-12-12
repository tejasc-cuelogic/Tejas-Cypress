import React from 'react';
import { Link } from 'react-router-dom';
import { Grid, Button, Form, Icon } from 'semantic-ui-react';
import { ByKeyword, DropdownFilter, DateRangeFilter } from '../../../../../theme/form/Filters';
import { FILTER_META } from '../../../../../constants/user';

export const P1 = props => <ByKeyword {...props} w={[8]} placeholder="Search by name" />;

export const P2 = props => (
  <Grid.Column width={3} textAlign="center">
    <span className="filter-count">{Object.keys(props.requestState.search).length}</span>
    <Button icon color="blue" onClick={props.toggleSearch} className="link-button">
      Filters <Icon className="ns-caret-down" />
    </Button>
  </Grid.Column>
);

export const P3 = () => (
  <Grid.Column width={5} textAlign="right">
    <Button color="green" as={Link} floated="right" to="/app/users/new">+ Add new user</Button>
  </Grid.Column>
);

export const P5 = props => (
  <div className={`more search-filters ${props.filters ? '' : 'collapsed'}`}>
    <Form>
      <Grid stackable>
        <Grid.Row>
          <Grid.Column width={3}>
            <DropdownFilter value={props.requestState.search.accountType} name="Account Type" change={props.setSearchParam} options={FILTER_META.accountType} isMultiple />
          </Grid.Column>
          <Grid.Column width={3}>
            <DropdownFilter value={props.requestState.search.accountStatus} name="Account Status" keyName="accountStatus" change={props.setSearchParam} options={FILTER_META.accountStatus} />
          </Grid.Column>
          <Grid.Column width={4}>
            <DateRangeFilter filters={props.requestState.search} label="Account Creation" name="createdAt" change={props.dateFilter} />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Form>
  </div>
);

// <Grid.Column width={3}>
// <DropdownFilter value={props.requestState.search.accreditation}
// name="Accreditation" change={props.setSearchParam} options={FILTER_META.accreditation} />
// </Grid.Column>
