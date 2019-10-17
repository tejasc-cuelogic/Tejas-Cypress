import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Route, Switch, withRouter } from 'react-router-dom';
import AccountTypes from '../../components/accountCreation/AccountTypes';
import IraAccCreation from './ira/AccountCreation';
import IndividualAccCreation from './individual/AccountCreation';
import EntityAccCreation from './entity/AccountCreation';
import ConfirmModal from '../../components/confirmModal';
import Helper from '../../../../../../helper/utility';

const isMobile = document.documentElement.clientWidth < 768;
const successMessage = 'Check out some of the investment opportunities now available to you as a member of the NextSeed community.';
const processingMessage = 'While we set up your account, check out some of the investment opportunities now available to you as a member of the NextSeed community.';
@inject('identityStore', 'accountStore', 'bankAccountStore', 'uiStore', 'userDetailsStore', 'userStore', 'iraAccountStore', 'entityAccountStore', 'individualAccountStore')
@withRouter
@observer
export default class AccountCreation extends Component {
  constructor(props) {
    super(props);
    this.props.bankAccountStore.setBankLinkInterface('list');
    const { INVESTMENT_ACC_TYPES } = this.props.accountStore;
    const accType = INVESTMENT_ACC_TYPES.fields.accType.values[0];
    // eslint-disable-next-line prefer-destructuring
    if (isMobile) {
      this.props.accountStore.setAccTypeChange();
    } else if (accType) {
      this.props.accountStore.setAccTypeChange(accType.value);
    }
  }

  handleCloseModal = () => {
    const { signupStatus } = this.props.userDetailsStore;
    const accountType = signupStatus.activeAccounts[0] || signupStatus.partialAccounts[0];
    this.props.history.push(accountType ? `/app/account-details/${accountType}/portfolio` : '/app/setup');
  }

  handleUserIdentity = async (accountType) => {
    try {
      this.props.uiStore.setProgress();
      const { isLegalDocsPresent, isUserVerified } = this.props.userDetailsStore;
      this.props.identityStore.setCipDetails();
      const { res, url } = await this.props.identityStore.verifyCip();
      const { cipStepUrlMapping } = this.props.identityStore;
      const { step } = res.data.verifyCip;
      const isCipOffline = step === 'OFFLINE';

      if (!isUserVerified && (step === 'userCIPSoftFail' && cipStepUrlMapping.cipSoftFail.url === url)) {
        this.props.history.push(cipStepUrlMapping.cipSoftFail.url);
      } else if (!isUserVerified && !isLegalDocsPresent) {
        this.props.history.push(cipStepUrlMapping.ciphardFail.url);
      } else if (isLegalDocsPresent && isCipOffline) {
        const processingUrl = await this.props.accountStore.accountProcessingWrapper(accountType, this.props.match);
        this.props.history.push(processingUrl);
      } else {
        this.props.uiStore.setProgress();
        this.handleLegalDocsBeforeSubmit(accountType);
      }
    } catch (err) {
      this.props.uiStore.removeOneFromProgressArray('submitAccountLoader');
    }
  }


  handleCreateAccount = async (accountType) => {
    this.props.identityStore.setCipStatusWithUserDetails();
    this.props.uiStore.addMoreInProgressArray('submitAccountLoader');
    const { isCipExpired, isUserVerified } = this.props.userDetailsStore;
    if (isCipExpired || !isUserVerified) {
      await this.handleUserIdentity(accountType);
      this.props.userDetailsStore.setAccountForWhichCipExpired(accountType);
    } else {
      await this.handleLegalDocsBeforeSubmit(accountType);
    }
  }

  handleLegalDocsBeforeSubmit = async (accountType) => {
    const { isUserVerified, isLegalDocsPresent } = this.props.userDetailsStore;
    this.props.identityStore.setCipStatusWithUserDetails();
    if (!isUserVerified && !isLegalDocsPresent) {
      this.props.userDetailsStore.setAccountForWhichCipExpired(accountType);
      await this.handleUserIdentity(accountType);
    } else {
      await this.handleSubmitAccount(accountType);
    }
  }

  handleSubmitAccount = async (accountType) => {
    try {
      this.props.uiStore.setcreateAccountMessage();
      await this.props[`${accountType}AccountStore`].submitAccount();
      this.props.uiStore.removeOneFromProgressArray('submitAccountLoader');
      this.props.userDetailsStore.getUser(this.props.userStore.currentUser.sub);
      this.props.uiStore.removeOneFromProgressArray('submitAccountLoader');
      this.props.uiStore.resetcreateAccountMessage();
      const confirmModal = this.props[`${accountType}AccountStore`].showProcessingModal ? 'processing' : 'success';
      this.props[`${accountType}AccountStore`].setFieldValue('showProcessingModal', false);
      this.props.history.push(`${this.props.match.url}/${accountType}/${confirmModal}`);
    } catch (err) {
      if (Helper.matchRegexWithString(/\brequired uploads(?![-])\b/, err.message)) {
        this.handleLegalDocsBeforeSubmit(accountType, this.handleSubmitAccount);
      }
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
          <Route exact path={`${this.props.match.url}/individual`} render={props => <IndividualAccCreation {...props} handleCreateAccount={this.handleCreateAccount} />} />
          <Route exact path={`${this.props.match.url}/ira`} render={props => <IraAccCreation {...props} handleCreateAccount={this.handleCreateAccount} />} />
          <Route exact path={`${this.props.match.url}/entity`} render={props => <EntityAccCreation {...props} handleCreateAccount={this.handleCreateAccount} />} />
          <Route exact path={`${this.props.match.url}/individual/success`} render={props => <ConfirmModal {...props} open content={successMessage} handleCloseModal={this.handleCloseModal} HandleModalCta={this.HandleModalCta} />} />;
          {
            ['individual', 'ira', 'entity'].map(accType => <Route exact path={`${this.props.match.url}/${accType}/processing`} render={props => <ConfirmModal {...props} open content={processingMessage} handleCloseModal={this.handleCloseModal} HandleModalCta={this.HandleModalCta} />} />)
          }
        </Switch>
      </div>
    );
  }
}
