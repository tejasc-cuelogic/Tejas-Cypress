import React, { Component } from 'react';
import { Header, Form, Divider } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import find from 'lodash/find';
import { FormRadioGroup, FormArrowButton } from '../../../../../../../theme/form';

const isMobile = document.documentElement.clientWidth < 768;

@inject('iraAccountStore', 'uiStore')
@observer
export default class AccountType extends Component {
  getOptionDetails = () => {
    const { value, values } = this.props.iraAccountStore.ACC_TYPES_FRM.fields.iraAccountType;
    return find(values, v => v.value === value) ? find(values, v => v.value === value).description : '';
  };

  handleArrowButtonClick = () => {
    const { createAccount, stepToBeRendered } = this.props.iraAccountStore;
    const { multiSteps } = this.props.uiStore;
    createAccount(multiSteps[stepToBeRendered]);
  }

  render() {
    const { ACC_TYPES_FRM, accTypesChange } = this.props.iraAccountStore;
    return (
      <div>
        <Header as="h3" textAlign={isMobile ? 'mb-20' : 'center'}>Which type of IRA account would you like to open?</Header>
        {!isMobile && <Divider section hidden />}
        <Form error className={isMobile ? '' : 'account-type-tab'}>
          {isMobile
            ? (
            <FormArrowButton
              fielddata={ACC_TYPES_FRM.fields.iraAccountType}
              name="iraAccountType"
              changed={accTypesChange}
              action={this.handleArrowButtonClick}
            />
            )
            : (
              <>
                <FormRadioGroup
                  fielddata={ACC_TYPES_FRM.fields.iraAccountType}
                  name="iraAccountType"
                  changed={accTypesChange}
                  containerclassname={`${isMobile ? 'two wide' : ''} button-radio center-align`}
                />
                {!isMobile && <Divider section hidden />}
                <div className={`${isMobile ? '' : 'option-details'} grey-header`}>
                  {this.getOptionDetails()}
                </div>
              </>
            )
          }
        </Form>
      </div>
    );
  }
}
