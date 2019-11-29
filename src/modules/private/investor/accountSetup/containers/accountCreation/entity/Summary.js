/* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Header, Table, Button, Message } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { isEmpty } from 'lodash';
import { DateTimeFormat, ListErrors, IframeModal } from '../../../../../../../theme/shared';
import Helper from '../../../../../../../helper/utility';

const isMobile = document.documentElement.clientWidth < 768;
@inject('entityAccountStore', 'uiStore', 'bankAccountStore', 'userDetailsStore', 'agreementsStore', 'userStore', 'identityStore')
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
    this.props.bankAccountStore.setLoaderForAccountBlank();
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
    } = this.props.entityAccountStore;
    const { errors } = this.props.uiStore;
    const {
      plaidAccDetails, formLinkBankManually,
      accountAttributes,
      isAccountPresent,
      routingNum,
    } = this.props.bankAccountStore;
    const bankAccountNumber = !isEmpty(plaidAccDetails)
      ? plaidAccDetails.accountNumber ? plaidAccDetails.accountNumber : '' : formLinkBankManually.fields.accountNumber.value;
    const { embedUrl, docLoading } = this.props.agreementsStore;
    const { taxId, name, street, state, city, zipCode } = GEN_INFO_FRM.fields;
    return (
      <>
        <Header as="h3" textAlign={isMobile ? '' : 'center'}>Verify information and submit for review</Header>
        <div className={isMobile ? '' : 'field-wrap'}>
          <div className="table-wrapper">
            <Table unstackable basic="very" fixed>
              <Table.Body>
                <Table.Row>
                  <Table.Cell className="grey-header">Entity Net Assets</Table.Cell>
                  <Table.Cell>{Helper.CurrencyFormat(FIN_INFO_FRM.fields.netAssets.value
                    ? FIN_INFO_FRM.fields.netAssets.value : 0)}
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell className="grey-header">Other CF Investments</Table.Cell>
                  <Table.Cell>{Helper.CurrencyFormat(FIN_INFO_FRM.fields.annualIncome.value
                    ? FIN_INFO_FRM.fields.annualIncome.value : 0)}
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell className="grey-header">Entity Name</Table.Cell>
                  <Table.Cell>{name.value}</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell className="grey-header">Tax ID</Table.Cell>
                  <Table.Cell>{taxId.value}</Table.Cell>
                </Table.Row>
                <Table.Row verticalAlign="top">
                  <Table.Cell className="grey-header">Entity Address</Table.Cell>
                  <Table.Cell>{`${street.value}, ${city.value}, ${state.value}, ${zipCode.value}`}
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell className="grey-header">Is Entity a Trust?</Table.Cell>
                  <Table.Cell>
                    {TRUST_INFO_FRM.fields.isTrust.value
                      && 'Yes, since '
                    }
                    {TRUST_INFO_FRM.fields.isTrust.value
                      && <DateTimeFormat datetime={TRUST_INFO_FRM.fields.trustDate.value} />
                    }
                    {!TRUST_INFO_FRM.fields.isTrust.value
                      && 'No'
                    }
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell className="grey-header">Title With the Entity</Table.Cell>
                  <Table.Cell>{PERSONAL_INFO_FRM.fields.title.value}</Table.Cell>
                </Table.Row>
                {(!isEmpty(plaidAccDetails) && plaidAccDetails.bankName)
                  && (
                  <Table.Row>
                    <Table.Cell className="grey-header">Bank: </Table.Cell>
                    <Table.Cell>{isEmpty(plaidAccDetails) || !plaidAccDetails.institution ? plaidAccDetails.bankName ? plaidAccDetails.bankName : '' : plaidAccDetails.institution.name}</Table.Cell>
                  </Table.Row>
                  )
                }
                <Table.Row>
                  <Table.Cell className="grey-header">Bank Account</Table.Cell>
                  <Table.Cell>{bankAccountNumber || ''}</Table.Cell>
                </Table.Row>
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
        <p className={`${isMobile ? '' : 'center-align'} grey-header mt-30 mb-0`}>
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
          <span className="highlight-text" style={{ cursor: 'pointer' }} onClick={() => this.openModal('bDIAgreemnt')}>
            NextSeed Securities LLC Investor Agreement
          </span>
, and
          {' '}
          <span className="highlight-text" style={{ cursor: 'pointer' }} onClick={() => this.openModal('irsCertification')}>
            Substitute IRS Form W-9 Certification
          </span>
.
          <IframeModal
            open={this.state.open}
            close={this.closeModal}
            srcUrl={embedUrl}
            loading={docLoading}
          />
        </p>
        <div className="center-align mt-30">
          <Button fluid={isMobile} primary size="large" className="relaxed" content="Submit for Review" onClick={() => this.props.handleCreateAccount('entity')} disabled={!this.props.entityAccountStore.isValidEntityForm || !isAccountPresent} />
        </div>
      </>
    );
  }
}
