import React from 'react';
import { Form, Grid } from 'semantic-ui-react';
import { ByKeyword, DropdownFilter, DateRangeFilter } from '../../../../../theme/form/Filters';
import { ROLES } from '../../../../../constants/user';

const Header = props => (
  <Form>
    <Grid>
      <Grid.Row>
        <ByKeyword {...props} w={[8, 16]} fLabel placeholder="Search by keyword or user’s name" />
        <Grid.Column widescreen={4} largeScreen={4} computer={16} tablet={16} mobile={16}>
          <DropdownFilter className="inverted" options={ROLES} change={props.setSearchParam} value={props.requestState.search.userType} name="User Type" isMultiple />
        </Grid.Column>
        <Grid.Column widescreen={4} largeScreen={4} computer={16} tablet={16} mobile={16}>
          <DateRangeFilter filters={props.requestState.search} changeStart={props.dateFilterStart} changeEnd={props.dateFilterEnd} label="Creation date" name="createdAt" />
        </Grid.Column>
      </Grid.Row>
    </Grid>
  </Form>
);

export default Header;
