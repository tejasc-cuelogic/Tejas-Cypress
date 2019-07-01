import React, { Component } from 'react';
import { Header, Form } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { FormRadioGroup, MaskedInput } from '../../../../../../../theme/form';

const isMobile = document.documentElement.clientWidth < 768;

@inject('entityAccountStore')
@observer
export default class AccountType extends Component {
  render() {
    const { TRUST_INFO_FRM, trustInfoChange, entityInfoDateChange } = this.props.entityAccountStore;
    return (
      <div>
        <Header as="h4" textAlign={isMobile ? 'mb-half' : 'center'}>Is this entity a trust?</Header>
        <Form error className={`${isMobile ? 'mb-30 mt-0' : ''} account-type-tab`}>
          <FormRadioGroup
            fielddata={TRUST_INFO_FRM.fields.isTrust}
            name="isTrust"
            changed={trustInfoChange}
            containerclassname={`${isMobile ? 'two wide' : ''} button-radio center-align`}
          />
          {TRUST_INFO_FRM.fields.isTrust.value
          && (
          <div className={isMobile ? '' : 'field-wrap'}>
            <MaskedInput
              name="trustDate"
              fielddata={TRUST_INFO_FRM.fields.trustDate}
              format="##/##/####"
              changed={values => entityInfoDateChange(values.formattedValue)}
              dateOfBirth
              showerror
            />
          </div>
          )
          }
        </Form>
      </div>
    );
  }
}
