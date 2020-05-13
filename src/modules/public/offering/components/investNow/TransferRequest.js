import React, { useEffect, useState } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Header, Button, Message, Responsive } from 'semantic-ui-react';
import money from 'money-math';
import { get, includes } from 'lodash';
import BasicTransferRequest from './transferRequest/basicTransferRequest';
import TransferRequestMethod from './transferRequest/transferRequestMethod';
import Helper from '../../../../../helper/utility';
import { MINIMUM_AUTODRAFT_AMOUNT_WIRE } from '../../../../../constants/common';


const isMobile = document.documentElement.clientWidth < 768;

function TransferRequest(props) {
  const [showTransferRequest, setShowTransferRequest] = useState('basic');
  const [transferRequestMethod, setTransferRequestMethod] = useState(null);

  const getTransferRequestMethod = (transferAmount) => {
    const { campaignStore, portfolioStore, accreditationStore } = props;
    const { userDetails, userAccredetiationState } = accreditationStore;
    const offeringReuglation = get(campaignStore.campaign, 'keyTerms.regulation') || get(portfolioStore.getInvestorAccountById, 'offering.keyTerms.regulation');
    const accreditationStatus = get(userDetails, 'accreditation.status');
    const isValidForParallelOfferinng = !!((offeringReuglation === 'BD_CF_506C' && includes(['CONFIRMED'], accreditationStatus) && userAccredetiationState !== 'EXPIRED'));
    const formatedTransferAmount = money.floatToAmount(transferAmount);
    const formatedBaseAmount = money.floatToAmount(MINIMUM_AUTODRAFT_AMOUNT_WIRE);
    const comairResult = money.cmp(formatedTransferAmount, formatedBaseAmount);
    if (Math.sign(comairResult) >= 0 && (['BD_506B', 'BD_506C'].includes(offeringReuglation) || isValidForParallelOfferinng)) {
      setShowTransferRequest('advance');
    }
  };

  useEffect(() => {
    const {
      getTransferRequestAmount,
      setStepToBeRendered,
      resetFormErrors,
      setFieldValue,
      stepToBeRendered,
    } = props.investmentStore;
    resetFormErrors('INVESTMONEY_FORM');
    if (getTransferRequestAmount <= 0) {
      props.history.push('agreement');
    } else {
      setFieldValue('disableNextbtn', true);
      setStepToBeRendered(2);
    }
    getTransferRequestMethod(getTransferRequestAmount);
    setFieldValue('transferRequestDraft', 'ACH');

    return () => {
      if (stepToBeRendered === 2) {
        setStepToBeRendered(0);
      }
      props.uiStore.clearErrors();
      setFieldValue('investmentFlowEquityErrorMessage', null);
      setFieldValue('investmentFlowErrorMessage', null);
      resetFormErrors('INVESTMONEY_FORM');
    };
  }, []);

  const handleShowTransferErrRequest = () => {
    props.investmentStore.setShowTransferRequestErr(false);
    props.investmentStore.resetData();
    props.accreditationStore.resetUserAccreditatedStatus();
    props.history.push(props.refLink);
  };

  const renderTransferStep = (renderStep) => {
    const { handleBack, investmentStore } = props;
    const { setFieldValue } = investmentStore;
    setFieldValue('transferRequestDraft', !renderStep ? 'ACH' : renderStep);
    const backButtonState = !!renderStep;
    handleBack(backButtonState);
    setTransferRequestMethod(renderStep);
  };

  const { investmentStore, investmentLimitStore, changeInvest, isPreferredEquity } = props;
  const {
    getTransferRequestAmount,
    showTransferRequestErr,
    investmentAmount,
    investmentFlowErrorMessage,
  } = investmentStore;
  const userAmountDetails = investmentLimitStore.getCurrentInvestNowHealthCheck;
  const getCurrCashAvailable = (userAmountDetails && userAmountDetails.availableCash) || 0;
  const getCurrCreditAvailable = (userAmountDetails && userAmountDetails.rewardBalance) || 0;
  const getPreviousInvestedAmount = (userAmountDetails && userAmountDetails.previousAmountInvested) || 0;
  const bankAndAccountName = userAmountDetails && userAmountDetails.bankNameAndAccountNumber ? userAmountDetails.bankNameAndAccountNumber : '-';
  let headerTitle = showTransferRequest === 'basic' ? 'Confirm Transfer Request' : 'How would you like to fund this investment?';
  if (transferRequestMethod) {
    headerTitle = transferRequestMethod === 'ACH' ? 'Confirm Transfer Date and Request' : 'Confirm Wire Amount';
  }
  const { campaignStore, portfolioStore, userDetailsStore } = props;
  const offeringReuglation = get(campaignStore.campaign, 'keyTerms.regulation') || get(portfolioStore.getInvestorAccountById, 'offering.keyTerms.regulation');
  const advanceTransferStepStatement = offeringReuglation === 'BD_506B'
    ? `Since the Balance Required exceeds ${Helper.CurrencyFormat(MINIMUM_AUTODRAFT_AMOUNT_WIRE, 0)} and this is an investment under Rule 506(b) of Regulation D, you have the option to initiate a transfer of funds or wire funds after you reserve your investment.`
    : `Since the Balance Required exceeds ${Helper.CurrencyFormat(MINIMUM_AUTODRAFT_AMOUNT_WIRE, 0)} and your accredited investor status has been verified, you have the option to schedule a transfer of funds for a future date or wire funds after you reserve your investment.`;
  const { userDetails, investorActiveAccountDetails } = userDetailsStore;
  const investorFullName = `${get(userDetails, 'info.firstName')} ${get(userDetails, 'info.lastName')}`;
  const accountDetailsMeta = {
    goldstarAccountNumber: get(investorActiveAccountDetails, 'details.goldstar.accountNumber') || null,
    userFullName: investorFullName,
  };

  if (showTransferRequestErr) {
    return (
      <div className="center-align">
        <Header as="h3" textAlign="center">Your investment transaction was not processed.</Header>
        <p className="mt-30 mb-30">This may have happened because your session expired or your network connection dropped.
        We did not complete your investment transaction. Please check your account, and
        try again to complete your investment.
          </p>
        <Button primary content="Try Again" onClick={handleShowTransferErrRequest} />
      </div>
    );
  }
  return (
    <>
      <Header as="h4">{headerTitle}</Header>
      {!transferRequestMethod
        ? (
          <BasicTransferRequest
            isPreferredEquity={isPreferredEquity}
            investmentAmount={investmentAmount}
            changeInvest={changeInvest}
            getPreviousInvestedAmount={getPreviousInvestedAmount}
            getCurrCashAvailable={getCurrCashAvailable}
            getCurrCreditAvailable={getCurrCreditAvailable}
            getTransferRequestAmount={getTransferRequestAmount}
            isMobile={isMobile}
            transferRequest={showTransferRequest}
          />
        )
        : (
          <TransferRequestMethod
            isPreferredEquity={isPreferredEquity}
            getTransferRequestAmount={getTransferRequestAmount}
            transferMethod={transferRequestMethod}
            accountDetailsMeta={accountDetailsMeta}
            isMobile={isMobile}
          />
        )
      }
      <p className="note mt-30">
        {!transferRequestMethod
          ? showTransferRequest === 'basic'
            ? `By clicking the “Confirm” button, I authorize the transfer from
          my ${bankAndAccountName} to my NextSeed account in the
          amount equal to the Transfer Requested above. I understand this transfer will
          be initiated within 1-3 business days.`
            : advanceTransferStepStatement
          : transferRequestMethod === 'ACH'
            ? <sapn>By clicking the “Confirm” button, I authorize the transfer from my <span className="positive-text">{bankAndAccountName}</span> account in the amount equal to the Transfer Requested above. I understand this transfer will be <span className="positive-text">initiated within 1 business day of the Transfer Date.</span></sapn>
            : <span>By clicking the “Confirm” button, I acknowledge that <span className="positive-text">I will initiate a wire transfer with these instructions within 5 business days.</span> If funds are not received by GoldStar Trust within this time period, my investment will be canceled.</span>
        }
      </p>
      {investmentFlowErrorMessage
        && (
          <Message error className="mt-30">
            {investmentFlowErrorMessage}
          </Message>
        )
      }
      <>
        {showTransferRequest === 'basic' || transferRequestMethod
          ? (
            <div className="center-align mt-30">
              <Button.Group>
                <Button content="Back" type="button" onClick={transferRequestMethod ? () => renderTransferStep(null) : props.cancel} />
                <Button primary content="Confirm" onClick={props.confirm} />
              </Button.Group>
            </div>
          )
          : (
            <div className={isMobile ? 'mt-20' : 'center-align'}>
              <Button primary fluid={isMobile ? true : ''} content="Transfer Funds Via ACH" type="button" onClick={() => renderTransferStep('ACH')} />
              <Responsive maxWidth={768} as="br" />
              <Button primary fluid={isMobile ? true : ''} content="Wire Funds" onClick={() => renderTransferStep('WIRE')} />
            </div>
          )
        }
      </>
    </>
  );
}

export default inject('investmentStore', 'investmentLimitStore', 'uiStore', 'accreditationStore', 'campaignStore', 'portfolioStore', 'userDetailsStore')(withRouter(observer(TransferRequest)));
