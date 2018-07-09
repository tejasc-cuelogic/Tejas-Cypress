import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Header, Button, Message, Table } from 'semantic-ui-react';
import _ from 'lodash';
import { ListErrors } from '../../../../../../theme/shared';
import Helper from '../../../../../../helper/utility';

@inject('bankAccountStore', 'individualAccountStore', 'uiStore', 'userStore')
@withRouter
@observer
export default class Summary extends React.Component {
  handleCreateAccount = () => {
    this.props.individualAccountStore.createAccount('Summary', 'submit');
  }
  render() {
    const { errors } = this.props.uiStore;
    const { currentUser } = this.props.userStore;
    const {
      formAddFunds,
      plaidAccDetails,
      isValidLinkBankPlaid,
      formLinkBankManually,
      isValidLinkBankAccountForm,
      depositMoneyNow,
    } = this.props.bankAccountStore;
    return (
      <div>
        <Header as="h1" textAlign="center">Link Bank Account</Header>
        <Header as="h4" textAlign="center">Lorem psum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</Header>
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
                  <Table.Row>
                    <Table.Cell><b>Bank Name</b></Table.Cell>
                    <Table.Cell>{_.isEmpty(plaidAccDetails) || !plaidAccDetails.institution ? plaidAccDetails.bankName ? plaidAccDetails.bankName : '' : plaidAccDetails.institution.name}</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell><b>Bank Account</b></Table.Cell>
                    <Table.Cell>{_.isEmpty(plaidAccDetails) || !plaidAccDetails.account_id ?
                      plaidAccDetails.plaidAccountId ? Helper.encryptNumber(plaidAccDetails.plaidAccountId) : '' :
                      Helper.encryptNumber(plaidAccDetails.account_id)}
                      {formLinkBankManually.fields.accountNumber.value ? Helper.encryptNumber(formLinkBankManually.fields.accountNumber.value) : ''}
                    </Table.Cell>
                  </Table.Row>
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
        <div className="center-align">
          <Button onClick={() => this.handleCreateAccount()} primary size="large" disabled={!isValidLinkBankAccountForm && !isValidLinkBankPlaid}>Create the account</Button>
        </div>
      </div>
    );
  }
}
