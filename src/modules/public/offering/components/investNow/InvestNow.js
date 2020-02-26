import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { get } from 'lodash';
import money from 'money-math';
import { MultiStep } from '../../../../../helper';
import TransferRequest from './TransferRequest';
import AccountType from './AccountType';
import FinancialInfo from './FinancialInfo';
// import Helper from '../../../../../helper/utility';

const isMobile = document.documentElement.clientWidth < 768;

@withRouter
@inject('uiStore', 'portfolioStore', 'campaignStore', 'accountStore', 'referralsStore', 'investmentStore', 'authStore', 'userStore', 'investmentLimitStore', 'userDetailsStore', 'accreditationStore')
@observer
export default class InvestNow extends React.Component {
  state = { submitLoading: false, isInvestmentUpdate: false };

  constructor(props) {
    super(props);
    if (!this.props.campaignStore.isInvestBtnClicked) {
      this.props.history.push(this.props.refLink);
    }
    this.props.campaignStore.setFieldValue('inInvestmentFlow', true);
    this.props.investmentStore.setStepToBeRendered(0);
    this.props.investmentStore.resetData();
    this.props.uiStore.setProgress(false);
    this.setState({ isInvestmentUpdate: false });
    const { isUserLoggedIn } = this.props.authStore;
    const { currentUser } = this.props.userStore;
    if (!isUserLoggedIn) {
      this.props.uiStore.setAuthRef((this.props.refLink));
      this.props.history.push('/login');
    } else if (!(isUserLoggedIn && currentUser.roles.includes('investor'))) {
      this.props.history.push(`${this.props.refLink}/confirm-invest-login`);
    }
    if (this.props.changeInvest) {
      const { offeringId } = this.props.match.params;
      const { offeringUUID } = this.props.campaignStore;
      const matchURL = this.props.match.url;
      if (matchURL.includes('portfolio')) {
        this.setState({ isInvestmentUpdate: true });
        this.props.portfolioStore.setFieldValue('currentOfferingId', offeringUUID);
      } else {
        this.props.portfolioStore.setFieldValue('currentOfferingId', offeringId);
      }
      this.props.campaignStore.getCampaignDetails(offeringId, true, true);
    }
  }

  componentDidMount() {
    window.addEventListener('message', this.handleIframeTask);
  }

  componentWillUnmount() {
    const { changeInvest } = this.props;
    const isUpdateScreen = changeInvest;
    const reflectedURL = this.props.history.location.pathname;
    const matchURL = this.props.match.url;
    if (!isUpdateScreen || (isUpdateScreen && !reflectedURL.includes('invest-now'))) {
      if (!matchURL.includes('portfolio')) {
        this.props.campaignStore.setFieldValue('isInvestBtnClicked', false);
      }
      this.props.accreditationStore.resetAccreditationObject();
      this.props.investmentStore.setFieldValue('isUpdateLimitReflect', false);
      if (!reflectedURL.includes('agreement')) {
        this.props.accreditationStore.setFieldVal('userAccredetiationState', null);
        this.props.investmentLimitStore.setFieldValue('investNowHealthCheckDetails', {});
        this.props.campaignStore.setFieldValue('inInvestmentFlow', false);
      }
      this.props.campaignStore.setFieldValue('offeringUUID', null);
    }
  }

  handleIframeTask = (e) => {
    console.log(e.data);
  };

  handleMultiStepModalclose = () => {
    this.props.investmentStore.setStepToBeRendered(0);
    this.props.uiStore.clearErrors();
    this.props.uiStore.setProgress(false);
    this.props.investmentStore.resetData();
    this.props.investmentStore.setByDefaultRender(true);
    this.props.accreditationStore.resetUserAccreditatedStatus();
    this.props.history.push(this.props.refLink);
  }

  handleStepChange = (step) => {
    this.props.investmentStore.setFieldValue('disableNextbtn', true);
    if (step === 1) {
      this.props.investmentStore.setByDefaultRender(true);
      this.props.investmentStore.setFieldValue('disableNextbtn', false);
    } else if (step === 0) {
      this.props.investmentStore.resetData();
      this.props.investmentStore.setByDefaultRender(true);
      this.props.accreditationStore.resetUserAccreditatedStatus();
      this.props.investmentLimitStore.setFieldValue('investNowHealthCheckDetails', {});
      this.setState({ isInvestmentUpdate: false });
      this.props.investmentStore.accTypeChanged(null, { value: this.props.userDetailsStore.currentActiveAccount });
      this.handleStepChnageOnPreviousForAlert();
    }
    this.props.investmentStore.setFieldValue('isGetTransferRequestCall', false);
    this.props.investmentStore.setStepToBeRendered(step);
  }

