/* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */
import React, { Component } from 'react';
import Aux from 'react-aux';
import { withRouter } from 'react-router-dom';
import { Header, Table, Button, Message } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { isEmpty } from 'lodash';
import { DateTimeFormat, ListErrors, IframeModal } from '../../../../../../../theme/shared';
import Helper from '../../../../../../../helper/utility';

@inject('entityAccountStore', 'uiStore', 'bankAccountStore', 'userDetailsStore', 'agreementsStore', 'userStore')
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
    this.props.bankAccountStore.setLoaderForAccountBlank();
  }
  handleCreateAccount = () => {
    this.props.uiStore.setcreateAccountMessage();
    const { isCipExpired, signupStatus } = this.props.userDetailsStore;
    if (isCipExpired && signupStatus.activeAccounts && signupStatus.activeAccounts.length === 0) {
      this.props.history.push('/app/summary/identity-verification/0');
      Helper.toast('CIP verification is expired now, You need to verify it again!', 'error');
      this.props.userDetailsStore.setAccountForWhichCipExpired('entity');
    } else if (isCipExpired) {
      this.props.history.push('/app/summary/identity-verification/0');
      Helper.toast('CIP verification is expired now, You need to verify it again!', 'error');
      this.props.userDetailsStore.setAccountForWhichCipExpired('entity');
    } else {
      this.props.entityAccountStore.submitAccount().then(() => {
        this.props.userDetailsStore.getUser(this.props.userStore.currentUser.sub);
        // this.props.history.push('app/summary');
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
      PERSONAL_INFO_FRM,
      GEN_INFO_FRM,
      TRUST_INFO_FRM,
    }
      = this.props.entityAccountStore;
    const { errors } = this.props.uiStore;
    const {
      plaidAccDetails, formLinkBankManually,
      accountAttributes,
      isAccountPresent,
    } = this.props.bankAccountStore;
    const bankAccountNumber = !isEmpty(plaidAccDetails) ?
      plaidAccDetails.accountNumber ? plaidAccDetails.accountNumber : '' : formLinkBankManually.fields.accountNumber.value;
    const { embedUrl, docLoading } = this.props.agreementsStore;
    return (
      <Aux>
        <Header as="h3" textAlign="center">Verify information and submit for review</Header>
        <div className="field-wrap">
          <div className="table-wrapper">
            <Table unstackable basic="very" fixed>
              <Table.Body>
                <Table.Row>
                  <Table.Cell>Entity Net Assets</Table.Cell>
                  <Table.Cell>{Helper.CurrencyFormat(FIN_INFO_FRM.fields.netAssets.value ?
                      FIN_INFO_FRM.fields.netAssets.value : 0)}
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Other CF Investments</Table.Cell>
                  <Table.Cell>{Helper.CurrencyFormat(FIN_INFO_FRM.fields.annualIncome.value ?
                      FIN_INFO_FRM.fields.annualIncome.value : 0)}
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Entity{"'"}s Name</Table.Cell>
                  <Table.Cell>{GEN_INFO_FRM.fields.name.value}</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Tax ID</Table.Cell>
                  <Table.Cell>{GEN_INFO_FRM.fields.taxId.value}</Table.Cell>
                </Table.Row>
                <Table.Row verticalAlign="top">
                  <Table.Cell>Entity Address</Table.Cell>
                  <Table.Cell>{GEN_INFO_FRM.fields.street.value}
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Is Entity a Trust?</Table.Cell>
                  <Table.Cell>
                    {TRUST_INFO_FRM.fields.isTrust.value &&
                      'Yes, since '
                    }
                    {TRUST_INFO_FRM.fields.isTrust.value &&
                      <DateTimeFormat datetime={TRUST_INFO_FRM.fields.trustDate.value} />
                    }
                    {!TRUST_INFO_FRM.fields.isTrust.value &&
                      'No'
                    }
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Title With the Entity</Table.Cell>
                  <Table.Cell>{PERSONAL_INFO_FRM.fields.title.value}</Table.Cell>
                </Table.Row>
                {(!isEmpty(plaidAccDetails) && plaidAccDetails.bankName) &&
                  <Table.Row>
                    <Table.Cell>Bank: </Table.Cell>
                    <Table.Cell>{isEmpty(plaidAccDetails) || !plaidAccDetails.institution ? plaidAccDetails.bankName ? plaidAccDetails.bankName : '' : plaidAccDetails.institution.name}</Table.Cell>
                  </Table.Row>
                }
                <Table.Row>
                  <Table.Cell>Bank Account</Table.Cell>
                  <Table.Cell>{bankAccountNumber || ''}</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Your Initial Deposit</Table.Cell>
                  <Table.Cell>
                    {[-1, ''].includes(accountAttributes.initialDepositAmount) ?
                    Helper.CurrencyFormat(0) :
                    Helper.CurrencyFormat(accountAttributes.initialDepositAmount || 0)}
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
          <Button primary size="large" className="relaxed" content="Submit for review" onClick={() => this.handleCreateAccount()} disabled={!this.props.entityAccountStore.isValidEntityForm || !isAccountPresent} />
        </div>
        <p className="center-align grey-header mt-30 mb-0">
          By continuing, I acknowledge that I have read and agree to the terms of the{' '}
          <span className="highlight-text" style={{ cursor: 'pointer' }} onClick={() => this.openModal('cCAgreement')}>
            CrowdPay Custodial Account Agreement
          </span>,{' '}
          <span className="highlight-text" style={{ cursor: 'pointer' }} onClick={() => this.openModal('fPAgreemnt')}>
            NextSeed US LLC Member Agreement
          </span>,
          <span className="highlight-text" style={{ cursor: 'pointer' }} onClick={() => this.openModal('bDIAgreemnt')}>
            NextSeed Securities LLC Investor Agreement
          </span>, and {' '}
          <span className="highlight-text" style={{ cursor: 'pointer' }} onClick={() => this.openModal('irsCertification')}>
            Substitute IRS Form W-9 Certification
          </span>.
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
