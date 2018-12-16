import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Form, Header, Message, Divider } from 'semantic-ui-react';
import { FormRadioGroup, FormInput } from '../../../../../../theme/form';
import { ListErrors } from '../../../../../../theme/shared';

@inject('investorProfileStore', 'uiStore')
@observer
export default class PublicCompanyRel extends Component {
  render() {
    const { PUBLIC_COMPANY_REL_FORM, employmentChange } = this.props.investorProfileStore;
    const { errors } = this.props.uiStore;
    return (
      <div className="center-align">
        <Header as="h3">Public Company Relations</Header>
        <p>Are you (or an immediate family member) a 10% shareholder,
          director or senior officer at a publicly traded U.S. company?
        </p>
        <Divider hidden />
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
          {errors &&
          <Message error className="mt-30">
            <ListErrors errors={errors.message ? [errors.message] : [errors]} />
          </Message>
          }
        </Form>
      </div>
    );
  }
}
