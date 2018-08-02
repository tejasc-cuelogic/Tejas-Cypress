import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Grid } from 'semantic-ui-react';
import FinancialInfo from '../components/investmentLimits/FinancialInfo';
import VerifyAccreditation from './accreditation/VerifyAccreditation';
import UpdateInvestmentLimits from '../components/investmentLimits/UpdateInvestmentLimits';
import AssetsAccreditation from './accreditation/assets/Accreditation';
import IncomeAccreditation from './accreditation/income/Accreditation';
import ThanksNote from '../components/investmentLimits/accreditation/ThanksNote';
@inject('investmentLimitStore', 'accreditationStore')
@observer
export default class InvestmentLimits extends Component {
  componentWillMount() {
    this.props.investmentLimitStore.getInvestmentLimit();
  }

  closeModal = () => {
    this.props.history.push('/app/profile-settings/investment-limits');
  }

  render() {
    const { accreditationMethods } = this.props.accreditationStore.ACCREDITATION_FORM.fields;
    return (
      <div>
        <Route exact path={`${this.props.match.url}/verify-accreditation`} component={VerifyAccreditation} />
        <Route exact path={`${this.props.match.url}/verify-accreditation/income`} component={IncomeAccreditation} />
        <Route exact path={`${this.props.match.url}/verify-accreditation/assets`} component={AssetsAccreditation} />
        <Route exact path={`${this.props.match.url}/verify-accreditation/${accreditationMethods.value}/thanksnote`} render={() => <ThanksNote closeModal={this.closeModal} />} />
        <Route exact path={`${this.props.match.url}/update`} component={UpdateInvestmentLimits} />
        <Grid columns={1} stackable>
          <FinancialInfo />
        </Grid>
      </div>
    );
  }
}
