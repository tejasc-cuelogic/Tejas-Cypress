import React, { Component } from 'react';
import { Route, withRouter, Link } from 'react-router-dom';
import { Header, Form, Popup, Icon, Divider } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { get, includes } from 'lodash';
import { MaskedInput } from '../../../../../theme/form';
import InvestmentLimit from './financialInfo/InvestmentLimit';
import ChangeInvestmentLimit from './ChangeInvestmentLimit';
import Helper from '../../../../../helper/utility';
import { Spinner } from '../../../../../theme/shared';

const isPrefferedEquity = true;
@withRouter
@inject('investmentStore', 'investmentLimitStore', 'portfolioStore', 'campaignStore', 'accreditationStore')
@observer
class FinancialInfo extends Component {
  constructor(props) {
    super(props);
    if (this.props.changeInvest
      && !this.props.investmentLimitStore.getCurrentInvestNowHealthCheck) {
      const { getInvestNowHealthCheck } = this.props.investmentLimitStore;
      const { match } = this.props;
      const offeringId = match && match.params && match.params.offeringId;
      if (this.props.investmentStore.getSelectedAccountTypeId) {
        getInvestNowHealthCheck(this.props.investmentStore.getSelectedAccountTypeId, offeringId);
      }
    }
    if (this.props.investmentLimitStore.getCurrentInvestNowHealthCheck) {
      const investorTotalAmountInvested = get(this.props.investmentLimitStore.getCurrentInvestNowHealthCheck, 'investorTotalAmountInvested') || '0';
      this.props.investmentLimitStore.setFieldValue('investorTotalAmountInvested', investorTotalAmountInvested);
    }
    // if (this.props.match.isExact && this.props.investmentStore.getSelectedAccountTypeId) {
    //   this.props.investmentLimitStore
    //     .getInvestorTotalAmountInvested(this.props.investmentStore.getSelectedAccountTypeId);
    // }
  }

