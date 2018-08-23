import React, { Component } from 'react';
import Aux from 'react-aux';
import { inject, observer } from 'mobx-react';
import { Form, Button, Divider, Confirm, Header } from 'semantic-ui-react';
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
    const {
      PROJECTIONS_FRM,
      projectionsEleChange,
      MANAGERS_FRM,
      managerEleChange,
    } = this.props.businessAppReviewStore;
    const { confirmBox } = this.props.uiStore;
    return (
      <div>
        <Form>
          {
            ['compareHistoricalForReasonabless', 'areTheProjectionsComplete', 'revenueCheck'].map((field, index) => (
              <Aux>
                <FormTextarea
                  key={field}
                  name={field}
                  fielddata={PROJECTIONS_FRM.fields[field]}
                  changed={projectionsEleChange}
                  containerclassname="secondary"
                />
                {index !== 2 &&
                  <Divider section />
                }
              </Aux>
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
            ['majorLineItems', 'tiesToLeaseAgreement', 'benchmarkAndPrintComps'].map((field, index) => (
              <Aux>
                <FormTextarea
                  key={field}
                  name={field}
                  fielddata={PROJECTIONS_FRM.fields[field]}
                  changed={projectionsEleChange}
                  containerclassname="secondary"
                />
                {index !== 2 &&
                <Divider section />
                }
              </Aux>
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
          <div className="right-align">
            <Button.Group>
              <Button disabled={!PROJECTIONS_FRM.meta.isValid} secondary className="relaxed">Save</Button>
              <Button disabled={!PROJECTIONS_FRM.meta.isValid} primary type="button">Submit for Approval</Button>
            </Button.Group>
          </div>
          <Divider section />
          <Header as="h4">Manager</Header>
          <FormTextarea
            name="managerOverview"
            fielddata={MANAGERS_FRM.fields.managerOverview}
            changed={managerEleChange}
            containerclassname="secondary"
          />
          <div className="right-align">
            <Button.Group>
              <Button disabled={!MANAGERS_FRM.meta.isValid} className="relaxed" secondary>Deny</Button>
              <Button disabled={!MANAGERS_FRM.meta.isValid} primary className="relaxed" type="button">Approve</Button>
            </Button.Group>
          </div>
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
