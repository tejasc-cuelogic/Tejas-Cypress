import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Header, Form, Button } from 'semantic-ui-react';

import { FormInput } from '../../../../theme/form/FormElements';

@inject('individualAccountStore')
@observer
export default class AddFunds extends Component {
  handleSubmitForm = (e) => {
    e.preventDefault();
  }
  render() {
    const { formAddFunds, addFundChange } = this.props.individualAccountStore;
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
              prefix="$"
            />
          </div>
          <div className="center-align">
            <Button primary size="large" disabled={!formAddFunds.meta.isValid}>Confirm</Button>
          </div>
          <div className="center-align">
            <Button className="theme-link" onClick={() => this.props.individualAccountStore.setStepToBeRendered(2)}>I dnt want to deposit any money now</Button>
          </div>
        </Form>
      </div>
    );
  }
}
