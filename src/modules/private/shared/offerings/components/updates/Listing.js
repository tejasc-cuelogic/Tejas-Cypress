import React from 'react';
import { Table } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { kebabCase } from 'lodash';
import { DateTimeFormat } from '../../../../../../theme/shared';

const meta = ['Title', 'Recipients', 'Last status change', 'Status', 'Last update'];

const Listing = (props) => {
  const listHeader = [...meta];
  return (
    <div className="table-wrapper">
      <Table unstackable singleLine className="investment-details">
        <Table.Header>
          <Table.Row>
            {
              listHeader.map(cell => (
                <Table.HeaderCell key={cell.split(' ')[0]} textAlign={cell === 'Last update' ? 'right' : ''}>{cell}</Table.HeaderCell>
              ))
            }
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {props.data.length === 0 ? (
            <Table.Row>
              <Table.Cell textAlign="center" colSpan={5}>No update to display !</Table.Cell>
            </Table.Row>
            ) :
            props.data.map(record => (
              <Table.Row key={record.id}>
                <Table.Cell><Link to={`${props.match.url}/${record.id}`}>{record.title}</Link></Table.Cell>
                <Table.Cell>Public</Table.Cell>
                <Table.Cell><DateTimeFormat datetime={record.updated.date} /></Table.Cell>
                <Table.Cell className={`status ${kebabCase(record.status)}`}>{record.status}</Table.Cell>
                <Table.Cell textAlign="right">{record.lastUpdate}</Table.Cell>
              </Table.Row>
            ))
          }
        </Table.Body>
      </Table>
    </div>
  );
};

export default Listing;
