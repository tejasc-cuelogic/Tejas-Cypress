import React from 'react';
import { Button, Table } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

const UserLink = props => (
  <Link to={`/admin/user/${props.username}`}>{ `${props.username.substr(0, 8)}...` }</Link>
);

const UserRow = props => (
  <Table.Row>
    <Table.Cell><UserLink username={props.username} /></Table.Cell>
    <Table.Cell width={4}>{ `${props.given_name} ${props.family_name}` }</Table.Cell>
    <Table.Cell>{ props.email}</Table.Cell>
    <Table.Cell>{ props.status }</Table.Cell>
    <Table.Cell>
      <Button
        className="ui secondary"
        onClick={props.handleDisableClick}
      >
        Disable
      </Button>
    </Table.Cell>
  </Table.Row>
);

export default UserRow;
