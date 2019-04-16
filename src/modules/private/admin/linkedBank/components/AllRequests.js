/* eslint-disable react/no-array-index-key */
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import moment from 'moment';
import { get, lowerCase } from 'lodash';
import { Card, Table, Button, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { InlineLoader, NsPagination } from './../../../../../theme/shared';
import Helper from '../../../../../helper/utility';
import Actions from './Actions';

@inject('bankAccountStore', 'uiStore')
@observer
export default class AllRequests extends Component {
  state = {
    routingNums: {},
  }
  componentWillMount() {
    this.props.bankAccountStore.initRequest();
  }
  getRoutingNumber = (e, accountId, userId) => {
    e.stopPropagation();
    const oldObj = this.state.routingNums;
    oldObj[accountId] = {};
    oldObj[accountId].loading = true;
    this.setState({ routingNums: oldObj });
    this.props.bankAccountStore.getDecryptedRoutingNum(accountId, userId).then((res) => {
      oldObj[accountId].decryptedRoutingNumber = res;
      oldObj[accountId].loading = false;
      this.setState({ routingNums: oldObj });
    });
  }
  paginate = params => this.props.bankAccountStore.pageRequest(params);
  render() {
    const { bankAccountStore, uiStore } = this.props;
    const { inProgress } = uiStore;
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
                <Table.HeaderCell>Account Type</Table.HeaderCell>
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
                      <Link to={`/app/users/${req.userId}/profile-data`}><p><b>{req.firstName} {req.lastName}</b></p></Link>
                    </Table.Cell>
                    <Table.Cell>
                      {get(req, 'linkedBank.changeRequest.dateRequested') ? moment.unix(get(req, 'linkedBank.changeRequest.dateRequested')).format('MM/DD/YYYY') : 'N/A'}
                    </Table.Cell>
                    <Table.Cell>
                      {req.accountType ?
                        <Icon size="large" className={`ns-${lowerCase(req.accountType)}-line`} color="green" /> : 'N/A'
                      }
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
                      {this.state.routingNums[get(req, 'accountId')] && this.state.routingNums[get(req, 'accountId')].decryptedRoutingNumber ? this.state.routingNums[get(req, 'accountId')].decryptedRoutingNumber :
                      this.state.routingNums[get(req, 'accountId')] && this.state.routingNums[get(req, 'accountId')].loading ? <p>Loading...</p> :
                      <Button color="blue" onClick={e => this.getRoutingNumber(e, get(req, 'accountId'), get(req, 'userId'))} className="link-button"> Click for Routing # </Button>
                      }
                    </Table.Cell>
                    <Actions
                      inProgress={inProgress}
                      userId={req.userId}
                      accountId={req.accountId}
                      updateAccountChangeAction={bankAccountStore.updateAccountChangeAction}
                    />
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
