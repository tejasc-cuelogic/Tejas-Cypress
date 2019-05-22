import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { includes, get } from 'lodash';
import moment from 'moment';
import { Header, Form, Divider, Table } from 'semantic-ui-react';
import Aux from 'react-aux';
import AccountHeader from './AccountHeader';
import IndividualSummary from './IndividualSummary';
import IraSummary from './IraSummary';
import EntitySummary from './EntitySummary';

@inject('userDetailsStore', 'bankAccountStore', 'transactionStore')
@withRouter
@observer
export default class Overview extends Component {
  state = {
    routingNumber: null,
    loading: false,
    availableCash: '0',
    totalBalance: '0',
    availableCashL: false,
    totalBalanceL: false,
  }
  componentWillMount() {
    const accountType = includes(this.props.location.pathname, 'individual') ? 'individual' : includes(this.props.location.pathname, 'ira') ? 'ira' : 'entity';
    const { setFieldValue } = this.props.userDetailsStore;
    setFieldValue('currentActiveAccount', accountType);
    this.setState({ availableCashL: true, totalBalanceL: true });
    this.props.transactionStore.getInvestorAvailableCash(false, true).then((data) => {
      this.setState({ availableCash: get(data, 'getInvestorAvailableCash'), availableCashL: false });
      this.props.transactionStore.getInvestorAvailableCash(true, true).then((dataN) => {
        this.setState({ totalBalance: get(dataN, 'getInvestorAvailableCash'), totalBalanceL: false });
      }).catch(() => this.setState({ availableCashL: false, totalBalanceL: false }));
    }).catch(() => this.setState({ availableCashL: false, totalBalanceL: false }));
  }
  getRoutingNumber = (e, accountId, userId) => {
    e.stopPropagation();
    this.setState({ loading: true });
    this.props.bankAccountStore.getDecryptedRoutingNum(accountId, userId, 'LINKED_BANK').then((res) => {
      this.setState({ loading: false, routingNumber: res });
    }).catch(() => this.setState({ loading: false }));
  }
  render() {
    const investor = this.props.userDetailsStore.getDetailsOfUser;
    const account = this.props.userDetailsStore.currentActiveAccountDetailsOfSelectedUsers;
    return (
      <Form>
        {this.props.isAdmin &&
          <AccountHeader pathname={this.props.location.pathname} />
        }
        <Header as="h6">Bank Account</Header>
        <Form.Group widths={3}>
          <Form.Input fluid label="Bank Name" placeholder="Bank Name" value={get(account, 'details.linkedBank.bankName') || 'N/A'} readOnly className="display-only" />
          <Form.Input fluid label="Account Number" placeholder="Account Number" value={get(account, 'details.linkedBank.accountNumber') || 'N/A'} readOnly className="display-only" />
        </Form.Group>
        <Divider />
        {get(account, 'linkedBank.changeRequest') &&
          <Aux>
            <Header as="h6">Change Bank Account Request</Header>
            <Form.Group widths={3}>
              <Form.Input fluid label="Bank Name" placeholder="Bank Name" value={get(account, 'details.linkedBank.changeRequest.bankName') || 'N/A'} readOnly className="display-only" />
              <Form.Input fluid label="Account Number" placeholder="Account Number" value={get(account, 'details.linkedBank.changeRequest.accountNumber') || 'N/A'} readOnly className="display-only" />
              <Form.Input fluid label="Requested Date" placeholder="Requested Date" value={get(account, 'details.linkedBank.changeRequest.dateRequested') ? moment(get(account, 'details.linkedBank.changeRequest.dateRequested')).format('MM/DD/YYYY') : 'N/A'} readOnly className="display-only" />
              <Form.Input fluid label="Status" placeholder="Status" value={get(account, 'details.linkedBank.changeRequest.status') || 'N/A'} readOnly className="display-only" />
            </Form.Group>
            <Divider />
          </Aux>
        }
        <Header as="h6">Summary</Header>
        <div className="bg-offwhite">
          <div className="table-wrapper">
            <Table unstackable basic="very" fixed>
              {get(account, 'name') === 'individual' ?
                <IndividualSummary
                  investor={investor}
                  account={account}
                  getRoutingNumber={this.getRoutingNumber}
                  loading={this.state.loading}
                  routingNumber={this.state.routingNumber}
                  availableCash={this.state.availableCash}
                  availableCashL={this.state.availableCashL}
                  totalBalance={this.state.totalBalance}
                  totalBalanceL={this.state.totalBalanceL}
                /> :
                get(account, 'name') === 'ira' ?
                  <IraSummary
                    investor={investor}
                    account={account}
                    availableCash={this.state.availableCash}
                    availableCashL={this.state.availableCashL}
                    totalBalance={this.state.totalBalance}
                    totalBalanceL={this.state.totalBalanceL}
                  /> :
                  get(account, 'name') === 'entity' ?
                    <EntitySummary
                      account={account}
                      availableCash={this.state.availableCash}
                      availableCashL={this.state.availableCashL}
                      totalBalance={this.state.totalBalance}
                      totalBalanceL={this.state.totalBalanceL}
                    /> : null
              }
            </Table>
          </div>
        </div>
      </Form>
    );
  }
}
