import React, { Component } from 'react';
import { Header } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';

@inject('accountStore')
@observer
export default class Summary extends Component {
  render() {
    const { iraAccount } = this.props.accountStore;
    return (
      <div>
        <Header as="h2">Verify the information and create IRA account</Header>
        Account type - {iraAccount.accountType.value.type}
        Funding option - {iraAccount.fundingOption.value.type}
        Your networth - {iraAccount.networth.value}
        Your annual income - {iraAccount.annualIncome.value}
        drivers licence - {iraAccount.driversLicence.value}
      </div>
    );
  }
}
