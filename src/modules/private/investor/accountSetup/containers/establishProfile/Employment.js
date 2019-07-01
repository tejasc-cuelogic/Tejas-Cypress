import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Form, Header, Message, Button } from 'semantic-ui-react';
import { FormRadioGroup, FormInput, FormArrowButton } from '../../../../../../theme/form';
import { ListErrors } from '../../../../../../theme/shared';

const isMobile = document.documentElement.clientWidth < 768;

@inject('investorProfileStore', 'uiStore')
@observer
export default class Employment extends Component {
  render() {
    const { EMPLOYMENT_FORM, employmentChange } = this.props.investorProfileStore;
    const { errors } = this.props.uiStore;
    return (
      <div className={isMobile ? '' : 'center-align'}>
        <Header as="h4">What is your employment status?</Header>
        {!isMobile && <p className="mb-40">Please indicate your current employment status</p>}
        <Form error className={isMobile ? 'mb-40' : ''}>
          <Button.Group fluid vertical>
            <FormArrowButton
              fielddata={{ content: 'Individual Account', description: 'Get started with a personal NextSeed Investment Account' }}
            />
            <FormArrowButton
              fielddata={{ content: 'Self-Directed IRA', description: 'Open a traditional or Roth IRA (minimum deposit of $5,000)' }}
            />
            <FormArrowButton
              fielddata={{ name: 'I have some experience' }}
            />
          </Button.Group>
          <FormRadioGroup
            fielddata={EMPLOYMENT_FORM.fields.status}
            name="status"
            changed={
              (e, result) => {
                employmentChange(e, 'EMPLOYMENT_FORM', result);
                this.props.uiStore.scrollIntoActiveInputFields();
              }
            }
            containerclassname="three wide button-radio center-align"
            showerror
          />
          {EMPLOYMENT_FORM.fields.status.value === 'EMPLOYED'
          && (
          <div className={`${isMobile ? 'mt-30' : 'field-wrap'} left-align`}>
            <Form.Group widths="equal">
              {
              ['employer', 'position'].map(field => (
                <FormInput
                  key={field}
                  fielddata={EMPLOYMENT_FORM.fields[field]}
                  name={field}
                  changed={(e, result) => employmentChange(e, 'EMPLOYMENT_FORM', result)}
                  showerror
                />
              ))}
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
