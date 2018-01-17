import React from 'react';
import { Button } from 'semantic-ui-react';

const UserRow = props => (
  <tr>
    <td>{ props.fname }</td>
    <td>{ props.lname }</td>
    <td>{ props.username }</td>
    <td>
      <Button className="ui secondary">
        Disable
      </Button>
    </td>
  </tr>
);

export default UserRow;
