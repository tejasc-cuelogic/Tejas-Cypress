import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { isEmpty, find } from 'lodash';
import { Header, Table, Button, Message } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import Helper from '../../../../../../../helper/utility';
import { ListErrors, IframeModal } from '../../../../../../../theme/shared';

@inject('iraAccountStore', 'uiStore', 'bankAccountStore', 'userDetailsStore', 'agreementsStore')
@withRouter
@observer
export default class Summary extends Component {
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
      this.props.iraAccountStore.createAccount('Summary', 'submit').then(() => {
        this.props.history.push('/app/summary');
      });
    }
  }
  render() {
    const { ccAgreementId, irsCertificationId, membershipAgreementId } = this.props.agreementsStore;
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
    const { plaidAccDetails, formLinkBankManually } = this.props.bankAccountStore;
    const bankAccountNumber = !isEmpty(plaidAccDetails) ?
      plaidAccDetails.accountNumber ? plaidAccDetails.accountNumber : '' : formLinkBankManually.fields.accountNumber.value;
    return (
      <div>
        <Header as="h3" textAlign="center">Verify your information and create an IRA account</Header>
        {errors &&
          <Message error>
            <ListErrors errors={[errors.message]} />
          </Message>
        }
        <div className="summary-wrap">
          <div className="field-wrap">
            <div className="table-wrapper">
              <Table unstackable basic>
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
                        <span className="positive-text"><b>Uploaded</b></span> :
                        <span className="negative-text"><b>Not Uploaded</b></span>}
                    </Table.Cell>
                  </Table.Row>
                  {fundingOption && fundingOption.value === 0 &&
                    <Table.Row>
                      <Table.Cell>Bank Account:</Table.Cell>
                      <Table.Cell>{bankAccountNumber ? Helper.encryptNumberWithX(bankAccountNumber) : ''}</Table.Cell>
                    </Table.Row>
                  }
                </Table.Body>
              </Table>
            </div>
          </div>
        </div>
        <div className="center-align">
          <Button primary size="large" onClick={() => this.handleCreateAccount()} className="relaxed" disabled={!this.props.iraAccountStore.isValidIraForm}>Create the account</Button>
        </div>
        <p className="center-align mt-30">
          <b>
            By continuing, I acknowledge that I have read and agree to the
            terms of the
            <IframeModal
              className="link-button highlight-text"
              text="CrowdPay Custodial Account Agreement"
              srcUrl={`https://nextseed.box.com/s/${ccAgreementId}`}
            />
            <IframeModal
              className="link-button highlight-text"
              text="Substitute IRS Form W-9 Certification"
              srcUrl={`https://nextseed.box.com/s/${irsCertificationId}`}
            />, and the
            <IframeModal
              className="link-button highlight-text"
              text="NextSeed Membership Agreement"
              srcUrl={`https://nextseed.box.com/s/${membershipAgreementId}`}
            />
          </b>
        </p>
      </div>
    );
  }
}
