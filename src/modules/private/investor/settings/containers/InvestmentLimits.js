import React, { Component } from 'react';
import { Route, withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import FinancialInfo from '../components/investmentLimits/FinancialInfo';
import VerifyAccreditation from './accreditation/VerifyAccreditation';
import VerifyEntityAccreditation from './accreditation/VerifyEntityAccreditation';
import UpdateInvestmentLimits from '../components/investmentLimits/UpdateInvestmentLimits';
import VerifyTrustEntityAccreditation from './accreditation/VerifyTrustEntityAccreditation';
import ThanksNote from '../components/investmentLimits/accreditation/ThanksNote';
import FailedAccreditation from '../components/investmentLimits/accreditation/failedAccreditation';

@inject('investmentLimitStore', 'accreditationStore', 'userDetailsStore')
@withRouter
@observer
export default class InvestmentLimits extends Component {
  componentWillMount() {
    if (this.props.match.isExact) {
      this.props.investmentLimitStore.initiateInvestmentLimit();
    }
  }

  closeModal = () => {
    const {
      partialInvestNowSessionURL,
      setPartialInvestmenSession,
    } = this.props.userDetailsStore;
    this.props.accreditationStore.resetAllForms();
    if (partialInvestNowSessionURL) {
      this.props.history.push(partialInvestNowSessionURL);
      setPartialInvestmenSession();
    } else {
      this.props.history.push(this.props.match.url);
    }
  }

  render() {
    return (
      <div>
        <Route exact path={`${this.props.match.url}/verify-accreditation/:accountId/:accountType`} render={() => <VerifyAccreditation refLink={this.props.match.url} />} />
        <Route exact path={`${this.props.match.url}/verify-entity-accreditation/:accountId/:accountType`} render={() => <VerifyEntityAccreditation refLink={this.props.match.url} />} />
        <Route exact path={`${this.props.match.url}/verify-trust-entity-accreditation/:accountId/:accountType`} render={() => <VerifyTrustEntityAccreditation refLink={this.props.match.url} />} />
        <Route exact path={`${this.props.match.url}/success`} render={() => <ThanksNote closeModal={this.closeModal} />} />
        <Route exact path={`${this.props.match.url}/falied`} render={() => <FailedAccreditation closeModal={this.closeModal} />} />
        <Route exact path={`${this.props.match.url}/update`} render={() => <UpdateInvestmentLimits refLink={this.props.match.url} />} />
        <FinancialInfo />
      </div>
    );
  }
}
