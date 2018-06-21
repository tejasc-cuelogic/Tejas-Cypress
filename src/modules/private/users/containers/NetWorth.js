import React, { Component } from 'react';
import { Header, Form, Modal } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import find from 'lodash/find';
import { FormRadioGroup } from '../../../../theme/form/FormElements';

@inject('iraAccountStore')
@observer
export default class NetWorth extends Component {
  getOptionDetails = () => {
    const { value, values } = this.props.iraAccountStore.formAccTypes.fields.iraAccountType;
    return find(values, v => v.value === value).description;
  };
  render() {
    const { formAccTypes, AccTypesChange } = this.props.iraAccountStore;
    return (
      <Modal open closeIcon onClose={this.handleCloseModal} size="tiny" closeOnDimmerClick={false}>
        <Modal.Content>
          <Header as="h1" textAlign="center">What is your net worth?</Header>
          <Header as="h4" textAlign="center">
            Lorem psum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
          </Header>
          <Form error className="account-type-tab">
            <FormRadioGroup
              fielddata={formAccTypes.fields.iraAccountType}
              name="iraAccountType"
              changed={AccTypesChange}
            />
            <div className="option-details">
              {this.getOptionDetails()}
            </div>
          </Form>
        </Modal.Content>
      </Modal>
    );
  }
}
