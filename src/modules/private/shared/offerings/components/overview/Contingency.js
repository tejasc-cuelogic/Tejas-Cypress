/*  eslint-disable jsx-a11y/label-has-for */
import React, { Component } from 'react';
import Aux from 'react-aux';
import { observer, inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Header, Button, Checkbox, Confirm, Icon, Modal, Form } from 'semantic-ui-react';
import { FormTextarea, FormInput } from '../../../../../../theme/form';

@withRouter
@inject('offeringCreationStore', 'userStore')
@observer
export default class Contingency extends Component {
  setContingencyForm = () => {
    const { formName, offeringCreationStore } = this.props;
    offeringCreationStore.setContingencyFormSelected(formName);
  }
  setDataForEditContingency = (form, dataKey, index) => {
    this.props.offeringCreationStore.setDataForEditContingency(form, dataKey, index);
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
  removeData = () => {
    const { confirmModalName } = this.props.offeringCreationStore;
    const dataKey = confirmModalName === 'LAUNCH_CONTITNGENCIES_FRM' ? 'launch' : 'close';
    this.props.offeringCreationStore.removeData(confirmModalName, dataKey);
    const successMsg = 'Contingency has been deleted successfully';
    this.handleSubmitComment(successMsg);
  }
  toggleConfirmModal = (e, index, formName) => {
    e.preventDefault();
    this.props.offeringCreationStore.toggleConfirmModal(index, formName);
  }
  handleUpdateForm = (form, dataKey, index) => {
    const {
      updateOffering,
      currentOfferingId,
      LAUNCH_CONTITNGENCIES_FRM,
      CLOSING_CONTITNGENCIES_FRM,
      setDataForFormAfterEdit,
    } = this.props.offeringCreationStore;
    setDataForFormAfterEdit(form, dataKey, index);
    const fields = { ...LAUNCH_CONTITNGENCIES_FRM.fields, ...CLOSING_CONTITNGENCIES_FRM.fields };
    updateOffering(currentOfferingId, fields, 'contingencies');
    this.props.history.push(this.props.refLink);
  }
  render() {
    const access = this.props.userStore.myAccessForModule('OFFERINGS');
    const {
      confirmModal,
      confirmModalName,
      formChange,
      contingencyFormSelected,
      ADD_NEW_CONTINGENCY_FRM,
      EDIT_CONTINGENCY_FRM,
    } = this.props.offeringCreationStore;
    const {
      form, formName, formArrayChange, addon,
    } = this.props;
    const dataKey = formName === 'LAUNCH_CONTITNGENCIES_FRM' ? 'launch' : 'close';
    return (
      <Aux>
        <Header as="h4">
          {formName === 'LAUNCH_CONTITNGENCIES_FRM' ? 'Launch Contingencies' : 'Closing Contingencies'}
          {this.props.hideAddNewBtn && <Icon className="ns-chevron-up-compact" color="blue" />}
          {access.asManager ?
            <Modal size="small" trigger={!this.props.hideAddNewBtn && <Button as="a" color="green" size="small" className="link link-button" onClick={() => this.setContingencyForm()}>+ Add {formName === 'LAUNCH_CONTITNGENCIES_FRM' ? 'Launch' : 'Closing'} Contingency</Button>} closeIcon >
              <Modal.Header>Add New {contingencyFormSelected === 'LAUNCH_CONTITNGENCIES_FRM' ? 'Launch' : 'Closing'} Contingency</Modal.Header>
              <Modal.Content>
                <Form>
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
                    <Button onClick={this.handleSubmitForm} className="relaxed" primary disabled={!ADD_NEW_CONTINGENCY_FRM.meta.isValid} >Add Contingency</Button>
                  </div>
                </Form>
              </Modal.Content>
            </Modal>
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
                    <Modal size="small" trigger={<Button onClick={() => this.setDataForEditContingency(form, dataKey, index)} inverted color="blue" content="Edit" />} closeIcon >
                      <Modal.Header>Edit Contingency</Modal.Header>
                      <Modal.Content>
                        <Form>
                          {
                            ['contingency', 'acceptance', 'comment'].map(field => (
                              <FormInput
                                name={field}
                                fielddata={EDIT_CONTINGENCY_FRM.fields[field]}
                                changed={(e, result) =>
                                  formChange(e, result, 'EDIT_CONTINGENCY_FRM')}
                              />
                            ))
                          }
                          <div className="center-align">
                            <Button onClick={() => this.handleUpdateForm(form, dataKey, index)} disabled={!EDIT_CONTINGENCY_FRM.meta.isValid} className="relaxed" primary >Update Contingency</Button>
                          </div>
                        </Form>
                      </Modal.Content>
                    </Modal>
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
          open={confirmModal && confirmModalName === formName}
          onCancel={this.toggleConfirmModal}
          onConfirm={() => this.removeData()}
          size="mini"
          className="deletion"
        />
      </Aux>
    );
  }
}
