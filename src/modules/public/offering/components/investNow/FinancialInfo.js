import React, { Component } from 'react';
import Aux from 'react-aux';
import { Route, withRouter, Link } from 'react-router-dom';
import { Header, Form, Popup, Icon, Divider } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { get, includes } from 'lodash';
import { MaskedInput } from '../../../../../theme/form';
import InvestmentLimit from './financialInfo/InvestmentLimit';
import ChangeInvestmentLimit from './ChangeInvestmentLimit';
import Helper from '../../../../../helper/utility';
import { Spinner } from '../../../../../theme/shared';

@withRouter
@inject('investmentStore', 'userDetailsStore', 'investmentLimitStore', 'portfolioStore', 'campaignStore', 'accreditationStore')
@observer
class FinancialInfo extends Component {
  componentWillMount() {
    if (this.props.changeInvest &&
      !this.props.investmentLimitStore.getCurrentInvestNowHealthCheck) {
      const { getInvestNowHealthCheck } = this.props.investmentLimitStore;
      const { match } = this.props;
      const offeringId = match && match.params && match.params.offeringId;
      if (this.props.investmentStore.getSelectedAccountTypeId) {
        getInvestNowHealthCheck(this.props.investmentStore.getSelectedAccountTypeId, offeringId);
      }
    }
    if (this.props.investmentStore.getSelectedAccountTypeId) {
      this.props.investmentLimitStore
        .getInvestorAmountInvested(this.props.investmentStore.getSelectedAccountTypeId);
    }
  }
  render() {
    const {
      investmentAmount,
      // isValidInvestAmtInOffering,
      INVESTMONEY_FORM,
      investMoneyChange,
      estReturnVal,
      calculateEstimatedReturn,
      validBonusRewards,
      setStepToBeRendered,
      validateMaskedInputForAmount,
      getDiffInvestmentLimitAmount,
    } = this.props.investmentStore;
    const { getInvestorAccountById } = this.props.portfolioStore;
    const { getCurrentInvestNowHealthCheck } = this.props.investmentLimitStore;
    const { match, refLink, offeringDetails } = this.props;
    const currentInvestmentLimit = getCurrentInvestNowHealthCheck &&
      getCurrentInvestNowHealthCheck.investmentLimit ?
      getCurrentInvestNowHealthCheck.investmentLimit : 0;
    const currentInvestedAmount = getCurrentInvestNowHealthCheck &&
      getCurrentInvestNowHealthCheck.previousAmountInvested ?
      getCurrentInvestNowHealthCheck.previousAmountInvested : 0;
    const investmentRegulation = get(getInvestorAccountById, 'regulation');
    const offeringId = get(this.props, 'match.params.offeringId') ? get(this.props, 'match.params.offeringId') : get(getInvestorAccountById, 'offering.id') ? get(getInvestorAccountById, 'offering.id') : offeringDetails && offeringDetails.id;
    const { currentInvestmentStatus, userDetails } = this.props.accreditationStore;
    const { campaign } = this.props.campaignStore;
    const offerName = get(campaign, 'keyTerms.shorthandBusinessName') ? get(campaign, 'keyTerms.shorthandBusinessName') : get(getInvestorAccountById, 'offering.keyTerms.shorthandBusinessName') ? get(getInvestorAccountById, 'offering.keyTerms.shorthandBusinessName') : '-';
    const campaignRegulation = get(campaign, 'keyTerms.regulation');
    const accreditationStatus = get(userDetails, 'accreditation.status');
    const offeringReuglation = campaignRegulation || get(getInvestorAccountById, 'offering.keyTerms.regulation');
    const showLimitComponent = !((offeringReuglation === 'BD_506C' || (offeringReuglation === 'BD_CF_506C' && includes(['REQUESTED', 'CONFIRMED'], accreditationStatus))));
    if (!getCurrentInvestNowHealthCheck) {
      return <Spinner loaderMessage="Loading.." />;
    }

    return (
      <Aux>
        <Route path={`${match.url}/change-investment-limit`} render={props => <ChangeInvestmentLimit offeringId={offeringId} refLink={match.url} {...props} />} />
        <Header as="h3" textAlign="center">{this.props.changeInvest ? 'Update your Investment' : 'How much would you like to invest?'}</Header>
        {this.props.changeInvest &&
          <Aux>
            <Header as="h4" textAlign="center" className="grey-header">Your current investment in {offerName}: <span className="highlight-text">{Helper.CurrencyFormat(currentInvestedAmount, 0)}</span></Header>
            <Divider section className="small" />
            <Header as="h4" className="mb-half">Enter new investment amount. </Header>
            {investmentRegulation !== 'BD_506C' && showLimitComponent &&
              <p>
                Your investment limit: {' '}
                {Helper.MoneyMathDisplayCurrency(currentInvestmentLimit || 0, false)}
                <Popup
                  wide
                  trigger={<Icon className="ns-help-circle ml-10" color="green" />}
                  content={(
                    <span>
                      Under Regulation Crowdfunding, you have a limit as to how much you may invest
                      in Reg CF offerings over a 12-month period.
                       This limit is calculated based on your
            annual income and net worth. <Link to={`${refLink}/investment-details/#total-payment-calculator`}>Click here</Link> for how this is calculated. If you believe
            your limit is innacurate, please update your <Link to="/app/profile-settings/profile-data">Investor Profile</Link>
                    </span>
                  )}
                  position="top center"
                  hoverable
                />
                <Link to={this.props.changeInvest && !this.props.isFromPublicPage ? 'change-investment-limit' : `${match.url}/change-investment-limit`} className="link"><small>Update</small></Link>
              </p>
            }
          </Aux>
        }
        {!this.props.changeInvest && currentInvestmentStatus !== 'BD_506C' && currentInvestmentStatus !== 'D506C' &&
          <InvestmentLimit
            changeInvest={this.props.changeInvest}
            match={this.props.match}
            refLink={refLink}
            getCurrentLimitForAccount={currentInvestmentLimit}
            setStepToBeRendered={setStepToBeRendered}
            diffLimitAmount={getDiffInvestmentLimitAmount}
          />
        }
        <Form error size="huge">
          <MaskedInput
            hidelabel
            name="investmentAmount"
            currency
            prefix="$ "
            showerror
            fielddata={INVESTMONEY_FORM.fields.investmentAmount}
            changed={values => investMoneyChange(values, 'investmentAmount')}
            onkeyup={validateMaskedInputForAmount}
            autoFocus
            allowNegative={false}
          />
        </Form>
        {this.props.changeInvest && getDiffInvestmentLimitAmount &&
          INVESTMONEY_FORM.fields.investmentAmount.value > 0 && getDiffInvestmentLimitAmount !== '0.00' ?
            <p className="mt-10">Your investment will be {getDiffInvestmentLimitAmount > 0 ? 'increased' : 'decreased'} by <span className={`${getDiffInvestmentLimitAmount > 0 ? 'positive-text' : 'negative-text'}`}>{Helper.CurrencyFormat(Math.abs(getDiffInvestmentLimitAmount) || 0, 0)}</span></p> : ''
        }
        <Divider hidden />
        {// isValidInvestAmtInOffering &&
          estReturnVal && estReturnVal !== '-' &&
            investmentAmount ?
              <Header as="h4">Total Investment Return: Up to {estReturnVal === '-' ? calculateEstimatedReturn() : estReturnVal}
                <Popup
                  wide
                  trigger={<Icon className="ns-help-circle" color="green" />}
                  content="This calculates the total amount that the issuer agrees to pay you under the note purchase agrrement, based on what you enter above. Payment is not guaranteed or ensured and investors may lose some or all of the principal invested. "
                  position="top center"
                />
              </Header>
            :
            null
        }
        {
          // isValidInvestAmtInOffering &&
          validBonusRewards.length > 0 &&
          validBonusRewards.map(reward => (
            <p className="grey-header">+ {reward.title}</p>
          ))
        }
      </Aux>
    );
  }
}

export default FinancialInfo;
