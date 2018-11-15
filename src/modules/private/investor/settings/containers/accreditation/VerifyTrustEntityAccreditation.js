import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Header, Form, Grid, Modal, Button } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { VERIFY_ACC_WITH_META } from './../../../../../../services/constants/investmentLimit';

@inject('accreditationStore')
@observer
export default class IncomeEvidence extends Component {
  handleCloseModal = (e) => {
    e.stopPropagation();
    this.props.history.goBack();
  }
  render() {
    const {
      TRUST_ENTITY_ACCREDITATION_FRM,
      accreditationMethodChange,
    } = this.props.accreditationStore;
    const trustEntityAccMethods = VERIFY_ACC_WITH_META.slice();
    return (
      <div>
        <Modal open onClose={this.handleCloseModal} size="tiny" closeOnDimmerClick>
          <Modal.Header className="center-align signup-header">
            <Header as="h3" textAlign="center">Verify accreditaton with</Header>
            <p className="center-align">To invest in Regulation D or 506(c) offerings, you will need to verify that your entity is eligible for accreditation. </p>
            <p className="center-align">Please confirm which of the following is applicable for you:</p>
          </Modal.Header>
          <Modal.Content>
            <Form error className="account-type-tab">
              <Grid columns={1}>
                {trustEntityAccMethods.map(method => (
                  <Grid.Column
                    onClick={e => accreditationMethodChange(e, 'TRUST_ENTITY_ACCREDITATION_FRM', { name: 'trustEntityAccMethods', value: method.value })}
                  >
                    <div className={`user-type ${(TRUST_ENTITY_ACCREDITATION_FRM.fields.trustEntityAccMethods.value === method.value ? 'active' : '')}`}>
                      <Header as="h6">{method.header}</Header>
                      <p>
                        {method.desc}
                      </p>
                    </div>
                  </Grid.Column>
                ))}
              </Grid>
            </Form>
            <Button
              circular
              icon={{ className: 'ns-arrow-right' }}
              className="multistep__btn next active"
              as={Link}
              to={TRUST_ENTITY_ACCREDITATION_FRM.fields.trustEntityAccMethods.value === 'RevocableAndAccredited' ? `${this.props.match.url}/verify` : `${this.props.match.url}/verify/assets`}
            />
          </Modal.Content>
        </Modal>
      </div>
    );
  }
}
