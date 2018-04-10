import React, { Component } from 'react';
import { Header } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';

@inject('accountStore')
@observer
export default class Summary extends Component {
  render() {
    const { entityAccount } = this.props.accountStore;
    return (
      <div>
        <Header as="h2">Verify the info and create Entity account</Header>
        Entity net assest - {entityAccount.entityNetAssets.value}
        Other CF Investments - {entityAccount.cfInvestments.value}
        Entitys name - {entityAccount.nameOfEntity.value}
        Tax ID - {entityAccount.taxId.value}
        Entity Address - {entityAccount.street.value}, {entityAccount.city.value},
        {entityAccount.state.value}, {entityAccount.zipCode.value}
        Is Entity a trust? - {entityAccount.isEntityTrust.value}
        Title with the entity - {entityAccount.entityTitle.value}
        Bank account - test
      </div>
    );
  }
}
