import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Form, Header, Message } from 'semantic-ui-react';
import { FormRadioGroup, FormInput } from '../../../../../../theme/form';
import { ListErrors } from '../../../../../../theme/shared';

@inject('investorProfileStore', 'uiStore')
@observer
export default class BrokerageEmployment extends Component {
  render() {
    const { BROKERAGE_EMPLOYMENT_FORM, employmentChange } = this.props.investorProfileStore;
    const { errors } = this.props.uiStore;
    return (
      <div>
        <Header as="h3" textAlign="center">Brokerage employment</Header>
        <p className="center-align mb-50">Do you (or an immediate family member) work for
         another U.S. brokerage? If you do not know what this means,
         it likely does not apply to you
        </p>
        {errors &&
        <Message error textAlign="left">
          <ListErrors errors={errors.message ? [errors.message] : [errors]} />
        </Message>
        }
        <Form error>
          <FormRadioGroup
            fielddata={BROKERAGE_EMPLOYMENT_FORM.fields.brokerageEmployment}
            name="brokerageEmployment"
            changed={(e, result) => employmentChange(e, 'BROKERAGE_EMPLOYMENT_FORM', result)}
            containerclassname="button-radio center-align"
            classname="center-align"
            showerror
          />
          {BROKERAGE_EMPLOYMENT_FORM.fields.brokerageEmployment.value === 'yes' &&
          <div className="field-wrap">
            <Form.Group widths="equal">
              <FormInput
                key="brokerageFirmName"
                fielddata={BROKERAGE_EMPLOYMENT_FORM.fields.brokerageFirmName}
                name="brokerageFirmName"
                changed={(e, result) => employmentChange(e, 'BROKERAGE_EMPLOYMENT_FORM', result)}
                showerror
              />
            </Form.Group>
          </div>
          }
        </Form>
      </div>
    );
  }
}
