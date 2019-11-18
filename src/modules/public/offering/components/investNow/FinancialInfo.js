import React, { Component } from 'react';
import { Route, withRouter, Link } from 'react-router-dom';
import { Header, Form, Popup, Icon, Divider, Table, Message } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { get, includes, capitalize } from 'lodash';
import { MaskedInput } from '../../../../../theme/form';
import InvestmentLimit from './financialInfo/InvestmentLimit';
import ChangeInvestmentLimit from './ChangeInvestmentLimit';
import Helper from '../../../../../helper/utility';
import { Spinner, FieldError } from '../../../../../theme/shared';

@withRouter
@inject('investmentStore', 'investmentLimitStore', 'portfolioStore', 'campaignStore', 'accreditationStore')
@observer
class FinancialInfo extends Component {
  constructor(props) {
    super(props);
    const { campaign } = this.props.campaignStore;
    const offeringSecurityType = get(campaign, 'keyTerms.securities');
    if (includes(['PREFERRED_EQUITY_506C'], offeringSecurityType)) {
      const { overrideMultipleValidationForInvestment } = this.props.investmentStore;
      overrideMultipleValidationForInvestment();
    }

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
      investMoneyChangeForEquity,
      equityInvestmentAmount,
      equityCalculateShareAmount,
      investmentFlowEquityErrorMessage,
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
    const { currentInvestmentStatus, userDetails, userAccredetiationState } = this.props.accreditationStore;
    const { campaign } = this.props.campaignStore;
    const offerName = get(campaign, 'keyTerms.shorthandBusinessName') ? get(campaign, 'keyTerms.shorthandBusinessName') : get(getInvestorAccountById, 'offering.keyTerms.shorthandBusinessName') ? get(getInvestorAccountById, 'offering.keyTerms.shorthandBusinessName') : '-';
    const campaignRegulation = get(campaign, 'keyTerms.regulation');
    const accreditationStatus = get(userDetails, 'accreditation.status');
    const offeringSecurityType = get(campaign, 'keyTerms.securities');
    const prefferedEquityLabel = get(campaign, 'keyTerms.equityUnitType');
    const prefferedEquityAmount = get(campaign, 'closureSummary.keyTerms.priceCalculation') || '0';
    const offeringReuglation = campaignRegulation || get(getInvestorAccountById, 'offering.keyTerms.regulation');
    const showLimitComponent = !((offeringReuglation === 'BD_506C' || offeringReuglation === 'BD_506B' || (offeringReuglation === 'BD_CF_506C' && includes(['REQUESTED', 'CONFIRMED'], accreditationStatus) && userAccredetiationState !== 'EXPIRED')));
    const { getInvestorAmountInvestedLoading } = this.props.investmentLimitStore;
    if (!getCurrentInvestNowHealthCheck || getInvestorAmountInvestedLoading
      || this.props.investmentLimitStore.investNowHealthCheckDetails.loading) {
      return <Spinner loaderMessage="Loading.." />;
    }
    const isCenterAlignedCls = includes(['PREFERRED_EQUITY_506C'], offeringSecurityType) ? 'center-align' : '';
    const isOfferingPreferredEquity = !!includes(['PREFERRED_EQUITY_506C'], offeringSecurityType);
    return (
      <>
        <Route exact path={`${match.url}/change-investment-limit`} render={props => <ChangeInvestmentLimit offeringId={offeringId} refLink={match.url} {...props} />} />
        <Header as="h3" textAlign="center">{this.props.changeInvest ? 'Update your Investment' : 'How much would you like to invest?'}</Header>
        {this.props.changeInvest
          && (
            <>
              <Header as="h4" textAlign="center" className="grey-header">Your current investment in {offerName}: <span className="highlight-text">{isOfferingPreferredEquity ? Helper.CurrencyFormat(currentInvestedAmount) : Helper.CurrencyFormat(currentInvestedAmount, 0)}</span></Header>
              <Divider section className="small" />
              {!includes(['PREFERRED_EQUITY_506C'], offeringSecurityType)
                && (<Header as="h4" className={`mb-half ${isCenterAlignedCls}`}>Enter new investment amount. </Header>)
              }
              {!includes(['BD_506C', 'BD_506B'], currentInvestmentStatus) && showLimitComponent
                && (
                  <p className={isCenterAlignedCls}>
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
          {includes(['PREFERRED_EQUITY_506C'], offeringSecurityType)
            ? (
              <>
                <Table unstackable basic className="mt-30" padded="very">
                  <Table.Body>
                    <Table.Row>
                      <Table.Cell className="grey-header plr-0" width="13">{`${capitalize(prefferedEquityLabel)}s*:`}</Table.Cell>
                      <Table.Cell className="plr-0">
                        <MaskedInput
                          data-cy="shares"
                          name="shares"
                          asterisk="true"
                          number
                          showerror
                          fielddata={PREFERRED_EQUITY_INVESTMONEY_FORM.fields.shares}
                          changed={values => investMoneyChangeForEquity(values, 'shares')}
                          autoFocus
                          allowNegative={false}
                          hidelabel
                          className="right-align-placeholder"
                          containerclassname="right-align"
                        />
                      </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell className="grey-header plr-0">{`Price per ${prefferedEquityLabel}:`}</Table.Cell>
                      <Table.Cell className="plr-0 grey-header right-align">{Helper.CurrencyFormat(prefferedEquityAmount)}</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell className="plr-0 grey-header"><b>Your investment:</b></Table.Cell>
                      <Table.Cell className="plr-0 highlight-text right-align">
                        <b>{equityInvestmentAmount}</b>
                      </Table.Cell>
                    </Table.Row>
                  </Table.Body>
                </Table>
                {this.props.changeInvest && getDiffInvestmentLimitAmount
                  && INVESTMONEY_FORM.fields.investmentAmount.value > 0 && getDiffInvestmentLimitAmount !== '0.00'
                  ? <p className="mt-10">Your investment will be {getDiffInvestmentLimitAmount > 0 ? 'increased' : 'decreased'} by <span className={`${getDiffInvestmentLimitAmount > 0 ? 'positive-text' : 'negative-text'}`}>{isOfferingPreferredEquity ? Helper.CurrencyFormat(Math.abs(getDiffInvestmentLimitAmount) || 0) : Helper.CurrencyFormat(Math.abs(getDiffInvestmentLimitAmount) || 0, 0)}</span></p> : ''
                }
                {investmentFlowEquityErrorMessage
                  && (<FieldError error={investmentFlowEquityErrorMessage} />)
                }
                {validBonusRewards && validBonusRewards.length > 0
                  && (
                    <Message className="bg-offwhite no-shadow">
                      <Message.Header>Bonus Rewards to be Received:</Message.Header>
                      {validBonusRewards.map(reward => (
                        <p>+ {reward.title}</p>
                      ))
                      }
                    </Message>
                  )
                }
                <p className="note mt-40 center-align">{equityCalculateShareAmount()}</p>
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
        {this.props.changeInvest && !includes(['PREFERRED_EQUITY_506C'], offeringSecurityType) && getDiffInvestmentLimitAmount
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
          !includes(['PREFERRED_EQUITY_506C'], offeringSecurityType)
          && validBonusRewards && validBonusRewards.length > 0
          && validBonusRewards.map(reward => (
            <p className="grey-header">+ {reward.title}</p>
          ))
        }
      </>
    );
  }
}

export default FinancialInfo;
