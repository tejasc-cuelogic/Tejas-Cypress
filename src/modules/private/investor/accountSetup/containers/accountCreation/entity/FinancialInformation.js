import React, { Component } from 'react';
// import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Header, Form, Message, Divider, Button } from 'semantic-ui-react';
import { MaskedInput } from '../../../../../../../theme/form';
import Helper from '../../../../../../../helper/utility';

const isMobile = document.documentElement.clientWidth < 768;

@inject('entityAccountStore', 'investmentLimitStore', 'uiStore')
@observer
export default class FinancialInformation extends Component {
  constructor(props) {
    super(props);
    const { FIN_INFO_FRM, maskedFinInfoChange } = this.props.entityAccountStore;
    if ((FIN_INFO_FRM.fields.investmentLimit.value === undefined || (FIN_INFO_FRM.fields.investmentLimit.value === '' || (FIN_INFO_FRM.fields.netAssets.value !== '' && FIN_INFO_FRM.fields.annualIncome.value !== ''))) && !(FIN_INFO_FRM.fields.netAssets.value === '' && FIN_INFO_FRM.fields.annualIncome.value === '')) {
      maskedFinInfoChange({ value: { floatValue: FIN_INFO_FRM.fields.netAssets.value }, name: 'netAssets' });
    }
    this.props.investmentLimitStore.setFieldValue('investedAmount', 0);
  }

  handleContinueButton = () => {
    const { createAccount, stepToBeRendered } = this.props.entityAccountStore;
    const { multiSteps } = this.props.uiStore;
    createAccount(multiSteps[stepToBeRendered]);
  }

  render() {
    const { FIN_INFO_FRM, maskedFinInfoChange } = this.props.entityAccountStore;
    return (
      <>
      <Header as="h4" textAlign={isMobile ? '' : 'center'}>Calculating your investment limit</Header>
        <p className={isMobile ? '' : 'center-align'}>
          Your net worth and annual income are used to determine your 12-month
          investment limit under Regulation Crowdfunding.
        </p>
        <Form error>
          <div className={isMobile ? '' : 'field-wrap'}>
            {['netAssets', 'annualIncome'].map(field => (
              <MaskedInput
                key={field}
                name={field}
                placeHolder={field === 'annualIncome' ? '$ 1,000,000' : '$ 5,000'}
                fielddata={FIN_INFO_FRM.fields[field]}
                maxLength={FIN_INFO_FRM.fields[field].maxLength}
                changed={values => maskedFinInfoChange(values, field)}
                currency
                prefix="$"
                allowNegative={false}
                showerror
              />
            ))}
            <Divider hidden />
            <p className="grey-header">
              {isMobile ? <b>Your investment limit:</b> : 'Your investment limit:'}
              {isMobile && <br />}
              <span className={`${isMobile ? '' : 'large ml-10'} ${FIN_INFO_FRM.fields.investmentLimit.value < 5000 && FIN_INFO_FRM.fields.investmentLimit.value !== '' ? 'negative-text' : 'highlight-text'}`}>
                {Helper.CurrencyFormat(FIN_INFO_FRM.fields.investmentLimit.value)}
              </span>
            </p>
            {/* <p className="grey-header">Your investment limit:<span className="highlight-text
          large ml-10">{Helper.CurrencyFormat(FIN_INFO_FRM.fields.investmentLimit.value)}</span></p>
          */}
            <a target="_blank" rel="noopener noreferrer" href={`${window.location.origin}/resources/education-center/investor/investment-limit-calcuator/`} className={`${isMobile ? 'mt-20 mb-20' : ''} link`}>How is this calculated?</a>
          </div>
          {(FIN_INFO_FRM.fields.investmentLimit.value < 5000 && FIN_INFO_FRM.fields.investmentLimit.value !== '')
          && (
          <Message error className={isMobile ? '' : 'center-align'}>
            Based on your entity&apos;s net assets and annual income, your 12-month investment
            limit is {Helper.CurrencyFormat(FIN_INFO_FRM.fields.investmentLimit.value)}.
            This is below the $5,000 minimum opening deposit.
          </Message>
          )
          }
          {isMobile && (
              <Button fluid primary className="relaxed" content="Continue" disabled={!FIN_INFO_FRM.meta.isValid} onClick={this.handleContinueButton} />
          )
          }
        </Form>
      </>
    );
  }
}
