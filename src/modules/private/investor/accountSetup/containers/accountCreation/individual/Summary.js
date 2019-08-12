/* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */
import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Header, Button, Message, Table } from 'semantic-ui-react';
import { isEmpty, get } from 'lodash';
import { ListErrors, IframeModal } from '../../../../../../../theme/shared';
import Helper from '../../../../../../../helper/utility';
@inject('bankAccountStore', 'individualAccountStore', 'uiStore', 'userDetailsStore', 'agreementsStore', 'userStore', 'identityStore')
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
    this.props.bankAccountStore.fetchRoutingNumber();
  }

  componentDidUpdate() {
    this.props.bankAccountStore.setLoaderForAccountBlank();
    const { userDetails } = this.props.userDetailsStore;
    this.props.uiStore.setProgress(get(userDetails, 'info.firstName') === null ? false : !get(userDetails, 'info.firstName'));
  }

  handleuserIdentity = () => {
    this.props.uiStore.setProgress();
    this.props.identityStore.setCipDetails();
    this.props.identityStore.verifyUserIdentity()
      .then(() => {
        const {
          key,
          route,
        } = this.props.identityStore.userVerficationStatus;
        if (key === 'id.failure') {
          this.props.identityStore.setIdentityQuestions();
          this.props.history.push(route);
        } else {
          this.props.uiStore.setProgress();
          this.handleLegalDocsBeforeSubmit();
        }
      });
  }

  handleLegalDocsBeforeSubmit = () => {
    const { isUserVerified, isLegalDocsPresent } = this.props.userDetailsStore;
    if (!isUserVerified && !isLegalDocsPresent) {
      this.props.userDetailsStore.setAccountForWhichCipExpired('individual');
      this.handleuserIdentity();
    } else {
      this.handleSubmitAccount();
    }
  }

  handleSubmitAccount = () => {
    const {
      partialInvestNowSessionURL,
      setPartialInvestmenSession,
    } = this.props.userDetailsStore;
    this.props.uiStore.setcreateAccountMessage();
    this.props.individualAccountStore.submitAccount().then(() => {
      this.props.uiStore.removeOneFromProgressArray('submitAccountLoader');
      this.props.userDetailsStore.getUser(this.props.userStore.currentUser.sub);
      if (partialInvestNowSessionURL) {
        this.props.history.push(partialInvestNowSessionURL);
        setPartialInvestmenSession();
      } else if (!this.props.individualAccountStore.showProcessingModal) {
        this.props.history.push('/app/summary');
        window.sessionStorage.removeItem('individualAccountCipExp');
        this.props.uiStore.resetcreateAccountMessage();
      }
    }).catch((err) => {
      if (Helper.matchRegexWithString(/\brequired uploads(?![-])\b/, err.message)) {
        this.handleLegalDocsBeforeSubmit();
      }
    });
  }

  handleCreateAccount = () => {
    this.props.uiStore.addMoreInProgressArray('submitAccountLoader');
    const {
      isCipExpired,
      signupStatus,
    } = this.props.userDetailsStore;
    if (isCipExpired && signupStatus.activeAccounts && signupStatus.activeAccounts.length === 0) {
      this.handleuserIdentity();
      this.props.userDetailsStore.setAccountForWhichCipExpired('individual');
    } else if (isCipExpired) {
      this.handleuserIdentity();
      this.props.userDetailsStore.setAccountForWhichCipExpired('individual');
    } else {
      this.handleLegalDocsBeforeSubmit();
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
      formLinkBankManually,
      routingNum,
      isAccountPresent,
      accountAttributes,
    } = this.props.bankAccountStore;
    const { userDetails } = this.props.userDetailsStore;
    const bankAccountNumber = !isEmpty(plaidAccDetails)
      ? plaidAccDetails.accountNumber ? plaidAccDetails.accountNumber : '' : formLinkBankManually.fields.accountNumber.value;
    const { embedUrl, docLoading } = this.props.agreementsStore;
    return (
      <>
        <Header as="h3" textAlign="center">Confirm Account</Header>
        <div className="field-wrap">
          <div className="table-wrapper">
            <Table unstackable basic="very" fixed>
              <Table.Body>
                <Table.Row>
                  <Table.Cell>Investor: </Table.Cell>
                  <Table.Cell>{`${get(userDetails, 'info.firstName') || ''} ${get(userDetails, 'info.lastName') || ''} `}</Table.Cell>
                </Table.Row>
                {(!isEmpty(plaidAccDetails) && plaidAccDetails.bankName)
                  && (
<Table.Row>
                    <Table.Cell>Bank: </Table.Cell>
                    <Table.Cell>{isEmpty(plaidAccDetails) || !plaidAccDetails.institution ? plaidAccDetails.bankName ? plaidAccDetails.bankName : '' : plaidAccDetails.institution.name}</Table.Cell>
                  </Table.Row>
                  )
                }
                <Table.Row>
                  <Table.Cell>Bank Account Number: </Table.Cell>
                  <Table.Cell>{bankAccountNumber || ''}</Table.Cell>
                </Table.Row>
                {!isEmpty(routingNum)
                  && (
<Table.Row>
                    <Table.Cell>Routing Number</Table.Cell>
                    <Table.Cell>
                      {routingNum || ''}
                    </Table.Cell>
                  </Table.Row>
                  )
                }
                <Table.Row>
                  <Table.Cell>Your Initial Deposit</Table.Cell>
                  <Table.Cell>
                    {[-1, ''].includes(accountAttributes.initialDepositAmount)
                      ? Helper.CurrencyFormat(0)
                      : Helper.CurrencyFormat(accountAttributes.initialDepositAmount || 0)}
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          </div>
        </div>
        {errors
          && (
<Message error className="center-align">
            <ListErrors errors={[errors.message]} />
          </Message>
          )
        }
        <p className="center-align grey-header mt-30">
          By continuing, I acknowledge that I have read and agree to the terms of the{' '}
          <span className="highlight-text" style={{ cursor: 'pointer' }} onClick={() => this.openModal('cCAgreement')}>CrowdPay Custodial Account Agreement</span>,{' '}
          <span className="highlight-text" style={{ cursor: 'pointer' }} onClick={() => this.openModal('fPAgreemnt')}>NextSeed US LLC Member Agreement</span>,{' '}
          <span className="highlight-text" style={{ cursor: 'pointer' }} onClick={() => this.openModal('bDIAgreemnt')}>NextSeed Securities LLC Investor Agreement</span>, and {' '}
          <span className="highlight-text" style={{ cursor: 'pointer' }} onClick={() => this.openModal('irsCertification')}>Substitute IRS Form W-9 Certification</span>.
          <IframeModal
            open={this.state.open}
            close={this.closeModal}
            srcUrl={embedUrl}
            loading={docLoading}
          />
        </p>
        <div className="center-align mt-30">
          <Button primary size="large" className="relaxed" content="Create your account" onClick={() => this.handleCreateAccount()} disabled={errors || !isAccountPresent || !formAddFunds.meta.isValid || isEmpty(routingNum)} />
        </div>
      </>
    );
  }
}
