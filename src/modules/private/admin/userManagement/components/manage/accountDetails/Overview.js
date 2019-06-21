import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { includes, get } from 'lodash';
import moment from 'moment';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Header, Form, Divider, Table, Card } from 'semantic-ui-react';
import Aux from 'react-aux';
import AccountHeader from './AccountHeader';
import IndividualSummary from './IndividualSummary';
import IraSummary from './IraSummary';
import EntitySummary from './EntitySummary';
import Helper from '../../../../../../../helper/utility';
import LockedInformation from '../profile/LockedInformation';
import CashMovement from '../../../../../investor/summary/components/CashMovement';

const CopyToClipboardAccountId = ({ account }) => (
  <CopyToClipboard
    text={get(account, 'details.accountId')}
    onCopy={() => Helper.toast('Investor account uuid copied to clipboard.', 'success')}
  >
    <span className="text-lowercase">
      {get(account, 'details.accountId')}
    </span>
  </CopyToClipboard>
);

@inject('userDetailsStore', 'bankAccountStore', 'transactionStore', 'portfolioStore')
@withRouter
@observer
export default class Overview extends Component {
  state = {
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
    this.props.portfolioStore.getSummary(true);
  }

  getRoutingNumber = (e, accountId, userId) => {
    e.stopPropagation();
    this.setState({ loading: true });
    this.props.bankAccountStore.getDecryptedRoutingNum(accountId, userId, 'LINKED_BANK').then((res) => {
      this.props.bankAccountStore.setFieldValue('routingNum', res);
      this.setState({ loading: false });
    }).catch(() => this.setState({ loading: false }));
  }

  render() {
    const { getChartData } = this.props.portfolioStore;
    const investor = this.props.userDetailsStore.getDetailsOfUser;
    const account = this.props.userDetailsStore.currentActiveAccountDetailsOfSelectedUsers;
    const cashMovementData = getChartData('cashMovement');
    return (
      <Form>
        {this.props.isAdmin
          && <AccountHeader showFreezeCTA pathname={this.props.location.pathname} />
        }
        {get(account, 'details.accountStatus') === 'FROZEN'
        && (
        <Aux>
          <LockedInformation account details={account} />
          <Divider />
        </Aux>
        )
        }
        <Header as="h6">Balances</Header>
        <Form.Group widths={2}>
          <Form.Input fluid label="Your Available Balance" value={this.state.availableCashL ? 'Loading...' : Helper.MoneyMathDisplayCurrency(this.state.availableCash)} readOnly className="display-only" />
          <Form.Input fluid label="Your Total Balance" value={this.state.totalBalanceL ? 'Loading...' : Helper.MoneyMathDisplayCurrency(this.state.totalBalance)} readOnly className="display-only" />
        </Form.Group>
        <Header as="h6">Bank Account</Header>
        <Form.Group widths={2}>
          <Form.Input fluid label="Bank Name" placeholder="Bank Name" value={get(account, 'details.linkedBank.bankName') || 'N/A'} readOnly className="display-only" />
          <Form.Input fluid label="Account Number" placeholder="Account Number" value={get(account, 'details.linkedBank.accountNumber') || 'N/A'} readOnly className="display-only" />
          <Form.Input fluid label="GoldStar Account Number" placeholder="GoldStar Account Number" value={get(account, 'details.goldstar.accountNumber') || 'N/A'} readOnly className="display-only" />
          <Form.Input fluid label="GoldStar Contact Id" placeholder="GoldStar Contact Id" value={get(account, 'details.goldstar.contactId') || 'N/A'} readOnly className="display-only" />
        </Form.Group>
        <Divider />
        {get(account, 'linkedBank.changeRequest')
          && (
          <Aux>
            <Header as="h6">Change Bank Account Request</Header>
            <Form.Group widths={2}>
              <Form.Input fluid label="Bank Name" placeholder="Bank Name" value={get(account, 'details.linkedBank.changeRequest.bankName') || 'N/A'} readOnly className="display-only" />
              <Form.Input fluid label="Account Number" placeholder="Account Number" value={get(account, 'details.linkedBank.changeRequest.accountNumber') || 'N/A'} readOnly className="display-only" />
              <Form.Input fluid label="Requested Date" placeholder="Requested Date" value={get(account, 'details.linkedBank.changeRequest.dateRequested') ? moment(get(account, 'details.linkedBank.changeRequest.dateRequested')).format('MM/DD/YYYY') : 'N/A'} readOnly className="display-only" />
              <Form.Input fluid label="Status" placeholder="Status" value={get(account, 'details.linkedBank.changeRequest.status') || 'N/A'} readOnly className="display-only" />
            </Form.Group>
            <Divider />
          </Aux>
          )
        }
        <Header as="h6">Opening Summary</Header>
        <div className="bg-offwhite">
          <div className="table-wrapper">
            <Table unstackable basic="very" fixed>
              {get(account, 'name') === 'individual'
                ? (
                  <IndividualSummary
                    investor={investor}
                    account={account}
                    getRoutingNumber={this.getRoutingNumber}
                    loading={this.state.loading}
                    routingNumber={this.props.bankAccountStore.routingNum}
                    CopyToClipboardAccountId={<CopyToClipboardAccountId account={account} />}
                  />
                )
                : get(account, 'name') === 'ira'
                  ? <IraSummary investor={investor} account={account} CopyToClipboardAccountId={<CopyToClipboardAccountId account={account} />} />
                  : get(account, 'name') === 'entity'
                    ? <EntitySummary investor={investor} account={account} CopyToClipboardAccountId={<CopyToClipboardAccountId account={account} />} /> : null
              }
            </Table>
          </div>
        </div>
        {cashMovementData && cashMovementData.length
          ? (
            <Aux>
              <Card fluid>
                <Card.Content>
                  <Header as="h4">Investments and Payments</Header>
                  <CashMovement data={cashMovementData} />
                </Card.Content>
              </Card>
            </Aux>
          ) : null
        }
      </Form>
    );
  }
}
