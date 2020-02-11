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
        <Header as="h4">Calculating your investment limit</Header>
        <p>
          Your net worth and annual income are used to determine your 12-month investment limit under Regulation Crowdfunding.
        </p>
        <Form error className={!isMobile && 'mt-40'}>
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
          <p className="mb-0"><b>Your investment limit:</b></p>
          <p className="mt-0 mb-40">
            <b>{Helper.CurrencyFormat(FIN_INFO_FRM.fields.investmentLimit.value)}</b>
          </p>
          <a target="_blank" rel="noopener noreferrer" href={`${window.location.origin}/resources/education-center/investor/investment-limit-calcuator/`} className={`${isMobile ? 'mt-20' : ''} link`}>How is this calculated?</a>
          <div className="mt-30">
            <Button fluid={isMobile} primary className="relaxed" content="Continue" disabled={!FIN_INFO_FRM.meta.isValid} onClick={this.handleContinueButton} />
          </div>
        </Form>
      </>
    );
  }
}
