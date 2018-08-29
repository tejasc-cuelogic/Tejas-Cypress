import React, { Component } from 'react';
import Aux from 'react-aux';
import { inject, observer } from 'mobx-react';
import { Header, Table, Icon, Button, Form, Confirm, Divider } from 'semantic-ui-react';
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
  match, form, formName, onchange, addMore, toggleConfirmModal,
}) => (
  <Table.Body>
    {
    form.fields.data.length ?
    form.fields.data.map((formData, index) => (
      <Table.Row verticalAlign="top">
        <Table.Cell width={5}>
          <FormInput
            name="contingency"
            fielddata={formData.contingency}
            changed={(e, result) => onchange(e, result, formName, index)}
            size="small"
          />
        </Table.Cell>
        <Table.Cell>
          <FormInput
            name="acceptanceCriteria"
            fielddata={formData.acceptanceCriteria}
            changed={(e, result) => onchange(e, result, formName, index)}
            size="small"
          />
        </Table.Cell>
        <Table.Cell collapsing>
          <Link to={match.url} className="icon-link" onClick={e => toggleConfirmModal(e, index, formName)} >
            <Icon className="ns-close-circle" color="grey" />
          </Link>
        </Table.Cell>
      </Table.Row>
    )) : ''
    }
    <Table.Row>
      <Table.Cell colSpan="3">
        <Button size="small" color="blue" className="link-button" onClick={() => addMore(formName)}>+ Add Contingency</Button>
      </Table.Cell>
    </Table.Row>
  </Table.Body>
);

@inject('businessAppReviewStore')
@observer
export default class Contingencies extends Component {
  toggleConfirmModal = (e, index, formName) => {
    e.preventDefault();
    this.props.businessAppReviewStore.toggleConfirmModal(index, formName);
  }
  render() {
    const {
      LAUNCH_FRM,
      CLOSE_FRM,
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
        <Form>
          <Header as="h5">
            Launch
          </Header>
          <Table basic compact className="form-table">
            <TableHeader />
            <TableBody match={this.props.match} form={LAUNCH_FRM} formName="LAUNCH_FRM" onchange={formChangeWithIndex} addMore={addMore} toggleConfirmModal={this.toggleConfirmModal} />
          </Table>
          <Header as="h5">
            Close
          </Header>
          <Table basic compact className="form-table">
            <TableHeader />
            <TableBody match={this.props.match} form={CLOSE_FRM} formName="CLOSE_FRM" onchange={formChangeWithIndex} addMore={addMore} toggleConfirmModal={this.toggleConfirmModal} />
          </Table>
          <div className="right-align">
            <Button.Group className="mt-20">
              <Button disabled={!(LAUNCH_FRM.meta.isValid && CLOSE_FRM.meta.isValid)} secondary>
                Save
              </Button>
              <Button disabled={!(LAUNCH_FRM.meta.isValid && CLOSE_FRM.meta.isValid)} primary type="button">Submit for Approval</Button>
            </Button.Group>
          </div>
          <Divider section />
          <ManagerOverview form={CONTINGENCY_MANAGER_FRM} formName="CONTINGENCY_MANAGER_FRM" />
        </Form>
        <Confirm
          header="Confirm"
          content="Are you sure you want to remove this contingency?"
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
