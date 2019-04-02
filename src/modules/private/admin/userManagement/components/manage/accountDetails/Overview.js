import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { includes, get } from 'lodash';
import { Header, Form, Divider, Table } from 'semantic-ui-react';
import AccountHeader from './AccountHeader';
import IndividualSummary from './IndividualSummary';
import IraSummary from './IraSummary';
import EntitySummary from './EntitySummary';

@inject('userDetailsStore', 'bankAccountStore')
@withRouter
@observer
export default class Overview extends Component {
  state = { routingNumber: null, loading: false }
  componentWillMount() {
    const accountType = includes(this.props.location.pathname, 'individual') ? 'individual' : includes(this.props.location.pathname, 'ira') ? 'ira' : 'entity';
    const { setFieldValue } = this.props.userDetailsStore;
    setFieldValue('currentActiveAccount', accountType);
  }
  getRoutingNumber = (e, accountId, userId) => {
    e.stopPropagation();
    this.setState({ loading: true });
    this.props.bankAccountStore.getDecryptedRoutingNum(accountId, userId).then((res) => {
      this.setState({ loading: true, routingNumber: res });
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
        <Header as="h6">Summary</Header>
        <div className="field-wrap">
          <div className="table-wrapper">
            <Table unstackable basic="very" fixed>
              {get(account, 'name') === 'individual' ?
                <IndividualSummary
                  investor={investor}
                  account={account}
                  getRoutingNumber={this.getRoutingNumber}
                  loading={this.state.loading}
                  routingNumber={this.state.routingNumber}
                /> :
                get(account, 'name') === 'ira' ?
                  <IraSummary investor={investor} account={account} /> :
                  get(account, 'name') === 'entity' ?
                    <EntitySummary account={account} /> : null
              }
            </Table>
          </div>
        </div>
      </Form>
    );
  }
}
