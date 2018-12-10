import React, { Component } from 'react';
import Aux from 'react-aux';
import { inject, observer } from 'mobx-react';
import { Header, Table, Icon, Button, Form, Confirm } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { FormInput } from '../../../../../../../theme/form';
import ManagerOverview from './ManagerOverview';
import ButtonGroup from './ButtonGroup';
import { InlineLoader } from '../../../../../../../theme/shared';

const TableHeader = ({ isReadonly }) => (
  <Table.Header>
    <Table.Row>
      <Table.HeaderCell>Contingency</Table.HeaderCell>
      <Table.HeaderCell>Acceptance Criteria</Table.HeaderCell>
      {!isReadonly && <Table.HeaderCell /> }
    </Table.Row>
  </Table.Header>
);

const TableBody = ({
  match, fields, formName, arrayName, onchange, addMore, toggleConfirmModal, isReadonly,
}) => (
  <Table.Body>
    {
    fields.length ?
    fields.map((formData, index) => (
      <Table.Row verticalAlign="top">
        <Table.Cell width={5}>
          <FormInput
            containerclassname={isReadonly ? 'display-only' : ''}
            readOnly={isReadonly}
            name="contingency"
            fielddata={formData.contingency}
            changed={(e, result) => onchange(e, result, formName, arrayName, index)}
            size="small"
          />
        </Table.Cell>
        <Table.Cell>
          <FormInput
            containerclassname={isReadonly ? 'display-only' : ''}
            readOnly={isReadonly}
            name="acceptance"
            fielddata={formData.acceptance}
            changed={(e, result) => onchange(e, result, formName, arrayName, index)}
            size="small"
          />
        </Table.Cell>
        {!isReadonly &&
        <Table.Cell collapsing>
          {fields.length > 1 &&
          <Link to={match.url} className="icon-link" onClick={e => toggleConfirmModal(e, index, arrayName)} >
            <Icon className="ns-close-circle" color="grey" />
          </Link>
          }
        </Table.Cell>
        }
      </Table.Row>
    )) : ''
    }
    {!isReadonly &&
    <Table.Row>
      <Table.Cell colSpan="3">
        {fields.length < 5 &&
        <Button size="small" color="blue" className="link-button" type="button" onClick={() => addMore(formName, arrayName)}>+ Add Contingency</Button>
        }
      </Table.Cell>
    </Table.Row>
    }
  </Table.Body>
);

@inject('businessAppReviewStore', 'businessAppStore', 'userStore')
@observer
export default class Contingencies extends Component {
  componentWillMount() {
    if (!this.props.businessAppReviewStore.initLoad.includes('CONTINGENCY_FRM')) {
      this.props.businessAppReviewStore.setFormData('CONTINGENCY_FRM', 'review.contingencies');
    }
    this.props.businessAppReviewStore.setFormData('MANAGERS_FRM', 'review.contingencies.managerOverview');
  }
  toggleConfirmModal = (e, index, formName) => {
    e.preventDefault();
    this.props.businessAppReviewStore.toggleConfirmModal(index, formName);
  }
  submit = () => {
    this.props.businessAppReviewStore.saveReviewForms('CONTINGENCY_FRM');
  }
  submitWithApproval = (form, action) => {
    this.props.businessAppReviewStore.saveReviewForms(form, action);
  }
  render() {
    const {
      CONTINGENCY_FRM, confirmModal, confirmModalName, addMore, formChangeWithIndex,
      toggleConfirmModal, removeData, inProgress,
    } = this.props.businessAppReviewStore;
    const access = this.props.userStore.myAccessForModule('APPLICATIONS');
    const isManager = access.asManager;
    const {
      businessApplicationDetailsAdmin, applicationReviewLoading,
    } = this.props.businessAppStore;
    const { review, applicationStatus } = businessApplicationDetailsAdmin;
    const submitted = (review && review.contingencies && review.contingencies &&
      review.contingencies.submitted) ? review.contingencies.submitted : null;
    const approved = (review && review.contingencies && review.contingencies &&
      review.contingencies.approved) ? review.contingencies.approved : null;
    const isReadonly = ((((approved && approved.status) || (submitted))
      && !isManager) || (isManager && approved && approved.status));
    if (applicationReviewLoading) {
      return <InlineLoader />;
    }
    return (
      <Aux>
        <Form onSubmit={this.submit}>
          <ManagerOverview applicationStatus={applicationStatus} submitted={submitted} isManager={isManager} formName="CONTINGENCY_FRM" approved={approved} isReadonly={isReadonly} isValid={CONTINGENCY_FRM.meta.isValid} />
          <Header as="h5">
            Launch
          </Header>
          <Table basic compact className="form-table">
            <TableHeader isReadonly={isReadonly} />
            <TableBody isReadonly={isReadonly} match={this.props.match} arrayName="launch" fields={CONTINGENCY_FRM.fields.launch} formName="CONTINGENCY_FRM" onchange={formChangeWithIndex} addMore={addMore} toggleConfirmModal={this.toggleConfirmModal} />
          </Table>
          <Header as="h5">
            Close
          </Header>
          <Table basic compact className="form-table">
            <TableHeader isReadonly={isReadonly} />
            <TableBody isReadonly={isReadonly} match={this.props.match} arrayName="close" fields={CONTINGENCY_FRM.fields.close} formName="CONTINGENCY_FRM" onchange={formChangeWithIndex} addMore={addMore} toggleConfirmModal={this.toggleConfirmModal} />
          </Table>
          <ButtonGroup
            inProgress={inProgress}
            formName="CONTINGENCY_FRM"
            isReadonly={isReadonly}
            isManager={isManager}
            submitted={submitted}
            approved={approved}
            formValid={CONTINGENCY_FRM.meta.isValid}
            submitWithApproval={this.submitWithApproval}
          />
        </Form>
        <Confirm
          header="Confirm"
          content="Are you sure you want to remove this contingency?"
          open={confirmModal}
          onCancel={toggleConfirmModal}
          onConfirm={() => removeData('CONTINGENCY_FRM', confirmModalName)}
          size="mini"
          className="deletion"
        />
      </Aux>
    );
  }
}
