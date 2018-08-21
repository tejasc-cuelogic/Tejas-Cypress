/* eslint-disable jsx-a11y/label-has-for */
import React, { Component } from 'react';
import Aux from 'react-aux';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { Grid, Form, Button, Divider, Header, Icon, Confirm, Table } from 'semantic-ui-react';
import { FormTextarea, MaskedInput, FormInput, DropZone, FormDatePicker } from '../../../../../../../theme/form';

@inject('businessAppReviewStore', 'uiStore')
@observer
export default class BusinessPlan extends Component {
  onExperieneFileDrop = (files, name, index) => {
    this.props.businessAppReviewStore.setFileUploadDataWithIndex('CONTROL_PERSONS_FRM', name, files, index);
  }
  onCreditScoreFileDrop = (files, name, index) => {
    this.props.businessAppReviewStore.setFileUploadDataWithIndex('CONTROL_PERSONS_FRM', name, files, index);
  }
  confirmRemoveDoc = (e, name) => {
    e.preventDefault();
    this.props.uiStore.setConfirmBox(name);
  }
  handleDelCancel = () => {
    this.props.uiStore.setConfirmBox('');
  }
  handleDelDoc = (field) => {
    this.props.businessAppReviewStore.removeUploadedData('CONTROL_PERSONS_FRM', field);
    this.props.uiStore.setConfirmBox('');
  }
  toggleConfirmModal = (e, index, formName) => {
    e.preventDefault();
    this.props.businessAppReviewStore.toggleConfirmModal(index, formName);
  }
  render() {
    const {
      SOURCES_FRM,
      USES_FRM,
      BUSINESS_PLAN_FRM,
      CONTROL_PERSONS_FRM,
      businessPlanEleChange,
      businessPlanDateChange,
      controlPersonEleChange,
      controlPersonMaskChange,
      sourceEleChange,
      sourceMaskChange,
      totalSourcesAmount,
      useEleChange,
      useMaskChange,
      totalUsesAmount,
      addMore,
      confirmModal,
      confirmModalName,
      removeData,
    } = this.props.businessAppReviewStore;
    const { confirmBox } = this.props.uiStore;
    return (
      <div className="inner-content-spacer">
        <Form>
          <FormTextarea
            name="locationFeasibility"
            fielddata={BUSINESS_PLAN_FRM.fields.locationFeasibility}
            changed={businessPlanEleChange}
            containerclassname="secondary"
          />
          <Divider section />
          <Header as="h5">
            Control Persons
            <Button color="blue" className="ghost-button" onClick={() => addMore('CONTROL_PERSONS_FRM')} >+ Add Control Person</Button>
          </Header>
          {
              CONTROL_PERSONS_FRM.fields.data.length ?
              CONTROL_PERSONS_FRM.fields.data.map((controlPerson, index) => (
                <Aux>
                  <div className="mb-10">
                    <label>{`Control Person ${index + 1}`}</label>
                    <Link to={this.props.match.url} className="icon-link" onClick={e => this.toggleConfirmModal(e, index, 'CONTROL_PERSONS_FRM')}>
                      <Icon className="ns-close-circle" color="grey" />
                    </Link>
                  </div>
                  <Form.Group widths="equal">
                    <FormInput
                      name="name"
                      fielddata={controlPerson.name}
                      changed={(e, result) => controlPersonEleChange(e, result, index)}
                    />
                    <MaskedInput
                      percentage
                      type="text"
                      name="ownership"
                      fielddata={controlPerson.ownership}
                      changed={values => controlPersonMaskChange(values, index)}
                    />
                    <FormInput
                      name="derogatoryMarks"
                      fielddata={controlPerson.derogatoryMarks}
                      changed={(e, result) => controlPersonEleChange(e, result, index)}
                    />
                  </Form.Group>
                  <Form.Group widths={3}>
                    <FormInput
                      name="experience"
                      fielddata={controlPerson.experience}
                      changed={(e, result) => controlPersonEleChange(e, result, index)}
                    />
                    <FormInput
                      name="creditScore"
                      fielddata={controlPerson.creditScore}
                      changed={(e, result) => controlPersonEleChange(e, result, index)}
                    />
                  </Form.Group>
                  <Form.Group widths={3}>
                    <Form.Field>
                      <DropZone
                        name="experienceFile"
                        fielddata={controlPerson.experienceFile}
                        ondrop={(files, name) => this.onExperieneFileDrop(files, name, index)}
                        onremove={this.confirmRemoveDoc}
                        uploadtitle="Upload Experience File"
                      />
                    </Form.Field>
                    <Form.Field>
                      <DropZone
                        name="creditScoreFile"
                        fielddata={controlPerson.creditScoreFile}
                        ondrop={(files, name) => this.onCreditScoreFileDrop(files, name, index)}
                        onremove={this.confirmRemoveDoc}
                        uploadtitle="Upload Credit Score File"
                      />
                    </Form.Field>
                  </Form.Group>
                </Aux>
              )) : <p>...Loading</p>
          }
          <Divider section />
          <FormTextarea
            name="timingOfOperations"
            fielddata={BUSINESS_PLAN_FRM.fields.timingOfOperations}
            changed={businessPlanEleChange}
            containerclassname="secondary"
          />
          <Divider section />
          <FormTextarea
            name="writeupTieToProjections"
            fielddata={BUSINESS_PLAN_FRM.fields.writeupTieToProjections}
            changed={businessPlanEleChange}
            containerclassname="secondary"
          />
          <Divider section />
          <FormTextarea
            name="isPlanAdequate"
            fielddata={BUSINESS_PLAN_FRM.fields.isPlanAdequate}
            changed={businessPlanEleChange}
            containerclassname="secondary"
          />
          <Divider section />
          <Header as="h5">
            Sources and Uses Chart
          </Header>
          <Grid columns={2}>
            <Grid.Column>
              <Header as="h6">
                Sources
              </Header>
              <Table inverted className="grey-table">
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>Name</Table.HeaderCell>
                    <Table.HeaderCell>Amount</Table.HeaderCell>
                    <Table.HeaderCell />
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {
                  SOURCES_FRM.fields.data.length ?
                  SOURCES_FRM.fields.data.map((source, index) => (
                    <Table.Row key={source}>
                      <Table.Cell collapsing>
                        <FormInput
                          name="name"
                          fielddata={source.name}
                          changed={(e, result) => sourceEleChange(e, result, index)}
                        />
                      </Table.Cell>
                      <Table.Cell>
                        <MaskedInput
                          prefix="$"
                          currency
                          name="amount"
                          fielddata={source.amount}
                          changed={values => sourceMaskChange(values, index)}
                        />
                      </Table.Cell>
                      <Table.Cell collapsing>
                        <Link to={this.props.match.url} className="icon-link" onClick={e => this.toggleConfirmModal(e, index, 'SOURCES_FRM')} >
                          <Icon className="ns-close-circle" color="grey" />
                        </Link>
                      </Table.Cell>
                    </Table.Row>
                  )) : ''
                  }
                  <Table.Row>
                    <Table.Cell collapsing>
                      <Button color="blue" className="ghost-button" onClick={() => addMore('SOURCES_FRM')} >+ Add Source</Button>
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
                <Table.Footer>
                  <Table.Row>
                    <Table.Cell>
                      Total
                    </Table.Cell>
                    <Table.Cell>
                      {totalSourcesAmount}
                    </Table.Cell>
                  </Table.Row>
                </Table.Footer>
              </Table>
            </Grid.Column>
            <Grid.Column>
              <Header as="h6">
              Uses
              </Header>
              <Table inverted className="grey-table">
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>Name</Table.HeaderCell>
                    <Table.HeaderCell>Amount</Table.HeaderCell>
                    <Table.HeaderCell />
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {
                  USES_FRM.fields.data.length ?
                  USES_FRM.fields.data.map((use, index) => (
                    <Table.Row key={use[index]}>
                      <Table.Cell collapsing>
                        <FormInput
                          name="name"
                          fielddata={use.name}
                          changed={(e, result) => useEleChange(e, result, index)}
                        />
                      </Table.Cell>
                      <Table.Cell>
                        <MaskedInput
                          prefix="$"
                          currency
                          name="amount"
                          fielddata={use.amount}
                          changed={values => useMaskChange(values, index)}
                        />
                      </Table.Cell>
                      <Table.Cell collapsing>
                        <Link to={this.props.match.url} className="icon-link" onClick={e => this.toggleConfirmModal(e, index, 'USES_FRM')} >
                          <Icon className="ns-close-circle" color="grey" />
                        </Link>
                      </Table.Cell>
                    </Table.Row>
                  )) : ''
                  }
                  <Table.Row>
                    <Table.Cell collapsing>
                      <Button color="blue" className="ghost-button" onClick={() => addMore('USES_FRM')} >+ Add Use</Button>
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
                <Table.Footer>
                  <Table.Row>
                    <Table.Cell>
                      Total
                    </Table.Cell>
                    <Table.Cell>
                      {totalUsesAmount}
                    </Table.Cell>
                  </Table.Row>
                </Table.Footer>
              </Table>
            </Grid.Column>
          </Grid>
          <Divider section />
          <FormDatePicker
            name="dateOfIncorporation"
            placeholder="12-02-1989"
            selected={BUSINESS_PLAN_FRM.fields.dateOfIncorporation.value ?
              moment(BUSINESS_PLAN_FRM.fields.dateOfIncorporation.value) : null}
            changed={date => businessPlanDateChange(date)}
            fielddata={BUSINESS_PLAN_FRM.fields.dateOfIncorporation}
          />
          <Button.Group className="pull-right">
            <Button disabled={!BUSINESS_PLAN_FRM.meta.isValid} secondary className="relaxed">Save</Button>
            <Button disabled={!BUSINESS_PLAN_FRM.meta.isValid} primary className="relaxed" type="button">Approve Review</Button>
          </Button.Group>
        </Form>
        <Confirm
          header="Confirm"
          content="Are you sure you want to remove this file?"
          open={confirmBox.entity === 'experienceFile' || confirmBox.entity === 'creditScoreFile'}
          onCancel={this.handleDelCancel}
          onConfirm={() => this.handleDelDoc(confirmBox.entity)}
          size="mini"
          className="deletion"
        />
        <Confirm
          header="Confirm"
          content={`Are you sure you want to remove this ${confirmModalName === 'USES_FRM' ? 'use' :
          confirmModalName === 'SOURCES_FRM' ? 'source' : 'control person'}?`}
          open={confirmModal}
          onCancel={this.toggleConfirmModal}
          onConfirm={() => removeData(confirmModalName)}
          size="mini"
          className="deletion"
        />
      </div>
    );
  }
}
