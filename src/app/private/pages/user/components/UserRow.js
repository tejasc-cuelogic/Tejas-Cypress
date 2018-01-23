import React from 'react';
import { Button } from 'semantic-ui-react';

const ConfirmButton = props => (
  <Button>
    {props.confirmed ? 'Confirmed' : 'Confirm!'}
  </Button>
);

const UserRow = props => (
  <tr>
    <td>{ props.given_name }</td>
    <td>{ props.family_name }</td>
    <td>{ `${props.username.substr(0, 8)}...` }</td>
    <td>
      <Button
        className="ui secondary"
        onClick={props.handleDisableClick}
      >
        Disable
      </Button>
    </td>
    <td>
      <ConfirmButton confirmed={props.confirmed} />
    </td>
  </tr>
);

export default UserRow;
