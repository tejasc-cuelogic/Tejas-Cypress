import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Card, Table, Header } from 'semantic-ui-react';
import { DateTimeFormat } from './../../../../../theme/shared';
import Actions from './Actions';

@inject('crowdpayStore')
@observer
export default class AllCrowdPay extends Component {
  componentWillMount() {
    this.props.crowdpayStore.initRequest();
  }
  render() {
    const { crowdpayStore } = this.props;
    const { accounts } = crowdpayStore;
    return (
      <Card fluid>
        <div className="table-wrapper">
          <Table unstackable className="application-list">
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Name</Table.HeaderCell>
                <Table.HeaderCell>Creation date</Table.HeaderCell>
                <Table.HeaderCell>Status</Table.HeaderCell>
                <Table.HeaderCell>Fail Reason</Table.HeaderCell>
                <Table.HeaderCell>Documents</Table.HeaderCell>
                <Table.HeaderCell textAlign="right">Action</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {
                accounts.map(account => (
                  <Table.Row key={account.id}>
                    <Table.Cell>
                      <Header as="h6">{account.name}</Header>
                      <div className="table-info-wrap">
                        <p>
                          {account.email}<br />
                          {account.phoneNumber}
                        </p>
                      </div>
                    </Table.Cell>
                    <Table.Cell><DateTimeFormat fromNow datetime={account.createdAt} /></Table.Cell>
                    <Table.Cell>{account.status}</Table.Cell>
                    <Table.Cell>{account.failReason}</Table.Cell>
                    <Table.Cell>{account.documents}</Table.Cell>
                    <Table.Cell textAlign="right">
                      <Actions />
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
