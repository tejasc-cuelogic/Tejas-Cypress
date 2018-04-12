import React, { Component } from 'react';
import { Grid, Header, Tab, Menu } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';

const panes = [
  {
    menuItem: <Menu.Item key="traditional"><div className="account-tab">Traditional</div></Menu.Item>,
    render: () => [
      <Tab.Pane key="individual">
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
          ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
          ullamco laboris
        </p>
      </Tab.Pane>,
    ],
  },
  {
    menuItem: <Menu.Item key="roth"><div className="account-tab">Roth</div></Menu.Item>,
    render: () => [
      <Tab.Pane key="roth">
        <p>
          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris Lorem psum dolor sit
          amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
          magna aliqua. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
          ad minim veniam, quis nostrud exercitation ullamco laboris
        </p>
      </Tab.Pane>,
    ],
  },
];

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
