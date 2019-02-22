import React, { Component } from 'react';
import Aux from 'react-aux';
// import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Header, Form, Message, Divider } from 'semantic-ui-react';
import { MaskedInput } from '../../../../../../../theme/form';
import Helper from '../../../../../../../helper/utility';

@inject('entityAccountStore')
@observer
export default class FinancialInformation extends Component {
  componentWillMount() {
    const { FIN_INFO_FRM, maskedFinInfoChange } = this.props.entityAccountStore;
    if ((FIN_INFO_FRM.fields.investmentLimit.value === undefined || (FIN_INFO_FRM.fields.investmentLimit.value === '' || (FIN_INFO_FRM.fields.netWorth.value !== '' && FIN_INFO_FRM.fields.annualIncome.value !== ''))) && !(FIN_INFO_FRM.fields.netWorth.value === '' && FIN_INFO_FRM.fields.income.value === '')) {
      maskedFinInfoChange({ value: { floatValue: FIN_INFO_FRM.fields.netWorth.value }, name: 'netWorth' });
    }
  }
  render() {
    const { FIN_INFO_FRM, maskedFinInfoChange } = this.props.entityAccountStore;
    return (
      <Aux>
        <Header as="h3" textAlign="center">Calculating your investment limit</Header>
        <p className="center-align">
          Your net worth and annual income are used to determine your 12-month investment limit.{' '}
          <a target="_blank" rel="noopener noreferrer" href="https://www.nextseed.com/education-center/for-investors/investment-limits-explained/investment-limit-calcuator/" className="link">How is this calculated?</a>
        </p>
        <Form error>
          <div className="field-wrap">
            {['netWorth', 'income'].map(field => (
              <MaskedInput
                key={field}
                name={field}
                placeHolder={field === 'income' ? '$ 1,000,000' : '$ 5,000'}
                fielddata={FIN_INFO_FRM.fields[field]}
                maxLength={FIN_INFO_FRM.fields[field].maxLength}
                changed={values => maskedFinInfoChange(values, field)}
                currency
                prefix="$"
                showerror
              />
            ))}
            <Divider hidden />
            <p className="grey-header">Your investment limit:
              <span className={`large ml-10 ${FIN_INFO_FRM.fields.investmentLimit.value < 5000 && FIN_INFO_FRM.fields.investmentLimit.value !== '' ? 'negative-text' : 'highlight-text'}`} >
                {Helper.CurrencyFormat(FIN_INFO_FRM.fields.investmentLimit.value)}
              </span>
            </p>
            {/* <p className="grey-header">Your investment limit:<span className="highlight-text
          large ml-10">{Helper.CurrencyFormat(FIN_INFO_FRM.fields.investmentLimit.value)}</span></p>
          */}
          </div>
          {(FIN_INFO_FRM.fields.investmentLimit.value < 5000 && FIN_INFO_FRM.fields.investmentLimit.value !== '') &&
          <Message error className="center-align">
            Based on your net assets and annual income, your 12-month investment
            limit is {Helper.CurrencyFormat(FIN_INFO_FRM.fields.investmentLimit.value)}.
            This is below the $5,000 minimum opening deposit for IRA accounts.
          </Message>
          }
        </Form>
      </Aux>
    );
  }
}
