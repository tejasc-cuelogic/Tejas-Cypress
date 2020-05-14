import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import PortfolioStep from './PortfolioStep';
import AccountsStep from './AccountsStep';
import OfferingsStep from './OfferingsStep';
import InterstitialModal from '../InterstitialModal';
@observer
@inject('uiStore', 'individualAccountStore')
@withRouter
export default class SignupInterstitial extends Component {
  handleStepChange = (step) => {
    this.props.individualAccountStore.setStepToBeRendered(step);
  }

  handleModalclose = () => {
    this.props.history.push('/dashboard/setup');
    this.props.uiStore.clearErrors();
  }

  render() {
      const { stepToBeRendered } = this.props.individualAccountStore;
      const { showInterstitial } = this.props.uiStore;
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
        {showInterstitial
          && (
          <div className="step-progress">
            <InterstitialModal setStepTobeRendered={this.handleStepChange} stepToBeRendered={stepToBeRendered} steps={steps} handleModalclose={this.handleModalclose} />
          </div>
          )
        }
      </>
    );
  }
}
