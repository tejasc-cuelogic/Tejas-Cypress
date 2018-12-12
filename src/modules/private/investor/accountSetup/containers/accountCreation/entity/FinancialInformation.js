import React, { Component } from 'react';
import Aux from 'react-aux';
import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Header, Form, Message, Divider } from 'semantic-ui-react';
import { MaskedInput } from '../../../../../../../theme/form';
import Helper from '../../../../../../../helper/utility';

@inject('entityAccountStore', 'investmentLimitStore')
@observer
export default class FinancialInformation extends Component {
  componentWillMount() {
    const { FIN_INFO_FRM, maskedFinInfoChange } = this.props.entityAccountStore;
    if ((FIN_INFO_FRM.fields.investmentLimit.value === undefined || (FIN_INFO_FRM.fields.investmentLimit.value === '' || (FIN_INFO_FRM.fields.netAssets.value !== '' && FIN_INFO_FRM.fields.cfInvestment.value !== ''))) && !(FIN_INFO_FRM.fields.netAssets.value === '' && FIN_INFO_FRM.fields.cfInvestment.value === '')) {
      maskedFinInfoChange({ value: { floatValue: FIN_INFO_FRM.fields.netAssets.value }, name: 'netAssets' });
    }
  }
  render() {
    const { FIN_INFO_FRM, maskedFinInfoChange } = this.props.entityAccountStore;
    return (
      <Aux>
        <Header as="h3" textAlign="center">Calculating your investment limit</Header>
        <p className="center-align">
          Your net worth and annual income are used to determine your 12-month investment limit.{' '}
          <Link to="/app/summary/account-creation/entity" className="link">How is this calculated?</Link>
        </p>
        <Form error>
          <div className="field-wrap">
            {['netAssets', 'cfInvestment'].map(field => (
              <MaskedInput
                key={field}
                name={field}
                placeHolder={field === 'netAssets' ? '$ 1,000,000' : '$ 5,000'}
                fielddata={FIN_INFO_FRM.fields[field]}
                maxLength={FIN_INFO_FRM.fields[field].maxLength}
                changed={values => maskedFinInfoChange(values, field)}
                currency
                prefix="$"
                showerror
              />
            ))}
            <Divider hidden />
            <p className="grey-header">Your investment limit: <span className="highlight-text large ml-10">{Helper.CurrencyFormat(FIN_INFO_FRM.fields.investmentLimit.value)}</span></p>
          </div>
          {(FIN_INFO_FRM.fields.investmentLimit.value < 5000 && FIN_INFO_FRM.fields.investmentLimit.value !== '') &&
          <Message error textAlign="left">
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
