import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Header, Grid } from 'semantic-ui-react';
import { ENTITY_ACCREDITATION_METHODS_META } from './../../../../../../../services/constants/investmentLimit';

@inject('uiStore', 'accreditationStore')
@observer
export default class VerifyEntityAccreditation extends Component {
  render() {
    const accreditationMethods = ENTITY_ACCREDITATION_METHODS_META.slice();
    const { ENTITY_ACCREDITATION_FORM, accreditationMethodChange } = this.props.accreditationStore;
    return (
      <div>
        <Header as="h3">How are you accredited?</Header>
        <p>
            To invest in Regulation D or 506(c) offerings, you will need to verify that
            you are an accredited investor.
        </p>
        <p>Please confirm which of the following is applicable for you:</p>
        <Grid stackable textAlign="center">
          <Grid.Row columns={2}>
            {accreditationMethods.map(method => (
              <Grid.Column
                onClick={e => accreditationMethodChange(e, 'ENTITY_ACCREDITATION_FORM', { name: 'method', value: method.value })}
              >
                <div className={`user-type ${(ENTITY_ACCREDITATION_FORM.fields.method.value === method.value ? 'active' : '')}`}>
                  <Header as="h4">{method.header}</Header>
                  <p>
                    {method.desc}
                  </p>
                </div>
              </Grid.Column>
            ))}
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}
