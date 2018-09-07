import React from 'react';
import { inject, observer } from 'mobx-react';
import { Form, Button, Modal } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { FormInput } from '../../../../../../../theme/form';

@withRouter
@inject('offeringCreationStore')
@observer
export default class AddNewContingency extends React.Component {
  handleCloseModal = () => {
    this.props.history.push(this.props.refLink);
  }
  handleSubmitForm = () => {
    const { addMore, contingencyFormSelected } = this.props.offeringCreationStore;
    addMore(contingencyFormSelected, true);
    this.props.history.push(this.props.refLink);
  }
  render() {
    const {
      ADD_NEW_CONTINGENCY_FRM,
      contingencyFormSelected,
      formChange,
    } = this.props.offeringCreationStore;
    return (
      <div>
        <Modal size="small" open closeIcon onClose={this.handleCloseModal} >
          <Modal.Header>Add New {contingencyFormSelected === 'LAUNCH_CONTITNGENCIES_FRM' ? 'Launch' : 'Closing'} Contingency</Modal.Header>
          <Modal.Content>
            <Form onSubmit={this.handleSubmitForm}>
              {
                ['name', 'acceptanceCriteria'].map(field => (
                  <FormInput
                    name={field}
                    fielddata={ADD_NEW_CONTINGENCY_FRM.fields[field]}
                    changed={(e, result) => formChange(e, result, 'ADD_NEW_CONTINGENCY_FRM')}
                  />
                ))
              }
              <Button className="relaxed center-align" primary disabled={!ADD_NEW_CONTINGENCY_FRM.meta.isValid} >Add Contingency</Button>
            </Form>
          </Modal.Content>
        </Modal>
      </div>
    );
  }
}
