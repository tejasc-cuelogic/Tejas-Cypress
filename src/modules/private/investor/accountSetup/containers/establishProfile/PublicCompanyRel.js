import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Form, Header } from 'semantic-ui-react';
import { FormRadioGroup, FormInput } from '../../../../../../theme/form';

@inject('investorProfileStore')
@observer
export default class PublicCompanyRel extends Component {
  render() {
    const { PUBLIC_COMPANY_REL, employmentChange } = this.props.investorProfileStore;
    return (
      <div>
        <Header as="h3" textAlign="center">Public Company Relations</Header>
        <p className="center-align mb-50">Are you (or an immediate family member) a 10% shareholder,
        director or senior officer at a publicly traded U.S. company?
        </p>
        <p>
        If you do not know what this means, it likely does not apply to you
        </p>
        <Form error>
          <FormRadioGroup
            fielddata={PUBLIC_COMPANY_REL.fields.publicCompanyRel}
            name="publicCompanyRel"
            changed={employmentChange}
            containerclassname="button-radio center-align"
          />
          {PUBLIC_COMPANY_REL.fields.publicCompanyRel.value === 'yes' &&
          <div className="field-wrap">
            <Form.Group widths="equal">
              <FormInput
                key="publicCompanyTicker"
                fielddata={PUBLIC_COMPANY_REL.fields.publicCompanyTicker}
                name="publicCompanyTicker"
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
