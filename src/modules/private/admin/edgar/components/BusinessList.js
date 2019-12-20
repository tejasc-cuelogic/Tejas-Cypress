import React from 'react';
import { Card, Table } from 'semantic-ui-react';
import { observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import { DateTimeFormat } from '../../../../../theme/shared';

const BusinessList = observer(props => (
  <Card fluid>
    <div className="table-wrapper">
      <Table unstackable striped padded>
        <Table.Header>
          <Table.Row>
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
                <Table.Cell singleLine><Link to={`/dashboard/edgar/${business.id}`}>{business.name}</Link></Table.Cell>
                <Table.Cell singleLine><DateTimeFormat datetime={business.created} /></Table.Cell>
                <Table.Cell>{business.description || 'N/A'}</Table.Cell>
                <Table.Cell singleLine><Link to={`/dashboard/edgar/${business.id}`} className="action">view filing</Link></Table.Cell>
              </Table.Row>
            ))
          }
        </Table.Body>
      </Table>
    </div>
  </Card>
));

export default BusinessList;
