import React, { Component } from 'react';
import Aux from 'react-aux';
import { inject, observer } from 'mobx-react';
import { Form, Divider, Confirm } from 'semantic-ui-react';
import { FormTextarea, DropZone } from '../../../../../../../theme/form';
import ManagerOverview from './ManagerOverview';
import ButtonGroup from './ButtonGroup';

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
    this.props.businessAppReviewStore.saveReviewForms(form, action);
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
    const isReadonly = ((((approved && approved.status) || (submitted && !approved))
      && !isManager) || (isManager && approved && approved.status));
    return (
      <div>
        <Form onSubmit={this.submit}>
          <ManagerOverview isManager={isManager} approved={approved} isReadonly={isReadonly} isValid={PROJECTIONS_FRM.meta.isValid} formName="PROJECTIONS_FRM" />
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
          <ButtonGroup
            formName="PROJECTIONS_FRM"
            isReadonly={isReadonly}
            isManager={isManager}
            submitted={submitted}
            approved={approved}
            formValid={PROJECTIONS_FRM.meta.isValid}
            submitWithApproval={this.submitWithApproval}
          />
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
