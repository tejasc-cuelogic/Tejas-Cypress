import React from 'react';
import { inject, observer } from 'mobx-react';
import { Form, Button, Modal } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { FormInput } from '../../../../../../theme/form';
@inject('offeringCreationStore')
@withRouter
@observer
export default class AddNewContingency extends React.Component {
  handleCloseModal = () => {
    this.props.history.push(this.props.refLink);
  }
  handleSubmitForm = () => {
    const {
      addMore,
      updateOffering,
      currentOfferingId,
      setContingencyDataOnAdd,
      contingencyFormSelected,
      LAUNCH_CONTITNGENCIES_FRM,
      CLOSING_CONTITNGENCIES_FRM,
    } = this.props.offeringCreationStore;
    const contingencyType = contingencyFormSelected === 'LAUNCH_CONTITNGENCIES_FRM' ? 'launch' : 'close';
    addMore(contingencyFormSelected, contingencyType);
    setContingencyDataOnAdd(contingencyFormSelected, contingencyType);
    const fields = { ...LAUNCH_CONTITNGENCIES_FRM.fields, ...CLOSING_CONTITNGENCIES_FRM.fields };
    updateOffering(currentOfferingId, fields, 'contingencies');
    this.props.history.push(this.props.refLink);
  }
  render() {
    const {
      ADD_NEW_CONTINGENCY_FRM,
      contingencyFormSelected,
      formChange,
    } = this.props.offeringCreationStore;
    return (
      <Modal size="small" open closeIcon onClose={this.handleCloseModal}>
        <Modal.Header>Add New {contingencyFormSelected === 'LAUNCH_CONTITNGENCIES_FRM' ? 'Launch' : 'Closing'} Contingency</Modal.Header>
        <Modal.Content>
          <Form onSubmit={() => this.handleSubmitForm()}>
            {
              ['contingency', 'acceptance'].map(field => (
                <FormInput
                  name={field}
                  fielddata={ADD_NEW_CONTINGENCY_FRM.fields[field]}
                  changed={(e, result) => formChange(e, result, 'ADD_NEW_CONTINGENCY_FRM')}
                />
              ))
            }
            <div className="center-align">
              <Button className="relaxed" primary disabled={!ADD_NEW_CONTINGENCY_FRM.meta.isValid} >Add Contingency</Button>
            </div>
          </Form>
        </Modal.Content>
      </Modal>
    );
  }
}
