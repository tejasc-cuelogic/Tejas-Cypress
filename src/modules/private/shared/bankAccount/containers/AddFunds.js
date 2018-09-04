import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Header, Form, Button, Message } from 'semantic-ui-react';

import { MaskedInput } from '../../../../../theme/form';
import AccCreationHelper from '../../../investor/accountSetup/containers/accountCreation/helper';
import { ListErrors } from '../../../../../theme/shared';

@inject('bankAccountStore', 'individualAccountStore', 'entityAccountStore', 'accountStore', 'iraAccountStore', 'uiStore')
@observer
export default class AddFunds extends Component {
  componentDidMount() {
    this.props.individualAccountStore.setStepToBeRendered(1);
  }
  componentWillUnmount() {
    this.props.bankAccountStore.resetShowAddFunds();
  }
  doNotDepositMoneyNow = () => {
    this.props.bankAccountStore.setDepositMoneyNow(false);
    if (!this.props.bankAccountStore.formAddFunds.fields.value.error) {
      this.renderStep();
    }
  }
  handleSubmitForm = (e) => {
    e.preventDefault();
    this.props.bankAccountStore.setDepositMoneyNow(true);
    this.renderStep();
  }

  renderStep = () => {
    if (this.props.accountStore.investmentAccType === 'individual') {
      const individualSteps = AccCreationHelper.individualSteps();
      this.props.individualAccountStore.setStepToBeRendered(individualSteps.summary);
    }
    if (this.props.accountStore.investmentAccType === 'entity') {
      this.props.entityAccountStore.setStepToBeRendered(AccCreationHelper.entitySteps().summary);
    }
    if (this.props.accountStore.investmentAccType === 'ira') {
      this.props.iraAccountStore.setStepToBeRendered(AccCreationHelper.iraSteps().summary);
    }
  }

  render() {
    const { formAddFunds, addFundChange } = this.props.bankAccountStore;
    const { errors } = this.props.uiStore;

    return (
      <div>
        <Header as="h3" textAlign="center">Add funds</Header>
        <p className="center-align">How much would you like to deposit into your account today?</p>
        {errors &&
          <Message error>
            <ListErrors errors={[errors.message]} />
          </Message>
        }
        <Form error onSubmit={this.handleSubmitForm}>
          <div className="field-wrap">
            <MaskedInput
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
            <Button.Group vertical>
              <Button primary size="large" className="relaxed" disabled={!formAddFunds.meta.isValid}>Confirm</Button>
              <Button type="button" className="link-button cancel-link" onClick={() => this.doNotDepositMoneyNow()}>I will do this later</Button>
            </Button.Group>
          </div>
        </Form>
      </div>
    );
  }
}
