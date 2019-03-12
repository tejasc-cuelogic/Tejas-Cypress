import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Route, Switch, withRouter } from 'react-router-dom';
import AccountTypes from '../../components/accountCreation/AccountTypes';
import IraAccCreation from './ira/AccountCreation';
import IndividualAccCreation from './individual/AccountCreation';
import EntityAccCreation from './entity/AccountCreation';

@inject('identityStore', 'accountStore', 'bankAccountStore')
@withRouter
@observer
export default class AccountCreation extends Component {
  componentWillMount() {
    // this.props.bankAccountStore.setBankLinkInterface('list');
  }
  handleCloseModal = () => {
    this.props.history.push('/app/summary');
  }
  renderAccType = () => {
    const { investmentAccType } = this.props.accountStore;
    this.props.history.push(`${this.props.match.url}/${investmentAccType}`);
  }
  render() {
    const { INVESTMENT_ACC_TYPES, setInvestmentAccType } = this.props.accountStore;
    return (
      <div>
        <Switch>
          <Route
            exact
            path={this.props.match.url}
            render={props =>
              (<AccountTypes
                form={INVESTMENT_ACC_TYPES}
                close={this.handleCloseModal}
                renderAccType={this.renderAccType}
                handleAccTypeChange={setInvestmentAccType}
                {...props}
              />)}
          />
          <Route exact path={`${this.props.match.url}/individual`} component={IndividualAccCreation} />
          <Route exact path={`${this.props.match.url}/ira`} component={IraAccCreation} />
          <Route exact path={`${this.props.match.url}/entity`} component={EntityAccCreation} />
        </Switch>
      </div>
    );
  }
}
