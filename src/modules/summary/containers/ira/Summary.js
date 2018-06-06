import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import _ from 'lodash';
import { Header, Table, Button, Message } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import Helper from '../../../../helper/utility';
import ListErrors from '../../../../theme/common/ListErrors';

@inject('iraAccountStore', 'uiStore')
@withRouter
@observer
export default class Summary extends Component {
  handleCreateAccount = () => {
    this.props.iraAccountStore.createAccount('Summary', 'submit');
  }
  render() {
    const {
      formFinInfo,
      formAccTypes,
      formFunding,
      formIdentity,
    } = this.props.iraAccountStore;
    const { errors } = this.props.uiStore;
    const accountType = _.find(
      formAccTypes.fields.iraAccountType.values,
      { value: formAccTypes.fields.iraAccountType.value },
    );
    const fundingOption = _.find(
      formFunding.fields.fundingType.values,
      { value: formFunding.fields.fundingType.value },
    );
    return (
      <div>
        <Header as="h1" textAlign="center">Verify the information and create IRA account</Header>
        {errors &&
          <Message error>
            <ListErrors errors={[errors.message]} />
          </Message>
        }
        <div className="summary-wrap">
          <div className="field-wrap">
            <div className="table-wrapper">
              <Table compact basic>
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
                    <Table.Cell>{Helper.CurrencyFormat(formFinInfo.fields.netWorth.value ?
                      formFinInfo.fields.netWorth.value : 0)}
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell><b>Your annual income</b></Table.Cell>
                    <Table.Cell>{Helper.CurrencyFormat(formFinInfo.fields.annualIncome.value ?
                      formFinInfo.fields.annualIncome.value : 0)}
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell><b>Drivers licence</b></Table.Cell>
                    <Table.Cell>
                      {formIdentity.fields.identityDoc.value ?
                        <span className="positive-text"><b>Uploaded</b></span> :
                        <span className="negative-text"><b>Not Uploaded</b></span>}
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table>
            </div>
          </div>
        </div>
        <div className="center-align">
          <Button primary size="large" onClick={() => this.handleCreateAccount()} className="relaxed" disabled={!this.props.iraAccountStore.isValidIraForm}>Create the account</Button>
        </div>
      </div>
    );
  }
}
