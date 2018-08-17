import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Form, Button, Divider, Confirm } from 'semantic-ui-react';
import { FormTextarea, DropZone } from '../../../../../../../theme/form';

@inject('businessAppReviewStore', 'uiStore')
@observer
export default class Projections extends Component {
  onBenchmarkDrop = (files) => {
    this.props.businessAppReviewStore.setFileUploadData('PROJECTIONS_FRM', 'benchmarkUpload', files);
  }
  onRevenueCheckDrop = (files) => {
    this.props.businessAppReviewStore.setFileUploadData('PROJECTIONS_FRM', 'revenueCheckUpload', files);
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

  render() {
    const { PROJECTIONS_FRM, projectionsEleChange } = this.props.businessAppReviewStore;
    const { confirmBox } = this.props.uiStore;
    return (
      <div>
        <Form>
          <Divider section />
          {
            ['compareHistoricalForReasonabless', 'areTheProjectionsComplete', 'revenueCheck'].map(field => (
              <FormTextarea
                key={field}
                name={field}
                fielddata={PROJECTIONS_FRM.fields[field]}
                changed={projectionsEleChange}
                containerclassname="secondary"
              />
            ))
          }
          <DropZone
            name="revenueCheckUpload"
            fielddata={PROJECTIONS_FRM.fields.revenueCheckUpload}
            ondrop={this.onRevenueCheckDrop}
            onremove={this.confirmRemoveDoc}
            uploadtitle="Upload Revenue Check"
            containerclassname="fluid"
          />
          <Divider section />
          {
            ['majorLineItems', 'tiesToLeaseAgreement', 'benchmarkAndPrintComps'].map(field => (
              <FormTextarea
                key={field}
                name={field}
                fielddata={PROJECTIONS_FRM.fields[field]}
                changed={projectionsEleChange}
                containerclassname="secondary"
              />
            ))
          }
          <DropZone
            name="benchmarkUpload"
            fielddata={PROJECTIONS_FRM.fields.benchmarkUpload}
            ondrop={this.onBenchmarkDrop}
            onremove={this.confirmRemoveDoc}
            uploadtitle="Upload Benchmark"
            containerclassname="fluid"
          />
          <Divider section />
          <FormTextarea
            name="requirements"
            fielddata={PROJECTIONS_FRM.fields.requirements}
            changed={projectionsEleChange}
            containerclassname="secondary"
          />
          <Button.Group className="pull-right">
            <Button disabled={!PROJECTIONS_FRM.meta.isValid} secondary >Save</Button>
            <Button disabled={!PROJECTIONS_FRM.meta.isValid} primary size="large" className="very relaxed" type="button">Submit for Approval</Button>
          </Button.Group>
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
