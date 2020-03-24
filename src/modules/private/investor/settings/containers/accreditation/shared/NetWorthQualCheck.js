import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Form, Header } from 'semantic-ui-react';
import { FormArrowButton } from '../../../../../../../theme/form';

// const isMobile = document.documentElement.clientWidth < 768;
@withRouter
@inject('accreditationStore')
@observer
export default class NetWorthQualCheck extends Component {
  render() {
    // const incomeQualChecks = INCOME_QUALIFICATION_CHECK_META.slice();
    const { NETWORTH_QAL_FORM, accreditationMethodChange } = this.props.accreditationStore;
    return (
      <div>
        <Header as="h4">Does your net worth qualify you as an accredited investor?</Header>
        {/* <p>
          To invest in Regulation D offerings on the NextSeed platform, we are required to
          verify your status as an accredited investor using standards put into place by the SEC.
        </p>
        <p><b>Does your net worth qualify you as an accredited investor?</b></p> */}
        <Form error className="account-type-tab">
          <FormArrowButton
            fielddata={NETWORTH_QAL_FORM.fields.method}
            name="method"
            formName="NETWORTH_QAL_FORM"
            changed={accreditationMethodChange}
            action={this.props.submitStep}
          />
          {/* <Grid columns={1}>
            {NETWORTH_QAL_FORM.fields.method.values.map(method => (
              <Grid.Column
                key={method.value}
                onClick={e => accreditationMethodChange(e, 'NETWORTH_QAL_FORM', { name: 'method', value: method.value })}
              >
                <div className={`user-type ${(NETWORTH_QAL_FORM.fields.method.value === method.value ? 'active' : '')}`}>
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
