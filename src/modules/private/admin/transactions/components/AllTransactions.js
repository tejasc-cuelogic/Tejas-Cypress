import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Card, Table } from 'semantic-ui-react';

@inject('helloWorldStore')
@observer
export default class AllTransactions extends Component {
  componentWillMount() {
    this.props.helloWorldStore.initRequest(); // load data
  }
  render() {
    const { match, helloWorldStore } = this.props;
    const { allRecords } = helloWorldStore;
    return (
      <Card fluid>
        <div className="table-wrapper">
          <Table unstackable striped sortable singleLine className="user-list">
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Title</Table.HeaderCell>
                <Table.HeaderCell>Created date</Table.HeaderCell>
                <Table.HeaderCell textAlign="right">Action</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {
                allRecords.map(record => (
                  <Table.Row key={record.id}>
                    <Table.Cell>{record.title}</Table.Cell>
                    <Table.Cell>{record.createdAt}</Table.Cell>
                    <Table.Cell textAlign="right">
                      <div className="actions">
                        <Link to={`${match.url}/${record.id}`} className="green">Details</Link>
                      </div>
                    </Table.Cell>
                  </Table.Row>
                ))
              }
            </Table.Body>
          </Table>
        </div>
      </Card>
    );
  }
}
