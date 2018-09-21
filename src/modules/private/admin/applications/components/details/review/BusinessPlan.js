/* eslint-disable jsx-a11y/label-has-for */
import React, { Component } from 'react';
import Aux from 'react-aux';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import { Grid, Form, Button, Divider, Header, Icon, Confirm, Table } from 'semantic-ui-react';
import { FormTextarea, MaskedInput, FormInput, DropZone } from '../../../../../../../theme/form';
import ManagerOverview from './ManagerOverview';
import Helper from '../../../../../../../helper/utility';

const AddMore = ({
  addMore, formName, arrayName, title,
}) => (
  <Button size="small" color="blue" className="link-button" onClick={e => addMore(e, formName, arrayName)} >+ {title}</Button>
);

@inject('businessAppReviewStore', 'uiStore')
@observer
export default class BusinessPlan extends Component {
  onFileDrop = (files, name, index) => {
    this.props.businessAppReviewStore.setFileUploadData('BUSINESS_PLAN_FRM', 'control_persons', name, files, index);
  }
  addMore = (e, formName, arrayName = 'data') => {
    e.preventDefault();
    this.props.businessAppReviewStore.addMore(formName, arrayName);
  }
  confirmRemoveDoc = (e, name, index) => {
    e.preventDefault();
    this.props.uiStore.setConfirmBox(name, index);
  }
  handleDelCancel = () => {
    this.props.uiStore.setConfirmBox('');
  }
  handleDelDoc = (field, index) => {
    this.props.businessAppReviewStore.removeUploadedData('CONTROL_PERSONS_FRM', field, index);
    this.props.uiStore.setConfirmBox('');
  }
  toggleConfirmModal = (e, index, formName) => {
    e.preventDefault();
    this.props.businessAppReviewStore.toggleConfirmModal(index, formName);
  }
  submit = (e) => {
    e.preventDefault();
    this.props.businessAppReviewStore.saveReviewForms('BUSINESS_PLAN_FRM');
  }
  render() {
    const {
      BUSINESS_PLAN_FRM,
      formChangeWithIndex,
      controlPersonMaskChange,
      totalSourcesAmount,
      maskChangeWithIndex,
      totalUsesAmount,
      confirmModal,
      confirmModalName,
      removeData,
      BUSINESS_PLAN_MANAGER_FRM,
    } = this.props.businessAppReviewStore;
    const { confirmBox } = this.props.uiStore;
    return (
      <Aux>
        <Form onSubmit={this.submit}>
          <Header as="h4">Location feasibility</Header>
          <FormTextarea
            name="locationFeasibility"
            fielddata={BUSINESS_PLAN_FRM.fields.locationFeasibility}
            changed={(e, result) => formChangeWithIndex(e, result, 'BUSINESS_PLAN_FRM')}
            containerclassname="secondary"
            hidelabel
          />
          <Divider section />
          <Header as="h4">
            Control Persons
            <Link to={this.props.match.url} className="link" onClick={e => this.addMore(e, 'BUSINESS_PLAN_FRM', 'control_persons')}><small>+ Add Control Person</small></Link>
          </Header>
          {
            BUSINESS_PLAN_FRM.fields.control_persons.map((controlPerson, index) => (
              <Aux>
                <Header as="h6">
                  {`Control Person ${index + 1}`}
                  <Link to={this.props.match.url} className="link" onClick={e => this.toggleConfirmModal(e, index, 'control_persons')}>
                    <Icon className="ns-close-circle" color="grey" />
                  </Link>
                </Header>
                <div className="featured-section">
                  <Form.Group widths={3}>
                    <FormInput
                      name="name"
                      fielddata={controlPerson.name}
                      changed={(e, result) => formChangeWithIndex(e, result, 'BUSINESS_PLAN_FRM', 'control_persons', index)}
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
                      changed={(e, result) => formChangeWithIndex(e, result, 'BUSINESS_PLAN_FRM', 'control_persons', index)}
                    />
                  </Form.Group>
                  <Form.Group widths={3}>
                    <FormInput
                      name="experience"
                      fielddata={controlPerson.experience}
                      changed={(e, result) => formChangeWithIndex(e, result, 'BUSINESS_PLAN_FRM', 'control_persons', index)}
                    />
                    <FormInput
                      name="creditScore"
                      fielddata={controlPerson.creditScore}
                      changed={(e, result) => formChangeWithIndex(e, result, 'BUSINESS_PLAN_FRM', 'control_persons', index)}
                    />
                  </Form.Group>
                  <Form.Group widths={3}>
                    <Form.Field>
                      <DropZone
                        name="experienceFile"
                        fielddata={controlPerson.experienceFile}
                        ondrop={(files, name) => this.onFileDrop(files, name, index)}
                        onremove={(e, name) => this.confirmRemoveDoc(e, name, index)}
                        uploadtitle="Upload Experience File"
                      />
                    </Form.Field>
                    <Form.Field>
                      <DropZone
                        name="creditScoreFile"
                        fielddata={controlPerson.creditScoreFile}
                        ondrop={(files, name) => this.onFileDrop(files, name, index)}
                        onremove={(e, name) => this.confirmRemoveDoc(e, name, index)}
                        uploadtitle="Upload Credit Score File"
                      />
                    </Form.Field>
                  </Form.Group>
                </div>
              </Aux>
            ))
          }
          <Divider section />
          {
            ['timingOfOperations', 'writeupTieToProjections', 'isPlanAdequate'].map(field => (
              <Aux>
                <FormTextarea
                  key={field}
                  name={field}
                  fielddata={BUSINESS_PLAN_FRM.fields[field]}
                  changed={(e, result) => formChangeWithIndex(e, result, 'BUSINESS_PLAN_FRM')}
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
                    BUSINESS_PLAN_FRM.fields.sources.length ?
                    BUSINESS_PLAN_FRM.fields.sources.map((source, index) => (
                      <Table.Row key={source} verticalAlign="top">
                        <Table.Cell width={8}>
                          <FormInput
                            name="name"
                            fielddata={source.name}
                            changed={(e, result) => formChangeWithIndex(e, result, 'BUSINESS_PLAN_FRM', 'sources', index)}
                            size="small"
                          />
                        </Table.Cell>
                        <Table.Cell width={8}>
                          <MaskedInput
                            prefix="$"
                            currency
                            name="amount"
                            fielddata={source.amount}
                            changed={(values, field) => maskChangeWithIndex(values, 'BUSINESS_PLAN_FRM', 'sources', field, index)}
                            ishidelabel
                            size="small"
                          />
                        </Table.Cell>
                        <Table.Cell collapsing>
                          <Link to={this.props.match.url} onClick={e => this.toggleConfirmModal(e, index, 'sources')} >
                            <Icon className="ns-close-circle" color="grey" />
                          </Link>
                        </Table.Cell>
                      </Table.Row>
                    )) : ''
                  }
                  <Table.Row>
                    <Table.Cell colSpan="3">
                      <AddMore addMore={this.addMore} arrayName="sources" formName="BUSINESS_PLAN_FRM" title="Add Source" />
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
                <Table.Footer>
                  <Table.Row>
                    <Table.HeaderCell>Total</Table.HeaderCell>
                    <Table.HeaderCell colSpan="2">{Helper.CurrencyFormat(totalSourcesAmount)}</Table.HeaderCell>
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
                  BUSINESS_PLAN_FRM.fields.uses.length ?
                  BUSINESS_PLAN_FRM.fields.uses.map((use, index) => (
                    <Table.Row key={use[index]} verticalAlign="top">
                      <Table.Cell width={8}>
                        <FormInput
                          name="name"
                          fielddata={use.name}
                          changed={(e, result) => formChangeWithIndex(e, result, 'BUSINESS_PLAN_FRM', 'uses', index)}
                          size="small"
                        />
                      </Table.Cell>
                      <Table.Cell width={8}>
                        <MaskedInput
                          prefix="$"
                          currency
                          name="amount"
                          fielddata={use.amount}
                          changed={(values, field) => maskChangeWithIndex(values, 'BUSINESS_PLAN_FRM', 'uses', field, index)}
                          ishidelabel
                          size="small"
                        />
                      </Table.Cell>
                      <Table.Cell collapsing>
                        <Link to={this.props.match.url} onClick={e => this.toggleConfirmModal(e, index, 'uses')} >
                          <Icon className="ns-close-circle" color="grey" />
                        </Link>
                      </Table.Cell>
                    </Table.Row>
                  )) : ''
                  }
                  <Table.Row>
                    <Table.Cell colSpan="3">
                      <AddMore addMore={this.addMore} arrayName="uses" formName="BUSINESS_PLAN_FRM" title="Add Use" />
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
                <Table.Footer>
                  <Table.Row>
                    <Table.HeaderCell>Total</Table.HeaderCell>
                    <Table.HeaderCell colSpan="2">{Helper.CurrencyFormat(totalUsesAmount)}</Table.HeaderCell>
                  </Table.Row>
                </Table.Footer>
              </Table>
            </Grid.Column>
          </Grid>
          <Divider section />
          <MaskedInput
            name="dateOfIncorporation"
            fielddata={BUSINESS_PLAN_FRM.fields.dateOfIncorporation}
            format="##-##-####"
            changed={(values, field) => maskChangeWithIndex(values, 'BUSINESS_PLAN_FRM', '', field)}
            dateOfBirth
          />
          <div className="right-align">
            <Button.Group>
              <Button disabled={!BUSINESS_PLAN_FRM.meta.isValid} secondary className="relaxed">Save</Button>
              <Button disabled={!BUSINESS_PLAN_FRM.meta.isValid} primary type="button">Approve Review</Button>
            </Button.Group>
          </div>
          <ManagerOverview form={BUSINESS_PLAN_MANAGER_FRM} formName="BUSINESS_PLAN_MANAGER_FRM" />
        </Form>
        <Confirm
          header="Confirm"
          content="Are you sure you want to remove this file?"
          open={confirmBox.entity === 'experienceFile' || confirmBox.entity === 'creditScoreFile'}
          onCancel={this.handleDelCancel}
          onConfirm={() => this.handleDelDoc(confirmBox.entity, confirmBox.refId)}
          size="mini"
          className="deletion"
        />
        <Confirm
          header="Confirm"
          content={`Are you sure you want to remove this ${confirmModalName === 'uses' ? 'use' :
          confirmModalName === 'sources' ? 'source' : 'control person'}?`}
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
