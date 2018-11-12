import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Header, Form } from 'semantic-ui-react';
import { FormRadioGroup, FormCheckbox } from '../../../../../../theme/form';

@inject('investorProfileStore')
@observer
export default class Experience extends Component {
  render() {
    const { INVESTMENT_EXP_FORM, experiencesChange } = this.props.investorProfileStore;
    return (
      <div>
        <Header as="h3" textAlign="center">Investment Experience</Header>
        <p className="center-align mb-50">
          Confirm your experience and understanding of the investment risks on NextSeed.
          Select the box that best describes your investment experience to date:
        </p>
        <Form error>
          <FormRadioGroup
            fielddata={INVESTMENT_EXP_FORM.fields.experienceLevel}
            name="experienceLevel"
            changed={experiencesChange}
            containerclassname="button-radio center-align mb-50"
          />
          <FormCheckbox
            fielddata={INVESTMENT_EXP_FORM.fields.isComfortable}
            name="isComfortable"
            changed={experiencesChange}
            defaults
            containerclassname="ui relaxed list"
          />
          <FormCheckbox
            fielddata={INVESTMENT_EXP_FORM.fields.isRiskTaker}
            name="isRiskTaker"
            changed={experiencesChange}
            defaults
            containerclassname="ui relaxed list"
          />
        </Form>
      </div>
    );
  }
}
