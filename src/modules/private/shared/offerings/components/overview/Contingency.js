/*  eslint-disable jsx-a11y/label-has-for */
import React, { Component } from 'react';
import Aux from 'react-aux';
import { observer, inject } from 'mobx-react';
import { Link, withRouter, Route } from 'react-router-dom';
import { Header, Button, Checkbox, Confirm, Icon, Modal, Form } from 'semantic-ui-react';
import { FormTextarea } from '../../../../../../theme/form';
import EditContingency from './EditContingency';

@withRouter
@inject('offeringCreationStore', 'userStore')
@observer
export default class Contingency extends Component {
  setContingencyForm = () => {
    const { formName, offeringCreationStore } = this.props;
    offeringCreationStore.setContingencyFormSelected(formName);
  }
  toggleConfirmModal = (e, index, formName) => {
    e.preventDefault();
    this.props.offeringCreationStore.toggleConfirmModal(index, formName);
  }
  removeData = () => {
    const { confirmModalName } = this.props.offeringCreationStore;
    const dataKey = confirmModalName === 'LAUNCH_CONTITNGENCIES_FRM' ? 'launch' : 'close';
    this.props.offeringCreationStore.removeData(confirmModalName, dataKey);
    const successMsg = 'Contingency has been deleted successfully';
    this.handleSubmitComment(successMsg);
  }
  handleSubmitComment = (successMsg) => {
    const {
      updateOffering,
      currentOfferingId,
      LAUNCH_CONTITNGENCIES_FRM,
      CLOSING_CONTITNGENCIES_FRM,
    } = this.props.offeringCreationStore;
    const fields = { ...LAUNCH_CONTITNGENCIES_FRM.fields, ...CLOSING_CONTITNGENCIES_FRM.fields };
    updateOffering(currentOfferingId, fields, 'contingencies', '', true, successMsg);
  }
  render() {
    const access = this.props.userStore.myAccessForModule('OFFERINGS');
    const {
      confirmModal,
    } = this.props.offeringCreationStore;
    const {
      form, formName, formArrayChange, match, addon,
    } = this.props;
    const dataKey = formName === 'LAUNCH_CONTITNGENCIES_FRM' ? 'launch' : 'close';
    return (
      <Aux>
        <Route path={`${match.url}/${dataKey}/edit-contingency/:index`} render={() => <EditContingency formArrayChange={formArrayChange} dataKey={dataKey} form={form} formName={formName} refLink={match.url} />} />
        <Header as="h4">
          {formName === 'LAUNCH_CONTITNGENCIES_FRM' ? 'Launch Contingencies' : 'Closing Contingencies'}
          {access.asManager ?
            <Link onClick={() => this.setContingencyForm()} to={`${match.url}/add-new-contingency`} className="link"><small>+ Add {formName === 'LAUNCH_CONTITNGENCIES_FRM' ? 'Launch' : 'Closing'} Contingency</small></Link>
          :
          null}
          {addon}
        </Header>
        {
        form.fields[dataKey] && form.fields[dataKey].length > 0 ?
        form.fields[dataKey].map((contingency, index) => (
          <div className="featured-section collapsed-checkbox">
            <Checkbox
              name="isAccepted"
              label={
                <label>
                  <Header as="h4">
                    {contingency.contingency.value}
                    <Header.Subheader>
                      {contingency.acceptance.value}
                    </Header.Subheader>
                  </Header>
                </label>
              }
              checked={form.fields[dataKey][index].isAccepted.value}
              onChange={(e, result) => formArrayChange(e, result, formName, dataKey, index)}
            />
            <div className="checkbox-description">
              <FormTextarea
                fielddata={contingency.comment}
                name="comment"
                containerclassname="secondary"
                changed={(e, result) => formArrayChange(e, result, formName, dataKey, index)}
              />
              <Button.Group compact size="small">
                {access.asManager &&
                  <Aux>
                    <Button as={Link} inverted color="blue" content="Edit" to={`${match.url}/${dataKey}/edit-contingency/${index}`} />
                    <Button type="button" color="red" content="Delete" onClick={e => this.toggleConfirmModal(e, index, formName)} />
                  </Aux>
                }
                <Button type="button" primary content="Submit" onClick={() => this.handleSubmitComment(null)} />
                <Button as="span" className="time-stamp">
                  <Icon className="ns-check-circle" color="green" />
                  Submitted by USER_NAME on 2/3/2018
                </Button>
              </Button.Group>
            </div>
          </div>
        )) :
        <div className="featured-section collapsed-checkbox">
          No data found
        </div>
      }
        <Confirm
          header="Confirm"
          content="Are you sure you want to remove this contingency?"
          open={confirmModal}
          onCancel={this.toggleConfirmModal}
          onConfirm={() => this.removeData()}
          size="mini"
          className="deletion"
        />
        <Modal size="small" trigger={<Button className="link">Add New</Button>} closeIcon onClose={this.handleCloseModal}>
          <Modal.Header>Add New Launch Contingency</Modal.Header>
          <Modal.Content>
            <Form onSubmit={() => this.handleSubmitForm()}>
              <Form.Input fluid label="Contingency Name" placeholder="Contingency Name" />
              <Form.Input fluid label="Acceptance Criteria" placeholder="Acceptance Criteria" />
              {/* {
                ['contingency', 'acceptance'].map(field => (
                  <FormInput
                    name={field}
                    fielddata={ADD_NEW_CONTINGENCY_FRM.fields[field]}
                    changed={(e, result) => formChange(e, result, 'ADD_NEW_CONTINGENCY_FRM')}
                  />
                ))
              } */}
              <div className="center-align">
                <Button className="relaxed" primary>Add Contingency</Button>
              </div>
            </Form>
          </Modal.Content>
        </Modal>
      </Aux>
    );
  }
}
