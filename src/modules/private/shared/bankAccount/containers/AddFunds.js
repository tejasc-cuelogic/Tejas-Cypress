import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Header, Form, Button } from 'semantic-ui-react';

import { FormInput } from '../../../../../theme/form';

@inject('bankAccountStore', 'individualAccountStore')
@observer
export default class AddFunds extends Component {
  componentDidMount() {
    this.props.individualAccountStore.setStepToBeRendered(1);
  }
  doNotDepositMoneyNow = () => {
    this.props.bankAccountStore.setDepositMoneyNow(false);
    this.props.individualAccountStore.setStepToBeRendered(2);
  }
  handleSubmitForm = (e) => {
    e.preventDefault();
    this.props.bankAccountStore.setDepositMoneyNow(true);
    this.props.individualAccountStore.setStepToBeRendered(2);
  }
  render() {
    const { formAddFunds, addFundChange } = this.props.bankAccountStore;
    return (
      <div>
        <Header as="h3" textAlign="center">Add funds</Header>
        <p className="center-align">How much would you like to deposit into your account today?</p>
        <Form error onSubmit={this.handleSubmitForm}>
          <div className="field-wrap">
            <FormInput
              name="value"
              fielddata={formAddFunds.fields.value}
              changed={addFundChange}
              maxLength={formAddFunds.fields.value.maxLength}
              prefix="$"
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
