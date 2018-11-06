import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Form, Header } from 'semantic-ui-react';
import { FormRadioGroup, FormInput } from '../../../../../../theme/form';

@inject('investorProfileStore')
@observer
export default class BrokerageEmployment extends Component {
  render() {
    const { BROKERAGE_EMPLOYMENT, employmentChange } = this.props.investorProfileStore;
    return (
      <div>
        <Header as="h3" textAlign="center">Brokerage employment</Header>
        <p className="center-align mb-50">Do you (or an immediate family member) work for
         another U.S. brokerage? If you do not know what this means,
         it likely does not apply to you
        </p>
        <Form error>
          <FormRadioGroup
            fielddata={BROKERAGE_EMPLOYMENT.fields.brokerageEmployment}
            name="brokerageEmployment"
            changed={employmentChange}
            containerclassname="button-radio center-align"
          />
          {BROKERAGE_EMPLOYMENT.fields.brokerageEmployment.value === 'yes' &&
          <div className="field-wrap">
            <Form.Group widths="equal">
              <FormInput
                key="brokerageFirmName"
                fielddata={BROKERAGE_EMPLOYMENT.fields.brokerageFirmName}
                name="brokerageFirmName"
                changed={employmentChange}
              />
            </Form.Group>
          </div>
          }
        </Form>
      </div>
    );
  }
}
