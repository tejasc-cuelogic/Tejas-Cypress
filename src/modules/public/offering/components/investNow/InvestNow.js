import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import money from 'money-math';
import { MultiStep } from '../../../../../helper';
import TransferRequest from './TransferRequest';
import AccountType from './AccountType';
import FinancialInfo from './FinancialInfo';
import Helper from '../../../../../helper/utility';

@withRouter
@inject('uiStore', 'portfolioStore', 'campaignStore', 'referralsStore', 'investmentStore', 'authStore', 'userStore', 'investmentLimitStore', 'userDetailsStore', 'accreditationStore')
@observer
export default class InvestNow extends React.Component {
  state = { submitLoading: false, isInvestmentUpdate: false };

  componentWillMount() {
    this.props.investmentStore.setStepToBeRendered(0);
    this.setState({ isInvestmentUpdate: false });
    const { isUserLoggedIn } = this.props.authStore;
    const { currentUser } = this.props.userStore;
    if (!isUserLoggedIn) {
      this.props.uiStore.setAuthRef((this.props.refLink));
      this.props.uiStore.setRedirectURL(this.props.history.location);
      this.props.history.push('/auth/login');
    } else if (!(isUserLoggedIn && currentUser.roles.includes('investor'))) {
      this.props.history.push(`${this.props.refLink}/confirm-invest-login`);
    }
    if (this.props.changeInvest) {
      const { offeringId } = this.props.match.params;
      this.props.portfolioStore.setFieldValue('currentOfferingId', offeringId);
      this.props.campaignStore.getCampaignDetails(offeringId);
    }
  }
  componentDidMount() {
    window.addEventListener('message', this.handleIframeTask);
  }
  handleIframeTask = (e) => {
    console.log(e.data);
  };
  handleMultiStepModalclose = () => {
    this.props.investmentStore.setStepToBeRendered(0);
    this.props.history.push(this.props.refLink);
    this.props.investmentStore.resetData();
    this.props.investmentStore.setByDefaultRender(true);
    this.props.accreditationStore.resetUserAccreditatedStatus();
  }
  handleStepChange = (step) => {
    this.props.investmentStore.setFieldValue('disableNextbtn', true);
    if (step === 1) {
      this.props.investmentStore.setFieldValue('disableNextbtn', false);
    } else if (step === 0) {
      this.handleStepChnageOnPreviousForAlert();
    }
    this.props.investmentStore.setStepToBeRendered(step);
  }
  handleStepChangeForPartialAccounts = (step) => {
    this.props.investmentStore.setFieldValue('disableNextbtn', false);
    this.props.investmentStore.setFieldValue('disablePrevButton', false);
    this.props.investmentStore.setStepToBeRendered(step);
  }
  handleStepChnageOnPreviousForAlert = () => {
    this.props.investmentStore.setFieldValue('disableNextbtn', true);
    this.props.accreditationStore.changeShowAccountListFlag(true);
  }
  handleCancel = () => {
    const currentStep = this.props.investmentStore.stepToBeRendered;
    const stepRendered = currentStep && currentStep > 0 ? currentStep - 1 : 0;
    this.props.investmentStore.setStepToBeRendered(stepRendered);
    this.props.investmentStore.setFieldValue('disableNextbtn', true);
    this.props.history.push('invest-now');
  }

