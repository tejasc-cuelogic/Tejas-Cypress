import React, { Component } from 'react';
import _ from 'lodash';
import { Header, Table, Button } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';

@inject('iraAccountStore')
@observer
export default class Summary extends Component {
  render() {
    const { formFinInfo, formAccTypes, formFunding } = this.props.iraAccountStore;
    const accountType = _.find(
      formAccTypes.fields.accountType.values,
      { value: formAccTypes.fields.accountType.value },
    );
    const fundingOption = _.find(
      formFunding.fields.fundingOption.values,
      { value: formFunding.fields.fundingOption.value },
    );
    return (
      <div>
        <Header as="h1" textAlign="center">Verify the information and create IRA account</Header>
        <Header as="h4" textAlign="center">Lorem psum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</Header>
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
                    <Table.Cell>{formFinInfo.fields.networth.value !== '' ? `$${formFinInfo.fields.networth.value}` : ''}</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell><b>Your annual income</b></Table.Cell>
                    <Table.Cell>{formFinInfo.fields.annualIncome.value !== '' ? `$${formFinInfo.fields.annualIncome.value}` : ''}</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell><b>Drivers licence</b></Table.Cell>
                    <Table.Cell>
                      <span className="positive-text"><b>Uploaded</b></span>
                      <span className="negative-text"><b>Not Uploaded</b></span>
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table>
            </div>
          </div>
        </div>
        <div className="center-align">
          <Button primary size="large" className="relaxed">Create the account</Button>
        </div>
      </div>
    );
  }
}
