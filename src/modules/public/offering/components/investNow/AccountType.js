import React, { Component } from 'react';
import Aux from 'react-aux';
import { includes, uniq, get } from 'lodash';
import { Header, Form, Icon, Button, Divider } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { Link, withRouter } from 'react-router-dom';
import cookie from 'react-cookies';
import { FormRadioGroup, FormCheckbox } from '../../../../../theme/form';
import { Spinner } from '../../../../../theme/shared';

@inject('investmentStore', 'userDetailsStore', 'investmentLimitStore', 'userStore', 'campaignStore', 'accreditationStore')
@withRouter
@observer
class AccountType extends Component {
  componentWillMount() {
    const {
      byDefaultRender,
      setStepToBeRendered,
      prepareAccountTypes,
      investAccTypes,
    } = this.props.investmentStore;
    const {
      activeAccounts,
      frozenAccounts,
      inprogressAccounts,
    } = this.props.userDetailsStore.signupStatus;
    const accountToConsider = (activeAccounts.length === 0 && inprogressAccounts.length === 0) ?
      [] : (activeAccounts.length === 1 && inprogressAccounts.length === 0) ?
        activeAccounts : uniq([...activeAccounts, ...inprogressAccounts]);
    prepareAccountTypes(accountToConsider);
    const {
      setPartialInvestmenSession,
      sendAdminEmailOfFrozenAccount,
    } = this.props.userDetailsStore;
    const { getCurrentInvestNowHealthCheck } = this.props.investmentLimitStore;
    const { campaign } = this.props.campaignStore;
    const offeringId = campaign && campaign.id ? campaign.id : this.props.match.params.offeringId;
    const offeringReuglation = campaign && campaign.regulation;
    const isRegulationCheck = !!(offeringReuglation && (offeringReuglation === 'BD_506C' || offeringReuglation === 'BD_CF_506C'));
    const regulationType = offeringReuglation;
    let isDocumentUpload = get(getCurrentInvestNowHealthCheck, 'availibityForNPAInOffering');
    const {
      userAccredetiationState,
      resetAccreditationExpirayForm,
      selectedAccountStatus,
      initiateAccreditation,
      userSelectedAccountStatus,
      setUserSelectedAccountStatus,
    } = this.props.accreditationStore;
    const userStatusFound = userSelectedAccountStatus(investAccTypes.value);
    setUserSelectedAccountStatus(userStatusFound);
    resetAccreditationExpirayForm('ACCREDITATION_EXPIRY_FORM');
    if ((activeAccounts.length && (investAccTypes.values.length === 1 || this.props.changeInvest))
      || (investAccTypes.values.length > 1 && !getCurrentInvestNowHealthCheck)) {
      if (this.props.investmentStore.getSelectedAccountTypeId && !getCurrentInvestNowHealthCheck) {
        this.props.investmentLimitStore
          .getInvestNowHealthCheck(this.props.investmentStore.getSelectedAccountTypeId, offeringId)
          .then((resp) => {
            isDocumentUpload = get(resp, 'investNowHealthCheck.availibityForNPAInOffering');
          });
      }
    }
    if (!byDefaultRender) {
      setStepToBeRendered(2);
    } else if (this.props.changeInvest || (accountToConsider &&
      accountToConsider.length === 1 && isDocumentUpload === true)) {
      if ((isRegulationCheck && userAccredetiationState && userAccredetiationState === 'ELGIBLE') || (isRegulationCheck && regulationType && regulationType === 'BD_CF_506C' && userAccredetiationState && userAccredetiationState === 'PENDING') || (!isRegulationCheck && selectedAccountStatus === 'FULL')) {
        const accountType = this.props.changeInvest ? includes(this.props.location.pathname, 'individual') ? 'individual' : includes(this.props.location.pathname, 'ira') ? 'ira' : 'entity' : activeAccounts[0];
        this.props.investmentStore.accTypeChanged(null, { value: accountType }).then(() => {
          if (activeAccounts.length && this.props.investmentStore.getSelectedAccountTypeId) {
            setStepToBeRendered(1);
          }
        });
      } else if (this.props.changeInvest) {
        const accountType = this.props.changeInvest ? includes(this.props.location.pathname, 'individual') ? 'individual' : includes(this.props.location.pathname, 'ira') ? 'ira' : 'entity' : activeAccounts[0];
        this.props.investmentStore.accTypeChanged(null, { value: accountType }).then(() => {
          if (activeAccounts.length && this.props.investmentStore.getSelectedAccountTypeId) {
            setStepToBeRendered(1);
          }
        });
      }
    }
    setPartialInvestmenSession();
    if (frozenAccounts.length && selectedAccountStatus === 'FROZEN') {
      if (!cookie.load('ADMIN_FROZEN_EMAIL') && cookie.load('ADMIN_FROZEN_EMAIL') === undefined) {
        // send email to admin
        sendAdminEmailOfFrozenAccount('INVESTMENT');
      }
    }
    if (!this.props.accreditationStore.accreditationData.ira) {
      this.props.accreditationStore.getUserAccreditation().then(() => {
        initiateAccreditation();
      });
    }
  }
  componentDidMount() {
    const {
      setStepToBeRendered,
      setFieldValue,
      investAccTypes,
      byDefaultRender,
      prepareAccountTypes,
    } = this.props.investmentStore;
    const {
      userAccredetiationState,
      selectedAccountStatus,
      userAccreditatedStatus,
      // showAccountList,
    } = this.props.accreditationStore;
    const { getCurrentInvestNowHealthCheck } = this.props.investmentLimitStore;
    // if (!showAccountList && !getCurrentInvestNowHealthCheck) {
    //   this.props.cancel();
    //   this.props.history.push(this.props.refLink);
    // }
    const { activeAccounts, inprogressAccounts } = this.props.userDetailsStore.signupStatus;
    const accountToConsider = (activeAccounts.length === 0 && inprogressAccounts.length === 0) ?
      [] : (activeAccounts.length === 1 && inprogressAccounts.length === 0) ?
        activeAccounts : uniq([...activeAccounts, ...inprogressAccounts]);
    prepareAccountTypes(accountToConsider);
    const { campaign } = this.props.campaignStore;
    const offeringReuglation = campaign && campaign.regulation;
    const isDocumentUpload = get(getCurrentInvestNowHealthCheck, 'availibityForNPAInOffering');
    const isRegulationCheck = !!(offeringReuglation && (offeringReuglation === 'BD_506C' || offeringReuglation === 'BD_CF_506C'));
    const regulationType = offeringReuglation;
    userAccreditatedStatus(investAccTypes.value, isRegulationCheck, offeringReuglation);
    if (!byDefaultRender) {
      setStepToBeRendered(2);
    } else if (accountToConsider && accountToConsider.length === 1 && isDocumentUpload === true) {
      if ((isRegulationCheck && userAccredetiationState && userAccredetiationState === 'ELGIBLE') || (isRegulationCheck && regulationType && regulationType === 'BD_CF_506C' && userAccredetiationState && userAccredetiationState === 'PENDING') || (!isRegulationCheck && selectedAccountStatus === 'FULL')) {
        setFieldValue('disableNextbtn', false);
        setStepToBeRendered(1);
      }
    }
  }
  componentDidUpdate() {
    const {
      setStepToBeRendered,
      setFieldValue,
      byDefaultRender,
      investAccTypes,
    } = this.props.investmentStore;
    const {
      userAccredetiationState,
      selectedAccountStatus,
    } = this.props.accreditationStore;
    const { getCurrentInvestNowHealthCheck } = this.props.investmentLimitStore;
    const { campaign } = this.props.campaignStore;
    const offeringReuglation = campaign && campaign.regulation;
    const isDocumentUpload = get(getCurrentInvestNowHealthCheck, 'availibityForNPAInOffering');
    const isRegulationCheck = !!(offeringReuglation && (offeringReuglation === 'BD_506C' || offeringReuglation === 'BD_CF_506C'));
    const regulationType = offeringReuglation;
    if (!byDefaultRender) {
      setStepToBeRendered(2);
    } else if (investAccTypes && investAccTypes.values.length === 1 && isDocumentUpload === true) {
      if ((isRegulationCheck && userAccredetiationState && userAccredetiationState === 'ELGIBLE') || (isRegulationCheck && regulationType && regulationType === 'BD_CF_506C' && userAccredetiationState && userAccredetiationState === 'PENDING') || (!isRegulationCheck && selectedAccountStatus === 'FULL')) {
        setFieldValue('disableNextbtn', false);
        setStepToBeRendered(1);
      }
    }
  }
  radioChnaged = (e, res) => {
    this.setState({ investAccountType: { ...this.state.investAccountType, value: res.value } });
  }
  handlUpdateExpiration = (e) => {
    e.preventDefault();
    const { updateAccreditationExpiray } = this.props.accreditationStore;
    updateAccreditationExpiray();
    this.props.accreditationStore.resetUserAccreditatedStatus();
    this.props.history.push(this.props.refLink);
  }
  handlBackToOffering = (e) => {
    e.preventDefault();
    this.props.accreditationStore.resetUserAccreditatedStatus();
    this.props.investmentStore.setFieldValue('disableNextbtn', true);
    this.props.history.push(this.props.refLink);
  }
  handleInvestmentWihoutAccreditation = (e) => {
    e.preventDefault();
    const {
      setStepToBeRendered,
      setFieldValue,
    } = this.props.investmentStore;
    setFieldValue('disableNextbtn', false);
    setStepToBeRendered(1);
  }
  render() {
    const {
      activeAccounts,
      frozenAccounts,
      partialAccounts,
      inActiveAccounts,
    } = this.props.userDetailsStore.signupStatus;
    const {
      accTypeChanged,
      investAccTypes,
    } = this.props.investmentStore;
    const { getCurrentInvestNowHealthCheck, investNowError } = this.props.investmentLimitStore;
    const { campaign } = this.props.campaignStore;
    const offeringReuglation = campaign && campaign.regulation;
    const offeringTitle = get(campaign, 'keyTerms.shorthandBusinessName');
    const offeringRegulationDMinAmount = get(campaign, 'keyTerms.minOfferingAmount506C');
    const offeringRegulationDMaxAmount = get(campaign, 'keyTerms.maxOfferingAmount506C');
    const OfferingRegulationCFMinAmount = get(campaign, 'keyTerms.minOfferingAmountCF');
    const OfferingRegulationCFMaxAmount = get(campaign, 'keyTerms.maxOfferingAmountCF');
    const isDocumentUpload = get(getCurrentInvestNowHealthCheck, 'availibityForNPAInOffering');
    const offeringDetailsObj = {
      offeringTitle,
      offeringRegulationDMinAmount,
      offeringRegulationDMaxAmount,
      OfferingRegulationCFMinAmount,
      OfferingRegulationCFMaxAmount,
    };
    const isRegulationCheck = !!(offeringReuglation && (offeringReuglation === 'BD_506C' || offeringReuglation === 'BD_CF_506C'));
    const {
      userDetails,
      setPartialInvestmenSession,
      sendAdminEmailOfFrozenAccount,
    } = this.props.userDetailsStore;
    const userProfileFullStatus = userDetails && userDetails.status && userDetails.status === 'FULL' ? userDetails.status : 'PARTIAL';
    const offeringInvestnowURL = this.props.match.url;
    const {
      accreditationData,
      userAccredetiationState,
      ACCREDITATION_EXPIRY_FORM,
      expirationChange,
      showAccountList,
      selectedAccountStatus,
      userAccreditatedStatus,
      headerSubheaderObj,
      offeringAccreditatoinStatusMessage,
      // setHeaderAndSubHeader,
    } = this.props.accreditationStore;
    if (investNowError) {
      this.props.cancel();
    }
    const isAccountCreated = !(inActiveAccounts && inActiveAccounts.length >= 3);
    if (userProfileFullStatus !== 'FULL' || (userAccredetiationState && (userAccredetiationState === 'NOT_ELGIBLE' || userAccredetiationState === 'INACTIVE'))) {
      setPartialInvestmenSession(offeringInvestnowURL);
    } else {
      setPartialInvestmenSession();
    }
    if ((isRegulationCheck && (!accreditationData.ira)) || (!selectedAccountStatus) ||
      (!showAccountList && !getCurrentInvestNowHealthCheck && activeAccounts.length > 0) ||
      this.props.inProgress) {
      return <Spinner loaderMessage="Loading.." />;
    }
    userAccreditatedStatus(investAccTypes.value, isRegulationCheck, offeringReuglation);
    const { currentUser } = this.props.userStore;
    let redirectURL = '';
    if (!showAccountList || investAccTypes.values.length <= 1) {
      redirectURL = (!isRegulationCheck || (isRegulationCheck && selectedAccountStatus !== 'FULL') || !isAccountCreated) ? currentUser && currentUser.roles && currentUser.roles.includes('investor') ?
        `${this.props.userDetailsStore.pendingStep}` : (currentUser && currentUser.roles && currentUser.roles.includes('investor') && isRegulationCheck && selectedAccountStatus === 'PARTIAL') ? `${this.props.userDetailsStore.pendingStepForPartialAndProcessingAccount}` : '/app/summary' : `${this.props.accreditationStore.pendingStepForAccreditation(investAccTypes.value)}`;
    }
    if ((isRegulationCheck && selectedAccountStatus === 'FULL' && !userAccredetiationState) || this.props.inProgress) {
      return <Spinner loaderMessage="Loading.." />;
    }
    const isParitalSectionNeedtoShow = !(partialAccounts.length && frozenAccounts.length);
    offeringAccreditatoinStatusMessage(
      selectedAccountStatus, userAccredetiationState,
      isRegulationCheck, investAccTypes, showAccountList, isDocumentUpload,
      offeringReuglation, offeringDetailsObj,
    );
    if (frozenAccounts.length && selectedAccountStatus === 'FROZEN') {
      if (!cookie.load('ADMIN_FROZEN_EMAIL') && cookie.load('ADMIN_FROZEN_EMAIL') === undefined) {
        // send email to admin:
        sendAdminEmailOfFrozenAccount('INVESTMENT');
      }
    }
    if (headerSubheaderObj.header === '' || this.props.inProgress) {
      return <Spinner loaderMessage="Loading.." />;
    }
    return (
      <Aux>
        <Header as="h3" textAlign="center"> {headerSubheaderObj.header}</Header>
        <Form error className="account-type-tab">
          {investAccTypes.values.length && selectedAccountStatus ?
            <Aux>
              {showAccountList && investAccTypes.values.length >= 2 && !this.props.changeInvest ?
                <Aux>
                  <p className="center-align">{headerSubheaderObj.subHeader}</p>
                  <FormRadioGroup
                    name="investAccountType"
                    containerclassname="button-radio center-align"
                    fielddata={investAccTypes}
                    changed={accTypeChanged}
                  />
                </Aux>
                :
                <Aux>
                  {isDocumentUpload === false ?
                    <Aux>
                      <div className="center-align">
                        <Aux>
                          <p>Please contact
                            <a href="mailto:support@nextseed.com"> support@nextseed.com</a> with any question.
                          </p>
                          <div className="mt-30"><Button as={Link} to="/" onClick={e => this.handlBackToOffering(e)} primary className="relaxed" content="Back to Offering" /></div>
                        </Aux>
                      </div>
                    </Aux>
                    :
                    selectedAccountStatus === 'FULL' ?
                      <div className="center-align">
                        <p className="center-align">{headerSubheaderObj.subHeader}</p>
                        {userAccredetiationState === 'NOT_ELGIBLE' || userAccredetiationState === 'INACTIVE' ?
                          offeringReuglation && offeringReuglation === 'BD_CF_506C' ?
                            <Aux>
                              <Divider hidden section />
                              <Header as="h3">Investing under Regulation D has its benefits</Header>
                              <p className="cneter-align">For a limited time, if you <span className="highlight-text"><b><Link to={redirectURL}>verify your accredited investor status</Link></b></span>,{' '}
                                we’ll add a <span className="highlight-text"><b><Link to={redirectURL}>$100 bonus</Link></b></span> to your account. See rules for details.
                              </p>
                              <Divider hidden section />
                              <p>
                                <b>Would you like to verify your accredited investor status?</b>
                              </p>
                              <Button as={Link} to={redirectURL} primary className="relaxed" content="Yes, verify status" />
                              <Button basic className="relaxed" content="No, thanks" onClick={e => this.handleInvestmentWihoutAccreditation(e)} />
                            </Aux>
                            :
                            <Aux>
                              <Link to={redirectURL} className="text-link">
                                <Icon className="ns-arrow-right" color="green" />
                                Apply for accreditation
                              </Link>
                              <div className="mt-30">
                                <Button
                                  as={Link}
                                  to="/"
                                  onClick={e =>
                                    this.handlBackToOffering(e)}
                                  primary
                                  className="relaxed"
                                  content="Back to Offering"
                                />
                              </div>
                            </Aux>
                          :
                          userAccredetiationState === 'EXPIRED' ?
                            <Aux>
                              <Form error>
                                <FormCheckbox
                                  fielddata={ACCREDITATION_EXPIRY_FORM.fields.financialStatus}
                                  name="financialStatus"
                                  changed={expirationChange}
                                  defaults
                                  containerclassname="ui relaxed list"
                                />
                                <Button as={Link} to="/" onClick={e => this.handlUpdateExpiration(e)} primary className="relaxed" content="Update accrditation" disabled={!(ACCREDITATION_EXPIRY_FORM.meta.isValid)} />
                                <Button as={Link} to="/" onClick={e => this.handlBackToOffering(e)} primary className="relaxed" content="Back to Offering" />
                              </Form>
                            </Aux>
                            :
                            <div className="mt-30"><Button as={Link} to="/" onClick={e => this.handlBackToOffering(e)} primary className="relaxed" content="Back to Offering" /></div>
                        }
                      </div>
                      :
                      <div className="center-align">
                        {selectedAccountStatus && selectedAccountStatus === 'FROZEN' ?
                          <Aux>
                            <p>Please contact <a href="mailto:support@nextseed.com">support@nextseed.com</a> to unlock your account.</p>
                            <div className="mt-30"><Button as={Link} to="/" onClick={e => this.handlBackToOffering(e)} primary className="relaxed" content="Back to Offering" /></div>
                          </Aux>
                          :
                          null}
                        {(selectedAccountStatus && selectedAccountStatus === 'PARTIAL') ?
                          <Aux>
                            <Link to={redirectURL} className="text-link">
                              <Icon className="ns-arrow-right" color="green" />
                              Please finish your account setup.
                            </Link>
                            <div className="mt-30"><Button as={Link} to="/" onClick={e => this.handlBackToOffering(e)} primary className="relaxed" content="Back to Offering" /></div>
                          </Aux>
                          :
                          null}
                        {(selectedAccountStatus && selectedAccountStatus === 'PROCESSING') ?
                          <Aux>
                            <p>
                              We are currently processing your new {investAccTypes.value} account.
                              You will recive notification when your account is ready.
                            Please contact <a href="mailto:support@nextseed.com">support@nextseed.com</a> if you have any question.
                            </p>
                            <div className="mt-30"><Button as={Link} to="/" onClick={e => this.handlBackToOffering(e)} primary className="relaxed" content="Back to Offering" /></div>
                          </Aux>
                          :
                          null}
                      </div>
                  }
                </Aux>
              }
            </Aux>
            :
            <div className="center-align">
              {selectedAccountStatus && selectedAccountStatus === 'FROZEN' ?
                <Aux>
                  <p>Please contact <a href="mailto:support@nextseed.com">support@nextseed.com</a> to unlock your account.</p>
                  <div className="mt-30"><Button as={Link} to="/" onClick={e => this.handlBackToOffering(e)} primary className="relaxed" content="Back to Offering" /></div>
                </Aux>
                :
                null}
              {(selectedAccountStatus && selectedAccountStatus === 'PARTIAL' && isParitalSectionNeedtoShow) || (userProfileFullStatus !== 'PARTIAL' && isParitalSectionNeedtoShow)
                ?
                  <Aux>
                    <Link to={redirectURL} className="text-link">
                      <Icon className="ns-arrow-right" color="green" />
                      Please finish your account setup.
                    </Link>
                    <div className="mt-30"><Button as={Link} to="/" onClick={e => this.handlBackToOffering(e)} primary className="relaxed" content="Back to Offering" /></div>
                  </Aux>
                :
                null}
              {(selectedAccountStatus && selectedAccountStatus === 'PROCESSING' && isParitalSectionNeedtoShow) ?
                <Aux>
                  <p>
                    We are currently processing your new {investAccTypes.value} account.
                    You will recive notification when your account is ready.
                    Please contact <a href="mailto:support@nextseed.com">support@nextseed.com</a> if you have any question.
                  </p>
                  <div className="mt-30"><Button as={Link} to="/" onClick={e => this.handlBackToOffering(e)} primary className="relaxed" content="Back to Offering" /></div>
                </Aux>
                :
                null}
            </div>
          }
        </Form>
      </Aux>
    );
  }
}
export default AccountType;
