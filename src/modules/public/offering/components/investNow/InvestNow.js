import React from 'react';
import { Loader, Dimmer } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { MultiStep } from '../../../../../helper';
import TransferRequest from './TransferRequest';
import AccountType from './AccountType';
import FinancialInfo from './FinancialInfo';
import Helper from '../../../../../helper/utility';

@withRouter
@inject('uiStore', 'portfolioStore', 'campaignStore', 'investmentStore', 'authStore', 'userStore', 'investmentLimitStore')
@observer
export default class InvestNow extends React.Component {
  state = { submitLoading: false };

  componentWillMount() {
    this.props.investmentStore.setStepToBeRendered(0);
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
    this.props.history.push(this.props.refLink);
    this.props.investmentStore.resetData();
    this.props.investmentStore.setByDefaultRender(true);
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
    // this.props.history.push(`${this.props.match.url}/confirm-cancellation`);
    this.props.history.push('invest-now');
  }

  handleConfirm = () => {
    this.props.investmentStore.setByDefaultRender(false);
    this.setState({ submitLoading: true });
    this.props.investmentStore.validateInvestmentAmount().then((isValid) => {
      if (isValid) {
        this.props.investmentStore.transferFundsForInvestment().then((status) => {
          if (status) {
            this.props.investmentStore.generateAgreement().then(() => {
              this.props.investmentStore.setByDefaultRender(true);
              Helper.toast('Transfer request is in process!', 'success');
              this.props.investmentStore.setStepToBeRendered(0);
              this.setState({ submitLoading: false });
              this.props.history.push('agreement');
            }).catch(() => {
              this.setState({ submitLoading: false });
            });
          }
        }).catch(() => {
          this.setState({ submitLoading: false });
        });
      }
    }).catch(() => {
      this.setState({ submitLoading: false });
    });
  }

  multiClickHandler = (step) => {
    if (step.name === 'Financial Info') {
      this.props.investmentStore.getInvestorAvailableCash().then(() => {
        const { getTransferRequestAmount, investAccTypes } = this.props.investmentStore;
        if (getTransferRequestAmount > 0 && investAccTypes.value !== 'ira') {
          this.handleStepChange(step.stepToBeRendered);
        } else {
          this.setState({ submitLoading: true });
          this.props.investmentStore.validateInvestmentAmount().then((isValid) => {
            this.setState({ submitLoading: isValid });
            if (isValid) {
              this.props.investmentStore.generateAgreement().then(() => {
                Helper.toast('Transfer request is in process!', 'success');
                this.props.investmentStore.setStepToBeRendered(0);
                this.setState({ submitLoading: false });
                this.props.history.push('agreement');
              }).finally(() => {
                this.setState({ submitLoading: false });
              });
            }
          }).catch(() => {
            this.setState({ submitLoading: false });
          });
        }
      });
    } else if (step.name === 'Account Type' && this.props.investmentStore.getSelectedAccountTypeId) {
      this.props.investmentLimitStore
        .getInvestorInvestmentLimit(this.props.investmentStore.getSelectedAccountTypeId)
        .then(() => {
          this.handleStepChange(step.stepToBeRendered);
        });
    }
  }

  render() {
    const { changeInvest, uiStore } = this.props;
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
