import React from 'react';
import { Table } from 'semantic-ui-react';
import { observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import DateTimeFormat from './../../../components/common/DateTimeFormat';

const BusinessList = observer(props => (
  <div className="table-wrapper">
    <Table striped padded>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell width={1} />
          <Table.HeaderCell width={3} singleLine>Business Name</Table.HeaderCell>
          <Table.HeaderCell width={3} singleLine>Created At</Table.HeaderCell>
          <Table.HeaderCell>Description</Table.HeaderCell>
          <Table.HeaderCell width={2} />
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {
          props.businessList.map(business => (
            <Table.Row key={business.id}>
              <Table.Cell />
              <Table.Cell singleLine><Link to={`/app/business/${business.id}`}>{business.name}</Link></Table.Cell>
              <Table.Cell singleLine><DateTimeFormat datetime={business.created} /></Table.Cell>
              <Table.Cell>{business.description || 'N/A'}</Table.Cell>
              <Table.Cell singleLine><Link to={`/app/business/${business.id}`} className="action">view filing</Link></Table.Cell>
            </Table.Row>
          ))
        }
      </Table.Body>
    </Table>
  </div>
));

export default BusinessList;
