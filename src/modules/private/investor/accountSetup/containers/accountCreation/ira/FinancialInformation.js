import React from 'react';
// import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Header, Form, Divider, Button } from 'semantic-ui-react';
import { MaskedInput } from '../../../../../../../theme/form';
import Helper from '../../../../../../../helper/utility';

const isMobile = document.documentElement.clientWidth < 768;

@inject('iraAccountStore', 'investmentLimitStore', 'uiStore')
@observer
export default class FinancialInformation extends React.Component {
  constructor(props) {
    super(props);
    const { FIN_INFO_FRM, finInfoChange } = this.props.iraAccountStore;
    if ((FIN_INFO_FRM.fields.investmentLimit.value === undefined || (FIN_INFO_FRM.fields.investmentLimit.value === '' || (FIN_INFO_FRM.fields.netWorth.value !== '' && FIN_INFO_FRM.fields.income.value !== ''))) && !(FIN_INFO_FRM.fields.netWorth.value === '' && FIN_INFO_FRM.fields.income.value === '')) {
      finInfoChange({ value: { floatValue: FIN_INFO_FRM.fields.netWorth.value }, name: 'netWorth' });
    }
    this.props.investmentLimitStore.setFieldValue('investedAmount', 0);
  }

  handleContinueButton = () => {
    const { createAccount, stepToBeRendered } = this.props.iraAccountStore;
    const { multiSteps } = this.props.uiStore;
    createAccount(multiSteps[stepToBeRendered]);
  }

  render() {
    const { FIN_INFO_FRM, finInfoChange } = this.props.iraAccountStore;
    return (
      <>
        <Header as="h4" textAlign={isMobile ? '' : 'center'}>Calculating your investment limit</Header>
        <p className={isMobile ? '' : 'center-align'}>
Your net worth and annual income are used to determine your 12-month investment limit under Regulation Crowdfunding.
        </p>
        <Form error>
          <div className={isMobile ? '' : 'field-wrap'}>
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
                  showerror
                />
              ))
            }
            <Divider hidden />
            <p className="grey-header">
              {isMobile ? <b>Your investment limit:</b> : 'Your investment limit:'}
              {isMobile && <br />}
              <b>
                <span className={`${isMobile ? '' : 'large ml-10'} ${FIN_INFO_FRM.fields.investmentLimit.value < 5000 && FIN_INFO_FRM.fields.investmentLimit.value !== '' ? 'negative-text' : ''}`}>
                  {Helper.CurrencyFormat(FIN_INFO_FRM.fields.investmentLimit.value)}
                </span>
              </b>
            </p>
            <a target="_blank" rel="noopener noreferrer" href={`${window.location.origin}/resources/education-center/investor/investment-limit-calcuator/`} className={`${isMobile ? 'mt-20' : ''} link`}>How is this calculated?</a>
          </div>
          {(FIN_INFO_FRM.fields.investmentLimit.value < 5000
            && FIN_INFO_FRM.fields.investmentLimit.value !== '')
            && (
            <p className={`${isMobile ? '' : 'center-align'} error`}>
              Based on your reported Net Worth and Annual Income, your 12-month investment limit
              under Regulation Crowdfunding is below the $5,000 minimum opening
              deposit for IRA accounts.
            </p>
            )
          }
          {isMobile && (
              <Button fluid primary className="relaxed mt-20" content="Continue" disabled={!FIN_INFO_FRM.meta.isValid} onClick={this.handleContinueButton} />
          )
          }
        </Form>
      </>
    );
  }
}
