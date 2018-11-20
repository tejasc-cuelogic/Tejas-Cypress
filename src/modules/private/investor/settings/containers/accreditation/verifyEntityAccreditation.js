import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Modal, Header, Button, Grid } from 'semantic-ui-react';
import { ENTITY_ACCREDITATION_METHODS_META } from './../../../../../../services/constants/investmentLimit';

@inject('uiStore', 'accreditationStore')
@observer
export default class VerifyEntityAccreditation extends Component {
  handleCloseModal = (e) => {
    e.stopPropagation();
    this.props.history.goBack();
  }
  render() {
    const accreditationMethods = ENTITY_ACCREDITATION_METHODS_META.slice();
    const { ENTITY_ACCREDITATION_FORM, accreditationMethodChange } = this.props.accreditationStore;
    return (
      <div>
        <Modal open onClose={this.handleCloseModal} size="tiny" closeOnDimmerClick>
          <Modal.Header className="center-align signup-header">
            <Header as="h3">How are you accredited?</Header>
            <p>
              To invest in Regulation D or 506(c) offerings, you will need to verify that
              you are an accredited investor.
            </p>
            <p>Please confirm which of the following is applicable for you:</p>
          </Modal.Header>
          <Modal.Content>
            <Grid stackable columns={2} textAlign="center">
              {accreditationMethods.map(method => (
                <Grid.Column
                  onClick={e => accreditationMethodChange(e, 'ENTITY_ACCREDITATION_FORM', { name: 'accreditationMethods', value: method.value })}
                >
                  <div className={`user-type ${(ENTITY_ACCREDITATION_FORM.fields.accreditationMethods.value === method.value ? 'active' : '')}`}>
                    {method.header ?
                      <Header as="h4">{method.header}</Header>
                      : null
                    }
                    <p>{method.desc}</p>
                  </div>
                </Grid.Column>
              ))}
            </Grid>
            <Button
              circular
              icon={{ className: 'ns-arrow-right' }}
              className="multistep__btn next active"
              as={Link}
              to={`${this.props.match.url}/income`}
            />
          </Modal.Content>
        </Modal>
      </div>
    );
  }
}
