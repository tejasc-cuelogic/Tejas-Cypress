import React from 'react';
import { Table } from 'semantic-ui-react';
import Helper from '../../helper/utility';

export const THeader = ({ columns }) => (
  <Table.Header>
    <Table.Row>
      {
        columns.map(col => (
          <Table.HeaderCell key={col.field} textAlign={col.textAlign}>{col.title}</Table.HeaderCell>
        ))
      }
    </Table.Row>
  </Table.Header>
);

export const FillTable = props => (
  <div className="table-wrapper">
    <Table singleLine className="investment-details">
      <THeader columns={props.result.columns} />
      <Table.Body>
        {
          props.result.rows.map(row => (
            <Table.Row key={Helper.guid()}>
              {
                props.result.columns.map(col => (
                  <Table.Cell key={col.field} textAlign={col.textAlign}>
                    {row[col.field]}
                  </Table.Cell>
                ))
              }
            </Table.Row>
          ))
        }
      </Table.Body>
    </Table>
  </div>
);
