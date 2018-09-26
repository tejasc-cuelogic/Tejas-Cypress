import React, { Component } from 'react';
import Aux from 'react-aux';
import { inject, observer } from 'mobx-react';
import { Form, Button, Divider, Confirm } from 'semantic-ui-react';
import { FormTextarea, DropZone } from '../../../../../../../theme/form';
import ManagerOverview from './ManagerOverview';

@inject('businessAppReviewStore', 'uiStore', 'businessAppStore', 'userStore')
@observer
export default class Projections extends Component {
  componentWillMount() {
    this.props.businessAppReviewStore.setFormData('PROJECTIONS_FRM', 'review.projections');
    this.props.businessAppReviewStore.setFormData('MANAGERS_FRM', 'review.projections.managerOverview');
  }
  onBenchmarkDrop = (files) => {
    this.props.businessAppReviewStore.setFileUploadData('PROJECTIONS_FRM', '', 'benchmarkUpload', files);
  }
  onRevenueCheckDrop = (files) => {
    this.props.businessAppReviewStore.setFileUploadData('PROJECTIONS_FRM', '', 'revenueCheckUpload', files);
  }
  confirmRemoveDoc = (e, name) => {
    e.preventDefault();
    this.props.uiStore.setConfirmBox(name);
  }
  handleDelCancel = () => {
    this.props.uiStore.setConfirmBox('');
  }
  handleDelDoc = (field) => {
    this.props.businessAppReviewStore.removeUploadedData('PROJECTIONS_FRM', field);
    this.props.uiStore.setConfirmBox('');
  }
  submit = () => {
    this.props.businessAppReviewStore.saveReviewForms('PROJECTIONS_FRM');
  }
  submitWithApproval = (form, action) => {
    this.props.businessAppReviewStore.approveOrSubmitReviewForms(form, action);
  }
  render() {
    const { PROJECTIONS_FRM, formChange } = this.props.businessAppReviewStore;
    const { confirmBox } = this.props.uiStore;
    const { roles } = this.props.userStore.currentUser;
    const isManager = roles && roles.includes('manager');
    const { businessApplicationDetailsAdmin } = this.props.businessAppStore;
    const { review } = businessApplicationDetailsAdmin;
    const submitted = (review && review.projections && review.projections &&
      review.projections.submitted) ? review.projections.submitted : false;
    const approved = (review && review.projections && review.projections &&
      review.projections.approved) ? review.projections.approved : false;
    const isReadonly = ((submitted && !isManager) || (isManager && approved));
    return (
      <div>
        <Form onSubmit={this.submit}>
          {
            ['reasonableHistoricals', 'projectionsComplete', 'revenueCheck'].map((field, index) => (
              <Aux>
                <FormTextarea
                  containerclassname={isReadonly ? 'display-only secondary' : 'secondary'}
                  disabled={isReadonly}
                  key={field}
                  name={field}
                  fielddata={PROJECTIONS_FRM.fields[field]}
                  changed={(e, result) => formChange(e, result, 'PROJECTIONS_FRM')}
                />
                {index !== 2 &&
                  <Divider section />
                }
              </Aux>
            ))
          }
          <DropZone
            containerclassname={isReadonly ? 'display-only fluid' : 'fluid'}
            disabled={isReadonly}
            name="revenueCheckUpload"
            fielddata={PROJECTIONS_FRM.fields.revenueCheckUpload}
            ondrop={this.onRevenueCheckDrop}
            onremove={this.confirmRemoveDoc}
            uploadtitle="Upload Revenue Check"
          />
          <Divider section />
          {
            ['opex', 'rent', 'benchmark'].map((field, index) => (
              <Aux>
                <FormTextarea
                  containerclassname={isReadonly ? 'display-only secondary' : 'secondary'}
                  disabled={isReadonly}
                  key={field}
                  name={field}
                  fielddata={PROJECTIONS_FRM.fields[field]}
                  changed={(e, result) => formChange(e, result, 'PROJECTIONS_FRM')}
                />
                {index !== 2 &&
                <Divider section />
                }
              </Aux>
            ))
          }
          <DropZone
            containerclassname={isReadonly ? 'display-only fluid' : 'fluid'}
            disabled={isReadonly}
            name="benchmarkUpload"
            fielddata={PROJECTIONS_FRM.fields.benchmarkUpload}
            ondrop={this.onBenchmarkDrop}
            onremove={this.confirmRemoveDoc}
            uploadtitle="Upload Benchmark"
          />
          <Divider section />
          <FormTextarea
            containerclassname={isReadonly ? 'display-only secondary' : 'secondary'}
            disabled={isReadonly}
            name="existingLiabilities"
            fielddata={PROJECTIONS_FRM.fields.existingLiabilities}
            changed={(e, result) => formChange(e, result, 'PROJECTIONS_FRM')}
          />
          {!isManager && !approved &&
          <div className="right-align">
            <Button.Group>
              {!submitted &&
              <Button disabled={!PROJECTIONS_FRM.meta.isValid} secondary className="relaxed">Save</Button>
              }
              <Button onClick={() => this.submitWithApproval('PROJECTIONS_FRM', 'REVIEW_SUBMITTED')} disabled={(!(PROJECTIONS_FRM.meta.isValid) || submitted)} primary={!submitted} type="button">{submitted ? 'Awaiting Manager Approval' : 'Submit for Approval'}</Button>
            </Button.Group>
          </div>
          }
          {(submitted || isManager) &&
          <ManagerOverview approved={approved} isReadonly={isReadonly} isValid={PROJECTIONS_FRM.meta.isValid} formName="PROJECTIONS_FRM" />
          }
        </Form>
        <Confirm
          header="Confirm"
          content="Are you sure you want to remove this file?"
          open={confirmBox.entity === 'benchmarkUpload' || confirmBox.entity === 'revenueCheckUpload'}
          onCancel={this.handleDelCancel}
          onConfirm={() => this.handleDelDoc(confirmBox.entity)}
          size="mini"
          className="deletion"
        />
      </div>
    );
  }
}
