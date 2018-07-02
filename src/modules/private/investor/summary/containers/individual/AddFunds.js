import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Header, Form, Button } from 'semantic-ui-react';

import { FormInput } from '../../../../../../theme/form';

@inject('accountStore', 'individualAccountStore')
@observer
export default class AddFunds extends Component {
  componentDidMount() {
    this.props.individualAccountStore.setStepToBeRendered(1);
  }
  doNotDepositMoneyNow = () => {
    this.props.individualAccountStore.setDepositMoneyNow(false);
    this.props.individualAccountStore.setStepToBeRendered(2);
  }
  handleSubmitForm = (e) => {
    e.preventDefault();
    this.props.individualAccountStore.setDepositMoneyNow(true);
    this.props.individualAccountStore.setStepToBeRendered(2);
  }
  render() {
    const { formAddFunds, addFundChange } = this.props.accountStore;
    return (
      <div>
        <Header as="h1" textAlign="center">Add funds</Header>
        <Header as="h4" textAlign="center">How much would you like to deposit into your account today?</Header>
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
            <Button className="theme-link" onClick={() => this.doNotDepositMoneyNow()}>I don`t want to deposit any money now</Button>
          </div>
        </Form>
      </div>
    );
  }
}
