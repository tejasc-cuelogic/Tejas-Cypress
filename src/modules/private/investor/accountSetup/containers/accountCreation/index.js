import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { find, get } from 'lodash';
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

  handleUserIdentity = (accountType, submitAccount) => new Promise((resolve, reject) => {
    this.props.uiStore.setProgress();
    this.props.identityStore.setCipStatusWithUserDetails();
    this.props.identityStore.setCipDetails();
    this.props.identityStore.verifyUserIdentity()
      .then(() => {
        const {
          key,
          route,
        } = this.props.identityStore.userVerficationStatus;
        if (key === 'id.failure') {
          this.props.identityStore.setIdentityQuestions();
          this.props.history.push(route);
          reject();
        } else if (this.props.identityStore.userCipStatus === 'OFFLINE') {
          this.props.uiStore.setProgress();
          const accountDetails = find(this.props.userDetailsStore.currentUser.data.user.roles, { name: accountType });
          const accountId = get(accountDetails, 'details.accountId') || this.props.individualAccountStore.individualAccId;
          const accountvalue = accountType === 'individual' ? 0 : accountType === 'ira' ? 1 : 2;
          this.props.accountStore.updateToAccountProcessing(accountId, this.props.identityStore.cipErrorMessage, accountvalue).then(() => {
            resolve();
          });
        } else {
          this.props.uiStore.setProgress();
          this.props.handleLegalDocsBeforeSubmit(accountType, submitAccount).then(() => {
            resolve();
          });
        }
      });
  });

  handleLegalDocsBeforeSubmit = (accountType, submitAccount) => new Promise((resolve, reject) => {
    const { isUserVerified, isLegalDocsPresent } = this.props.userDetailsStore;
    if (!isUserVerified && !isLegalDocsPresent) {
      if (accountType === 'individual') {
        this.props.userDetailsStore.setAccountForWhichCipExpired(accountType);
      }
      this.handleUserIdentity(accountType, submitAccount).then(() => resolve());
    } else {
      submitAccount();
      reject();
    }
  });

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
