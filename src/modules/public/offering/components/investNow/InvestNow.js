import React from 'react';
import { Loader, Dimmer } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { MultiStep } from '../../../../../helper';
import TransferRequest from './TransferRequest';
import AccountType from './AccountType';
import FinancialInfo from './FinancialInfo';
import Helper from '../../../../../helper/utility';

@inject('uiStore', 'portfolioStore', 'campaignStore', 'userDetailsStore', 'investmentStore', 'authStore', 'userStore', 'investmentLimitStore')
@observer
export default class InvestNow extends React.Component {
  state = { submitLoading: false };
  componentWillMount() {
    const { isUserLoggedIn } = this.props.authStore;
    const { currentUser } = this.props.userStore;
    if (!(isUserLoggedIn && currentUser.roles.includes('investor'))) {
      this.props.uiStore.setRedirectURL(this.props.history.location);
      this.props.uiStore.setAuthRef(this.props.refLink);
      this.props.history.push('/auth/login');
    }
    if (this.props.changeInvest) {
      const { offeringId } = this.props.match.params;
      this.props.portfolioStore.setFieldValue('currentOfferingId', offeringId);
      this.props.campaignStore.getCampaignDetails(offeringId);
    }
  }

  handleMultiStepModalclose = () => {
    this.props.investmentStore.setStepToBeRendered(0);
    this.props.history.push('overview');
    this.props.investmentStore.resetData();
  }
  handleStepChange = (step) => {
    this.props.investmentStore.setFieldValue('disableNextbtn', true);
    if (step === 1) {
      this.props.investmentStore.setFieldValue('disableNextbtn', false);
    }
    this.props.investmentStore.setStepToBeRendered(step);
  }
  handleCancel = () => {
    this.props.investmentStore.setStepToBeRendered(0);
    this.props.investmentStore.setFieldValue('disableNextbtn', true);
    this.props.history.push('invest-now');
  }

  handleConfirm = () => {
    this.setState({ submitLoading: !this.state.submitLoading });
    this.props.investmentStore.validateInvestmentAmount().then((isValid) => {
      if (isValid) {
        this.props.investmentStore.transferFundsForInvestment().then((status) => {
          if (status) {
            this.props.investmentStore.generateAgreement().then(() => {
              Helper.toast('Transfer request is in process!', 'success');
              this.props.investmentStore.setStepToBeRendered(0);
              this.setState({ submitLoading: !this.state.submitLoading });
              this.props.history.push('agreement');
            });
          }
        });
      }
    });
  }
  multiClickHandler = (step) => {
    if (step.name === 'Financial Info') {
      this.props.investmentStore.getInvestorAvailableCash().then(() => {
        const { getTransferRequestAmount, investAccTypes } = this.props.investmentStore;
        if (getTransferRequestAmount > 0 && investAccTypes.value !== 'ira') {
          this.handleStepChange(step.stepToBeRendered);
        } else {
          this.setState({ submitLoading: !this.state.submitLoading });
          this.props.investmentStore.validateInvestmentAmount().then((isValid) => {
            if (isValid) {
              this.props.investmentStore.generateAgreement().then(() => {
                Helper.toast('Transfer request is in process!', 'success');
                this.props.investmentStore.setStepToBeRendered(0);
                this.setState({ submitLoading: !this.state.submitLoading });
                this.props.history.push('agreement');
              });
            }
          });
        }
      });
    } else if (step.name === 'Account Type') {
      this.props.investmentLimitStore.getInvestorInvestmentLimit().then(() => {
        this.handleStepChange(step.stepToBeRendered);
      });
    }
  }

  render() {
    const { changeInvest, uiStore, userDetailsStore } = this.props;
    const { signupStatus } = userDetailsStore;
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
          changeInvest={changeInvest}
          UserAccounts={signupStatus.activeAccounts}
        />,
        isValid: '',
        stepToBeRendered: 1,
        isDirty: true,
      },
      {
        name: 'Financial Info',
        component: <FinancialInfo
          refLink={this.props.refLink}
          changeInvest={changeInvest}
        />,
        isValid: '',
        stepToBeRendered: 2,
        isDirty: true,
      },
      {
        name: 'TransferRequest',
        component: <TransferRequest
          changeInvest={changeInvest}
          confirm={this.handleConfirm}
          cancel={this.handleCancel}
        />,
        stepToBeRendered: 3,
        isValid: '',
      },
    ];
    return (
      <div className="step-progress" >
        {!this.state.submitLoading ?
          <MultiStep createAccount={this.multiClickHandler} setIsEnterPressed={setIsEnterPressed} disableNxtbtn={this.props.investmentStore.disableNextbtn} isEnterPressed={isEnterPressed} resetEnterPressed={resetIsEnterPressed} inProgress={inProgress} hideHeader setStepTobeRendered={this.handleStepChange} stepToBeRendered={this.props.investmentStore.stepToBeRendered} steps={steps} formTitle="Entity Account Creation" handleMultiStepModalclose={this.handleMultiStepModalclose} />
          :
          <Dimmer active>
            <Loader>
              Please wait...<br /><br />
              We are generating your agreement. This can take up to a minute.
            </Loader>
          </Dimmer>
        }
      </div>
    );
  }
}
