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
  addCriticalPoint = (e) => {
    e.preventDefault();
    this.props.businessAppReviewStore.addMore('OVERVIEW_FRM');
  }
  toggleConfirmModal = (e, index, formName) => {
    e.preventDefault();
    this.props.businessAppReviewStore.toggleConfirmModal(index, formName);
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
          <Link to={this.props.match.url} className="link" onClick={e => this.addCriticalPoint(e)}><small>+ Add Critical Point</small></Link>
        </Header>
        <Form>
          {
            OVERVIEW_FRM.fields.data.map((overview, index) => (
              <FormInput
                type="text"
                name="criticalPoint"
                label={`Critical Point ${index + 1}`}
                fielddata={overview.criticalPoint}
                changed={(e, result) => formChangeWithIndex(e, result, 'OVERVIEW_FRM', index)}
                removed={e => this.toggleConfirmModal(e, index, 'OVERVIEW_FRM')}
                linkto={this.props.match.url}
              />
            ))
          }
          <div className="right-align">
            <Button.Group>
              <Button disabled={!OVERVIEW_FRM.meta.isValid} secondary className="relaxed">Save</Button>
              <Button disabled={!OVERVIEW_FRM.meta.isValid} primary type="button">Submit for Approval</Button>
            </Button.Group>
          </div>
          <ManagerOverview form={OVERVIEW_MANAGER_FRM} formName="OVERVIEW_MANAGER_FRM" />
        </Form>
        <Confirm
          header="Confirm"
          content="Are you sure you want to remove this critical point?"
          open={confirmModal}
          onCancel={toggleConfirmModal}
          onConfirm={() => removeData(confirmModalName)}
          size="mini"
          className="deletion"
        />
      </Aux>
    );
  }
}
