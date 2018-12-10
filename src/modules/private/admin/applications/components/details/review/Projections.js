import React, { Component } from 'react';
import Aux from 'react-aux';
import { inject, observer } from 'mobx-react';
import { Form, Divider } from 'semantic-ui-react';
import { FormTextarea, DropZoneConfirm as DropZone } from '../../../../../../../theme/form';
import ManagerOverview from './ManagerOverview';
import ButtonGroup from './ButtonGroup';
import { InlineLoader } from '../../../../../../../theme/shared';

@inject('businessAppReviewStore', 'businessAppStore', 'userStore')
@observer
export default class Projections extends Component {
  componentWillMount() {
    if (!this.props.businessAppReviewStore.initLoad.includes('PROJECTIONS_FRM')) {
      this.props.businessAppReviewStore.setFormData('PROJECTIONS_FRM', 'review.projections');
    }
    this.props.businessAppReviewStore.setFormData('MANAGERS_FRM', 'review.projections.managerOverview');
  }
  onBenchmarkDrop = (files) => {
    this.props.businessAppReviewStore.setFileUploadData('PROJECTIONS_FRM', '', 'benchmarkUpload', files);
  }
  onRevenueCheckDrop = (files) => {
    this.props.businessAppReviewStore.setFileUploadData('PROJECTIONS_FRM', '', 'revenueCheckUpload', files);
  }
  handleDelDoc = (field) => {
    this.props.businessAppReviewStore.removeUploadedData('PROJECTIONS_FRM', field);
  }
  submit = () => {
    this.props.businessAppReviewStore.saveReviewForms('PROJECTIONS_FRM');
  }
  submitWithApproval = (form, action) => {
    this.props.businessAppReviewStore.saveReviewForms(form, action);
  }
  render() {
    const { PROJECTIONS_FRM, formChange, inProgress } = this.props.businessAppReviewStore;
    const access = this.props.userStore.myAccessForModule('APPLICATIONS');
    const isManager = access.asManager;
    const {
      businessApplicationDetailsAdmin, applicationReviewLoading,
    } = this.props.businessAppStore;
    const { review, applicationStatus } = businessApplicationDetailsAdmin;
    const submitted = (review && review.projections && review.projections &&
      review.projections.submitted) ? review.projections.submitted : false;
    const approved = (review && review.projections && review.projections &&
      review.projections.approved) ? review.projections.approved : false;
    const isReadonly = ((((approved && approved.status) || (submitted))
      && !isManager) || (isManager && approved && approved.status));
    if (applicationReviewLoading) {
      return <InlineLoader />;
    }
    return (
      <div>
        <Form onSubmit={this.submit}>
          <ManagerOverview applicationStatus={applicationStatus} submitted={submitted} isManager={isManager} approved={approved} isReadonly={isReadonly} isValid={PROJECTIONS_FRM.meta.isValid} formName="PROJECTIONS_FRM" />
          {
            ['reasonableHistoricals', 'projectionsComplete', 'revenueCheck'].map((field, index) => (
              <Aux>
                <FormTextarea
                  containerclassname={isReadonly ? 'display-only secondary' : 'secondary'}
                  readOnly={isReadonly}
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
            containerclassname={isReadonly ? 'display-only' : ''}
            hideFields={isReadonly}
            disabled={isReadonly}
            name="revenueCheckUpload"
            fielddata={PROJECTIONS_FRM.fields.revenueCheckUpload}
            ondrop={this.onRevenueCheckDrop}
            onremove={this.handleDelDoc}
            uploadtitle="Upload Revenue Check"
          />
          <Divider section />
          {
            ['opex', 'rent', 'benchmark'].map((field, index) => (
              <Aux>
                <FormTextarea
                  containerclassname={isReadonly ? 'display-only secondary' : 'secondary'}
                  readOnly={isReadonly}
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
            containerclassname={isReadonly ? 'display-only' : ''}
            disabled={isReadonly}
            hideFields={isReadonly}
            name="benchmarkUpload"
            fielddata={PROJECTIONS_FRM.fields.benchmarkUpload}
            ondrop={this.onBenchmarkDrop}
            onremove={this.handleDelDoc}
            uploadtitle="Upload Benchmark"
          />
          <Divider section />
          <FormTextarea
            containerclassname={isReadonly ? 'display-only secondary' : 'secondary'}
            readOnly={isReadonly}
            name="existingLiabilities"
            fielddata={PROJECTIONS_FRM.fields.existingLiabilities}
            changed={(e, result) => formChange(e, result, 'PROJECTIONS_FRM')}
          />
          <ButtonGroup
            inProgress={inProgress}
            formName="PROJECTIONS_FRM"
            isReadonly={isReadonly}
            isManager={isManager}
            submitted={submitted}
            approved={approved}
            formValid={PROJECTIONS_FRM.meta.isValid}
            submitWithApproval={this.submitWithApproval}
          />
        </Form>
      </div>
    );
  }
}