  handleStepChangeForPartialAccounts = (step) => {
    this.props.investmentStore.setFieldValue('disableNextbtn', false);
    this.props.investmentStore.setFieldValue('disablePrevButton', false);
    this.props.investmentStore.setStepToBeRendered(step);
  }

  handleStepChnageOnPreviousForAlert = () => {
    this.props.investmentStore.setFieldValue('disableNextbtn', true);
    this.props.accreditationStore.changeShowAccountListFlag(!this.props.changeInvest);
  }

  handleCancel = () => {
    const currentStep = this.props.investmentStore.stepToBeRendered;
    const stepRendered = currentStep && currentStep > 0 ? currentStep - 1 : 0;
    this.props.investmentStore.setStepToBeRendered(stepRendered);
    this.props.investmentStore.setFieldValue('disableNextbtn', true);
    this.props.investmentStore.setFieldValue('isGetTransferRequestCall', false);
    this.props.history.push('invest-now');
  }

  handleConfirm = () => {
    this.props.investmentStore.setByDefaultRender(false);
    this.setState({ submitLoading: true });
    this.props.investmentStore.validateInvestmentAmountInOffering().then((response) => {
      if (response.isValid) {
        this.props.investmentStore.setByDefaultRender(true);
        // Helper.toast('Transfer request is in process!', 'success');
        this.props.investmentStore.setStepToBeRendered(0);
        this.setState({ submitLoading: false });
        this.props.history.push('agreement');
      } else {
        this.setState({ submitLoading: false });
      }
    }).catch(() => {
      this.setState({ submitLoading: false });
    });
  }

  multiClickHandler = (step) => {
    const { inprogressAccounts } = this.props.userDetailsStore.signupStatus;
    const { userDetails } = this.props.userDetailsStore;
    const userStatus = userDetails && userDetails.status;
    if (step.name === 'Financial Info') {
      this.setState({ submitLoading: true });
      this.props.investmentStore.validateInvestmentAmountInOffering().then((response) => {
        this.setState({ submitLoading: response.isValid });
        if (response.isValid) {
          // Helper.toast('Agreement has been generated successfully!', 'success');
          this.props.investmentStore.setStepToBeRendered(0);
          this.setState({ submitLoading: false });
          this.props.history.push('agreement');
        } else if (response.flag === 1) {
          const { getTransferRequestAmount } = this.props.investmentStore;
          if (getTransferRequestAmount > 0) {
            this.handleStepChangeForPartialAccounts(step.stepToBeRendered);
          }
        }
      }).catch(() => {
        this.setState({ submitLoading: false });
      })
        .finally(() => {
          this.setState({ submitLoading: false });
        });
    } else if (step.name === 'Account Type' && this.props.investmentStore.getSelectedAccountTypeId) {
      const { campaign } = this.props.campaignStore;
      const offeringId = campaign && campaign.id;
      const offeringReuglation = campaign && campaign.regulation;
      const regulationType = offeringReuglation;
      const isRegulationCheck = !!(offeringReuglation && (offeringReuglation === 'BD_506C'
        || offeringReuglation === 'BD_506B' || offeringReuglation === 'BD_CF_506C'));
      const {
        changeShowAccountListFlag,
        userAccredetiationState,
        selectedAccountStatus,
      } = this.props.accreditationStore;
      changeShowAccountListFlag(false);
      if (!this.props.accountStore.isAccFrozen(selectedAccountStatus) && userStatus === 'FULL' && (userAccredetiationState === 'ELGIBLE' || (regulationType && regulationType === 'BD_CF_506C' && (['PENDING', 'INACTIVE', 'EXPIRED'].includes(userAccredetiationState))) || userAccredetiationState === undefined || !isRegulationCheck)) {
        this.props.investmentLimitStore
          .getInvestNowHealthCheck(this.props.investmentStore.getSelectedAccountTypeId, offeringId)
          .then((resp) => {
            const isDocumentUpload = get(resp, 'investNowHealthCheck.availabilityForNPAInOffering');
            if (!isDocumentUpload) {
              this.handleStepChangeForPartialAccounts(0);
            } else if (['INACTIVE', 'EXPIRED'].includes(userAccredetiationState)) {
              this.handleStepChangeForPartialAccounts(0);
            } else {
              this.handleStepChange(step.stepToBeRendered);
            }
          });
      } else {
        this.handleStepChangeForPartialAccounts(0);
      }
    } else if (step.name === 'Account Type' && inprogressAccounts.length) {
      const { changeShowAccountListFlag } = this.props.accreditationStore;
      changeShowAccountListFlag(false);
      this.handleStepChangeForPartialAccounts(0);
    }
  }

