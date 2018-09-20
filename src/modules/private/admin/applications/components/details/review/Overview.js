/* eslint-disable jsx-a11y/label-has-for */
import React, { Component } from 'react';
import Aux from 'react-aux';
import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Form, Header, Button, Confirm } from 'semantic-ui-react';
import { FormInput } from '../../../../../../../theme/form';
import ManagerOverview from './ManagerOverview';

@inject('businessAppReviewStore')
@observer
export default class Overview extends Component {
  componentWillMount() {
    this.props.businessAppReviewStore.setFormData('OVERVIEW_FRM', 'review', 'criticalPoint');
  }
  addCriticalPoint = (e) => {
    e.preventDefault();
    this.props.businessAppReviewStore.addMore('OVERVIEW_FRM', 'criticalPoint');
  }
  toggleConfirmModal = (e, index, formName) => {
    e.preventDefault();
    this.props.businessAppReviewStore.toggleConfirmModal(index, formName);
  }
  submit = () => {
    this.props.businessAppReviewStore.saveReviewForms('OVERVIEW_FRM');
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
    return (
      <Aux>
        <Header as="h4">
          Overview
          <Link to={this.props.match.url} className="link" onClick={this.addCriticalPoint}><small>+ Add Critical Point</small></Link>
        </Header>
        <Form onSubmit={this.submit}>
          {
            OVERVIEW_FRM.fields.criticalPoint.map((description, index) => (
              <FormInput
                type="text"
                name="description"
                label={`Critical Point ${index + 1}`}
                fielddata={description}
                changed={(e, result) => formChangeWithIndex(e, result, 'OVERVIEW_FRM', 'criticalPoint', index)}
                removed={e => this.toggleConfirmModal(e, index, 'OVERVIEW_FRM')}
                linkto={this.props.match.url}
              />
            ))
          }
          <div className="right-align">
            <Button.Group>
              <Button disabled={!(OVERVIEW_FRM.meta.isValid && OVERVIEW_FRM.fields.criticalPoint.length)} secondary className="relaxed">Save</Button>
              <Button disabled={!(OVERVIEW_FRM.meta.isValid && OVERVIEW_FRM.fields.criticalPoint.length)} primary type="button">Submit for Approval</Button>
            </Button.Group>
          </div>
          <ManagerOverview form={OVERVIEW_MANAGER_FRM} formName="OVERVIEW_MANAGER_FRM" />
        </Form>
        <Confirm
          header="Confirm"
          content="Are you sure you want to remove this critical point?"
          open={confirmModal}
          onCancel={toggleConfirmModal}
          onConfirm={() => removeData(confirmModalName, 'criticalPoint')}
          size="mini"
          className="deletion"
        />
      </Aux>
    );
  }
}
