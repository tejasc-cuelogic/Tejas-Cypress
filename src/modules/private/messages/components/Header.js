import React from 'react';
import { Form, Grid, Input } from 'semantic-ui-react';
import { DropdownFilter, DateRangeFilter } from '../../../../theme/form/Filters';

const Header = () => (
  <Form>
    <Grid>
      <Grid.Row>
        <Grid.Column widescreen={8} largeScreen={8} computer={16} tablet={16} mobile={16}>
          <Form.Field>
            {/* eslint-disable jsx-a11y/label-has-for  */}
            <label className="invisible">Search by keyword or user’s name</label>
            <Input fluid inverted icon={{ className: 'ns-search' }} iconPosition="left" placeholder="Search by keyword or user’s name" />
          </Form.Field>
        </Grid.Column>
        <Grid.Column widescreen={4} largeScreen={4} computer={16} tablet={16} mobile={16}>
          <DropdownFilter value="user type" name="User Type" isMultiple />
        </Grid.Column>
        <Grid.Column widescreen={4} largeScreen={4} computer={16} tablet={16} mobile={16}>
          <DateRangeFilter filters="" label="Creation date" name="createdAt" />
        </Grid.Column>
      </Grid.Row>
    </Grid>
  </Form>
);

export default Header;
