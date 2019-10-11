import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Route, Switch, withRouter } from 'react-router-dom';
import AccountTypes from '../../components/accountCreation/AccountTypes';
import IraAccCreation from './ira/AccountCreation';
import IndividualAccCreation from './individual/AccountCreation';
import EntityAccCreation from './entity/AccountCreation';
import ConfirmModal from '../../components/confirmModal';

const successMessage = 'Check out some of the investment opportunities now available to you as a member of the NextSeed community.';
const processingMessage = 'While we set up your account, check out some of the investment opportunities now available to you as a member of the NextSeed community.';
@inject('identityStore', 'accountStore', 'bankAccountStore', 'uiStore', 'userDetailsStore', 'userStore')
@withRouter
@observer
export default class AccountCreation extends Component {
  constructor(props) {
    super(props);
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

  handleUserIdentity = async (accountType, submitAccount) => {
    try {
      this.props.uiStore.setProgress();
      const { isLegalDocsPresent, isUserVerified } = this.props.userDetailsStore;
      this.props.identityStore.setCipDetails();
      const { res, url } = await this.props.identityStore.verifyCip();
      const { cipStepUrlMapping } = this.props.identityStore;
      const isCipOffline = res.data.verifyCip.step === 'OFFLINE';

      if (!isUserVerified && cipStepUrlMapping.cipSoftFail.url === url) {
        this.props.history.push(cipStepUrlMapping.cipSoftFail.url);
      } else if (!isUserVerified && !isLegalDocsPresent) {
        this.props.history.push(cipStepUrlMapping.ciphardFail.url);
      } else if (!isUserVerified && isLegalDocsPresent && isCipOffline) {
        await this.props.accountStore.accountProcessingWrapper(accountType, this.props.match);
      } else {
        this.props.uiStore.setProgress();
        this.handleLegalDocsBeforeSubmit(accountType, submitAccount);
      }
    } catch {
      this.props.uiStore.removeOneFromProgressArray('submitAccountLoader');
    }
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

  HandleModalCta = () => {
    const { partialInvestNowSessionURL, setPartialInvestmenSession } = this.props.userDetailsStore;
    if (partialInvestNowSessionURL) {
      this.props.history.push(partialInvestNowSessionURL);
      setPartialInvestmenSession();
    } else {
      this.props.history.push('/offerings');
      this.props.uiStore.resetcreateAccountMessage();
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
          <Route exact path={`${this.props.match.url}/individual/success`} render={props => <ConfirmModal {...props} open content={successMessage} handleCloseModal={this.handleCloseModal} HandleModalCta={this.HandleModalCta} />} />;
          {
            ['individual', 'ira', 'entity'].map(accType => <Route exact path={`${this.props.match.url}/${accType}/processing`} render={props => <ConfirmModal {...props} open content={processingMessage} handleCloseModal={this.handleCloseModal} HandleModalCta={this.HandleModalCta} />} />)
          }
        </Switch>
      </div>
    );
  }
}
