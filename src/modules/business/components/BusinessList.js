import React from 'react';
import { Table } from 'semantic-ui-react';
import { observer } from 'mobx-react';
import { Link } from 'react-router-dom';

const BusinessList = observer(props => (
  <Table celled structured>
    <Table.Header>
      <Table.Row>
        <Table.HeaderCell>Business Name</Table.HeaderCell>
        <Table.HeaderCell>Created At</Table.HeaderCell>
      </Table.Row>
    </Table.Header>
    <Table.Body>
      {
        props.businessList.map(business => (
          <Table.Row>
            <Table.Cell><Link to={`/app/business/${business.id}`}>{business.name}</Link></Table.Cell>
            <Table.Cell>{business.created}</Table.Cell>
          </Table.Row>
        ))
      }
    </Table.Body>
  </Table>
));

export default BusinessList;
