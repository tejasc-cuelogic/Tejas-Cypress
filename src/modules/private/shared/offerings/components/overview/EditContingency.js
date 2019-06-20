import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Modal, Form, Button } from 'semantic-ui-react';
import { FormInput } from '../../../../../../theme/form';

@inject('offeringCreationStore')
@withRouter
@observer
export default class EditContingency extends Component {
  handleSubmitForm = () => {
    const {
      updateOffering,
      currentOfferingId,
      LAUNCH_CONTITNGENCIES_FRM,
      CLOSING_CONTITNGENCIES_FRM,
    } = this.props.offeringCreationStore;
    const fields = { ...LAUNCH_CONTITNGENCIES_FRM.fields, ...CLOSING_CONTITNGENCIES_FRM.fields };
    updateOffering(currentOfferingId, fields, 'contingencies');
    this.props.history.push(this.props.refLink);
  }

  handleCloseModal = () => {
    this.props.history.push(this.props.refLink);
  }

  render() {
    const {
      form,
      formName,
      dataKey,
      formArrayChange,
    } = this.props;
    const { index } = this.props.match.params;
    return (
      <div>
        <Modal size="small" open closeIcon onClose={this.handleCloseModal}>
          <Modal.Header>Edit Contingency</Modal.Header>
          <Modal.Content>
            <Form onSubmit={() => this.handleSubmitForm(form)}>
              {
                ['contingency', 'acceptance', 'comment'].map(field => (
                  <FormInput
                    name={field}
                    fielddata={form.fields[dataKey][index][field]}
                    changed={(e, result) => formArrayChange(e, result, formName, dataKey, index)}
                  />
                ))
              }
              <div className="center-align">
                <Button disabled={!form.meta.isValid} className="relaxed" primary>Update Contingency</Button>
              </div>
            </Form>
          </Modal.Content>
        </Modal>
      </div>
    );
  }
}
