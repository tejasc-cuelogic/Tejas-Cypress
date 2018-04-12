import React, { Component } from 'react';
import { Grid, Header, Tab, Menu } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';

const panes = [
  {
    menuItem: <Menu.Item key="check"><div className="account-tab">Check</div></Menu.Item>,
    render: () => [
      <Tab.Pane key="check">
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
          ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
          ullamco laboris
        </p>
      </Tab.Pane>,
    ],
  },
  {
    menuItem: <Menu.Item key="iraTransfer"><div className="account-tab">IRA Transfer</div></Menu.Item>,
    render: () => [
      <Tab.Pane key="iraTransfer">
        <p>
          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris Lorem psum dolor sit
          amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
          magna aliqua. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
          ad minim veniam, quis nostrud exercitation ullamco laboris
        </p>
      </Tab.Pane>,
    ],
  },
  {
    menuItem: <Menu.Item key="directRollover"><div className="account-tab">Direct Rollover</div></Menu.Item>,
    render: () => [
      <Tab.Pane key="directRollover">
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
          ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
          ullamco laboris
        </p>
      </Tab.Pane>,
    ],
  },
];

@inject('accountStore')
@observer
export default class Funding extends Component {
  handleFundingOption = (e, { activeIndex }) => {
    this.props.accountStore.setIraFundingOption(activeIndex);
  }
  render() {
    const { iraAccount } = this.props.accountStore;
    return (
      <div>
        <Header as="h1" textAlign="center">How would you like to fund your IRA?</Header>
        <Header as="h4" textAlign="center">Choose funding option</Header>
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
            activeIndex={iraAccount.fundingOption.value.activeIndex}
            onTabChange={this.handleFundingOption}
          />
        </Grid>
      </div>
    );
  }
}
