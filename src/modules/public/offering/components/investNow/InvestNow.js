import React from 'react';
import { Loader, Dimmer } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { MultiStep } from '../../../../../helper';
import TransferRequest from './TransferRequest';
import AccountType from './AccountType';
import FinancialInfo from './FinancialInfo';
import Helper from '../../../../../helper/utility';

@inject('uiStore', 'userDetailsStore', 'investmentStore', 'authStore', 'userStore', 'investmentLimitStore')
@observer
export default class InvestNow extends React.Component {
  state = { submitLoading: false };
  componentWillMount() {
    const { isUserLoggedIn } = this.props.authStore;
    const { currentUser } = this.props.userStore;
    if (!(isUserLoggedIn && currentUser.roles.includes('investor'))) {
      this.props.uiStore.setRedirectURL(this.props.history.location);
      this.props.history.push('/auth/login');
    }
  }

  handleMultiStepModalclose = () => {
    this.props.investmentStore.setStepToBeRendered(0);
    this.props.history.push('overview');
  }
  handleStepChange = (step) => {
    this.props.investmentStore.ResetDisableNextbtn();
    this.props.investmentStore.setStepToBeRendered(step);
  }
  handleCancel = () => {
    this.props.investmentStore.setStepToBeRendered(0);
    this.props.investmentStore.ResetDisableNextbtn();
    this.props.history.push('invest-now');
  }

  handleConfirm = () => {
    this.setState({ submitLoading: !this.state.submitLoading });
    Helper.toast('Transfer request is in process!', 'success');
    setTimeout(() => {
      this.props.investmentStore.setStepToBeRendered(0);
      this.setState({ submitLoading: !this.state.submitLoading });
      this.props.history.push('agreement');
    }, 2000);
  }
  multiClickHandler = (step) => {
    if (step.name === 'Financial Info') {
      this.props.investmentStore.getInvestorAvailableCash().then(() => {
        this.handleStepChange(step.stepToBeRendered);
      });
    } else if (step.name === 'Account Type') {
      this.props.investmentLimitStore.getInvestorInvestmentLimit().then(() => {
        this.handleStepChange(step.stepToBeRendered);
      });
    }
  }

  render() {
    const { signupStatus } = this.props.userDetailsStore;
    const {
      inProgress,
      isEnterPressed,
      resetIsEnterPressed,
      setIsEnterPressed,
    } = this.props.uiStore;
    const steps =
    [
      {
        name: 'Account Type',
        component: <AccountType UserAccounts={signupStatus.activeAccounts} />,
        isValid: '',
        stepToBeRendered: 1,
        isDirty: true,
      },
      {
        name: 'Financial Info',
        component: <FinancialInfo />,
        isValid: '',
        stepToBeRendered: 2,
        isDirty: true,
      },
      {
        name: 'TransferRequest',
        component: <TransferRequest confirm={this.handleConfirm} cancel={this.handleCancel} />,
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