  handleSubmitStep = () => { // only for mobile screens
    const { stepToBeRendered } = this.props.investmentStore;
    const { multiSteps } = this.props.uiStore;
    this.multiClickHandler(multiSteps[stepToBeRendered]);
  }

  render() {
    const { changeInvest, uiStore } = this.props;
    const { showAccountList, disableElement } = this.props.accreditationStore;
    const { investAccTypes, stepToBeRendered } = this.props.investmentStore;
    const multipleAccountExsists = !!(investAccTypes && investAccTypes.values.length >= 2);
    const { campaign, campaignStatus } = this.props.campaignStore;
    const {
      getCurrentInvestNowHealthCheck, investNowHealthCheckDetails,
    } = this.props.investmentLimitStore;
    if (stepToBeRendered === 1 && !this.state.isInvestmentUpdate
      && getCurrentInvestNowHealthCheck && getCurrentInvestNowHealthCheck.previousAmountInvested
      && !money.isZero(getCurrentInvestNowHealthCheck.previousAmountInvested)) {
      this.setState({ isInvestmentUpdate: true });
    }
    const {
      inProgress, setFieldvalue,
      isEnterPressed,
      resetIsEnterPressed,
      setIsEnterPressed,
    } = uiStore;
    const steps = [
      {
        name: 'Account Type',
        component: <AccountType
          refLink={this.props.refLink}
          changeInvest={changeInvest}
          cancel={this.handleMultiStepModalclose}
          inProgress={inProgress}
          submitStep={this.handleSubmitStep}
          disableContinueButton={!this.props.investmentStore.disableNextbtn}
          isFromPublicPage={this.state.isInvestmentUpdate}
        />,
        isValid: '',
        disableNextButton: changeInvest,
        disablePrevButton: changeInvest || disableElement,
        stepToBeRendered: 1,
        isDirty: true,
      },
      {
        name: 'Financial Info',
        component: <FinancialInfo
          refLink={this.props.refLink}
          changeInvest={changeInvest || this.state.isInvestmentUpdate}
          offeringDetails={this.state.isInvestmentUpdate && campaign}
          isFromPublicPage={this.state.isInvestmentUpdate}
          submitStep={this.handleSubmitStep}
          disableContinueButton={!this.props.investmentStore.disableNextbtn}
        />,
        isValid: '',
        stepToBeRendered: 2,
        isDirty: true,
      },
      {
        name: 'TransferRequest',
        component: <TransferRequest
          changeInvest={changeInvest || this.state.isInvestmentUpdate}
          isPreferredEquity={campaignStatus.isPreferredEquity}
          confirm={this.handleConfirm}
          cancel={this.handleCancel}
          refLink={this.props.refLink}
        />,
        isValid: '',
        onlyDisableNextButton: true,
      },
    ];
    const isMultiStepButtonsVisible = !!showAccountList && multipleAccountExsists;
    const closeOnDimmerClickAction = false;
    this.props.investmentStore.setFieldValue('disablePrevButton', true);
    return (
      <div className="step-progress">
        {
          <MultiStep
            loaderMsg={this.state.submitLoading ? `Please wait...<br /><br />
            We are generating your agreement. This can take up to a minute.` : ''}
            inProgress={this.state.submitLoading
              || (inProgress && !investNowHealthCheckDetails.loading)}
            createAccount={this.multiClickHandler}
            setIsEnterPressed={setIsEnterPressed}
            disableNxtbtn={this.props.investmentStore.disableNextbtn}
            isEnterPressed={isEnterPressed}
            resetEnterPressed={resetIsEnterPressed}
            hideHeader={!isMobile}
            setStepTobeRendered={this.handleStepChange}
            setStepTobeRenderedForAlert={this.handleStepChnageOnPreviousForAlert}
            stepToBeRendered={this.props.investmentStore.stepToBeRendered}
            steps={steps}
            formTitle="Entity Account Creation"
            handleMultiStepModalclose={this.handleMultiStepModalclose}
            isStepButtonsVisible={isMultiStepButtonsVisible}
            closeOnDimmerClick={closeOnDimmerClickAction}
            setUiStorevalue={setFieldvalue}
          />
        }
      </div>
    );
  }
}
