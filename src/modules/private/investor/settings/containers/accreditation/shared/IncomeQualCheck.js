import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Form, Header } from 'semantic-ui-react';
import { FormArrowButton } from '../../../../../../../theme/form';

// const isMobile = document.documentElement.clientWidth < 768;
@withRouter
@inject('accreditationStore')
@observer
export default class IncomeQualificationCheck extends Component {
  constructor(props) {
    super(props);
    this.props.accreditationStore.setFieldValue('accreditationInitialStep', true, 'open');
  }

  componentDidUpdate() {
    const {
      INCOME_UPLOAD_DOC_FORM, ASSETS_UPLOAD_DOC_FORM,
    } = this.props.accreditationStore;
    this.props.accreditationStore.resetAccreditation(INCOME_UPLOAD_DOC_FORM);
    this.props.accreditationStore.resetAccreditation(ASSETS_UPLOAD_DOC_FORM);
  }

  render() {
    const { ACCREDITATION_FORM, accreditationMethodChange } = this.props.accreditationStore;
    return (
      <div>
        <Header as="h4">Does your annual income qualify you as an accredited investor?</Header>
        {/* <p>
          To invest in Regulation D offerings on the NextSeed platform, we are required to
          verify your status as an accredited investor using standards put into place by the SEC.
        </p>
        <p><b>Does your annual income qualify you as an accredited investor?</b></p> */}
        <Form error className="mt-30">
          <FormArrowButton
            fielddata={ACCREDITATION_FORM.fields.method}
            name="method"
            formName="ACCREDITATION_FORM"
            changed={accreditationMethodChange}
            action={this.props.submitStep}
          />
          {/* <Grid columns={1}>
            {ACCREDITATION_FORM.fields.method.values.map(method => (
              <Grid.Column
                key={method.value}
                onClick={e => accreditationMethodChange(e, 'ACCREDITATION_FORM', { name: 'method', value: method.value })}
              >
                <div className={`user-type ${(ACCREDITATION_FORM.fields.method.value === method.value ? 'active' : '')}`}>
                  <p>
                    {method.label}
                  </p>
                </div>
              </Grid.Column>
            ))}
          </Grid>
          <Button onClick={this.props.submitStep} primary size="large" fluid={isMobile} className="mt-40 relaxed" content="Continue" /> */}
        </Form>
      </div>
    );
  }
}
