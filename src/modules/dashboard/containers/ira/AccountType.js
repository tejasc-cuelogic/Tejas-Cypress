import React, { Component } from 'react';
import { Grid, Header, Tab, Menu } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';

const panes = [
  {
    menuItem: <Menu.Item key="traditional"><div className="account-tab">Traditional</div></Menu.Item>,
  },
  {
    menuItem: <Menu.Item key="roth"><div className="account-tab">Roth</div></Menu.Item>,
  },
];

@inject('accountStore')
@observer
export default class AccountType extends Component {
  handleAccountType = (e, data) => {
    this.props.accountStore.setIraAccountType(data.activeIndex);
  }
  render() {
    return (
      <div>
        <Header as="h2">What type of IRA account you want to create?</Header>
        <p>Choose an account type</p>
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
            onTabChange={this.handleAccountType}
          />
        </Grid>
      </div>
    );
  }
}
