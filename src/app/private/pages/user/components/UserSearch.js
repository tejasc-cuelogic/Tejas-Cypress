import React from 'react';
import { Input } from 'semantic-ui-react';

const UserSearch = props => (
  <div>
    <Input
      action={{ icon: 'search' }}
      onKeyPress={props.handleSearch}
      placeholder="Search..."
    />
  </div>
);

export default UserSearch;
