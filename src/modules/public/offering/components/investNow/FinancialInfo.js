import React, { Component } from 'react';
import Aux from 'react-aux';
import { Route, withRouter } from 'react-router-dom';
import { Header, Form, Popup, Icon, Divider } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { MaskedInput } from '../../../../../theme/form';
import InvestmentLimit from './financialInfo/InvestmentLimit';
import OfferingInvestDetails from './financialInfo/OfferingInvestDetails';
import ChangeInvestmentLimit from './ChangeInvestmentLimit';

@withRouter
@inject('investmentStore', 'userDetailsStore', 'investmentLimitStore', 'portfolioStore')
@observer
class FinancialInfo extends Component {
  render() {
    const {
      investmentAmount,
      isValidInvestAmtInOffering,
      INVESTMONEY_FORM,
      investMoneyChange,
      estReturnVal,
      calculateEstimatedReturn,
      validBonusRewards,
      setStepToBeRendered,
      investAccTypes,
      validateInvestmentAmountInOffering,
      getDiffInvestmentLimitAmount,
    } = this.props.investmentStore;
    const { getInvestorAccountById } = this.props.portfolioStore;
    const { getCurrentLimitForAccount } = this.props.investmentLimitStore;
    const { match, refLink } = this.props;
    return (
      <Aux>
        <Route path={`${match.url}/change-investment-limit`} render={props => <ChangeInvestmentLimit refLink={match.url} {...props} />} />
        <Header as="h3" textAlign="center">{this.props.changeInvest ? 'Update your investment amount' : 'How much would you like to invest?'}</Header>
        {this.props.changeInvest &&
          <OfferingInvestDetails
            offering={getInvestorAccountById}
            accType={investAccTypes.value}
            changeInvest={this.props.changeInvest}
            match={this.props.match}
            getCurrentLimitForAccount={getCurrentLimitForAccount}
            setStepToBeRendered={setStepToBeRendered}
          />
        }
        {!this.props.changeInvest &&
          <InvestmentLimit
            changeInvest={this.props.changeInvest}
            match={this.props.match}
            refLink={refLink}
            getCurrentLimitForAccount={getCurrentLimitForAccount}
            setStepToBeRendered={setStepToBeRendered}
            diffLimitAmount={getDiffInvestmentLimitAmount}
          />
        }
        <Form error size="huge">
          <MaskedInput
            hidelabel
            name="investmentAmount"
            currency
            prefix="$ "
            fielddata={INVESTMONEY_FORM.fields.investmentAmount}
            changed={values => investMoneyChange(values, 'investmentAmount')}
            // onblur={validateInvestmentAmountInOffering}
            onkeypress={validateInvestmentAmountInOffering}
          />
        </Form>
        {this.props.changeInvest &&
          <InvestmentLimit
            changeInvest={this.props.changeInvest}
            match={this.props.match}
            getCurrentLimitForAccount={getCurrentLimitForAccount}
            setStepToBeRendered={setStepToBeRendered}
            diffLimitAmount={getDiffInvestmentLimitAmount}
          />
        }
        <Divider hidden />
        {isValidInvestAmtInOffering &&
          investmentAmount ?
            <p>
              <b>Total Investment Return: {estReturnVal === '-' ? calculateEstimatedReturn() : estReturnVal}</b>
              <Popup
                wide
                trigger={<Icon name="help circle" color="green" />}
                content="This calculates the total amount that the issuer agrees to pay you under the note purchase agrrement, based on what you enter above. Payment is not guaranteed or ensured and investors may lose some or all of the principal invested. "
                position="top center"
              />
            </p>
          :
          null
        }
        {
          isValidInvestAmtInOffering &&
          validBonusRewards.map(reward => (
            <p>+ {reward.title}</p>
          ))
        }
      </Aux>
    );
  }
}

export default FinancialInfo;
