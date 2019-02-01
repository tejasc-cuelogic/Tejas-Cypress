/* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */
import React from 'react';
import Aux from 'react-aux';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Header, Button, Message, Table } from 'semantic-ui-react';
import { isEmpty } from 'lodash';
import { ListErrors, IframeModal } from '../../../../../../../theme/shared';
import Helper from '../../../../../../../helper/utility';
@inject('bankAccountStore', 'individualAccountStore', 'uiStore', 'userDetailsStore', 'agreementsStore')
@withRouter
@observer
export default class Summary extends React.Component {
  state = {
    open: false,
  };
  componentWillMount() {
    const {
      getLegalDocsFileIds, alreadySet,
    } = this.props.agreementsStore;
    if (!alreadySet) {
      getLegalDocsFileIds();
    }
  }
  componentDidMount() {
    const { plaidAccDetails } = this.props.bankAccountStore;
    this.props.uiStore.setProgress(isEmpty(plaidAccDetails));
  }
  handleCreateAccount = () => {
    const { isCipExpired, signupStatus } = this.props.userDetailsStore;
    if (isCipExpired && signupStatus.activeAccounts && signupStatus.activeAccounts.length === 0) {
      this.props.history.push('/app/summary/identity-verification/0');
      Helper.toast('CIP verification is expired now, You need to verify it again!', 'error');
      this.props.userDetailsStore.setAccountForWhichCipExpired('individual');
    } else if (isCipExpired) {
      this.props.history.push('/app/summary/identity-verification/0');
      Helper.toast('CIP verification is expired now, You need to verify it again!', 'error');
      this.props.userDetailsStore.setAccountForWhichCipExpired('individual');
    } else {
      this.props.individualAccountStore.createAccount('Summary', 'FULL').then(() => {
        this.props.history.push('summary');
      })
        .catch(() => {});
    }
  }
  openModal = (type) => {
    const { getBoxEmbedLink } = this.props.agreementsStore;
    getBoxEmbedLink(type);
    this.setState({
      open: true,
    });
  }
  closeModal = () => {
    this.setState({ open: false });
  }
  render() {
    const { errors } = this.props.uiStore;
    const {
      formAddFunds,
      plaidAccDetails,
      isValidLinkBank,
      formLinkBankManually,
      depositMoneyNow,
      isEncrypted,
    } = this.props.bankAccountStore;
    const { userDetails } = this.props.userDetailsStore;
    const bankAccountNumber = !isEmpty(plaidAccDetails) ?
      plaidAccDetails.accountNumber ? plaidAccDetails.accountNumber : '' : formLinkBankManually.fields.accountNumber.value;
    const { embedUrl, docLoading } = this.props.agreementsStore;
    return (
      <Aux>
        <Header as="h3" textAlign="center">Confirm Account</Header>
        <div className="field-wrap">
          <div className="table-wrapper">
            <Table unstackable basic="very" fixed>
              <Table.Body>
                <Table.Row>
                  <Table.Cell>Investor: </Table.Cell>
                  <Table.Cell>{`${userDetails.info.firstName} ${userDetails.info.lastName}`}</Table.Cell>
                </Table.Row>
                {(!isEmpty(plaidAccDetails) && plaidAccDetails.bankName) &&
                <Table.Row>
                  <Table.Cell>Bank: </Table.Cell>
                  <Table.Cell>{isEmpty(plaidAccDetails) || !plaidAccDetails.institution ? plaidAccDetails.bankName ? plaidAccDetails.bankName : '' : plaidAccDetails.institution.name}</Table.Cell>
                </Table.Row>
                }
                <Table.Row>
                  <Table.Cell>Bank Account Number: </Table.Cell>
                  <Table.Cell>{bankAccountNumber || ''}</Table.Cell>
                </Table.Row>
                {(formLinkBankManually.fields.routingNumber.value &&
                !isEncrypted(formLinkBankManually.fields.routingNumber.value, 'routingNo')) &&
                <Table.Row>
                  <Table.Cell>Routing Number</Table.Cell>
                  <Table.Cell>
                    {formLinkBankManually.fields.routingNumber.value}
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
        {errors &&
          <Message error className="center-align">
            <ListErrors errors={[errors.message]} />
          </Message>
        }
        <p className="center-align grey-header mt-30">
          By continuing, I acknowledge that I have read and agree to the terms of the{' '}
          <span className="highlight-text" style={{ cursor: 'pointer' }} onClick={() => this.openModal('cCAgreement')}>CrowdPay Custodial Account Agreement</span>,{' '}
          <span className="highlight-text" style={{ cursor: 'pointer' }}>NextSeed US LLC Member Agreement</span>,{' '}
          <span className="highlight-text" style={{ cursor: 'pointer' }}>NextSeed Securities LLC Investor Agreement</span>, and {' '}
          <span className="highlight-text" style={{ cursor: 'pointer' }} onClick={() => this.openModal('irsCertification')}>Substitute IRS Form W-9 Certification</span>.
          <IframeModal
            open={this.state.open}
            close={this.closeModal}
            srcUrl={embedUrl}
            loading={docLoading}
          />
        </p>
        <div className="center-align mt-30">
          <Button primary size="large" className="relaxed" content="Create your account" onClick={() => this.handleCreateAccount()} disabled={!formLinkBankManually.meta.isValid && !isValidLinkBank} />
        </div>
      </Aux>
    );
  }
}
