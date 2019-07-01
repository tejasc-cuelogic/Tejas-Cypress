import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Form, Header, Message, Divider } from 'semantic-ui-react';
import { FormRadioGroup, FormInput } from '../../../../../../theme/form';
import { ListErrors } from '../../../../../../theme/shared';

const isMobile = document.documentElement.clientWidth < 768;

@inject('investorProfileStore', 'uiStore')
@observer
export default class PublicCompanyRel extends Component {
  render() {
    const { PUBLIC_COMPANY_REL_FORM, employmentChange } = this.props.investorProfileStore;
    const { errors } = this.props.uiStore;
    return (
      <div className={isMobile ? '' : 'center-align'}>
        {/* <Header as="h3">Public Company Relations</Header> */}
        <Header as="h4">
Are you (or an immediate family member) a 10% shareholder,
          director or senior officer at a publicly traded U.S. company?
        </Header>
        {!isMobile && <Divider hidden />}
        <p className="mb-40">If you do not know what this means, it likely does not apply to you</p>
        <Form error className={isMobile ? ' mb-30' : ''}>
          <FormRadioGroup
            fielddata={PUBLIC_COMPANY_REL_FORM.fields.publicCompanyRel}
            name="publicCompanyRel"
            changed={(e, result) => {
              employmentChange(e, 'PUBLIC_COMPANY_REL_FORM', result);
              this.props.uiStore.scrollIntoActiveInputFields();
            }}
            containerclassname="three wide button-radio center-align"
            showerror
          />
          {PUBLIC_COMPANY_REL_FORM.fields.publicCompanyRel.value === 'yes'
          && (
          <div className={`${isMobile ? 'mt-30' : 'field-wrap'} left-align`}>
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
