import React, { Component } from 'react';
import { Header, Form } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';

import { FormRadioGroup, MaskedInput } from '../../../../../../../theme/form';

@inject('entityAccountStore')
@observer
export default class AccountType extends Component {
  render() {
    const { TRUST_INFO_FRM, trustInfoChange, entityInfoDateChange } = this.props.entityAccountStore;
    return (
      <div>
        <Header as="h3" textAlign="center">Is Entity a trust?</Header>
        <Form error className="account-type-tab">
          <FormRadioGroup
            fielddata={TRUST_INFO_FRM.fields.isTrust}
            name="isTrust"
            changed={trustInfoChange}
            containerclassname="button-radio center-align"
          />
          {TRUST_INFO_FRM.fields.isTrust.value &&
          <div className="field-wrap">
            <MaskedInput
              name="trustDate"
              fielddata={TRUST_INFO_FRM.fields.trustDate}
              format="##/##/####"
              changed={values => entityInfoDateChange(values.formattedValue)}
              dateOfBirth
              showerror
            />
          </div>
          }
        </Form>
      </div>
    );
  }
}
