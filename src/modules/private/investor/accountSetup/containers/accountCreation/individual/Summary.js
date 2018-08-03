import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter, Link } from 'react-router-dom';
import { Header, Button, Message, Table } from 'semantic-ui-react';
import { isEmpty } from 'lodash';
import { ListErrors } from '../../../../../../../theme/shared';
import Helper from '../../../../../../../helper/utility';
@inject('bankAccountStore', 'individualAccountStore', 'uiStore', 'userStore')
@withRouter
@observer
export default class Summary extends React.Component {
  handleCreateAccount = () => {
    this.props.individualAccountStore.createAccount('Summary', 'submit');
    this.props.history.push('summary');
  }
  render() {
    const { errors } = this.props.uiStore;
    const { currentUser } = this.props.userStore;
    const {
      formAddFunds,
      plaidAccDetails,
      plaidBankDetails,
      isValidLinkBank,
      formLinkBankManually,
      depositMoneyNow,
    } = this.props.bankAccountStore;
    const bankAccountNumber = !isEmpty(plaidBankDetails) ?
      plaidBankDetails.accountNumber : formLinkBankManually.fields.accountNumber.value;
    return (
      <div>
        <Header as="h3" textAlign="center">Confirm Account</Header>
        {/* <p className="center-align">Lorem psum dolor sit amet, consectetur adipiscing elit,
        sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p> */}
        {errors &&
          <Message error>
            <ListErrors errors={[errors.message]} />
          </Message>
        }
        <div className="summary-wrap">
          <div className="field-wrap">
            <div className="table-wrapper">
              <Table unstackable compact basic fixed singleLine>
                <Table.Body>
                  <Table.Row>
                    <Table.Cell><b>Investor Name</b></Table.Cell>
                    <Table.Cell>{currentUser.givenName}</Table.Cell>
                  </Table.Row>
                  {!isEmpty(plaidAccDetails) &&
                  <Table.Row>
                    <Table.Cell><b>Bank Name</b></Table.Cell>
                    <Table.Cell>{isEmpty(plaidAccDetails) || !plaidAccDetails.institution ? plaidAccDetails.bankName ? plaidAccDetails.bankName : '' : plaidAccDetails.institution.name}</Table.Cell>
                  </Table.Row>
                  }
                  <Table.Row>
                    <Table.Cell><b>Bank Account</b></Table.Cell>
                    <Table.Cell>{Helper.encryptNumber(bankAccountNumber)}</Table.Cell>
                  </Table.Row>
                  {formLinkBankManually.fields.routingNumber.value &&
                  <Table.Row>
                    <Table.Cell><b>Routing Number</b></Table.Cell>
                    <Table.Cell>
                      {formLinkBankManually.fields.routingNumber.value}
                    </Table.Cell>
                  </Table.Row>
                  }
                  <Table.Row>
                    <Table.Cell><b>Your initial deposit</b></Table.Cell>
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
          terms of the <Link to="/app/summary/account-creation/individual" className="link">CrowdPay Custodial Account Agreement</Link>, <Link to="/" className="link">Substitute IRS Form W-9 Certification</Link>,
          and the <Link to="/app/summary/account-creation/individual" className="link">NextSeed Membership Agreement</Link>.
        </p>
        <div className="center-align">
          <Button onClick={() => this.handleCreateAccount()} primary size="large" disabled={!formLinkBankManually.meta.isValid && !isValidLinkBank}>Create the account</Button>
        </div>
      </div>
    );
  }
}
