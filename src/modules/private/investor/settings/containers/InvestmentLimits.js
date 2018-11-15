import React, { Component } from 'react';
import { Route, withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Grid } from 'semantic-ui-react';
import FinancialInfo from '../components/investmentLimits/FinancialInfo';
import VerifyAccreditation from './accreditation/VerifyAccreditation';
import VerifyEntityAccreditation from './accreditation/verifyEntityAccreditation';
import UpdateInvestmentLimits from '../components/investmentLimits/UpdateInvestmentLimits';
import VerifyTrustEntityAccreditation from './accreditation/VerifyTrustEntityAccreditation';
// import IncomeAccreditation from './accreditation/income/Accreditation';
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
    this.props.history.push(this.props.match.url);
  }

  render() {
    const { accreditationMethods } = this.props.accreditationStore.ACCREDITATION_FORM.fields;
    return (
      <div>
        <Route exact path={`${this.props.match.url}/verify-accreditation`} component={VerifyAccreditation} />
        <Route exact path={`${this.props.match.url}/verify-entity-accreditation`} component={VerifyEntityAccreditation} />
        {/* <Route exact path={`${this.props.match.url}/verify-entity-accreditation/income`}
      component={IncomeAccreditation} /> */}
        <Route exact path={`${this.props.match.url}/verify-entity-accreditation/${accreditationMethods.value}/success`} render={() => <ThanksNote closeModal={this.closeModal} />} />
        <Route exact path={`${this.props.match.url}/verify-accreditation/${accreditationMethods.value}/success`} render={() => <ThanksNote closeModal={this.closeModal} />} />

        <Route exact path={`${this.props.match.url}/verify-entity-accreditation`} component={VerifyEntityAccreditation} />
        {/* <Route exact path={`${this.props.match.url}/verify-entity-accreditation/income`}
      // component={IncomeAccreditation} /> */}
        <Route exact path={`${this.props.match.url}/verify-entity-accreditation/${accreditationMethods.value}/success`} render={() => <ThanksNote closeModal={this.closeModal} />} />

        <Route exact path={`${this.props.match.url}/verify-trust-entity-accreditation/verify`} component={VerifyAccreditation} />
        <Route exact path={`${this.props.match.url}/verify-trust-entity-accreditation`} component={VerifyTrustEntityAccreditation} />
        {/* <Route exact path={`${this.props.match.url}/verify
        // -trust-entity-accreditation/verify/income`} component={IncomeAccreditation} />
        <Route exact path={`${this.props.match.url}/verify-trust-entity-accreditation/
        // verify/assets`} component={AssetsAccreditation} /> */}
        <Route exact path={`${this.props.match.url}/verify-trust-entity-accreditation/verify/${accreditationMethods.value}/success`} render={() => <ThanksNote closeModal={this.closeModal} />} />
        <Route exact path={`${this.props.match.url}/update`} render={() => <UpdateInvestmentLimits refLink={this.props.match.url} />} />
        <Grid columns={1} stackable>
          <FinancialInfo />
        </Grid>
      </div>
    );
  }
}
