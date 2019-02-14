import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Header, Form, Grid } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';

@inject('accreditationStore')
@withRouter
@observer
export default class TrustEntityAccreditationMethod extends Component {
  render() {
    const {
      TRUST_ENTITY_ACCREDITATION_FRM,
      accreditationMethodChange,
    } = this.props.accreditationStore;
    return (
      <div>
        <Header as="h3" textAlign="center">Is your trust an entity an accredited investor?</Header>
        <p className="center-align">To invest in Reg D offerings on the NextSeed platform, we are required to verify your trust`s status as an accredited investor. </p>
        <p className="center-align"><b>Please confirm which of the following is applicable to your trust.</b></p>
        <Form error className="account-type-tab">
          <Grid columns={1}>
            {TRUST_ENTITY_ACCREDITATION_FRM.fields.method.values.map(method => (
              <Grid.Column
                onClick={e => accreditationMethodChange(e, 'TRUST_ENTITY_ACCREDITATION_FRM', { name: 'method', value: method.value })}
              >
                <div className={`user-type ${(TRUST_ENTITY_ACCREDITATION_FRM.fields.method.value === method.value ? 'active' : '')}`}>
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
