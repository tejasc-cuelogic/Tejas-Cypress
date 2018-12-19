/* eslint-disable react/no-array-index-key */
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Card, Table } from 'semantic-ui-react';
import { DateTimeFormat, InlineLoader, NsPagination } from './../../../../../theme/shared';
import Helper from '../../../../../helper/utility';
import Actions from './Actions';

@inject('bankAccountStore')
@observer
export default class AllRequests extends Component {
  componentWillMount() {
    this.props.bankAccountStore.initRequest();
  }
  paginate = params => this.props.bankAccountStore.pageRequest(params);
  render() {
    const { bankAccountStore } = this.props;
    const {
      changeRequests, loading, count, requestState,
    } = bankAccountStore;
    const totalRecords = count || 0;
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
              changeRequests.length === 0 ? (
                <Table.Row>
                  <Table.Cell textAlign="center" colSpan={6}>No Linked Account Bank requests to display !</Table.Cell>
                </Table.Row>
                ) :
                changeRequests.map((req, index) => (
                  <Table.Row key={`${req.userId}_${index}`}>
                    <Table.Cell>
                      <p><b>{req.firstName} {req.lastName}</b></p>
                    </Table.Cell>
                    <Table.Cell>
                      <DateTimeFormat datetime={req.dateRequested} />
                    </Table.Cell>
                    <Table.Cell>
                      <p>{req.linkedBank && req.linkedBank.changeRequest &&
                        req.linkedBank.changeRequest.plaidAccessToken ? 'Plaid' : 'Manual'}
                      </p>
                    </Table.Cell>
                    <Table.Cell>
                      <p>N/A</p>
                    </Table.Cell>
                    <Table.Cell>
                      {(req.linkedBank && req.linkedBank.changeRequest
                        && req.linkedBank.changeRequest.accountNumber && Helper.encryptNumberWithX(req.linkedBank.changeRequest.accountNumber)) || 'N/A'}
                      <br />
                      {(req.linkedBank && req.linkedBank.changeRequest
                        && req.linkedBank.changeRequest.routingNumber && req.linkedBank.changeRequest.routingNumber) || 'N/A'}
                    </Table.Cell>
                    <Actions {...this.props} />
                  </Table.Row>
                ))
              }
            </Table.Body>
          </Table>
        </div>
        {totalRecords > 0 &&
          <NsPagination floated="right" initRequest={this.paginate} meta={{ totalRecords, requestState }} />
        }
      </Card>
    );
  }
}
