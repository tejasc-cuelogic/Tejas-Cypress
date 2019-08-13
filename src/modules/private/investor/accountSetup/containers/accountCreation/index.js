import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Route, Switch, withRouter } from 'react-router-dom';
import AccountTypes from '../../components/accountCreation/AccountTypes';
import IraAccCreation from './ira/AccountCreation';
import IndividualAccCreation from './individual/AccountCreation';
import EntityAccCreation from './entity/AccountCreation';

@inject('identityStore', 'accountStore', 'bankAccountStore', 'uiStore', 'userDetailsStore', 'userStore')
@withRouter
@observer
export default class AccountCreation extends Component {
  componentWillMount() {
    this.props.bankAccountStore.setBankLinkInterface('list');
    const { INVESTMENT_ACC_TYPES } = this.props.accountStore;
    const accType = INVESTMENT_ACC_TYPES.fields.accType.values[0];
    // eslint-disable-next-line prefer-destructuring
    if (accType) {
      this.props.accountStore.setAccTypeChange(accType.value);
    }
  }

  handleCloseModal = () => {
    this.props.history.push('/app/summary');
  }

  handleUserIdentity = (accountType, submitAccount) => {
    this.props.uiStore.setProgress();
    this.props.identityStore.setCipStatusWithUserDetails();
    this.props.identityStore.setCipDetails();
    const { isLegalDocsPresent } = this.props.userDetailsStore;
    this.props.identityStore.verifyUserIdentity()
      .then(() => {
        const {
          key,
          route,
        } = this.props.identityStore.userVerficationStatus;
        if (key === 'id.failure') {
          this.props.identityStore.setIdentityQuestions();
          this.props.history.push(route);
        } else if (this.props.identityStore.isUserCipOffline && !isLegalDocsPresent) {
          this.props.uiStore.setProgress();
          this.props.history.push('/app/summary/identity-verification/1');
        } else {
          this.props.uiStore.setProgress();
          this.handleLegalDocsBeforeSubmit(accountType, submitAccount);
        }
      });
  }

  handleLegalDocsBeforeSubmit = (accountType, submitAccount) => {
    const { isUserVerified, isLegalDocsPresent } = this.props.userDetailsStore;
    this.props.identityStore.setCipStatusWithUserDetails();
    if ((!isUserVerified && !isLegalDocsPresent) || this.props.identityStore.isUserCipOffline) {
      this.props.userDetailsStore.setAccountForWhichCipExpired(accountType);
      this.handleUserIdentity(accountType, submitAccount);
    } else {
      submitAccount();
    }
  }

  renderAccType = () => {
    const { investmentAccType } = this.props.accountStore;
    this.props.bankAccountStore.resetStoreData();
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
            render={props => (
<AccountTypes
  form={INVESTMENT_ACC_TYPES}
  close={this.handleCloseModal}
  renderAccType={this.renderAccType}
  handleAccTypeChange={setInvestmentAccType}
  {...props}
/>
            )}
          />
          <Route exact path={`${this.props.match.url}/individual`} render={props => <IndividualAccCreation {...props} handleUserIdentity={this.handleUserIdentity} handleLegalDocsBeforeSubmit={this.handleLegalDocsBeforeSubmit} />} />
          <Route exact path={`${this.props.match.url}/ira`} render={props => <IraAccCreation {...props} handleUserIdentity={this.handleUserIdentity} handleLegalDocsBeforeSubmit={this.handleLegalDocsBeforeSubmit} />} />
          <Route exact path={`${this.props.match.url}/entity`} render={props => <EntityAccCreation {...props} handleUserIdentity={this.handleUserIdentity} handleLegalDocsBeforeSubmit={this.handleLegalDocsBeforeSubmit} />} />
        </Switch>
      </div>
    );
  }
}
