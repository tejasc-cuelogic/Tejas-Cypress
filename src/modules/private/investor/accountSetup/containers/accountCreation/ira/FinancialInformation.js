import React from 'react';
// import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Header, Form, Divider } from 'semantic-ui-react';
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
        <Header as="h3" textAlign={isMobile ? '' : 'center'}>Calculating your investment limit</Header>
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
                  toolTipOnLabel
                />
              ))
            }
            <Divider hidden />
            <p className="grey-header">Your investment limit:
              <span className="large ml-10 highlight-text">
                {Helper.CurrencyFormat(FIN_INFO_FRM.fields.investmentLimit.value)}
              </span>
            </p>
            <a target="_blank" rel="noopener noreferrer" href={`${window.location.origin}/resources/education-center/investor/investment-limit-calcuator/`} className={`${isMobile ? 'mt-20' : ''} link`}>How is this calculated?</a>
          </div>
        </Form>
      </>
    );
  }
}
