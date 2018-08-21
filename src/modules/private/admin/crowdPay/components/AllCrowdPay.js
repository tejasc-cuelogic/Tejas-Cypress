import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { kebabCase } from 'lodash';
import { Card, Table, Icon } from 'semantic-ui-react';
import { DateTimeFormat, InlineLoader } from './../../../../../theme/shared';
import Actions from './Actions';

@inject('crowdpayStore')
@observer
export default class AllCrowdPay extends Component {
  componentWillMount() {
    this.props.crowdpayStore.initRequest();
  }
  render() {
    const { crowdpayStore } = this.props;
    const { accounts, loading } = crowdpayStore;

    if (loading) {
      return <InlineLoader />;
    }
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
                <Table.HeaderCell textAlign="center" />
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {
                accounts.map(account => (
                  <Table.Row key={account.id}>
                    <Table.Cell>
                      <p>
                        <b>{account.name}</b><br />
                        {account.email}<br />
                        {account.phoneNumber}
                      </p>
                    </Table.Cell>
                    <Table.Cell><DateTimeFormat fromNow datetime={account.createdAt} /></Table.Cell>
                    <Table.Cell className={`status ${kebabCase(account.status)}`}>
                      <Icon className="ns-warning-circle" />{account.status}
                    </Table.Cell>
                    <Table.Cell>{account.failReason}</Table.Cell>
                    <Table.Cell>{account.documents}</Table.Cell>
                    <Actions />
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
