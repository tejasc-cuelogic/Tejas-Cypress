import React from 'react';
import { Table } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import Pagination from './../../../theme/table/Pagination';

const userListing = props => (
  <Table striped sortable>
    <Table.Header>
      <Table.Row>
        { props.header.map(item => <Table.HeaderCell key={item[0]}>{item[1]}</Table.HeaderCell>)}
      </Table.Row>
    </Table.Header>
    <Table.Body>
      <Table.Row>
        <Table.Cell>profilepic</Table.Cell>
        <Table.Cell>Jonathan Smith</Table.Cell>
        <Table.Cell>Detroit, MI (80331)</Table.Cell>
        <Table.Cell>617 434-1551</Table.Cell>
        <Table.Cell>R</Table.Cell>
        <Table.Cell>2 days ago</Table.Cell>
        <Table.Cell>13 months ago</Table.Cell>
        <Table.Cell><Link to="/app/users/1/details">view profile</Link></Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell>profilepic</Table.Cell>
        <Table.Cell>Jonathan Smith</Table.Cell>
        <Table.Cell>Detroit, MI (80331)</Table.Cell>
        <Table.Cell>617 434-1551</Table.Cell>
        <Table.Cell>R</Table.Cell>
        <Table.Cell>2 days ago</Table.Cell>
        <Table.Cell>13 months ago</Table.Cell>
        <Table.Cell><Link to="/app/users/2/details">view profile</Link></Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell>profilepic</Table.Cell>
        <Table.Cell>Jonathan Smith</Table.Cell>
        <Table.Cell>Detroit, MI (80331)</Table.Cell>
        <Table.Cell>617 434-1551</Table.Cell>
        <Table.Cell>R</Table.Cell>
        <Table.Cell>2 days ago</Table.Cell>
        <Table.Cell>13 months ago</Table.Cell>
        <Table.Cell><Link to="/app/users/3/details">view profile</Link></Table.Cell>
      </Table.Row>
    </Table.Body>
    {props.hasPagination &&
      <Pagination colspan={props.header.length} />
    }
  </Table>
);

export default userListing;
