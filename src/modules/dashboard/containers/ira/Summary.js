import React, { Component } from 'react';
import { Header, Table, Button } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';

@inject('accountStore')
@observer
export default class Summary extends Component {
  render() {
    const { iraAccount } = this.props.accountStore;
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
                    <Table.Cell>{iraAccount.accountType.value.type}</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell><b>Funding option</b></Table.Cell>
                    <Table.Cell>{iraAccount.fundingOption.value.type}</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell><b>Your networth</b></Table.Cell>
                    <Table.Cell>{iraAccount.networth.value !== '' ? `$${iraAccount.networth.value}` : ''}</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell><b>Your annual income</b></Table.Cell>
                    <Table.Cell>{iraAccount.annualIncome.value !== '' ? `$${iraAccount.annualIncome.value}` : ''}</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell><b>Drivers licence</b></Table.Cell>
                    <Table.Cell>
                      {iraAccount.driversLicence.value !== '' &&
                        <span className="positive-text"><b>Uploaded</b></span>
                      }
                      {iraAccount.driversLicence.value === '' &&
                        <span className="negative-text"><b>Not Uploaded</b></span>
                      }
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table>
            </div>
          </div>
        </div>
        <div className="center-align">
          <Button primary size="large">Create the account</Button>
        </div>
      </div>
    );
  }
}
