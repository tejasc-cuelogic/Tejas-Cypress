import React, { Component } from 'react';
import { Grid, Header, Tab, Menu } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { FormRadioGroup } from '../../../../components/form/FormElements';

@inject('accountStore')
@observer
export default class AccountType extends Component {
  handleAccountType = (e, { activeIndex }) => {
    this.props.accountStore.setIraAccountType(activeIndex);
  }
  render() {
    const { iraAccount } = this.props.accountStore;
    return (
      <div>
        <Header as="h1" textAlign="center">What type of IRA account you want to create?</Header>
        <Header as="h4" textAlign="center">Choose an account type</Header>
        <Grid textAlign="center">
          <Tab
            className="account-type-tab"
            menu={{
              secondary: true,
              pointing: true,
              className: 'item three',
              fluid: true,
              stackable: true,
            }}
            panes={panes}
            activeIndex={iraAccount.accountType.value.activeIndex}
            onTabChange={this.handleAccountType}
          />
        </Grid>
      </div>
    );
  }
}
