/* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */
import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Header, Button, Message, Table } from 'semantic-ui-react';
import { isEmpty, get } from 'lodash';
import { ListErrors, IframeModal } from '../../../../../../../theme/shared';
import Helper from '../../../../../../../helper/utility';

const isMobile = document.documentElement.clientWidth < 768;
@inject('bankAccountStore', 'individualAccountStore', 'uiStore', 'userDetailsStore', 'agreementsStore', 'userStore', 'identityStore', 'accountStore')
@withRouter
@observer
export default class Summary extends React.Component {
  state = {
    open: false,
  };

  constructor(props) {
    super(props);
    const {
      getLegalDocsFileIds, alreadySet,
    } = this.props.agreementsStore;
    if (!alreadySet) {
      getLegalDocsFileIds();
    }
    this.props.bankAccountStore.fetchRoutingNumber();
    this.props.uiStore.clearErrors();
  }

  componentDidUpdate() {
    this.props.bankAccountStore.setLoaderForAccountBlank();
    const { userDetails } = this.props.userDetailsStore;
    this.props.uiStore.setProgress(get(userDetails, 'info.firstName') === null ? false : !get(userDetails, 'info.firstName'));
  }

  openModal = (e, type) => {
    e.preventDefault();
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
    const { errors, inProgressArray } = this.props.uiStore;
    const {
      formAddFunds,
      plaidAccDetails,
      formLinkBankManually,
      routingNum,
      isAccountPresent,
      depositAmount,
    } = this.props.bankAccountStore;
    const { setStepToBeRendered } = this.props.individualAccountStore;
    const { userDetails } = this.props.userDetailsStore;
    const bankAccountNumber = !isEmpty(plaidAccDetails)
      ? plaidAccDetails.accountNumber ? plaidAccDetails.accountNumber : '' : formLinkBankManually.fields.accountNumber.value;
    const { embedUrl, docLoading } = this.props.agreementsStore;
    return (
      <>
        <Header as="h4">Confirm your account to start investing! </Header>
        <>
          <div className="table-wrapper mt-30">
            <Table unstackable basic="very" fixed compact={isMobile}>
              <Table.Body>
                <Table.Row>
                  <Table.Cell className="grey-header">Investor: </Table.Cell>
                  <Table.Cell textAlign="right">{`${get(userDetails, 'info.firstName') || ''} ${get(userDetails, 'info.lastName') || ''} `}</Table.Cell>
                  <Table.Cell collapsing width={isMobile ? '3' : '2'} />
                </Table.Row>
                {(!isEmpty(plaidAccDetails) && plaidAccDetails.bankName)
                  && (
                <Table.Row>
                    <Table.Cell className="grey-header">Bank: </Table.Cell>
                    <Table.Cell textAlign="right">{isEmpty(plaidAccDetails) || !plaidAccDetails.institution ? plaidAccDetails.bankName ? plaidAccDetails.bankName : '' : plaidAccDetails.institution.name}</Table.Cell>
                    <Table.Cell collapsing width={isMobile ? '3' : '2'} />
                    </Table.Row>
                  )
                }
                <Table.Row>
                  <Table.Cell className="grey-header">Account Type: </Table.Cell>
                  <Table.Cell textAlign="right">{Helper.caseify(plaidAccDetails.accountType || '')}</Table.Cell>
                  <Table.Cell collapsing width={isMobile ? '3' : '2'} />
                </Table.Row>
                <Table.Row>
                  <Table.Cell className="grey-header">Bank Account Number: </Table.Cell>
                  <Table.Cell textAlign="right">{bankAccountNumber || ''}</Table.Cell>
                  <Table.Cell collapsing width={isMobile ? '3' : '2'} />
                </Table.Row>
                {!isEmpty(routingNum)
                  && (
               <Table.Row>
                    <Table.Cell className="grey-header">Routing Number</Table.Cell>
                    <Table.Cell textAlign="right">
                      {routingNum || ''}
                    </Table.Cell>
                    <Table.Cell collapsing width={isMobile ? '3' : '2'} />
                  </Table.Row>
                  )
                }
                <Table.Row>
                  <Table.Cell className="grey-header">Your Initial Deposit</Table.Cell>
                  <Table.Cell textAlign="right">
                      {depositAmount}
                  </Table.Cell>
                  <Table.Cell collapsing>
                      <span className="pull-right">
                        <Button className="link-button highlight-text" onClick={() => setStepToBeRendered(1)}>Change</Button>
                      </span>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          </div>
        </>
        {errors
          && (
            <Message error className={isMobile && 'center-align'}>
              <ListErrors errors={[errors.message]} />
            </Message>
          )
        }
        <p className="grey-header mt-30">
          By continuing, I acknowledge that I have read and agree to the terms of the{' '}
          <a className="highlight-text" style={{ cursor: 'pointer' }} href="/dashboard/legal-docs/cCAgreement" onClick={e => this.openModal(e, 'cCAgreement')}>CrowdPay Custodial Account Agreement</a>,{' '}
          <a className="highlight-text" style={{ cursor: 'pointer' }} href="/dashboard/legal-docs/fPAgreemnt" onClick={e => this.openModal(e, 'fPAgreemnt')}>NextSeed US LLC Member Agreement</a>,{' '}
          <a className="highlight-text" style={{ cursor: 'pointer' }} href="/dashboard/legal-docs/bDIAgreemnt" onClick={e => this.openModal(e, 'bDIAgreemnt')}>NextSeed Securities LLC Investor Agreement</a>, and {' '}
          <a className="highlight-text" style={{ cursor: 'pointer' }} href="/dashboard/legal-docs/irsCertification" onClick={e => this.openModal(e, 'irsCertification')}>Substitute IRS Form W-9 Certification</a>.
          <IframeModal
            open={this.state.open}
            close={this.closeModal}
            srcUrl={embedUrl}
            loading={docLoading}
          />
        </p>
        <div className="mt-30">
          <Button primary size="large" fluid={isMobile} className="relaxed" content="Create your account" onClick={() => this.props.handleCreateAccount('individual')} disabled={errors || !isAccountPresent || !formAddFunds.meta.isValid || isEmpty(routingNum) || inProgressArray.includes('submitAccountLoader')} />
        </div>
      </>
    );
  }
}
