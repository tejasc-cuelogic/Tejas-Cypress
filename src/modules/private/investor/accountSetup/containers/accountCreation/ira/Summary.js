import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import _ from 'lodash';
import { Header, Table, Button, Message } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import Helper from '../../../../../../../helper/utility';
import { ListErrors } from '../../../../../../../theme/shared';

@inject('iraAccountStore', 'uiStore')
@withRouter
@observer
export default class Summary extends Component {
  handleCreateAccount = () => {
    this.props.iraAccountStore.createAccount('Summary', 'submit');
    this.props.history.push('/app/summary');
  }
  render() {
    const {
      FIN_INFO_FRM,
      ACC_TYPES_FRM,
      FUNDING_FRM,
      IDENTITY_FRM,
    } = this.props.iraAccountStore;
    const { errors } = this.props.uiStore;
    const accountType = _.find(
      ACC_TYPES_FRM.fields.iraAccountType.values,
      { value: ACC_TYPES_FRM.fields.iraAccountType.value },
    );
    const fundingOption = _.find(
      FUNDING_FRM.fields.fundingType.values,
      { value: FUNDING_FRM.fields.fundingType.value },
    );
    return (
      <div>
        <Header as="h3" textAlign="center">Verify the information and create IRA account</Header>
        {errors &&
          <Message error>
            <ListErrors errors={[errors.message]} />
          </Message>
        }
        <div className="summary-wrap">
          <div className="field-wrap">
            <div className="table-wrapper">
              <Table unstackable compact basic>
                <Table.Body>
                  <Table.Row>
                    <Table.Cell><b>Account type</b></Table.Cell>
                    <Table.Cell>{accountType.label}</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell><b>Funding option</b></Table.Cell>
                    <Table.Cell>{fundingOption.label}</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell><b>Your networth</b></Table.Cell>
                    <Table.Cell>{Helper.CurrencyFormat(FIN_INFO_FRM.fields.netWorth.value ?
                      FIN_INFO_FRM.fields.netWorth.value : 0)}
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell><b>Your annual income</b></Table.Cell>
                    <Table.Cell>{Helper.CurrencyFormat(FIN_INFO_FRM.fields.annualIncome.value ?
                      FIN_INFO_FRM.fields.annualIncome.value : 0)}
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell><b>Drivers licence</b></Table.Cell>
                    <Table.Cell>
                      {IDENTITY_FRM.fields.identityDoc.value ?
                        <span className="positive-text"><b>Uploaded</b></span> :
                        <span className="negative-text"><b>Not Uploaded</b></span>}
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table>
            </div>
          </div>
        </div>
        <p className="center-align mb-30">
          By continuing, I acknowledge that I have read and agree to the
          terms of the <Link to="/" className="link">CrowdPay Custodial Account Agreement</Link>, <Link to="/" className="link">Substitute IRS Form W-9 Certification</Link>,
          and the <Link to="/" className="link">NextSeed Membership Agreement</Link>.
        </p>
        <div className="center-align">
          <Button primary size="large" onClick={() => this.handleCreateAccount()} className="relaxed" disabled={!this.props.iraAccountStore.isValidIraForm}>Create the account</Button>
        </div>
      </div>
    );
  }
}
