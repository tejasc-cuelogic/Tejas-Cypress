/* eslint-disable jsx-a11y/label-has-for */
import React, { Component } from 'react';
import Aux from 'react-aux';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import { Grid, Form, Button, Divider, Header, Icon, Confirm, Table } from 'semantic-ui-react';
import { FormTextarea, MaskedInput, FormInput, DropZoneConfirm as DropZone } from '../../../../../../../theme/form';
import ManagerOverview from './ManagerOverview';
import Helper from '../../../../../../../helper/utility';
import ButtonGroup from './ButtonGroup';
import { InlineLoader } from '../../../../../../../theme/shared';

const AddMore = ({
  addMore, formName, arrayName, title,
}) => (
  <Button size="small" color="blue" className="link-button" onClick={e => addMore(e, formName, arrayName)} >+ {title}</Button>
);

@inject('businessAppReviewStore', 'businessAppStore', 'userStore')
@observer
export default class BusinessPlan extends Component {
  componentWillMount() {
    if (!this.props.businessAppReviewStore.initLoad.includes('BUSINESS_PLAN_FRM')) {
      this.props.businessAppReviewStore.setFormData('BUSINESS_PLAN_FRM', 'review.businessPlan');
    }
    this.props.businessAppReviewStore.setFormData('MANAGERS_FRM', 'review.businessPlan.managerOverview');
  }
  onFileDrop = (files, name, index) => {
    this.props.businessAppReviewStore.setFileUploadData('BUSINESS_PLAN_FRM', 'controlPersons', name, files, index);
  }
  addMore = (e, formName, arrayName = 'data') => {
    e.preventDefault();
    this.props.businessAppReviewStore.addMore(formName, arrayName);
  }
  handleDelDoc = (field, index) => {
    this.props.businessAppReviewStore.removeUploadedData('BUSINESS_PLAN_FRM', field, index, 'controlPersons');
  }
  toggleConfirmModal = (e, index, formName) => {
    e.preventDefault();
    this.props.businessAppReviewStore.toggleConfirmModal(index, formName);
  }
  submit = (e) => {
    e.preventDefault();
    this.props.businessAppReviewStore.saveReviewForms('BUSINESS_PLAN_FRM');
  }
  submitWithApproval = (form, action) => {
    this.props.businessAppReviewStore.saveReviewForms(form, action);
  }
  render() {
    const {
      BUSINESS_PLAN_FRM, formChangeWithIndex, controlPersonMaskChange, totalSourcesAmount,
      maskChangeWithIndex, totalUsesAmount, confirmModal, confirmModalName, removeData, inProgress,
    } = this.props.businessAppReviewStore;
    const access = this.props.userStore.myAccessForModule('APPLICATIONS');
    const isManager = access.asManager;
    const {
      businessApplicationDetailsAdmin, applicationReviewLoading,
    } = this.props.businessAppStore;
    const { review, applicationStatus } = businessApplicationDetailsAdmin;
    const submitted = (review && review.businessPlan && review.businessPlan &&
      review.businessPlan.submitted) ? review.businessPlan.submitted : null;
    const approved = (review && review.businessPlan && review.businessPlan &&
      review.businessPlan.approved) ? review.businessPlan.approved : null;
    const isReadonly = ((((approved && approved.status) || (submitted))
      && !isManager) || (isManager && approved && approved.status));
    if (applicationReviewLoading) {
      return <InlineLoader />;
    }
    return (
      <Aux>
        <Form onSubmit={this.submit}>
          <ManagerOverview applicationStatus={applicationStatus} submitted={submitted} isManager={isManager} approved={approved} isReadonly={isReadonly} isValid={BUSINESS_PLAN_FRM.meta.isValid} formName="BUSINESS_PLAN_FRM" />
          <Header as="h4">Location feasibility</Header>
          <FormTextarea
            containerclassname={isReadonly ? 'secondary display-only' : 'secondary'}
            readOnly={isReadonly}
            name="locationFeasibility"
            fielddata={BUSINESS_PLAN_FRM.fields.locationFeasibility}
            changed={(e, result) => formChangeWithIndex(e, result, 'BUSINESS_PLAN_FRM')}
            hidelabel
          />
          <Divider section />
          <Header as="h4">
            Control Persons
            {(!isReadonly && BUSINESS_PLAN_FRM.fields.controlPersons.length < 5) &&
            <Link to={this.props.match.url} className="link" onClick={e => this.addMore(e, 'BUSINESS_PLAN_FRM', 'controlPersons')}><small>+ Add Control Person</small></Link>
            }
          </Header>
          {
            BUSINESS_PLAN_FRM.fields.controlPersons.map((controlPerson, index) => (
              <Aux>
                <Header as="h6">
                  {`Control Person ${index + 1}`}
                  {!isReadonly && BUSINESS_PLAN_FRM.fields.controlPersons.length > 1 &&
                  <Link to={this.props.match.url} className="link" onClick={e => this.toggleConfirmModal(e, index, 'controlPersons')}>
                    <Icon className="ns-close-circle" color="grey" />
                  </Link>
                  }
                </Header>
                <div className="bg-offwhite">
                  <Form.Group widths={3}>
                    <FormInput
                      containerclassname={isReadonly ? 'display-only' : ''}
                      readOnly={isReadonly}
                      name="name"
                      fielddata={controlPerson.name}
                      changed={(e, result) => formChangeWithIndex(e, result, 'BUSINESS_PLAN_FRM', 'controlPersons', index)}
                    />
                    <MaskedInput
                      containerclassname={isReadonly ? 'display-only' : ''}
                      readOnly={isReadonly}
                      percentage
                      type="text"
                      name="ownership"
                      fielddata={controlPerson.ownership}
                      changed={values => controlPersonMaskChange(values, index)}
                    />
                    <FormInput
                      containerclassname={isReadonly ? 'display-only' : ''}
                      readOnly={isReadonly}
                      name="derogatoryMarks"
                      fielddata={controlPerson.derogatoryMarks}
                      changed={(e, result) => formChangeWithIndex(e, result, 'BUSINESS_PLAN_FRM', 'controlPersons', index)}
                    />
                    <FormInput
                      containerclassname={isReadonly ? 'display-only' : ''}
                      readOnly={isReadonly}
                      name="experience"
                      fielddata={controlPerson.experience}
                      changed={(e, result) => formChangeWithIndex(e, result, 'BUSINESS_PLAN_FRM', 'controlPersons', index)}
                    />
                    <FormInput
                      containerclassname={isReadonly ? 'display-only' : ''}
                      readOnly={isReadonly}
                      name="creditScore"
                      fielddata={controlPerson.creditScore}
                      changed={(e, result) => formChangeWithIndex(e, result, 'BUSINESS_PLAN_FRM', 'controlPersons', index)}
                    />
                  </Form.Group>
                  <Form.Group widths={3}>
                    <Form.Field>
                      <DropZone
                        hideFields={isReadonly}
                        containerclassname={isReadonly ? 'display-only' : ''}
                        disabled={isReadonly}
                        name="experienceUpload"
                        fielddata={controlPerson.experienceUpload}
                        ondrop={(files, name) => this.onFileDrop(files, name, index)}
                        onremove={field => this.handleDelDoc(field, index)}
                        uploadtitle="Upload Experience File"
                      />
                    </Form.Field>
                    <Form.Field>
                      <DropZone
                        hideFields={isReadonly}
                        containerclassname={isReadonly ? 'display-only' : ''}
                        disabled={isReadonly}
                        name="creditUpload"
                        fielddata={controlPerson.creditUpload}
                        ondrop={(files, name) => this.onFileDrop(files, name, index)}
                        onremove={field => this.handleDelDoc(field, index)}
                        uploadtitle="Upload Credit Score File"
                      />
                    </Form.Field>
                  </Form.Group>
                </div>
              </Aux>
            ))
          }
          <Divider section />
          {['timingOfOperation', 'financialToProjection', 'isPlanAdequate'].map(field => (
            <Aux>
              <FormTextarea
                containerclassname={isReadonly ? 'secondary display-only' : 'secondary'}
                readOnly={isReadonly}
                key={field}
                name={field}
                fielddata={BUSINESS_PLAN_FRM.fields[field]}
                changed={(e, result) => formChangeWithIndex(e, result, 'BUSINESS_PLAN_FRM')}
              />
              <Divider section />
            </Aux>
          ))}
          <Header as="h4">Sources and Uses Chart</Header>
          <Grid columns={2}>
            <Grid.Column>
              <Header as="h6">Sources</Header>
              <Table basic compact className="form-table">
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>Name</Table.HeaderCell>
                    <Table.HeaderCell>Amount</Table.HeaderCell>
                    {!isReadonly && <Table.HeaderCell /> }
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {
                    BUSINESS_PLAN_FRM.fields.sources.length ?
                    BUSINESS_PLAN_FRM.fields.sources.map((source, index) => (
                      <Table.Row key={source} verticalAlign="top">
                        <Table.Cell width={8}>
                          <FormInput
                            containerclassname={isReadonly ? 'display-only' : ''}
                            readOnly={isReadonly}
                            name="name"
                            fielddata={source.name}
                            changed={(e, result) => formChangeWithIndex(e, result, 'BUSINESS_PLAN_FRM', 'sources', index)}
                            size="small"
                          />
                        </Table.Cell>
                        <Table.Cell width={8}>
                          <MaskedInput
                            containerclassname={isReadonly ? 'display-only' : ''}
                            readOnly={isReadonly}
                            prefix="$"
                            currency
                            name="amount"
                            fielddata={source.amount}
                            changed={(values, field) => maskChangeWithIndex(values, 'BUSINESS_PLAN_FRM', 'sources', field, index)}
                            hidelabel
                            size="small"
                          />
                        </Table.Cell>
                        {!isReadonly &&
                        <Table.Cell collapsing>
                          <Link to={this.props.match.url} onClick={e => this.toggleConfirmModal(e, index, 'sources')} >
                            <Icon className="ns-close-circle" color="grey" />
                          </Link>
                        </Table.Cell>
                        }
                      </Table.Row>
                    )) : ''
                  }
                  {!isReadonly &&
                  <Table.Row>
                    <Table.Cell colSpan="3">
                      <AddMore addMore={this.addMore} arrayName="sources" formName="BUSINESS_PLAN_FRM" title="Add Source" />
                    </Table.Cell>
                  </Table.Row>
                  }
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
                    {!isReadonly && <Table.HeaderCell /> }
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {
                  BUSINESS_PLAN_FRM.fields.uses.length ?
                  BUSINESS_PLAN_FRM.fields.uses.map((use, index) => (
                    <Table.Row key={use[index]} verticalAlign="top">
                      <Table.Cell width={8}>
                        <FormInput
                          containerclassname={isReadonly ? 'display-only' : ''}
                          readOnly={isReadonly}
                          name="name"
                          fielddata={use.name}
                          changed={(e, result) => formChangeWithIndex(e, result, 'BUSINESS_PLAN_FRM', 'uses', index)}
                          size="small"
                        />
                      </Table.Cell>
                      <Table.Cell width={8}>
                        <MaskedInput
                          containerclassname={isReadonly ? 'display-only' : ''}
                          readOnly={isReadonly}
                          prefix="$"
                          currency
                          name="amount"
                          fielddata={use.amount}
                          changed={(values, field) => maskChangeWithIndex(values, 'BUSINESS_PLAN_FRM', 'uses', field, index)}
                          hidelabel
                          size="small"
                        />
                      </Table.Cell>
                      {!isReadonly &&
                      <Table.Cell collapsing>
                        <Link to={this.props.match.url} onClick={e => this.toggleConfirmModal(e, index, 'uses')} >
                          <Icon className="ns-close-circle" color="grey" />
                        </Link>
                      </Table.Cell>
                      }
                    </Table.Row>
                  )) : ''
                  }
                  {!isReadonly &&
                  <Table.Row>
                    <Table.Cell colSpan="3">
                      <AddMore addMore={this.addMore} arrayName="uses" formName="BUSINESS_PLAN_FRM" title="Add Use" />
                    </Table.Cell>
                  </Table.Row>
                  }
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
            containerclassname={isReadonly ? 'display-only' : ''}
            readOnly={isReadonly}
            containerwidth="4"
            name="dateOfIncorporation"
            fielddata={BUSINESS_PLAN_FRM.fields.dateOfIncorporation}
            format="##-##-####"
            changed={(values, field) => maskChangeWithIndex(values, 'BUSINESS_PLAN_FRM', '', field)}
            dateOfBirth
          />
          <ButtonGroup
            inProgress={inProgress}
            formName="BUSINESS_PLAN_FRM"
            isReadonly={isReadonly}
            isManager={isManager}
            submitted={submitted}
            approved={approved}
            formValid={BUSINESS_PLAN_FRM.meta.isValid}
            submitWithApproval={this.submitWithApproval}
          />
        </Form>
        <Confirm
          header="Confirm"
          content={`Are you sure you want to remove this ${confirmModalName === 'uses' ? 'use' :
          confirmModalName === 'sources' ? 'source' : 'control person'}?`}
          open={confirmModal}
          onCancel={this.toggleConfirmModal}
          onConfirm={() => removeData('BUSINESS_PLAN_FRM', confirmModalName)}
          size="mini"
          className="deletion"
        />
      </Aux>
    );
  }
}
