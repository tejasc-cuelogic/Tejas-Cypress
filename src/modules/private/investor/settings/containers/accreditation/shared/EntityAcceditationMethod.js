/* eslint-disable react/no-unescaped-entities */
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Header, Grid, Form } from 'semantic-ui-react';

@inject('uiStore', 'accreditationStore')
@withRouter
@observer
export default class VerifyEntityAccreditation extends Component {
  componentWillMount() {
    const { accountType } = this.props.match.params;
    this.props.accreditationStore.setFormData('ACCREDITATION_FORM', 'accreditation', accountType);
  }
  render() {
    const {
      ENTITY_ACCREDITATION_FORM,
      ACCREDITATION_FORM,
      accreditationMethodChange,
    } = this.props.accreditationStore;
    return (
      <div>
        <Header as="h3" className="center-align">Is your entity an accredited investor?</Header>
        <p className="center-align">
        To invest in Reg D offerings on the NextSeed platform, we are required to verify your
        entity's status as an accredited investor.
        </p>
        <p className="center-align"><b>Please confirm which of the following is applicable to your entity.</b></p>
        <Form error className="account-type-tab">
          <Grid columns={1}>
            {ENTITY_ACCREDITATION_FORM.fields.method.values.map(method => (
              <Grid.Column
                onClick={(e) => {
                  accreditationMethodChange(e, 'ENTITY_ACCREDITATION_FORM', { name: 'method', value: method.value });
                  accreditationMethodChange(e, 'ACCREDITATION_FORM', { name: 'method', value: method.value });
                }}
              >
                <div className={`user-type ${((ENTITY_ACCREDITATION_FORM.fields.method.value === method.value || ACCREDITATION_FORM.fields.method.value === method.value) ? 'active' : '')}`}>
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
