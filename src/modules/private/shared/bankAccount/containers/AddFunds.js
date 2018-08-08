import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Header, Form, Button } from 'semantic-ui-react';

import { MaskedInput2 } from '../../../../../theme/form';
import AccCreationHelper from '../../../investor/accountSetup/containers/accountCreation/helper';

@inject('bankAccountStore', 'individualAccountStore', 'entityAccountStore', 'accountStore', 'iraAccountStore')
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
            <Button type="button" className="cancel-link" onClick={() => this.doNotDepositMoneyNow()}>I will do this later</Button>
          </div>
        </Form>
      </div>
    );
  }
}
