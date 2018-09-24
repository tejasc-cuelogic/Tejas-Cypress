import React, { Component } from 'react';
import Aux from 'react-aux';
import { inject, observer } from 'mobx-react';
import { Header, Table, Icon, Button, Form, Confirm } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { FormInput } from '../../../../../../../theme/form';
import ManagerOverview from './ManagerOverview';

const TableHeader = () => (
  <Table.Header>
    <Table.Row>
      <Table.HeaderCell>Contingency</Table.HeaderCell>
      <Table.HeaderCell>Acceptance Criteria</Table.HeaderCell>
      <Table.HeaderCell />
    </Table.Row>
  </Table.Header>
);

const TableBody = ({
  match, fields, formName, arrayName, onchange, addMore, toggleConfirmModal,
}) => (
  <Table.Body>
    {
    fields.length ?
    fields.map((formData, index) => (
      <Table.Row verticalAlign="top">
        <Table.Cell width={5}>
          <FormInput
            name="contingency"
            fielddata={formData.contingency}
            changed={(e, result) => onchange(e, result, formName, arrayName, index)}
            size="small"
          />
        </Table.Cell>
        <Table.Cell>
          <FormInput
            name="acceptance"
            fielddata={formData.acceptance}
            changed={(e, result) => onchange(e, result, formName, arrayName, index)}
            size="small"
          />
        </Table.Cell>
        <Table.Cell collapsing>
          <Link to={match.url} className="icon-link" onClick={e => toggleConfirmModal(e, index, arrayName)} >
            <Icon className="ns-close-circle" color="grey" />
          </Link>
        </Table.Cell>
      </Table.Row>
    )) : ''
    }
    <Table.Row>
      <Table.Cell colSpan="3">
        <Button size="small" color="blue" className="link-button" onClick={() => addMore(formName, arrayName)}>+ Add Contingency</Button>
      </Table.Cell>
    </Table.Row>
  </Table.Body>
);

@inject('businessAppReviewStore')
@observer
export default class Contingencies extends Component {
  componentWillMount() {
    this.props.businessAppReviewStore.setFormData('CONTINGENCY_FRM', 'review.contingencies');
  }
  toggleConfirmModal = (e, index, formName) => {
    e.preventDefault();
    this.props.businessAppReviewStore.toggleConfirmModal(index, formName);
  }
  submit = () => {
    this.props.businessAppReviewStore.saveReviewForms('CONTINGENCY_FRM');
  }
  render() {
    const {
      CONTINGENCY_FRM,
      confirmModal,
      confirmModalName,
      addMore,
      formChangeWithIndex,
      toggleConfirmModal,
      removeData,
      CONTINGENCY_MANAGER_FRM,
    } = this.props.businessAppReviewStore;
    return (
      <Aux>
        <Form onSubmit={this.submit}>
          <Header as="h5">
            Launch
          </Header>
          <Table basic compact className="form-table">
            <TableHeader />
            <TableBody match={this.props.match} arrayName="launch" fields={CONTINGENCY_FRM.fields.launch} formName="CONTINGENCY_FRM" onchange={formChangeWithIndex} addMore={addMore} toggleConfirmModal={this.toggleConfirmModal} />
          </Table>
          <Header as="h5">
            Close
          </Header>
          <Table basic compact className="form-table">
            <TableHeader />
            <TableBody match={this.props.match} arrayName="close" fields={CONTINGENCY_FRM.fields.close} formName="CONTINGENCY_FRM" onchange={formChangeWithIndex} addMore={addMore} toggleConfirmModal={this.toggleConfirmModal} />
          </Table>
          <div className="right-align">
            <Button.Group className="mt-20">
              <Button className="" disabled={!CONTINGENCY_FRM.meta.isValid} secondary>
                Save
              </Button>
              <Button disabled={!CONTINGENCY_FRM.meta.isValid} primary type="button">Submit for Approval</Button>
            </Button.Group>
          </div>
          <ManagerOverview form={CONTINGENCY_MANAGER_FRM} formName="CONTINGENCY_MANAGER_FRM" />
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
