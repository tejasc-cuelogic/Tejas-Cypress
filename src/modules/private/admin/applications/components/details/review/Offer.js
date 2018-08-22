import React, { Component } from 'react';
import { Table } from 'semantic-ui-react';

export default class Offer extends Component {
  render() {
    return (
      <div>
        <Table basic compact className="form-table">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>&nbsp;</Table.HeaderCell>
              <Table.HeaderCell>Offer A</Table.HeaderCell>
              <Table.HeaderCell />
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.Cell>
              jghjgjhghj
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      </div>
    );
  }
}
