import React from 'react';
import Aux from 'react-aux';
// import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Header, Form, Divider, Message } from 'semantic-ui-react';
import { MaskedInput } from '../../../../../../../theme/form';
import Helper from '../../../../../../../helper/utility';

@inject('iraAccountStore', 'investmentLimitStore')
@observer
export default class FinancialInformation extends React.Component {
  componentWillMount() {
    const { FIN_INFO_FRM, finInfoChange } = this.props.iraAccountStore;
    if ((FIN_INFO_FRM.fields.investmentLimit.value === undefined || (FIN_INFO_FRM.fields.investmentLimit.value === '' || (FIN_INFO_FRM.fields.netWorth.value !== '' && FIN_INFO_FRM.fields.income.value !== ''))) && !(FIN_INFO_FRM.fields.netWorth.value === '' && FIN_INFO_FRM.fields.income.value === '')) {
      finInfoChange({ value: { floatValue: FIN_INFO_FRM.fields.netWorth.value }, name: 'netWorth' });
    }
  }
  render() {
    const { FIN_INFO_FRM, finInfoChange } = this.props.iraAccountStore;
    return (
      <Aux>
        <Header as="h3" textAlign="center">Calculating your investment limit</Header>
        <p className="center-align">Your net worth and annual income are used to determine your 12-month investment limit under Regulation Crowdfunding.{' '}
          <a target="_blank" rel="noopener noreferrer" href={`${window.location.origin}/resources/education-center/investor/investment-limit-calcuator/`} className="link">How is this calculated?</a>
        </p>
        <Form error>
          <div className="field-wrap">
            {
              ['netWorth', 'income'].map(field => (
                <MaskedInput
                  key={field}
                  type="tel"
                  fielddata={FIN_INFO_FRM.fields[field]}
                  name={field}
                  changed={values => finInfoChange(values, field)}
                  prefix="$ "
                  hoverable={field === 'netWorth'}
                  maxLength={FIN_INFO_FRM.fields[field].maxLength}
                  currency
                  allowNegative={false}
                />
              ))
            }
            <Divider hidden />
            <p className="grey-header">Your investment limit:
              <span className={`large ml-10 ${FIN_INFO_FRM.fields.investmentLimit.value < 5000 && FIN_INFO_FRM.fields.investmentLimit.value !== '' ? 'negative-text' : 'highlight-text'}`} >
                {Helper.CurrencyFormat(FIN_INFO_FRM.fields.investmentLimit.value)}
              </span>
            </p>
          </div>
          {(FIN_INFO_FRM.fields.investmentLimit.value < 5000 &&
            FIN_INFO_FRM.fields.investmentLimit.value !== '') &&
            <Message error className="center-align">
              Based on your reported Net Worth and Annual Income, your 12-month investment limit
              under Regulation Crowdfunding is below the $5,000 minimum opening
              deposit for IRA accounts.
            </Message>
          }
        </Form>
      </Aux>
    );
  }
}