  render() {
    const {
      investmentAmount,
      // isValidInvestAmtInOffering,
      INVESTMONEY_FORM,
      PREFERRED_EQUITY_INVESTMONEY_FORM,
      investMoneyChange,
      investMoneyChangeForEquiry,
      calculatedInvestmentAmountForPreferredEquity,
      estReturnVal,
      calculateEstimatedReturn,
      setStepToBeRendered,
      validateMaskedInputForAmount,
      getDiffInvestmentLimitAmount,
      investmentBonusRewards,
    } = this.props.investmentStore;
    const validBonusRewards = investmentBonusRewards(investmentAmount);
    const { getInvestorAccountById } = this.props.portfolioStore;
    const { getCurrentInvestNowHealthCheck } = this.props.investmentLimitStore;
    const { match, refLink, offeringDetails } = this.props;
    const currentInvestmentLimit = getCurrentInvestNowHealthCheck
      && getCurrentInvestNowHealthCheck.investmentLimit
      ? getCurrentInvestNowHealthCheck.investmentLimit : 0;
    const currentInvestedAmount = getCurrentInvestNowHealthCheck
      && getCurrentInvestNowHealthCheck.previousAmountInvested
      ? getCurrentInvestNowHealthCheck.previousAmountInvested : 0;
    // const investmentRegulation = get(getInvestorAccountById, 'regulation');
    const offeringId = get(this.props, 'match.params.offeringId') ? get(this.props, 'match.params.offeringId') : get(getInvestorAccountById, 'offering.id') ? get(getInvestorAccountById, 'offering.id') : offeringDetails && offeringDetails.id;
    const { currentInvestmentStatus, userDetails } = this.props.accreditationStore;
    const { campaign } = this.props.campaignStore;
    const offerName = get(campaign, 'keyTerms.shorthandBusinessName') ? get(campaign, 'keyTerms.shorthandBusinessName') : get(getInvestorAccountById, 'offering.keyTerms.shorthandBusinessName') ? get(getInvestorAccountById, 'offering.keyTerms.shorthandBusinessName') : '-';
    const campaignRegulation = get(campaign, 'keyTerms.regulation');
    const accreditationStatus = get(userDetails, 'accreditation.status');
    // const offeringSecurityType = get(campaign, 'keyTerms.securities');
    const prefferedEquityLabel = get(campaign, 'keyTerms.equityUnitType');
    const prefferedEquityAmount = get(campaign, 'keyTerms.equityClass') ? get(userDetails, 'keyTerms.equityClass') : '0';
    const offeringReuglation = campaignRegulation || get(getInvestorAccountById, 'offering.keyTerms.regulation');
    const showLimitComponent = !((offeringReuglation === 'BD_506C' || offeringReuglation === 'BD_506B' || (offeringReuglation === 'BD_CF_506C' && includes(['REQUESTED', 'CONFIRMED'], accreditationStatus))));
    const { getInvestorAmountInvestedLoading } = this.props.investmentLimitStore;
    if (!getCurrentInvestNowHealthCheck || getInvestorAmountInvestedLoading
      || this.props.investmentLimitStore.investNowHealthCheckDetails.loading) {
      return <Spinner loaderMessage="Loading.." />;
    }

    return (
      <>
        <Route exact path={`${match.url}/change-investment-limit`} render={props => <ChangeInvestmentLimit offeringId={offeringId} refLink={match.url} {...props} />} />
        <Header as="h3" textAlign="center">{this.props.changeInvest ? 'Update your Investment' : 'How much would you like to invest?'}</Header>
        {this.props.changeInvest
          && (
            <>
              <Header as="h4" textAlign="center" className="grey-header">Your current investment in {offerName}: <span className="highlight-text">{Helper.CurrencyFormat(currentInvestedAmount, 0)}</span></Header>
              <Divider section className="small" />
              <Header as="h4" className="mb-half">Enter new investment amount. </Header>
              {!includes(['BD_506C', 'BD_506B'], currentInvestmentStatus) && showLimitComponent
                && (
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
            your limit is innacurate, please update your <Link to="/app/account-settings/profile-data">Investor Profile</Link>
                        </span>
                      )}
                      position="top center"
                      hoverable
                    />
                    <Link to={this.props.changeInvest && !this.props.isFromPublicPage ? 'change-investment-limit' : `${match.url}/change-investment-limit`} className="link"><small>Update</small></Link>
                  </p>
                )
              }
            </>
          )
        }
        {/* {!this.props.changeInvest && currentInvestmentStatus !== ('BD_506C' || 'BD_506B') && */}
        {!this.props.changeInvest && !includes(['BD_506C', 'BD_506B'], currentInvestmentStatus)
          && (
            <InvestmentLimit
              changeInvest={this.props.changeInvest}
              match={this.props.match}
              refLink={refLink}
              getCurrentLimitForAccount={currentInvestmentLimit}
              setStepToBeRendered={setStepToBeRendered}
              diffLimitAmount={getDiffInvestmentLimitAmount}
            />
          )
        }
        <Form error size="huge">
          {isPrefferedEquity
            ? (
              <>
                <MaskedInput
                  data-cy="shares"
                  name="shares"
                  label={prefferedEquityLabel}
                  asterisk="true"
                  currency
                  prefix="$ "
                  showerror
                  fielddata={PREFERRED_EQUITY_INVESTMONEY_FORM.fields.shares}
                  changed={values => investMoneyChangeForEquiry(values, 'shares')}
                  onkeyup={calculatedInvestmentAmountForPreferredEquity}
                  autoFocus
                  allowNegative={false}
                />
                <span>{`Price per ${prefferedEquityLabel}:`}</span>
                <p>{prefferedEquityAmount}</p>
                <MaskedInput
                  data-cy="investmentAmount"
                  name="investmentAmount"
                  label="Your investment"
                  currency
                  prefix="$ "
                  showerror
                  fielddata={INVESTMONEY_FORM.fields.investmentAmount}
                  autoFocus
                  allowNegative={false}
                />
              </>
            )
            : (
              <MaskedInput
                data-cy="investmentAmount"
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
            )}
        </Form>
        {this.props.changeInvest && getDiffInvestmentLimitAmount
          && INVESTMONEY_FORM.fields.investmentAmount.value > 0 && getDiffInvestmentLimitAmount !== '0.00'
          ? <p className="mt-10">Your investment will be {getDiffInvestmentLimitAmount > 0 ? 'increased' : 'decreased'} by <span className={`${getDiffInvestmentLimitAmount > 0 ? 'positive-text' : 'negative-text'}`}>{Helper.CurrencyFormat(Math.abs(getDiffInvestmentLimitAmount) || 0, 0)}</span></p> : ''
        }
        <Divider hidden />
        {// isValidInvestAmtInOffering &&
          estReturnVal && estReturnVal !== '-'
            && investmentAmount
            ? (
              <Header as="h4">Total Investment Return: Up to {estReturnVal === '-' ? calculateEstimatedReturn() : estReturnVal}
                <Popup
                  wide
                  trigger={<Icon className="ns-help-circle" color="green" />}
                  content="This calculates the total amount that the issuer agrees to pay you under the note purchase agrrement, based on what you enter above. Payment is not guaranteed or ensured and investors may lose some or all of the principal invested. "
                  position="top center"
                />
              </Header>
            )
            : null
        }
        {
          // isValidInvestAmtInOffering &&
          validBonusRewards && validBonusRewards.length > 0
          && validBonusRewards.map(reward => (
            <p className="grey-header">+ {reward.title}</p>
          ))
        }
      </>
    );
  }
}

export default FinancialInfo;
