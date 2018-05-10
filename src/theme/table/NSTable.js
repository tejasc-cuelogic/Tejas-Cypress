import React from 'react';
import { Table } from 'semantic-ui-react';

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
