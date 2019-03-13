/* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */
import React, { Component } from 'react';
import Aux from 'react-aux';
import { withRouter } from 'react-router-dom';
import { isEmpty, find } from 'lodash';
import { Header, Table, Button, Message } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import Helper from '../../../../../../../helper/utility';
import { ListErrors, IframeModal } from '../../../../../../../theme/shared';

@inject('iraAccountStore', 'uiStore', 'bankAccountStore', 'userDetailsStore', 'agreementsStore', 'userStore')
@withRouter
@observer
export default class Summary extends Component {
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
  componentDidUpdate() {
    const { isValidIraForm } = this.props.iraAccountStore;
    this.props.uiStore.setProgress(!isValidIraForm);
  }
  handleCreateAccount = () => {
    const { isCipExpired, signupStatus } = this.props.userDetailsStore;
    if (isCipExpired && signupStatus.activeAccounts && signupStatus.activeAccounts.length === 0) {
      this.props.history.push('/app/summary/identity-verification/0');
      Helper.toast('CIP verification is expired now, You need to verify it again!', 'error');
      this.props.userDetailsStore.setAccountForWhichCipExpired('ira');
    } else if (isCipExpired) {
      this.props.history.push('/app/summary/identity-verification/0');
      Helper.toast('CIP verification is expired now, You need to verify it again!', 'error');
      this.props.userDetailsStore.setAccountForWhichCipExpired('ira');
    } else {
      this.props.iraAccountStore.submitAccount().then(() => {
        this.props.userDetailsStore.getUser(this.props.userStore.currentUser.sub);
        this.props.bankAccountStore.resetLinkBank();
        this.props.history.push('app/summary');
      });
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
    const {
      FIN_INFO_FRM,
      ACC_TYPES_FRM,
      FUNDING_FRM,
      IDENTITY_FRM,
    } = this.props.iraAccountStore;
    const { errors } = this.props.uiStore;
    const accountType = find(
      ACC_TYPES_FRM.fields.iraAccountType.values,
      { value: ACC_TYPES_FRM.fields.iraAccountType.value },
    );
    const fundingOption = find(
      FUNDING_FRM.fields.fundingType.values,
      { value: FUNDING_FRM.fields.fundingType.value },
    );
    const {
      plaidAccDetails, formLinkBankManually,
      formAddFunds, depositMoneyNow,
      isAccountPresent,
    } = this.props.bankAccountStore;
    const bankAccountNumber = !isEmpty(plaidAccDetails) ?
      plaidAccDetails.accountNumber ? plaidAccDetails.accountNumber : '' : formLinkBankManually.fields.accountNumber.value;
    const { embedUrl, docLoading } = this.props.agreementsStore;
    return (
      <Aux>
        <Header as="h3" textAlign="center">Verify your information and submit for review</Header>
        <div className="field-wrap">
          <div className="table-wrapper">
            <Table unstackable basic="very">
              <Table.Body>
                <Table.Row>
                  <Table.Cell>Type:</Table.Cell>
                  <Table.Cell>{accountType ? accountType.label : ''}</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Funding Option:</Table.Cell>
                  <Table.Cell>{fundingOption ? fundingOption.label : ''}</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Net Worth:</Table.Cell>
                  <Table.Cell>{Helper.CurrencyFormat(FIN_INFO_FRM.fields.netWorth.value ?
                    FIN_INFO_FRM.fields.netWorth.value : 0)}
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Annual Income:</Table.Cell>
                  <Table.Cell>{Helper.CurrencyFormat(FIN_INFO_FRM.fields.income.value ?
                    FIN_INFO_FRM.fields.income.value : 0)}
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Identification:</Table.Cell>
                  <Table.Cell>
                    {IDENTITY_FRM.fields.identityDoc.value ?
                      <span>Uploaded</span> :
                      <span className="negative-text">Not Uploaded</span>}
                  </Table.Cell>
                </Table.Row>
                {fundingOption && fundingOption.value === 0 &&
                  <Table.Row>
                    <Table.Cell>Bank Account:</Table.Cell>
                    <Table.Cell>{bankAccountNumber || ''}</Table.Cell>
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
          <Message error>
            <ListErrors errors={[errors.message]} />
          </Message>
        }
        <div className="center-align mt-30">
          <Button primary size="large" className="relaxed" content="Submit for review" onClick={() => this.handleCreateAccount()} disabled={!this.props.iraAccountStore.isValidIraForm && !isAccountPresent} />
        </div>
        <p className="center-align mt-30 grey-header">
          By continuing, I acknowledge that I have read and agree to the terms of the{' '}
          <span className="highlight-text" style={{ cursor: 'pointer' }} onClick={() => this.openModal('cCAgreement')}>
          CrowdPay Custodial Account Agreement
          </span>,{' '}
          <span className="highlight-text" style={{ cursor: 'pointer' }} onClick={() => this.openModal('fPAgreemnt')}>
          NextSeed US LLC Member Agreement
          </span>,{' '}
          <span className="highlight-text" style={{ cursor: 'pointer' }} onClick={() => this.openModal('bDIAgreemnt')}>
          NextSeed Securities LLC Investor Agreement
          </span>, and {' '}
          <span className="highlight-text" style={{ cursor: 'pointer' }} onClick={() => this.openModal('irsCertification')}>
          Substitute IRS Form W-9 Certification
          </span>.
          {/* <span className="highlight-text" style={{ cursor: 'pointer' }}
          onClick={() => this.openModal('membershipAgreement')}>
          NextSeed Membership Agreement
          </span>. */}
          <IframeModal
            open={this.state.open}
            close={this.closeModal}
            srcUrl={embedUrl}
            loading={docLoading}
          />
        </p>
      </Aux>
    );
  }
}
