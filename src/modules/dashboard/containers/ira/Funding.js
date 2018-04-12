import React, { Component } from 'react';
import { Grid, Header, Tab, Menu } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';

const panes = [
  {
    menuItem: <Menu.Item key="check"><div className="account-tab">Check</div></Menu.Item>,
  },
  {
    menuItem: <Menu.Item key="iraTransfer"><div className="account-tab">IRA Transfer</div></Menu.Item>,
  },
  {
    menuItem: <Menu.Item key="directRollover"><div className="account-tab">Direct Rollover</div></Menu.Item>,
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
        <Header as="h2">How would you like to fund your IRA?</Header>
        <p>Choose funding option</p>
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
