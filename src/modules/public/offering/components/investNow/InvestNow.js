import React from 'react';
import { Loader, Dimmer } from 'semantic-ui-react';
import { MultiStep } from '../../../../../helper';
import TransferRequest from './TransferRequest';
import AccountType from './AccountType';
import FinancialInfo from './FinancialInfo';
import Helper from '../../../../../helper/utility';

export default class InvestNow extends React.Component {
  state = { step: 0, submitLoading: false };
  handleMultiStepModalclose = () => {
    this.props.history.push('overview');
  }
  handleStepChange = (step) => {
    console.log(step);
  }
  handelSumbit = () => {
    this.setState({ submitLoading: !this.state.submitLoading });
    Helper.toast('Transfer requeste is in process!', 'success');
    setTimeout(() => {
      this.setState({ submitLoading: !this.state.submitLoading });
      this.props.history.push('agreement');
    }, 2000);
  }
  render() {
    const steps =
    [
      {
        name: 'Financial Info',
        component: <FinancialInfo />,
        isValid: '',
        stepToBeRendered: 1,
      },
      {
        name: 'Account Type',
        component: <AccountType />,
        isValid: '',
        stepToBeRendered: 2,
      },
      {
        name: 'TransferRequest',
        component: <TransferRequest click={this.handelSumbit} />,
        isValid: '',
      },
    ];
    return (
      <div className="step-progress" >
        {!this.state.submitLoading ?
          <MultiStep hideHeader inProgress={false} setStepTobeRendered={this.handleStepChange} stepToBeRendered={this.state.step} steps={steps} formTitle="Entity Account Creation" handleMultiStepModalclose={this.handleMultiStepModalclose} />
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
