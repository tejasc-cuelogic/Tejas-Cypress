import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Header, Form, Button } from 'semantic-ui-react';

import { MaskedInput2 } from '../../../../../theme/form';

@inject('bankAccountStore', 'individualAccountStore', 'entityAccountStore', 'accountStore')
@observer
export default class AddFunds extends Component {
  componentDidMount() {
    this.props.individualAccountStore.setStepToBeRendered(1);
  }
  doNotDepositMoneyNow = () => {
    this.props.bankAccountStore.setDepositMoneyNow(false);
    if (this.props.accountStore.investmentAccType === 'individual') {
      this.props.individualAccountStore.setStepToBeRendered(2);
    }
    if (this.props.accountStore.investmentAccType === 'entity') {
      this.props.entityAccountStore.setStepToBeRendered(6);
    }
  }
  handleSubmitForm = (e) => {
    e.preventDefault();
    this.props.bankAccountStore.setDepositMoneyNow(true);
    if (this.props.accountStore.investmentAccType === 'individual') {
      this.props.individualAccountStore.setStepToBeRendered(2);
    }
    if (this.props.accountStore.investmentAccType === 'entity') {
      this.props.entityAccountStore.setStepToBeRendered(6);
    }
  }
  render() {
    const { formAddFunds, addFundChange } = this.props.bankAccountStore;
    return (
      <div>
        <Header as="h3" textAlign="center">Add funds</Header>
        <p className="center-align">How much would you like to deposit into your account today?</p>
        <Form error onSubmit={this.handleSubmitForm}>
          <div className="field-wrap">
            <MaskedInput2
              name="value"
              type="tel"
              currency
              placeholder="$ 15,000"
              fielddata={formAddFunds.fields.value}
              changed={values => addFundChange(values, 'value')}
              maxLength={formAddFunds.fields.value.maxLength}
              prefix="$ "
            />
          </div>
          <div className="center-align">
            <Button primary size="large" disabled={!formAddFunds.meta.isValid}>Confirm</Button>
          </div>
          <div className="center-align">
            <Button className="cancel-link" onClick={() => this.doNotDepositMoneyNow()}>I don`t want to deposit any money now</Button>
          </div>
        </Form>
      </div>
    );
  }
}
