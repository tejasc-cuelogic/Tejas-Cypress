import React, { Component } from 'react';
import Aux from 'react-aux';
import { includes, uniq, get } from 'lodash';
import { Header, Form, Button, Icon, Card } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { Link, withRouter } from 'react-router-dom';
import cookie from 'react-cookies';
import { FormRadioGroup, FormCheckbox } from '../../../../../theme/form';
import { Spinner } from '../../../../../theme/shared';

@inject('investmentStore', 'userDetailsStore', 'investmentLimitStore', 'userStore', 'campaignStore', 'accreditationStore', 'portfolioStore')
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
    const userInfoDetails = this.props.userDetailsStore.userDetails;
    const userStatus = userInfoDetails && userInfoDetails.status;
    const { getCurrentInvestNowHealthCheck } = this.props.investmentLimitStore;
    const { campaign } = this.props.campaignStore;
    const offeringId = campaign && campaign.id ? campaign.id : this.props.match.params.offeringId;
    const offeringReuglation = campaign && campaign.regulation;
    const isRegulationCheck = !!(offeringReuglation && (offeringReuglation === 'BD_506C' || offeringReuglation === 'BD_CF_506C'));
    const regulationType = offeringReuglation;
    let isDocumentUpload = get(getCurrentInvestNowHealthCheck, 'availabilityForNPAInOffering');
    const {
      userAccredetiationState,
      resetAccreditationExpirayForm,
      selectedAccountStatus,
      initiateAccreditation,
      userSelectedAccountStatus,
      setUserSelectedAccountStatus,
      userDetails,
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
            isDocumentUpload = get(resp, 'investNowHealthCheck.availabilityForNPAInOffering');
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
          if (activeAccounts.length && this.props.investmentStore.getSelectedAccountTypeId && userStatus === 'FULL') {
            setStepToBeRendered(1);
          }
        });
      } else if (this.props.changeInvest) {
        const { getInvestorAccountById } = this.props.portfolioStore;
        const offeringRegulation = get(getInvestorAccountById, 'offering.keyTerms.regulation');
        const accreditationStatus = get(userDetails, 'accreditation.status');
        const isParallelOfferingModelToShow = !!(offeringRegulation === 'BD_CF_506C' && !includes(['REQUESTED', 'CONFIRMED'], accreditationStatus));
        const accountType = this.props.changeInvest ? includes(this.props.location.pathname, 'individual') ? 'individual' : includes(this.props.location.pathname, 'ira') ? 'ira' : 'entity' : activeAccounts[0];
        this.props.investmentStore.accTypeChanged(null, { value: accountType }).then(() => {
          if (activeAccounts.length && this.props.investmentStore.getSelectedAccountTypeId &&
            !isParallelOfferingModelToShow && userStatus === 'FULL') {
            setStepToBeRendered(1);
          }
        });
      }
    }
    setPartialInvestmenSession();
    if (frozenAccounts.length && selectedAccountStatus === 'FROZEN') {
      if (!cookie.load('ADMIN_FROZEN_EMAIL') && cookie.load('ADMIN_FROZEN_EMAIL') === undefined) {
        // send email to admin
        sendAdminEmailOfFrozenAccount('INVESTMENT', offeringId);
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
      userDetails,
      // showAccountList,
    } = this.props.accreditationStore;
    const { getCurrentInvestNowHealthCheck } = this.props.investmentLimitStore;
    // if (!showAccountList && !getCurrentInvestNowHealthCheck) {
    //   this.props.cancel();
    //   this.props.history.push(this.props.refLink);
    // }
    const { activeAccounts, inprogressAccounts } = this.props.userDetailsStore.signupStatus;
    const userInfoDetails = this.props.userDetailsStore.userDetails;
    const userStatus = userInfoDetails && userInfoDetails.status;
    const accountToConsider = (activeAccounts.length === 0 && inprogressAccounts.length === 0) ?
      [] : (activeAccounts.length === 1 && inprogressAccounts.length === 0) ?
        activeAccounts : uniq([...activeAccounts, ...inprogressAccounts]);
    prepareAccountTypes(accountToConsider);
    const { getInvestorAccountById } = this.props.portfolioStore;
    const { campaign } = this.props.campaignStore;
    const offeringDetailObj = this.props.changeInvest ? get(getInvestorAccountById, 'offering') : campaign;
    const offeringReuglation = get(offeringDetailObj, 'keyTerms.regulation');
    const isDocumentUpload = get(getCurrentInvestNowHealthCheck, 'availabilityForNPAInOffering');
    const isRegulationCheck = !!(offeringReuglation && (offeringReuglation === 'BD_506C' || offeringReuglation === 'BD_CF_506C'));
    const regulationType = offeringReuglation;
    userAccreditatedStatus(investAccTypes.value, isRegulationCheck, offeringReuglation);
    if (!byDefaultRender) {
      setStepToBeRendered(2);
    } else if (accountToConsider && accountToConsider.length === 1 && isDocumentUpload === true) {
      if ((isRegulationCheck && userAccredetiationState && userAccredetiationState === 'ELGIBLE') || (isRegulationCheck && regulationType && regulationType === 'BD_CF_506C' && userAccredetiationState && userAccredetiationState === 'PENDING') || (!isRegulationCheck && selectedAccountStatus === 'FULL')) {
        if (this.props.changeInvest) {
          // const { getInvestorAccountById } = this.props.portfolioStore;
          // const offeringRegulation = get(getInvestorAccountById, 'offering.keyTerms.regulation');
          const accreditationStatus = get(userDetails, 'accreditation.status');
          const isParallelOfferingModelToShow = !!(offeringReuglation === 'BD_CF_506C' && !includes(['REQUESTED', 'CONFIRMED'], accreditationStatus));
          if (!isParallelOfferingModelToShow) {
            setFieldValue('disableNextbtn', false);
            setStepToBeRendered(1);
          }
        } else if (userStatus === 'FULL') {
          setFieldValue('disableNextbtn', false);
          setStepToBeRendered(1);
        }
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
      userDetails,
    } = this.props.accreditationStore;
    const { getCurrentInvestNowHealthCheck } = this.props.investmentLimitStore;
    const userInfoDetails = this.props.userDetailsStore.userDetails;
    const userStatus = userInfoDetails && userInfoDetails.status;
    const { campaign } = this.props.campaignStore;
    const offeringReuglation = campaign && campaign.regulation;
    const isDocumentUpload = get(getCurrentInvestNowHealthCheck, 'availabilityForNPAInOffering');
    const isRegulationCheck = !!(offeringReuglation && (offeringReuglation === 'BD_506C' || offeringReuglation === 'BD_CF_506C'));
    const regulationType = offeringReuglation;
    if (!byDefaultRender) {
      setStepToBeRendered(2);
    } else if (investAccTypes && investAccTypes.values.length === 1 && isDocumentUpload === true) {
      if ((isRegulationCheck && userAccredetiationState && userAccredetiationState === 'ELGIBLE') || (isRegulationCheck && regulationType && regulationType === 'BD_CF_506C' && userAccredetiationState && userAccredetiationState === 'PENDING') || (!isRegulationCheck && selectedAccountStatus === 'FULL')) {
        if (this.props.changeInvest) {
          const { getInvestorAccountById } = this.props.portfolioStore;
          const offeringRegulation = get(getInvestorAccountById, 'offering.keyTerms.regulation');
          const accreditationStatus = get(userDetails, 'accreditation.status');
          const isParallelOfferingModelToShow = !!(offeringRegulation === 'BD_CF_506C' && !includes(['REQUESTED', 'CONFIRMED'], accreditationStatus));
          if (!isParallelOfferingModelToShow) {
            setFieldValue('disableNextbtn', false);
            setStepToBeRendered(1);
          }
        } else if (userStatus === 'FULL') {
          setFieldValue('disableNextbtn', false);
          setStepToBeRendered(1);
        }
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
    const { getInvestorAccountById } = this.props.portfolioStore;
    const { campaign } = this.props.campaignStore;
    const offeringId = get(campaign, 'id');
    const offeringDetailObj = this.props.changeInvest ? get(getInvestorAccountById, 'offering') : campaign;
    const offeringReuglation = get(offeringDetailObj, 'keyTerms.regulation');
    const offeringTitle = get(offeringDetailObj, 'keyTerms.shorthandBusinessName');
    const offeringRegulationDMinAmount = get(offeringDetailObj, 'keyTerms.minOfferingAmount506C');
    const offeringRegulationDMaxAmount = get(offeringDetailObj, 'keyTerms.maxOfferingAmount506C');
    const OfferingRegulationCFMinAmount = get(offeringDetailObj, 'keyTerms.minOfferingAmountCF');
    const OfferingRegulationCFMaxAmount = get(offeringDetailObj, 'keyTerms.maxOfferingAmountCF');
    const isDocumentUpload = get(getCurrentInvestNowHealthCheck, 'availabilityForNPAInOffering');
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
    const userProfileFullStatus = userDetails && userDetails.status && userDetails.status === 'FULL' ? userDetails.status : userDetails.status === 'BASIC' && investAccTypes.values.length > 0 ? 'BASIC' : 'PARTIAL';
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
      (showAccountList && !getCurrentInvestNowHealthCheck && activeAccounts.length === 1) ||
      this.props.inProgress) {
      return <Spinner loaderMessage="Loading.." />;
    }
    userAccreditatedStatus(investAccTypes.value, isRegulationCheck, offeringReuglation);
    const { currentUser } = this.props.userStore;
    let redirectURL = '';
    if (!showAccountList || investAccTypes.values.length <= 1) {
      redirectURL = (!isRegulationCheck || (isRegulationCheck && selectedAccountStatus !== 'FULL') || !isAccountCreated) ? currentUser && currentUser.roles && currentUser.roles.includes('investor') && userProfileFullStatus !== 'FULL' ?
        `${this.props.userDetailsStore.pendingStep}` : (currentUser && currentUser.roles && currentUser.roles.includes('investor') && selectedAccountStatus === 'PARTIAL') ? `${this.props.userDetailsStore.pendingStepForPartialAndProcessingAccount}` : '/app/summary' : `${this.props.accreditationStore.pendingStepForAccreditation(investAccTypes.value)}`;
    }
    if ((isRegulationCheck && selectedAccountStatus === 'FULL' && !userAccredetiationState) || this.props.inProgress) {
      return <Spinner loaderMessage="Loading.." />;
    }
    const isParitalSectionNeedtoShow = !(partialAccounts.length && frozenAccounts.length);
    const currentStatus = userProfileFullStatus && userProfileFullStatus !== 'FULL' && userProfileFullStatus !== 'BASIC' ? 'USER-PARTIAL' : selectedAccountStatus;
    offeringAccreditatoinStatusMessage(
      currentStatus, userAccredetiationState,
      isRegulationCheck, investAccTypes, showAccountList, isDocumentUpload,
      offeringReuglation, offeringDetailsObj,
    );
    if (frozenAccounts.length && selectedAccountStatus === 'FROZEN') {
      if (!cookie.load('ADMIN_FROZEN_EMAIL') && cookie.load('ADMIN_FROZEN_EMAIL') === undefined) {
        // send email to admin:
        sendAdminEmailOfFrozenAccount('INVESTMENT', offeringId);
      }
    }
    if (headerSubheaderObj.header === '' || this.props.inProgress) {
      return <Spinner loaderMessage="Loading.." />;
    }
    return (
      <Aux>
        <Header as="h3" textAlign="center"> {headerSubheaderObj.header}</Header>
        <Form error className="account-type-tab mb-0">
          {investAccTypes.values.length && selectedAccountStatus && (userProfileFullStatus === 'FULL' || userProfileFullStatus === 'BASIC') ?
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
                          <p>
                            There is a technical issue with this offering.
                            The NextSeed team has been notified and will
                            resolve it as soon as possible.
                            Please try back later.
                          </p>
                          <div className="mt-30"><Button as={Link} to="/" onClick={e => this.handlBackToOffering(e)} primary className="relaxed" content="Back to Offering" /></div>
                        </Aux>
                      </div>
                    </Aux>
                    :
                    selectedAccountStatus === 'FULL' ?
                      <div className="center-align">
                        <p className="center-align">{headerSubheaderObj.subHeader}</p>
                        {userAccredetiationState === 'NOT_ELGIBLE' || userAccredetiationState === 'INACTIVE' || userAccredetiationState === 'PENDING' ?
                          offeringReuglation && offeringReuglation === 'BD_CF_506C' ?
                            <Card.Group itemsPerRow={2}>
                              <Card>
                                <Card.Content>
                                  <Header as="h5" color="green">Yes, let’s get you verified.</Header>
                                  <p className="accredetaion-intro mb-20">
                                    By verifying your status, you can invest in this offering under
                                    Reg D and not have this count towards your annual Reg CF limits.
                                  </p>
                                  <Button as={Link} to={redirectURL} basic className="relaxed" content="Verify Status" />
                                  <p className="note mt-20">
                                    For a limited time, accredited investors can earn a $100 bonus
                                    by verifying your status on NextSeed.<br />
                                    <a href="#">See rules for details.</a>
                                  </p>
                                </Card.Content>
                              </Card>
                              <Card>
                                <Card.Content>
                                  <Header as="h5" color="green">No, no problem.</Header>
                                  <p className="accredetaion-intro mb-20">
                                    Proceed to invest in this offering
                                    under Regulation Crowdfunding.
                                  </p>
                                  <Button basic className="relaxed" content="Continue" onClick={e => this.handleInvestmentWihoutAccreditation(e)} />
                                </Card.Content>
                              </Card>
                            </Card.Group>
                            :
                            <Aux>
                              {/* <Link to={redirectURL} className="text-link">
                                <Icon className="ns-arrow-right" color="green" />
                                Apply for accreditation
                              </Link> */}
                              <div className="mt-30">
                                <Button
                                  as={Link}
                                  to={redirectURL}
                                  primary
                                  className="relaxed"
                                  content="Confirm Status"
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
                            <p>We&apos;ll notify you through email when your account is set up.</p>
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
                    Please answer a few basic questions to complete your Investor Profile.
                    {/* <Link to={redirectURL} className="text-link">
                        <Icon className="ns-arrow-right" color="green" />
                        Please finish your account setup.
                      </Link> */}
                    {/* <div className="mt-30">
                    <Button
                    as={Link}
                      to="/"
                      onClick={e => this.handlBackToOffering(e)}
                        primary
                        className="relaxed"
                          content="Confirm Status"
                          />
                    </div> */}
                    <div className="mt-30"><Button as={Link} to={redirectURL} primary className="relaxed" content="Continue" /></div>
                  </Aux>
                :
                null}
              {(selectedAccountStatus && selectedAccountStatus === 'PROCESSING' && isParitalSectionNeedtoShow) ?
                <Aux>
                  <p>We&apos;ll notify you through email when your account is set up.</p>
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
