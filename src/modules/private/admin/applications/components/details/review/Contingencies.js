import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Header, Table, Icon, Button, Form, Confirm } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { FormInput } from '../../../../../../../theme/form';

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
      <Table.Row>
        <Table.Cell collapsing>
          <FormInput
            name="contingency"
            fielddata={formData.contingency}
            changed={(e, result) => onchange(e, formName, result, index)}
          />
        </Table.Cell>
        <Table.Cell>
          <FormInput
            name="acceptanceCriteria"
            fielddata={formData.acceptanceCriteria}
            changed={(e, result) => onchange(e, formName, result, index)}
          />
        </Table.Cell>
        {index !== 0 &&
        <Table.Cell collapsing>
          <Link to={match.url} className="icon-link" onClick={e => toggleConfirmModal(e, index, formName)} >
            <Icon className="ns-close-circle" color="grey" />
          </Link>
        </Table.Cell>
        }
      </Table.Row>
    )) : ''
    }
    <Table.Row>
      <Table.Cell collapsing>
        <Button type="button" color="blue" className="ghost-button" onClick={() => addMore(formName)} >+ Add Contingency</Button>
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
      contingenciesEleChange,
      toggleConfirmModal,
      removeData,
    } = this.props.businessAppReviewStore;
    return (
      <div className="inner-content-spacer">
        <Form>
          <Header as="h5">
            Launch
          </Header>
          <Table basic compact inverted className="grey-table">
            <TableHeader />
            <TableBody match={this.props.match} form={LAUNCH_FRM} formName="LAUNCH_FRM" onchange={contingenciesEleChange} addMore={addMore} toggleConfirmModal={this.toggleConfirmModal} />
          </Table>
          <Header as="h5">
            Close
          </Header>
          <Table basic compact inverted className="grey-table">
            <TableHeader />
            <TableBody match={this.props.match} form={CLOSE_FRM} formName="CLOSE_FRM" onchange={contingenciesEleChange} addMore={addMore} toggleConfirmModal={this.toggleConfirmModal} />
          </Table>
          <Button.Group className="pull-right">
            <Button disabled={!(LAUNCH_FRM.meta.isValid && CLOSE_FRM.meta.isValid)} secondary className="relaxed">
              Save
            </Button>
            <Button disabled={!(LAUNCH_FRM.meta.isValid && CLOSE_FRM.meta.isValid)} primary type="button">Submit for Approval</Button>
          </Button.Group>
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
      </div>
    );
  }
}
