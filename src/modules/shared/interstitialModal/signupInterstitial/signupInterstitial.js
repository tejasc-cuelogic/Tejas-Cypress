import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import PortfolioStep from './PortfolioStep';
import AccountsStep from './AccountsStep';
import OfferingsStep from './OfferingsStep';
import InterstitialModal from '../InterstitialModal';
@observer
@inject('uiStore', 'userStore', 'accountStore', 'individualAccountStore')
@withRouter
export default class SignupInterstitial extends Component {
  handleStepChange = (step) => {
    this.props.individualAccountStore.setStepToBeRendered(step);
  }

  render() {
      const { stepToBeRendered } = this.props.individualAccountStore;
      const steps = [
        {
          component: <PortfolioStep />,
          stepToBeRendered: 1,
      },
      {
        component: <AccountsStep />,
        stepToBeRendered: 2,
      },
      {
        component: <OfferingsStep />,
        stepToBeRendered: 3,
      },
    ];
    return (
      <>
        <div className="step-progress">
          <InterstitialModal setStepTobeRendered={this.handleStepChange} stepToBeRendered={stepToBeRendered} steps={steps} handleModalclose={this.handleModalclose} />
        </div>
      </>
    );
  }
}
