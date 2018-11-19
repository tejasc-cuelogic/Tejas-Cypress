import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Card, Table } from 'semantic-ui-react';
import { DateTimeFormat, InlineLoader } from './../../../../../theme/shared';
import Actions from './Actions';

@inject('bankAccountStore')
@observer
export default class AllRequests extends Component {
  componentWillMount() {
    this.props.bankAccountStore.initRequest();
  }
  render() {
    const { bankAccountStore } = this.props;
    const { changeRequests, loading } = bankAccountStore;
    if (loading) {
      return <InlineLoader />;
    }
    return (
      <Card fluid>
        <div className="table-wrapper">
          <Table unstackable className="application-list">
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Investor</Table.HeaderCell>
                <Table.HeaderCell>Requested Date</Table.HeaderCell>
                <Table.HeaderCell>Type</Table.HeaderCell>
                <Table.HeaderCell>GS Transaction #</Table.HeaderCell>
                <Table.HeaderCell>Account</Table.HeaderCell>
                <Table.HeaderCell textAlign="center" />
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {
                changeRequests.map(req => (
                  <Table.Row key={req.id}>
                    <Table.Cell>
                      <p><b>{req.name}</b></p>
                    </Table.Cell>
                    <Table.Cell>
                      <DateTimeFormat datetime={req.createdAt} />
                    </Table.Cell>
                    <Table.Cell>
                      <p>{req.type}</p>
                    </Table.Cell>
                    <Table.Cell>
                      <p>{req.transaction}</p>
                    </Table.Cell>
                    <Table.Cell>
                        XXX XXX 8493<br />
                        2424024249
                    </Table.Cell>
                    <Actions {...this.props} />
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
