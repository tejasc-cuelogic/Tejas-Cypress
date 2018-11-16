import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Header, Button, Message, Table } from 'semantic-ui-react';
import { isEmpty } from 'lodash';
import { ListErrors } from '../../../../../../../theme/shared';
import Helper from '../../../../../../../helper/utility';
@inject('bankAccountStore', 'individualAccountStore', 'uiStore', 'userDetailsStore', 'agreementsStore')
@withRouter
@observer
export default class Summary extends React.Component {
  handleCreateAccount = () => {
    const { isCipExpired, signupStatus } = this.props.userDetailsStore;
    if (isCipExpired && signupStatus.activeAccounts && signupStatus.activeAccounts.length === 0) {
      this.props.history.push('/app/summary/identity-verification/0');
      Helper.toast('CIP verification is expired now, You need to verify it again!', 'error');
    } else if (isCipExpired) {
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
    const { ccAgreementId, irsCertificationId, membershipAgreementId } = this.props.agreementsStore;
    const { errors } = this.props.uiStore;
    const {
      formAddFunds,
      plaidAccDetails,
      isValidLinkBank,
      formLinkBankManually,
      depositMoneyNow,
    } = this.props.bankAccountStore;
    const { userDetails } = this.props.userDetailsStore;
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
                    <Table.Cell>{`${userDetails.info.firstName} ${userDetails.info.lastName}`}</Table.Cell>
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
          terms of the <a target="_blank" rel="noopener noreferrer" href={`https://nextseed.box.com/s/${ccAgreementId}`}>CrowdPay Custodial Account Agreement</a>,
          <a target="_blank" rel="noopener noreferrer" href={`https://nextseed.box.com/s/${irsCertificationId}`}>Substitute IRS Form W-9 Certification</a>,
          and the <a target="_blank" rel="noopener noreferrer" href={`https://nextseed.box.com/s/${membershipAgreementId}`}>NextSeed Membership Agreement</a>.
        </p>
        <div className="center-align">
          <Button onClick={() => this.handleCreateAccount()} primary size="large" disabled={!formLinkBankManually.meta.isValid && !isValidLinkBank}>Create your account</Button>
        </div>
      </div>
    );
  }
}
