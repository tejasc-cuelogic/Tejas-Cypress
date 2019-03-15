import React, { Component } from 'react';
import { Form, Header, Grid } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';

@withRouter
@inject('accreditationStore')
@observer
export default class FillingStatus extends Component {
  render() {
    const { FILLING_STATUS_FORM, accreditationMethodChange } = this.props.accreditationStore;
    return (
      <div>
        <Header as="h3" textAlign="center">Filing Status</Header>
        <p className="center-align">
        Do you have documentation to verify your income for 2018?
        </p>
        <Form error className="account-type-tab">
          <Grid columns={3} centered reversed>
            {FILLING_STATUS_FORM.fields.method.values.map(method => (
              <Grid.Column
                onClick={e => accreditationMethodChange(e, 'FILLING_STATUS_FORM', { name: 'method', value: method.value })}
              >
                <div className={`user-type ${(FILLING_STATUS_FORM.fields.method.value === method.value ? 'active' : '')}`}>
                  <p className="center-align">
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
