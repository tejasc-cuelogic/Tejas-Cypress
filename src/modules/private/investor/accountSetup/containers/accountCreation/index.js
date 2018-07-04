import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Route, Switch, withRouter } from 'react-router-dom';
import AccountTypes from '../../components/accountCreation/AccountTypes';
import IraAccCreation from './ira/AccountCreation';
import IndividualAccCreation from './individual/AccountCreation';
import EntityAccCreation from './entity/AccountCreation';

@inject('identityStore', 'accountStore')
@withRouter
@observer
export default class AccountCreation extends Component {
  handleAccTypeChange = (e, { value }) => {
    this.props.accountStore.setInvestmentAccType(value);
  }
  handleCloseModal = () => {
    this.props.history.push('/app/summary');
  }
  renderAccType = () => {
    const { investmentAccType } = this.props.accountStore;
    this.props.history.push(`/app/summary/account-creation/${investmentAccType}`);
  }
  render() {
    const { investmentAccTypes } = this.props.accountStore;
    return (
      <div>
        <Switch>
          <Route exact path="/app/summary/account-creation/individual" component={IndividualAccCreation} />
          <Route exact path="/app/summary/account-creation/ira" component={IraAccCreation} />
          <Route exact path="/app/summary/account-creation/entity" component={EntityAccCreation} />
        </Switch>
        <AccountTypes
          form={investmentAccTypes}
          close={this.handleCloseModal}
          renderAccType={this.renderAccType}
          handleAccTypeChange={this.handleAccTypeChange}
        />
      </div>
    );
  }
}
