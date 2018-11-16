import React, { Component } from 'react';
import { Route, withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Grid } from 'semantic-ui-react';
import FinancialInfo from '../components/investmentLimits/FinancialInfo';
import VerifyAccreditation from './accreditation/VerifyAccreditation';
import VerifyEntityAccreditation from './accreditation/VerifyEntityAccreditation';
import UpdateInvestmentLimits from '../components/investmentLimits/UpdateInvestmentLimits';
import VerifyTrustEntityAccreditation from './accreditation/VerifyTrustEntityAccreditation';
import ThanksNote from '../components/investmentLimits/accreditation/ThanksNote';

@inject('investmentLimitStore', 'accreditationStore')
@withRouter
@observer
export default class InvestmentLimits extends Component {
  componentWillMount() {
    if (this.props.match.isExact) {
      this.props.investmentLimitStore.initiateInvestmentLimit();
    }
  }

  closeModal = () => {
    const { INCOME_EVIDENCE_FORM, VERIFICATION_REQUEST_FORM } = this.props.accreditationStore;
    this.props.accreditationStore.resetAccreditation(VERIFICATION_REQUEST_FORM);
    this.props.accreditationStore.resetAccreditation(INCOME_EVIDENCE_FORM);
    this.props.accreditationStore.setStepToBeRendered(0);
    this.props.history.push(this.props.match.url);
  }

  render() {
    return (
      <div>
        <Route exact path={`${this.props.match.url}/verify-accreditation/:accountId/:accountType`} render={() => <VerifyAccreditation refLink={this.props.match.url} />} />
        <Route exact path={`${this.props.match.url}/verify-entity-accreditation/:accountId/:accountType`} render={() => <VerifyEntityAccreditation refLink={this.props.match.url} />} />
        <Route exact path={`${this.props.match.url}/verify-trust-entity-accreditation/:accountId/:accountType`} render={() => <VerifyTrustEntityAccreditation refLink={this.props.match.url} />} />
        <Route exact path={`${this.props.match.url}/success`} render={() => <ThanksNote closeModal={this.closeModal} />} />
        <Route exact path={`${this.props.match.url}/update`} render={() => <UpdateInvestmentLimits refLink={this.props.match.url} />} />
        <Grid columns={1} stackable>
          <FinancialInfo />
        </Grid>
      </div>
    );
  }
}