  handleConfirm = () => {
    this.props.investmentStore.setByDefaultRender(false);
    this.setState({ submitLoading: true });
    this.props.investmentStore.validateInvestmentAmountInOffering().then((response) => {
      if (response.isValid) {
        this.props.investmentStore.setByDefaultRender(true);
        Helper.toast('Transfer request is in process!', 'success');
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
    if (step.name === 'Financial Info') {
      this.props.investmentStore.validateInvestmentAmountInOffering().then((response) => {
        this.setState({ submitLoading: response.isValid });
        if (response.isValid) {
          Helper.toast('Agreement has been generated successfully!', 'success');
          this.props.investmentStore.setStepToBeRendered(0);
          this.setState({ submitLoading: false });
          this.props.history.push('agreement');
        } else if (response.flag === 1) {
          const { getTransferRequestAmount, investAccTypes } = this.props.investmentStore;
          if (getTransferRequestAmount > 0 && investAccTypes.value !== 'ira') {
            this.handleStepChange(step.stepToBeRendered);
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
      const isRegulationCheck = !!(offeringReuglation && (offeringReuglation === 'BD_506C' || offeringReuglation === 'BD_CF_506C'));
      const {
        changeShowAccountListFlag,
        userAccredetiationState,
      } = this.props.accreditationStore;
      changeShowAccountListFlag(false);
      if (userAccredetiationState === 'ELGIBLE' || (regulationType && regulationType === 'BD_CF_506C' && userAccredetiationState === 'PENDING') || userAccredetiationState === undefined || !isRegulationCheck) {
        this.props.investmentLimitStore
          .getInvestNowHealthCheck(this.props.investmentStore.getSelectedAccountTypeId, offeringId)
          .then(() => {
            this.handleStepChange(step.stepToBeRendered);
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

  render() {
    const { changeInvest, uiStore } = this.props;
    const { showAccountList } = this.props.accreditationStore;
    const { investAccTypes, stepToBeRendered } = this.props.investmentStore;
    const multipleAccountExsists = !!(investAccTypes && investAccTypes.values.length >= 2);
    const { campaign } = this.props.campaignStore;
    const { getCurrentInvestNowHealthCheck } = this.props.investmentLimitStore;
    if (stepToBeRendered === 1 && !this.state.isInvestmentUpdate &&
      getCurrentInvestNowHealthCheck && getCurrentInvestNowHealthCheck.previousAmountInvested &&
      !money.isZero(getCurrentInvestNowHealthCheck.previousAmountInvested)) {
      this.setState({ isInvestmentUpdate: true });
    }
    const {
      inProgress,
      isEnterPressed,
      resetIsEnterPressed,
      setIsEnterPressed,
    } = uiStore;
    const steps =
      [
        {
          name: 'Account Type',
          component: <AccountType
            refLink={this.props.refLink}
            changeInvest={changeInvest}
          />,
          isValid: '',
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
          />,
          isValid: '',
          stepToBeRendered: 2,
          isDirty: true,
        },
        {
          name: 'TransferRequest',
          component: <TransferRequest
            changeInvest={changeInvest || this.state.isInvestmentUpdate}
            confirm={this.handleConfirm}
            cancel={this.handleCancel}
          />,
          isValid: '',
        },
      ];
    const isMultiStepButtonsVisible = !!showAccountList && multipleAccountExsists;
    const closeOnDimmerClickAction = false;
    return (
      <div className="step-progress" >
        {
          <MultiStep
            loaderMsg={this.state.submitLoading ? `Please wait...<br /><br />
            We are generating your agreement. This can take up to a minute.` : ''}
            inProgress={this.state.submitLoading || inProgress}
            createAccount={this.multiClickHandler}
            setIsEnterPressed={setIsEnterPressed}
            disableNxtbtn={this.props.investmentStore.disableNextbtn}
            isEnterPressed={isEnterPressed}
            resetEnterPressed={resetIsEnterPressed}
            hideHeader
            setStepTobeRendered={this.handleStepChange}
            setStepTobeRenderedForAlert={this.handleStepChnageOnPreviousForAlert}
            stepToBeRendered={this.props.investmentStore.stepToBeRendered}
            steps={steps}
            formTitle="Entity Account Creation"
            handleMultiStepModalclose={this.handleMultiStepModalclose}
            isStepButtonsVisible={isMultiStepButtonsVisible}
            closeOnDimmerClick={closeOnDimmerClickAction}
          />
        }
      </div>
    );
  }
}
