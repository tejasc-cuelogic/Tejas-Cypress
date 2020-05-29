import React, { useEffect } from 'react';
import { observer, inject } from 'mobx-react';
import { withRouter, Link } from 'react-router-dom';
import { Header, Divider, Form, Table, Message, Button } from 'semantic-ui-react';
import { get, capitalize } from 'lodash';
import { MaskedInput } from '../../../../../../../theme/form';
import Helper from '../../../../../../../helper/utility';
import { PopUpModal } from '../../../../../../../theme/shared';

const isMobile = document.documentElement.clientWidth < 768;

function ConfigPreview(props) {
  useEffect(() => () => {
    props.investmentStore.resetData();
  }, []);

  const handleClick = (e) => {
    e.preventDefault();
  };

  const { offeringsStore, investmentStore, manageOfferingStore } = props;
  const {
    offer,
    offeringStatus,
    adminInvestmentBonusRewards,
    adminInvestMoneyChangeForEquity,
    adminEquityCalculateShareAmount,
    admininvestMoneyChange,
  } = offeringsStore;
  const {
    INVEST_NOW_CONFIG_FRM,
  } = manageOfferingStore;
  const {
    INVESTMONEY_FORM,
    PREFERRED_EQUITY_INVESTMONEY_FORM,
    equityInvestmentAmount,
    getDiffInvestmentLimitAmount,
    investmentAmount,
    validateMaskedInputForAmount,
    estReturnVal,
    calculateEstimatedReturn,
  } = investmentStore;
  const validBonusRewards = adminInvestmentBonusRewards(investmentAmount);
  const offerName = get(offer, 'keyTerms.shorthandBusinessName') || '-';
  // const isOfferingPreferredEquity = !!offeringStatus.isPreferredEquity;
  const isOfferingPreferredEquity = !!(INVEST_NOW_CONFIG_FRM.fields.investmentType.value === 'UNITS');
  const isCenterAlignedCls = isOfferingPreferredEquity ? 'center-align' : '';
  const prefferedEquityAmount = get(offer, 'closureSummary.keyTerms.priceCalculation') || '0';
  const currentInvestedAmount = '500';
  const currentInvestmentLimit = '50000';
  const diffLimitAmount = getDiffInvestmentLimitAmount; // 100;
  const prefferedEquityLabel = get(offer, 'keyTerms.equityUnitType');
  const showLimitComponent = true;
  const changeInvest = false;
  const returnCalculationType = INVEST_NOW_CONFIG_FRM.fields.expectedReturnCalc.value;

  const InvestmentLimit = () => (
    <>
      <Header as={props.changeInvest ? 'h6' : 'h4'}>
        Your{' '}
        <PopUpModal
          wide
          customTrigger={<span className="popup-label">investment limit</span>}
          content={(
            <span>
              Under Regulation Crowdfunding, you have a limit as to how much you may invest
              in Reg CF offerings over a 12-month period. This limit is calculated based on your
              annual income and net worth. <Link to="#" onClick={e => handleClick(e)}>Click here</Link> for how this is calculated. If you believe
              your limit is inaccurate, please update your <Link to="#" onClick={e => handleClick(e)}>Investor Profile</Link>
            </span>
          )}
          position="top center"
          showOnlyPopup={!isMobile}
          hoverable
        />
        :{' '}
        {Helper.MoneyMathDisplayCurrency(currentInvestmentLimit || 0, false)}
        <Link to="#" onClick={e => handleClick(e)} className="link"><small>Update</small></Link>
      </Header>
      {changeInvest
        ? <p>Your investment will be {diffLimitAmount > 0 ? 'increased' : 'decreased'} by <span className="negative-text">{Helper.CurrencyFormat(diffLimitAmount || 0, 0)}</span></p>
        : null
      }
    </>
  );


  return (
    <>
      <Header as="h4">{changeInvest ? 'Update your Investment' : 'How much would you like to invest?'}</Header>
      {changeInvest
        && (
          <>
            <Header as="h4" className="grey-header">Your current investment in {offerName}: <span className="highlight-text">{isOfferingPreferredEquity ? Helper.CurrencyFormat(currentInvestedAmount) : Helper.CurrencyFormat(currentInvestedAmount, 0)}</span></Header>
            <Divider hidden />
            {!isOfferingPreferredEquity
              && (<Header as="h4" className={`mb-half ${isCenterAlignedCls}`}>Enter new investment amount. </Header>)
            }
            {showLimitComponent
              && (
                <p>
                  Your
                  <PopUpModal
                    wide
                    customTrigger={<span className="popup-label">{' '}investment limit</span>}
                    content={(
                      <span>
                        Under Regulation Crowdfunding, you have a limit as to how much you may invest
                        in Reg CF offerings over a 12-month period.
                        This limit is calculated based on your
                          annual income and net worth. <Link to="#" onClick={e => handleClick(e)}>Click here</Link> for how this is calculated. If you believe
                          your limit is innacurate, please update your <Link to="#" onClick={e => handleClick(e)}>Investor Profile</Link>
                      </span>
                    )}
                    position="top center"
                    showOnlyPopup={!isMobile}
                    hoverable
                  />
                    :{' '}
                  {Helper.MoneyMathDisplayCurrency(currentInvestmentLimit || 0, false)}
                  <Link to="#" onClick={e => handleClick(e)} className="link"> <small>Update</small></Link>
                </p>
              )
            }
          </>
        )
      }
      {!changeInvest
        && (
          <InvestmentLimit />
        )
      }
      <Form error>
        {isOfferingPreferredEquity
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
                        fielddata={PREFERRED_EQUITY_INVESTMONEY_FORM.fields.shares}
                        changed={values => adminInvestMoneyChangeForEquity(values, 'shares')}
                        autoFocus
                        showerror
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
                  <Table.Row>
                    <Button primary size="large" fluid={isMobile} className="mt-40 relaxed" content="Continue" />
                  </Table.Row>
                </Table.Body>
              </Table>
              {changeInvest && getDiffInvestmentLimitAmount
                && INVESTMONEY_FORM.fields.investmentAmount.value > 0 && getDiffInvestmentLimitAmount !== '0.00'
                ? <p className="mt-20">Your investment will be {getDiffInvestmentLimitAmount > 0 ? 'increased' : 'decreased'} by <span className={`${getDiffInvestmentLimitAmount > 0 ? 'positive-text' : 'negative-text'}`}>{isOfferingPreferredEquity ? Helper.CurrencyFormat(Math.abs(getDiffInvestmentLimitAmount) || 0) : Helper.CurrencyFormat(Math.abs(getDiffInvestmentLimitAmount) || 0, 0)}</span></p> : ''
              }
              {validBonusRewards && validBonusRewards.length > 0
                && INVEST_NOW_CONFIG_FRM.fields.toggleMeta.value.includes('BONUS_REWARDS')
                && (
                  <Message className="bg-offwhite no-shadow no-wrap">
                    <Message.Header>Bonus Rewards to be Received:</Message.Header>
                    {validBonusRewards.map(reward => (
                      <p>+ {reward.title}</p>
                    ))
                    }
                  </Message>
                )
              }
              <p className="note mt-40">{adminEquityCalculateShareAmount()}</p>
            </>
          )
          : (
            <>
              <MaskedInput
                data-cy="investmentAmount"
                hidelabel
                name="investmentAmount"
                type="tel"
                currency
                prefix="$ "
                fielddata={INVESTMONEY_FORM.fields.investmentAmount}
                changed={values => admininvestMoneyChange(values, 'investmentAmount', false, returnCalculationType)}
                onkeyup={validateMaskedInputForAmount}
                autoFocus
                allowNegative={false}
              />
              <Button primary size="large" fluid={isMobile} className="mt-40 relaxed" content="Continue" />
            </>
          )}
      </Form>
      {changeInvest && !isOfferingPreferredEquity && getDiffInvestmentLimitAmount
        && INVESTMONEY_FORM.fields.investmentAmount.value > 0 && getDiffInvestmentLimitAmount !== '0.00'
        ? <p className="mt-10">Your investment will be {getDiffInvestmentLimitAmount > 0 ? 'increased' : 'decreased'} by <span className={`${getDiffInvestmentLimitAmount > 0 ? 'positive-text' : 'negative-text'}`}>{Helper.CurrencyFormat(Math.abs(getDiffInvestmentLimitAmount) || 0, 0)}</span></p> : ''
      }
      <Divider hidden />
      {!offeringStatus.isSafe && estReturnVal && estReturnVal !== '-'
        && investmentAmount
        && INVEST_NOW_CONFIG_FRM.fields.toggleMeta.value.includes('EXPECTED_RETURN')
        ? (
          <Header as="h4">
            <PopUpModal
              wide
              customTrigger={<span className="popup-label">Total Investment Return</span>}
              content="This calculates the total amount that the issuer agrees to pay you under the note purchase agreement, based on what you enter above. Payment is not guaranteed or ensured and investors may lose some or all of the principal invested. "
              position="top center"
              showOnlyPopup={!isMobile}
            />
                : Up to {estReturnVal === '-' ? calculateEstimatedReturn() : estReturnVal}
          </Header>
        )
        : null
      }
      {
        INVEST_NOW_CONFIG_FRM.fields.toggleMeta.value.includes('BONUS_REWARDS')
        && validBonusRewards && validBonusRewards.length > 0
        && validBonusRewards.map(reward => (
          <p className="grey-header">+ {reward.title}</p>
        ))
      }
    </>
  );
}

export default inject('manageOfferingStore', 'offeringsStore', 'investmentStore')(withRouter(observer(ConfigPreview)));
