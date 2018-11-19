import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Header, Form, Grid } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { VERIFY_ACC_WITH_META } from './../../../../../../../services/constants/investmentLimit';

@inject('accreditationStore')
@withRouter
@observer
export default class TrustEntityAccreditationMethod extends Component {
  componentWillMount() {
    const { accountType } = this.props.match.params;
    this.props.accreditationStore.setFormData('TRUST_ENTITY_ACCREDITATION_FRM', 'accreditation', accountType);
  }
  render() {
    const {
      TRUST_ENTITY_ACCREDITATION_FRM,
      accreditationMethodChange,
    } = this.props.accreditationStore;
    const trustEntityAccMethods = VERIFY_ACC_WITH_META.slice();
    return (
      <div>
        <Header as="h3" textAlign="center">Verify accreditation with</Header>
        <p className="center-align">To invest in Regulation D or 506(c) offerings, you will need to verify that your entity is eligible for accreditation. </p>
        <p className="center-align">Please confirm which of the following is applicable for you:</p>
        <Form error className="account-type-tab">
          <Grid columns={1}>
            {trustEntityAccMethods.map(method => (
              <Grid.Column
                onClick={(e) => { accreditationMethodChange(e, 'TRUST_ENTITY_ACCREDITATION_FRM', { name: 'method', value: method.value }); accreditationMethodChange(e, 'NET_WORTH_FORM', { name: 'netWorth', value: method.value === 'ASSETS' ? 'FIVE_MILLION' : 'NONE' }); accreditationMethodChange(e, 'ACCREDITATION_FORM', { name: 'method', value: method.value === 'ASSETS' ? 'ASSETS' : 'REVOCABLE_TRUST_ASSETS' }); }}
              >
                <div className={`user-type ${(TRUST_ENTITY_ACCREDITATION_FRM.fields.method.value === method.value ? 'active' : '')}`}>
                  <Header as="h6">{method.header}</Header>
                  <p>
                    {method.desc}
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
