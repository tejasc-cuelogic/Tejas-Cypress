import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Form, Header } from 'semantic-ui-react';
import { FormRadioGroup, FormInput } from '../../../../../../theme/form';

@inject('investorProfileStore')
@observer
export default class PublicCompanyRel extends Component {
  render() {
    const { PUBLIC_COMPANY_REL_FORM, employmentChange } = this.props.investorProfileStore;
    return (
      <div className="center-align">
        <Header as="h3">Public Company Relations</Header>
        <p className="mb-50">Are you (or an immediate family member) a 10% shareholder,
          director or senior officer at a publicly traded U.S. company?
        </p>
        <p className="mb-40">If you do not know what this means, it likely does not apply to you</p>
        <Form error>
          <FormRadioGroup
            fielddata={PUBLIC_COMPANY_REL_FORM.fields.publicCompanyRel}
            name="publicCompanyRel"
            changed={(e, result) => employmentChange(e, 'PUBLIC_COMPANY_REL_FORM', result)}
            containerclassname="button-radio center-align"
            showerror
            classname="center-align"
          />
          {PUBLIC_COMPANY_REL_FORM.fields.publicCompanyRel.value === 'yes' &&
          <div className="field-wrap left-align">
            <Form.Group widths="equal">
              <FormInput
                key="publicCompanyTicker"
                fielddata={PUBLIC_COMPANY_REL_FORM.fields.publicCompanyTicker}
                name="publicCompanyTicker"
                changed={(e, result) => employmentChange(e, 'PUBLIC_COMPANY_REL_FORM', result)}
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
