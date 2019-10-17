/* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { isEmpty, find } from 'lodash';
import { Header, Table, Button, Message } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import Helper from '../../../../../../../helper/utility';
import { ListErrors, IframeModal } from '../../../../../../../theme/shared';

const isMobile = document.documentElement.clientWidth < 768;
@inject('iraAccountStore', 'uiStore', 'bankAccountStore', 'userDetailsStore', 'agreementsStore', 'userStore', 'identityStore')
@withRouter
@observer
export default class Summary extends Component {
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
  }

  componentDidUpdate() {
    if (this.props.iraAccountStore.FUNDING_FRM.fields.fundingType.value === 0) {
      this.props.bankAccountStore.setLoaderForAccountBlank();
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
      accountAttributes, routingNum,
    } = this.props.bankAccountStore;
    const bankAccountNumber = !isEmpty(plaidAccDetails)
      ? plaidAccDetails.accountNumber ? plaidAccDetails.accountNumber : '' : formLinkBankManually.fields.accountNumber.value;
    const { embedUrl, docLoading } = this.props.agreementsStore;
    return (
      <>
        <Header as="h4" textAlign={isMobile ? '' : 'center'}>Confirm your account to start investing!</Header>
        <div className={isMobile ? '' : 'field-wrap'}>
          <div className="table-wrapper">
            <Table unstackable basic="very">
              <Table.Body>
                <Table.Row>
                  <Table.Cell className="grey-header">Type:</Table.Cell>
                  <Table.Cell>{accountType ? accountType.label : ''}</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell className="grey-header">Funding Option:</Table.Cell>
                  <Table.Cell>{fundingOption ? fundingOption.label : ''}</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell className="grey-header">Net Worth:</Table.Cell>
                  <Table.Cell>{Helper.CurrencyFormat(FIN_INFO_FRM.fields.netWorth.value
                    ? FIN_INFO_FRM.fields.netWorth.value : 0)}
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell className="grey-header">Annual Income:</Table.Cell>
                  <Table.Cell>{Helper.CurrencyFormat(FIN_INFO_FRM.fields.income.value
                    ? FIN_INFO_FRM.fields.income.value : 0)}
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell className="grey-header">Identification:</Table.Cell>
                  <Table.Cell>
                    {IDENTITY_FRM.fields.identityDoc.value
                      ? <span>Uploaded</span>
                      : <span className="negative-text">Not Uploaded</span>}
                  </Table.Cell>
                </Table.Row>
                {(!isEmpty(plaidAccDetails) && plaidAccDetails.bankName)
                  && (
<Table.Row>
                    <Table.Cell className="grey-header">Bank: </Table.Cell>
                    <Table.Cell>{isEmpty(plaidAccDetails) || !plaidAccDetails.institution ? plaidAccDetails.bankName ? plaidAccDetails.bankName : '' : plaidAccDetails.institution.name}</Table.Cell>
                  </Table.Row>
                  )
                }
                {fundingOption && fundingOption.value === 0
                  && (
<Table.Row>
                    <Table.Cell className="grey-header">Bank Account:</Table.Cell>
                    <Table.Cell>{bankAccountNumber || ''}</Table.Cell>
                  </Table.Row>
                  )
                }

                {!isEmpty(routingNum)
                  && (
<Table.Row>
                    <Table.Cell className="grey-header">Routing Number</Table.Cell>
                    <Table.Cell>
                      { routingNum || '' }
                    </Table.Cell>
                  </Table.Row>
                  )
                }
                <Table.Row>
                  <Table.Cell className="grey-header">Your Initial Deposit</Table.Cell>
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
            <Message error>
              <ListErrors errors={[errors.message]} />
            </Message>
          )
        }
        {isMobile && (
<p className="mb-30 mt-30 grey-header">
          By continuing, I acknowledge that I have read and agree to the terms of the
          {' '}
          <span className="highlight-text" style={{ cursor: 'pointer' }} onClick={() => this.openModal('cCAgreement')}>
          CrowdPay Custodial Account Agreement
          </span>
,
          {' '}
          <span className="highlight-text" style={{ cursor: 'pointer' }} onClick={() => this.openModal('fPAgreemnt')}>
          NextSeed US LLC Member Agreement
          </span>
,
          {' '}
          <span className="highlight-text" style={{ cursor: 'pointer' }} onClick={() => this.openModal('bDIAgreemnt')}>
          NextSeed Securities LLC Investor Agreement
          </span>
, and
          {' '}
          <span className="highlight-text" style={{ cursor: 'pointer' }} onClick={() => this.openModal('irsCertification')}>
          Substitute IRS Form W-9 Certification
          </span>
.
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
        )}
        <div className="center-align mt-30">
          <Button primary size="large" fluid={isMobile} className="relaxed" content="Submit for review" onClick={() => this.props.handleCreateAccount('ira')} disabled={!this.props.iraAccountStore.isValidIraForm} />
        </div>
        {!isMobile && (
<p className="center-align mt-30 grey-header">
          By continuing, I acknowledge that I have read and agree to the terms of the
          {' '}
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
        )}
      </>
    );
  }
}
