import React from 'react';
import { Table } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import Pagination from './../../../theme/table/Pagination';

const paginateOptions = {
  activePage: 5,
  boundaryRange: 1,
  siblingRange: 1,
  showEllipsis: true,
  showFirstAndLastNav: true,
  showPreviousAndNextNav: true,
  totalPages: 50,
};

const userListing = props => (
  <Table striped sortable>
    <Table.Header>
      <Table.Row>
        { props.header.map(item => <Table.HeaderCell key={item[0]}>{item[1]}</Table.HeaderCell>)}
      </Table.Row>
    </Table.Header>
    <Table.Body>
      {_.map(props.listData, user => (
        <Table.Row key={user.Username}>
          <Table.Cell>profilepic</Table.Cell>
          <Table.Cell>{`${user.given_name} ${user.family_name}`}</Table.Cell>
          <Table.Cell>Detroit, MI (80331)</Table.Cell>
          <Table.Cell>617 434-1551</Table.Cell>
          <Table.Cell>R</Table.Cell>
          <Table.Cell>2 days ago</Table.Cell>
          <Table.Cell>13 months ago</Table.Cell>
          <Table.Cell><Link to="/app/users/1/details">view profile</Link></Table.Cell>
        </Table.Row>
      ))}
      {!props.listData &&
        <Table.Row>
          <Table.Cell colSpan={props.header.length}>No record found</Table.Cell>
        </Table.Row>
      }
    </Table.Body>
    {props.hasPagination &&
      <Pagination paginateOptions={paginateOptions} colspan={props.header.length} />
    }
  </Table>
);

export default userListing;
