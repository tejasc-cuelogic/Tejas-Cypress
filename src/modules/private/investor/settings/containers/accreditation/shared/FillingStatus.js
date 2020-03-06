import React, { Component } from 'react';
import { Form, Header, Grid, Button } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';

@withRouter
@inject('accreditationStore', 'uiStore')
@observer
export default class FillingStatus extends Component {
  render() {
    const { FILLING_STATUS_FORM, accreditationMethodChange } = this.props.accreditationStore;
    const { responsiveVars } = this.props.uiStore;
    return (
      <div>
        <Header as="h4">Filing Status</Header>
        <p>
        Do you have documentation to verify your income for 2019?
        </p>
        <Form error className="account-type-tab">
          <Grid columns={1}>
            {FILLING_STATUS_FORM.fields.method.values.map(method => (
              <Grid.Column
                onClick={e => accreditationMethodChange(e, 'FILLING_STATUS_FORM', { name: 'method', value: method.value })}
              >
                <div className={`user-type ${(FILLING_STATUS_FORM.fields.method.value === method.value ? 'active' : '')}`}>
                  <p>
                    {method.label}
                  </p>
                </div>
              </Grid.Column>
            ))}
          </Grid>
          <Button disabled={!FILLING_STATUS_FORM.meta.isValid} onClick={() => this.props.submitStep()} primary size="large" fluid={responsiveVars.isMobile} className="mt-40 relaxed" content="Continue" />
        </Form>
      </div>
    );
  }
}
