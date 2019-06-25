import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import Aux from 'react-aux';
import { Form, Header, Message, Divider, Responsive } from 'semantic-ui-react';
import { FormRadioGroup, FormInput } from '../../../../../../theme/form';
import { ListErrors } from '../../../../../../theme/shared';

@inject('investorProfileStore', 'uiStore')
@observer
export default class BrokerageEmployment extends Component {
  render() {
    const { BROKERAGE_EMPLOYMENT_FORM, employmentChange } = this.props.investorProfileStore;
    const { errors } = this.props.uiStore;
    return (
      <div className="center-align">
        <Header as="h3">Brokerage employment</Header>
        <Divider hidden />
        <p>
          Do you (or an immediate family member) work for a US-based{' '}
          <Responsive as={Aux} minWidth={1200}><br /></Responsive>securities brokerage firm?
        </p>
        <Divider hidden />
        <p className="mb-40">
          If you do not know what this means, it likely does not apply to you.
        </p>
        <Form error>
          <FormRadioGroup
            fielddata={BROKERAGE_EMPLOYMENT_FORM.fields.brokerageEmployment}
            name="brokerageEmployment"
            changed={(e, result) => employmentChange(e, 'BROKERAGE_EMPLOYMENT_FORM', result)}
            containerclassname="three wide button-radio center-align"
            showerror
          />
          {BROKERAGE_EMPLOYMENT_FORM.fields.brokerageEmployment.value === 'yes'
          && (
<div className="field-wrap left-align">
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
          )
          }
          {errors
          && (
<Message error className="mt-30">
            <ListErrors errors={errors.message ? [errors.message] : [errors]} />
          </Message>
          )
          }
        </Form>
      </div>
    );
  }
}
