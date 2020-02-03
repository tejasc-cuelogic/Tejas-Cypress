import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Form, Header, Message, Button } from 'semantic-ui-react';
import { FormInput, FormArrowButton } from '../../../../../../theme/form';
import { ListErrors } from '../../../../../../theme/shared';

const isMobile = document.documentElement.clientWidth < 768;

@inject('investorProfileStore', 'uiStore')
@observer
export default class Employment extends Component {
  componentWillMount() {
    // const { EMPLOYMENT_FORM } = this.props.investorProfileStore;
    // if (EMPLOYMENT_FORM.fields.status.value === 'EMPLOYED') {
    //   this.props.uiStore.addMoreInProgressArray('EMPLOYED');
    // }
  }

  componentWillUnmount() {
    this.props.uiStore.setFieldvalue('inProgressArray', []);
  }

  handleUpdateInvestorProfileData = () => {
    const { updateInvestorProfileData, stepToBeRendered, EMPLOYMENT_FORM } = this.props.investorProfileStore;
    const { multiSteps } = this.props.uiStore;
    if (EMPLOYMENT_FORM.fields.status.value === 'EMPLOYED' && isMobile) {
      this.props.uiStore.addMoreInProgressArray('EMPLOYED');
      return;
    }
    updateInvestorProfileData(multiSteps[stepToBeRendered]);
  }

  toggleInputFields = () => {
    const { EMPLOYMENT_FORM } = this.props.investorProfileStore;
    if (EMPLOYMENT_FORM.fields.status.value === 'EMPLOYED' && isMobile) {
      this.props.uiStore.addMoreInProgressArray('EMPLOYED');
    }
  }


  render() {
    const { EMPLOYMENT_FORM, employmentChange, updateInvestorProfileData, stepToBeRendered } = this.props.investorProfileStore;
    const { errors, inProgressArray, multiSteps } = this.props.uiStore;
    if (inProgressArray.includes('EMPLOYED')) {
      return (
        <Form onSubmit={() => updateInvestorProfileData(multiSteps && multiSteps[stepToBeRendered])} error className="mb-40">
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
            <Button primary size="large" fluid className="relaxed" content="Continue" disabled={!EMPLOYMENT_FORM.meta.isValid} />
          </Form.Group>
        </Form>
      );
    }
    return (
      <>
        <Header as="h3" className={isMobile ? 'mb-30' : ''}>What is your employment status?</Header>
        {!isMobile && <p className="mb-40">Please indicate your current employment status</p>}
        <Form onSubmit={() => updateInvestorProfileData(multiSteps && multiSteps[stepToBeRendered])} error className={isMobile ? 'mb-40' : ''}>
          <FormArrowButton
            fielddata={EMPLOYMENT_FORM.fields.status}
            name="status"
            changed={
              (e, result) => {
                employmentChange(e, 'EMPLOYMENT_FORM', result);
                this.toggleInputFields();
                // this.props.uiStore.scrollIntoActiveInputFields();
              }
            }
            action={this.handleUpdateInvestorProfileData}
          />
          {
            !isMobile && EMPLOYMENT_FORM.fields.status.value === 'EMPLOYED'
          && (
          <div className={`${isMobile ? 'mt-30' : 'field-wrap plr-0'} left-align`}>
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
            <Button primary size="large" className="relaxed mt-30" content="Continue" disabled={!EMPLOYMENT_FORM.meta.isValid} />
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
      </>
    );
  }
}
