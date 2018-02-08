import React from 'react';
import { Input, Dropdown } from 'semantic-ui-react';

const userAttributes =
  [
    { key: 'given_name', text: 'First Name', value: 'given_name' },
    { key: 'family_name', text: 'Last Name', value: 'family_name' },
    { key: 'email', text: 'Email', value: 'email' },
  ];

const UserSearch = props => (
  <div>
    <Input
      label={
        <Dropdown
          defaultValue={props.userFilter}
          options={userAttributes}
          onChange={props.handleFilterChange}
        />}
      labelPosition="right"
      onKeyPress={props.handleSearch}
      placeholder="Search..."
    />
  </div>
);

export default UserSearch;
