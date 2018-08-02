import React, { Component } from 'react';
import { Route, withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Grid } from 'semantic-ui-react';
import FinancialInfo from '../components/investmentLimits/FinancialInfo';
import VerifyAccreditation from './VerifyAccreditation';
import UpdateInvestmentLimits from '../components/investmentLimits/UpdateInvestmentLimits';

@inject('investmentLimitStore')
@withRouter
@observer
export default class InvestmentLimits extends Component {
  componentWillMount() {
    if (this.props.match.isExact) {
      this.props.investmentLimitStore.initiateInvestmentLimit();
    }
  }

  render() {
    return (
      <div>
        <Route exact path={`${this.props.match.url}/verify-accreditation`} component={VerifyAccreditation} />
        <Route exact path={`${this.props.match.url}/update`} component={UpdateInvestmentLimits} />
        <Grid columns={1} stackable>
          <FinancialInfo />
        </Grid>
      </div>
    );
  }
}
