import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { Header, Table, Button, Message } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { isEmpty } from 'lodash';
import { DateTimeFormat, ListErrors } from '../../../../../../../theme/shared';
import Helper from '../../../../../../../helper/utility';

@inject('entityAccountStore', 'uiStore', 'bankAccountStore', 'userDetailsStore')
@withRouter
@observer
export default class Summary extends Component {
  handleCreateAccount = () => {
    const { isCipExpired, signupStatus } = this.props.userDetailsStore;
    if (isCipExpired && signupStatus.activeAccounts && signupStatus.activeAccounts.length === 0) {
      this.props.history.push('/app/summary/identity-verification/0');
      Helper.toast('CIP verification is expired now, You need to verify it again!', 'error');
    } else {
      this.props.entityAccountStore.createAccount('Summary', 'submit').then(() => {
        this.props.history.push('summary');
      });
    }
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
    const { plaidAccDetails, formLinkBankManually } = this.props.bankAccountStore;
    const bankAccountNumber = !isEmpty(plaidAccDetails) ?
      plaidAccDetails.accountNumber ? plaidAccDetails.accountNumber : '' : formLinkBankManually.fields.accountNumber.value;
    return (
      <div>
        <Header as="h3" textAlign="center">Verify the info and create Entity account</Header>
        {errors &&
          <Message error>
            <ListErrors errors={[errors.message]} />
          </Message>
        }
        <div className="field-wrap">
          <div className="table-wrapper">
            <Table unstackable basic fixed>
              <Table.Body>
                <Table.Row>
                  <Table.Cell>Entity Net Assets</Table.Cell>
                  <Table.Cell>{Helper.CurrencyFormat(FIN_INFO_FRM.fields.netAssets.value ?
                      FIN_INFO_FRM.fields.netAssets.value : 0)}
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Other CF Investments</Table.Cell>
                  <Table.Cell>{Helper.CurrencyFormat(FIN_INFO_FRM.fields.cfInvestment.value ?
                      FIN_INFO_FRM.fields.cfInvestment.value : 0)}
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
                  <Table.Cell>{TRUST_INFO_FRM.fields.isTrust.value}
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
                <Table.Row>
                  <Table.Cell>Bank Account</Table.Cell>
                  <Table.Cell>{bankAccountNumber ? Helper.encryptNumberWithX(bankAccountNumber) : ''}</Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          </div>
        </div>
        <div className="center-align">
          <Button primary size="large" onClick={() => this.handleCreateAccount()} disabled={!this.props.entityAccountStore.isValidEntityForm}>Confirm</Button>
        </div>
        <p className="center-align mt-30 grey-text">
          By continuing, I acknowledge that I have read and agree to the
          terms of the <Link to="/app/summary/account-creation/entity" className="link">CrowdPay Custodial Account Agreement</Link>, <Link to="/app/summary/account-creation/entity" className="link">Substitute IRS Form W-9 Certification</Link>,
          and the <Link to="/app/summary/account-creation/entity" className="link">NextSeed Membership Agreement</Link>.
        </p>
      </div>
    );
  }
}
