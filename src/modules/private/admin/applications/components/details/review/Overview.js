/* eslint-disable jsx-a11y/label-has-for */
import React, { Component } from 'react';
import Aux from 'react-aux';
import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Form, Header, Button, Confirm } from 'semantic-ui-react';
import { FormInput } from '../../../../../../../theme/form';
import ManagerOverview from './ManagerOverview';

@inject('businessAppReviewStore', 'businessAppStore')
@observer
export default class Overview extends Component {
  componentWillMount() {
    this.props.businessAppReviewStore.setFormData('OVERVIEW_FRM', 'review.overview.criticalPoint.description');
  }
  addCriticalPoint = (e) => {
    e.preventDefault();
    this.props.businessAppReviewStore.addMore('OVERVIEW_FRM', 'data');
  }
  toggleConfirmModal = (e, index, formName) => {
    e.preventDefault();
    this.props.businessAppReviewStore.toggleConfirmModal(index, formName);
  }
  submit = () => {
    this.props.businessAppReviewStore.saveReviewForms('OVERVIEW_FRM');
  }
  submitWithApproval = (form, action) => {
    this.props.businessAppReviewStore.approveOrSubmitReviewForms(form, action);
  }
  render() {
    const {
      OVERVIEW_FRM,
      OVERVIEW_MANAGER_FRM,
      formChangeWithIndex,
      confirmModal,
      toggleConfirmModal,
      removeData,
      confirmModalName,
    } = this.props.businessAppReviewStore;
    const { businessApplicationDetailsAdmin } = this.props.businessAppStore;
    const { review } = businessApplicationDetailsAdmin;
    const submitted = (review && review.overview && review.overview.criticalPoint &&
      review.overview.criticalPoint.submitted) ? review.overview.criticalPoint.submitted : null;
    return (
      <Aux>
        <Header as="h4">
          Overview
          <Link to={this.props.match.url} className="link" onClick={this.addCriticalPoint}><small>+ Add Critical Point</small></Link>
        </Header>
        <Form onSubmit={this.submit}>
          {
            OVERVIEW_FRM.fields.data.map((field, index) => (
              <FormInput
                type="text"
                name="description"
                label={`Critical Point ${index + 1}`}
                fielddata={field.description}
                changed={(e, result) => formChangeWithIndex(e, result, 'OVERVIEW_FRM', 'data', index)}
                removed={e => this.toggleConfirmModal(e, index, 'OVERVIEW_FRM')}
                linkto={this.props.match.url}
              />
            ))
          }
          <div className="right-align">
            <Button.Group>
              {!submitted &&
              <Button disabled={!(OVERVIEW_FRM.meta.isValid)} secondary className="relaxed">Save</Button>
              }
              <Button onClick={() => this.submitWithApproval('OVERVIEW_FRM', 'REVIEW_SUBMITTED')} disabled={(!(OVERVIEW_FRM.meta.isValid) || submitted)} primary={!submitted} type="button">{submitted ? 'Awaiting Manager Approval' : 'Submit for Approval'}</Button>
            </Button.Group>
          </div>
          {submitted &&
          <ManagerOverview form={OVERVIEW_MANAGER_FRM} formName="OVERVIEW_MANAGER_FRM" />
          }
        </Form>
        <Confirm
          header="Confirm"
          content="Are you sure you want to remove this critical point?"
          open={confirmModal}
          onCancel={toggleConfirmModal}
          onConfirm={() => removeData(confirmModalName, 'data')}
          size="mini"
          className="deletion"
        />
      </Aux>
    );
  }
}
