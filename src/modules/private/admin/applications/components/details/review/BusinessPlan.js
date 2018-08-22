/* eslint-disable jsx-a11y/label-has-for */
import React, { Component } from 'react';
import Aux from 'react-aux';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { Grid, Form, Button, Divider, Header, Icon, Confirm, Table } from 'semantic-ui-react';
import { FormTextarea, MaskedInput, FormInput, DropZone, FormDatePicker } from '../../../../../../../theme/form';
import { InlineLoader } from '../../../../../../../theme/shared';

const AddMore = ({
  addMore, formName, title,
}) => (
  <Button size="small" color="blue" className="link-button" onClick={e => addMore(e, formName)} >+ {title}</Button>
);

@inject('businessAppReviewStore', 'uiStore')
@observer
export default class BusinessPlan extends Component {
  onFileDrop = (files, name, index) => {
    this.props.businessAppReviewStore.setFileUploadDataWithIndex('CONTROL_PERSONS_FRM', name, files, index);
  }
  addMore = (e, formName) => {
    e.preventDefault();
    this.props.businessAppReviewStore.addMore(formName);
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
      confirmModal,
      confirmModalName,
      removeData,
      MANAGERS_FRM,
      managerEleChange,
    } = this.props.businessAppReviewStore;
    const { confirmBox } = this.props.uiStore;
    return (
      <Aux>
        <Form>
          <Header as="h4">Location feasibility</Header>
          <FormTextarea
            name="locationFeasibility"
            fielddata={BUSINESS_PLAN_FRM.fields.locationFeasibility}
            changed={businessPlanEleChange}
            containerclassname="secondary"
            hidelabel
          />
          <Divider section />
          <Header as="h4">
            Control Persons
            <Link to={this.props.match.url} className="link" onClick={e => this.addMore(e, 'CONTROL_PERSONS_FRM')}><small>+ Add Control Person</small></Link>
          </Header>
          {
            CONTROL_PERSONS_FRM.fields.data.length ?
            CONTROL_PERSONS_FRM.fields.data.map((controlPerson, index) => (
              <Aux>
                <Header as="h6">
                  {`Control Person ${index + 1}`}
                  {index !== 0 &&
                  <Link to={this.props.match.url} className="link" onClick={e => this.toggleConfirmModal(e, index, 'CONTROL_PERSONS_FRM')}>
                    <Icon className="ns-close-circle" color="grey" />
                  </Link>
                  }
                </Header>
                <div className="featured-section">
                  <Form.Group widths={3}>
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
                        ondrop={(files, name) => this.onFileDrop(files, name, index)}
                        onremove={this.confirmRemoveDoc}
                        uploadtitle="Upload Experience File"
                      />
                    </Form.Field>
                    <Form.Field>
                      <DropZone
                        name="creditScoreFile"
                        fielddata={controlPerson.creditScoreFile}
                        ondrop={(files, name) => this.onFileDrop(files, name, index)}
                        onremove={this.confirmRemoveDoc}
                        uploadtitle="Upload Credit Score File"
                      />
                    </Form.Field>
                  </Form.Group>
                </div>
              </Aux>
            )) : <InlineLoader />
          }
          <Divider section />
          {
            ['timingOfOperations', 'writeupTieToProjections', 'isPlanAdequate'].map(field => (
              <Aux>
                <FormTextarea
                  key={field}
                  name={field}
                  fielddata={BUSINESS_PLAN_FRM.fields[field]}
                  changed={businessPlanEleChange}
                  containerclassname="secondary"
                />
                <Divider section />
              </Aux>
            ))
          }
          <Header as="h4">Sources and Uses Chart</Header>
          <Grid columns={2}>
            <Grid.Column>
              <Header as="h6">Sources</Header>
              <Table basic compact className="form-table">
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
                        <Table.Cell width={8}>
                          <FormInput
                            name="name"
                            fielddata={source.name}
                            changed={(e, result) => sourceEleChange(e, result, index)}
                            size="small"
                          />
                        </Table.Cell>
                        <Table.Cell width={8}>
                          <MaskedInput
                            prefix="$"
                            currency
                            name="amount"
                            fielddata={source.amount}
                            changed={values => sourceMaskChange(values, index)}
                            ishidelabel
                            size="small"
                          />
                        </Table.Cell>
                        {index !== 0 &&
                        <Table.Cell collapsing>
                          <Link to={this.props.match.url} onClick={e => this.toggleConfirmModal(e, index, 'SOURCES_FRM')} >
                            <Icon className="ns-close-circle" color="grey" />
                          </Link>
                        </Table.Cell>
                        }
                      </Table.Row>
                    )) : ''
                  }
                  <Table.Row>
                    <Table.Cell colSpan="3">
                      <AddMore addMore={this.addMore} formName="SOURCES_FRM" title="Add Source" />
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
                <Table.Footer>
                  <Table.Row>
                    <Table.HeaderCell>Total</Table.HeaderCell>
                    <Table.HeaderCell colSpan="2">{totalSourcesAmount}</Table.HeaderCell>
                  </Table.Row>
                </Table.Footer>
              </Table>
            </Grid.Column>
            <Grid.Column>
              <Header as="h6">Uses</Header>
              <Table basic compact className="form-table">
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
                      <Table.Cell width={8}>
                        <FormInput
                          name="name"
                          fielddata={use.name}
                          changed={(e, result) => useEleChange(e, result, index)}
                          size="small"
                        />
                      </Table.Cell>
                      <Table.Cell width={8}>
                        <MaskedInput
                          prefix="$"
                          currency
                          name="amount"
                          fielddata={use.amount}
                          changed={values => useMaskChange(values, index)}
                          ishidelabel
                          size="small"
                        />
                      </Table.Cell>
                      {index !== 0 &&
                      <Table.Cell collapsing>
                        <Link to={this.props.match.url} onClick={e => this.toggleConfirmModal(e, index, 'USES_FRM')} >
                          <Icon className="ns-close-circle" color="grey" />
                        </Link>
                      </Table.Cell>
                      }
                    </Table.Row>
                  )) : ''
                  }
                  <Table.Row>
                    <Table.Cell colSpan="3">
                      <AddMore addMore={this.addMore} formName="USES_FRM" title="Add Use" />
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
                <Table.Footer>
                  <Table.Row>
                    <Table.HeaderCell>Total</Table.HeaderCell>
                    <Table.HeaderCell colSpan="2">{totalUsesAmount}</Table.HeaderCell>
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
            containerwidth={5}
          />
          <div className="right-align">
            <Button.Group>
              <Button disabled={!BUSINESS_PLAN_FRM.meta.isValid} secondary className="relaxed">Save</Button>
              <Button disabled={!BUSINESS_PLAN_FRM.meta.isValid} primary type="button">Approve Review</Button>
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
              <Button disabled className="relaxed" secondary>Deny</Button>
              <Button disabled primary className="relaxed" type="button">Approve</Button>
            </Button.Group>
          </div>
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
      </Aux>
    );
  }
}
