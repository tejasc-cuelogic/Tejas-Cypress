import React, { Component } from 'react';
import Aux from 'react-aux';
import { Header, Form, Popup, Icon, Divider, Button } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { MaskedInput } from '../../../../../theme/form';

@inject('investmentStore', 'userDetailsStore', 'campaignStore')
@observer
class FinancialInfo extends Component {
  render() {
    const {
      investmentAmount,
      INVESTMONEY_FORM,
      investMoneyChange,
      estReturnVal,
      calculateEstimatedReturn,
      validBonusRewards,
      validateInvestmentAmountInOffering,
    } = this.props.investmentStore;
    const { userDetails } = this.props.userDetailsStore;
    return (
      <Aux>
        <Header as="h3" textAlign="center">How much would you like to invest?</Header>
        <Header as="h4" textAlign="center">
          Your investment limit: ${(userDetails && userDetails.limits &&
            userDetails.limits.limit) || 0}
          <Popup
            wide
            trigger={<Icon name="help circle" color="green" />}
            content="This calculates"
            position="top center"
          />
          <Button className="link-button">Update</Button>
        </Header>
        <Form error size="huge">
          <MaskedInput
            hidelabel
            name="investmentAmount"
            currency
            prefix="$ "
            fielddata={INVESTMONEY_FORM.fields.investmentAmount}
            changed={values => investMoneyChange(values, 'investmentAmount')}
            onblur={validateInvestmentAmountInOffering}
          />
        </Form>
        <Divider hidden />
        {
          investmentAmount &&
          <p>
            <b>Total Investment Return: {estReturnVal === '-' ? calculateEstimatedReturn() : estReturnVal}</b>
            <Popup
              wide
              trigger={<Icon name="help circle" color="green" />}
              content="This calculates the total amount that the issuer agrees to pay you under the note purchase agrrement, based on what you enter above. Payment is not guaranteed or ensured and investors may lose some or all of the principal invested. "
              position="top center"
            />
          </p>
        }
        {
          validBonusRewards.map(reward => (
            // <p>+ 2 Private VIP Launch Party Invitations</p>
            <p>+ {reward.title}</p>
          ))
        }
      </Aux>
    );
  }
}

export default FinancialInfo;
