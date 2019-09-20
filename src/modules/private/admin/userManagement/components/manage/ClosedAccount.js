import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Route, withRouter } from 'react-router-dom';
import SecondaryMenu from '../../../../../../theme/layout/SecondaryMenu';
import AccountDetails from './AccountDetails';

@inject('accountStore', 'transactionStore')
@withRouter
@observer
export default class ClosedAccount extends Component {
  constructor(props) {
    super(props);
    if (this.props.match.isExact) {
      const { sortedNavAccounts } = this.props.accountStore;
      this.props.history.push(`${this.props.match.url}/${sortedNavAccounts[0].to}`);
    }
  }

  render() {
    const { sortedNavAccounts } = this.props.accountStore;
    return (
      <>
        <SecondaryMenu force2ary match={this.props.match} navItems={sortedNavAccounts} />
        <div className="inner-content-spacer">
          <Route path={`${this.props.match.url}/:closedAccountId`} render={() => <AccountDetails />} />
        </div>
      </>
    );
  }
}
