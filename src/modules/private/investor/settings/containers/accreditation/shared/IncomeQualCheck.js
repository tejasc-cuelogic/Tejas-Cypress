import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Form, Header, Grid } from 'semantic-ui-react';

@withRouter
@inject('accreditationStore')
@observer
export default class IncomeQualificationCheck extends Component {
  componentWillMount() {
    this.props.accreditationStore.setFieldVal('docsToUpload', []);
  }
  componentWillUpdate() {
    const {
      INCOME_UPLOAD_DOC_FORM, ASSETS_UPLOAD_DOC_FORM,
    } = this.props.accreditationStore;
    this.props.accreditationStore.setFieldVal('docsToUpload', []);
    this.props.accreditationStore.resetAccreditation(INCOME_UPLOAD_DOC_FORM);
    this.props.accreditationStore.resetAccreditation(ASSETS_UPLOAD_DOC_FORM);
  }
  render() {
    // const incomeQualChecks = INCOME_QUALIFICATION_CHECK_META.slice();
    const { ACCREDITATION_FORM, accreditationMethodChange } = this.props.accreditationStore;
    return (
      <div>
        <Header as="h3" textAlign="center">How are you an accredited investor?</Header>
        <p className="center-align">
          To invest in Regulation D offerings on the NextSeed platform, we are required to
          verify your status as an accredited investor using standards put into place by the SEC.
        </p>
        <p className="center-align"><b>Does your annual income qualify you as an accredited investor?</b></p>
        <Form error className="account-type-tab">
          <Grid columns={1}>
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
        </Form>
      </div>
    );
  }
}
