import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter, Link } from 'react-router-dom';
import { Header, Button, Message, Table } from 'semantic-ui-react';
import { isEmpty } from 'lodash';
import { ListErrors } from '../../../../../../../theme/shared';
import Helper from '../../../../../../../helper/utility';
@inject('bankAccountStore', 'individualAccountStore', 'uiStore', 'userStore', 'userDetailsStore')
@withRouter
@observer
export default class Summary extends React.Component {
  handleCreateAccount = () => {
    const { isCipExpired, signupStatus } = this.props.userDetailsStore;
    if (isCipExpired && signupStatus.activeAccounts && signupStatus.activeAccounts.length === 0) {
      this.props.history.push('/app/summary/identity-verification/0');
      Helper.toast('CIP verification is expired now, You need to verify it again!', 'error');
    } else {
      this.props.individualAccountStore.createAccount('Summary', 'submit').then(() => {
        this.props.history.push('summary');
      })
        .catch(() => {});
    }
  }
  render() {
    const { errors } = this.props.uiStore;
    const { currentUser } = this.props.userStore;
    const {
      formAddFunds,
      plaidAccDetails,
      isValidLinkBank,
      formLinkBankManually,
      depositMoneyNow,
    } = this.props.bankAccountStore;
    const bankAccountNumber = !isEmpty(plaidAccDetails) ?
      plaidAccDetails.accountNumber ? plaidAccDetails.accountNumber : '' : formLinkBankManually.fields.accountNumber.value;
    return (
      <div>
        <Header as="h3" textAlign="center">Confirm Account</Header>
        {errors &&
          <Message error>
            <ListErrors errors={[errors.message]} />
          </Message>
        }
        <div className="summary-wrap">
          <div className="field-wrap">
            <div className="table-wrapper">
              <Table unstackable basic fixed singleLine>
                <Table.Body>
                  <Table.Row>
                    <Table.Cell>Investor: </Table.Cell>
                    <Table.Cell>{currentUser.givenName}</Table.Cell>
                  </Table.Row>
                  {!isEmpty(plaidAccDetails) &&
                  <Table.Row>
                    <Table.Cell>Bank: </Table.Cell>
                    <Table.Cell>{isEmpty(plaidAccDetails) || !plaidAccDetails.institution ? plaidAccDetails.bankName ? plaidAccDetails.bankName : '' : plaidAccDetails.institution.name}</Table.Cell>
                  </Table.Row>
                  }
                  <Table.Row>
                    <Table.Cell>Bank Account Number: </Table.Cell>
                    <Table.Cell>{bankAccountNumber ? Helper.encryptNumberWithX(bankAccountNumber) : ''}</Table.Cell>
                  </Table.Row>
                  {formLinkBankManually.fields.routingNumber.value &&
                  <Table.Row>
                    <Table.Cell>Routing Number</Table.Cell>
                    <Table.Cell>
                      {Helper.encryptNumberWithX(formLinkBankManually.fields.routingNumber.value)}
                    </Table.Cell>
                  </Table.Row>
                  }
                  <Table.Row>
                    <Table.Cell>Your Initial Deposit</Table.Cell>
                    <Table.Cell>
                      {!depositMoneyNow ?
                      Helper.CurrencyFormat(0) :
                      formAddFunds.fields.value.value !== '' ? `${Helper.CurrencyFormat(formAddFunds.fields.value.value)}` :
                      Helper.CurrencyFormat(0)}
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table>
            </div>
          </div>
        </div>
        <p className="center-align mb-30">
          By continuing, I acknowledge that I have read and agree to the
          terms of the <Link to={this.props.match.url} className="link">CrowdPay Custodial Account Agreement</Link>, <Link to={this.props.match.url} className="link">Substitute IRS Form W-9 Certification</Link>,
          and the <Link to={this.props.match.url} className="link">NextSeed Membership Agreement</Link>.
        </p>
        <div className="center-align">
          <Button onClick={() => this.handleCreateAccount()} primary size="large" disabled={!formLinkBankManually.meta.isValid && !isValidLinkBank}>Create your account</Button>
        </div>
      </div>
    );
  }
}
