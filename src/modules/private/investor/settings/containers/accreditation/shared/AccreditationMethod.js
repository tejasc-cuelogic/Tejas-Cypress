import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Form, Header, Grid } from 'semantic-ui-react';
import { ACCREDITATION_METHODS_META } from '../../../../../../../services/constants/investmentLimit';
import { FormInput } from '../../../../../../../theme/form';

@inject('uiStore', 'accreditationStore')
@withRouter
@observer
export default class AccreditationMethod extends Component {
  render() {
    const accreditationMethods = ACCREDITATION_METHODS_META.slice();
    const { ACCREDITATION_FORM, accreditationMethodChange } = this.props.accreditationStore;
    return (
      <div>
        <Header as="h3" textAlign="center">How are you accredited?</Header>
        <p className="center-align">
          {ACCREDITATION_FORM.fields.method.value === 'ASSETS' ? 'To invest in Regulation D on the NextSeed platform via 506(c) offerings, we are required to obtain proof of accreditation from you that meets the stringent standard the SEC has put in place.' : 'To invest in Regulation D or 506(c) offerings, you will need to verify that you are an accredited investor'}
        </p>
        <p className="center-align">Please confirm which of the following is applicable for you:</p>
        <Form error className="account-type-tab">
          {this.props.isTrust &&
          <div className="field-wrap">
            <FormInput
              name="grantorName"
              fielddata={ACCREDITATION_FORM.fields.grantorName}
              changed={(e, result) => accreditationMethodChange(e, 'ACCREDITATION_FORM', result)}
            />
          </div>
          }
          <Grid stackable textAlign="center">
            <Grid.Row columns={2}>
              {accreditationMethods.map(method => (
                <Grid.Column
                  onClick={e => accreditationMethodChange(e, 'ACCREDITATION_FORM', { name: 'method', value: method.value })}
                >
                  <div className={`user-type ${(ACCREDITATION_FORM.fields.method.value === method.value ? 'active' : '')}`}>
                    <Header as="h4">{method.header}</Header>
                    <p>
                      {method.desc}
                    </p>
                  </div>
                </Grid.Column>
            ))}
            </Grid.Row>
          </Grid>
        </Form>
      </div>
    );
  }
}
