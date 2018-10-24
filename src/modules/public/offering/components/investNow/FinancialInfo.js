import React, { Component } from 'react';
import Aux from 'react-aux';
import { Link } from 'react-router-dom';
import { Header, Form, Popup, Icon, Divider } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { MaskedInput } from '../../../../../theme/form';

@inject('investmentStore', 'investmentLimitStore')
@observer
class FinancialInfo extends Component {
  render() {
    const {
      INVESTMONEY_FORM,
      investMoneyChange,
      estReturnVal,
      calculateEstimatedReturn,
    } = this.props.investmentStore;
    const { getCurrentLimitForAccount } = this.props.investmentLimitStore;
    return (
      <Aux>
        <Header as="h3" textAlign="center">How much would you like to invest?</Header>
        <Header as="h4" textAlign="center">
          Your investment limit: ${(getCurrentLimitForAccount) || 0}
          <Popup
            wide
            trigger={<Icon className="ns-help-circle" color="green" />}
            content="This calculates"
            position="top center"
          />
          <Link to="/" className="link"><small>Update</small></Link>
        </Header>
        <Form error size="huge">
          <MaskedInput
            hidelabel
            name="investmentAmount"
            currency
            prefix="$ "
            fielddata={INVESTMONEY_FORM.fields.investmentAmount}
            changed={values => investMoneyChange(values, 'investmentAmount')}
          />
        </Form>
        <Divider hidden />
        <p>
          <b>Total Investment Return: {estReturnVal === '-' ? calculateEstimatedReturn() : estReturnVal}</b>
          <Popup
            wide
            trigger={<Icon name="ns-help-circle" color="green" />}
            content="This calculates the total amount that the issuer agrees to pay you under the note purchase agrrement, based on what you enter above. Payment is not guaranteed or ensured and investors may lose some or all of the principal invested. "
            position="top center"
          />
        </p>
        <p>+ 2 Private VIP Launch Party Invitations</p>
      </Aux>
    );
  }
}

export default FinancialInfo;
