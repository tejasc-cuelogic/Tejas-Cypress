import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Grid, Header, Divider, Form, Button, Icon, Accordion, Confirm, Popup, Table } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { InlineLoader } from '../../../../theme/shared';
import { FormInput, DropZoneConfirm as DropZone, MaskedInput } from '../../../../theme/form';
import FormElementWrap from './FormElementWrap';
import AppNavigation from './AppNavigation';
import Helper from '../../../../helper/utility';

@inject('businessAppStore', 'agreementsStore', 'commonStore', 'userStore', 'uiStore')
@observer
export default class BusinessDetails extends Component {
  state = {
    showPartialSaveModal: false,
    currentForm: '',
    currentIndex: 0,
    legalNoteToggle: false,
  }

  componentWillMount() {
    this.props.businessAppStore.setFieldvalue('applicationStep', 'business-details');
    const {
      getLegalDocsFileIds, alreadySet,
    } = this.props.agreementsStore;
    if (!alreadySet) {
      getLegalDocsFileIds();
    }
  }

  componentDidMount() {
    ['sources', 'uses'].forEach((ele) => {
      this.props.businessAppStore.totalChange(ele, ele === 'sources' ? 'sourcesTotal' : 'usesTotal');
    });
  }

  removeForm = (e) => {
    this.setState({ showPartialSaveModal: !this.state.showPartialSaveModal });
    this.props.businessAppStore.removeForm(e, this.state.currentForm, this.state.currentIndex);
    if (['sources', 'uses'].includes(this.state.currentForm)) {
      this.props.businessAppStore.totalChange(this.state.currentForm, this.state.currentForm === 'sources' ? 'sourcesTotal' : 'usesTotal');
    }
  }

  toggleHandel = () => {
    this.setState({ legalNoteToggle: !this.state.legalNoteToggle });
  }

  toggleConfirm = (formName, index) => {
    this.setState({
      ...this.state,
      showPartialSaveModal: !this.state.showPartialSaveModal,
      currentForm: formName,
      currentIndex: index,
    });
  }

  handleLearnMore = () => {
    const { getBoxLink, setField, agreements } = this.props.agreementsStore;
    setField('docLoading', true);
    getBoxLink(agreements[2].id, 'SERVICES').then((res) => {
      setField('docLoading', false);
      window.open(res.data.getBoxEmbedLink, '_blank');
    });
  }

  render() {
    const {
      BUSINESS_DETAILS_FRM, businessDetailsChange, businessAppUploadFiles,
      businessAppRemoveFiles, addMoreForms, businessDetailsMaskingChange,
      formReadOnlyMode, businessDetailsDateChange, currentApplicationType,
      businessAppParitalSubmit, enableSave, businessApplicationDetailsAdmin,
      sourcesTotal, usesTotal, totalChange,
    } = this.props.businessAppStore;
    const { hideFields } = this.props;
    const { docLoading, docIdsLoading } = this.props.agreementsStore;
    let disableFileUpload = true;
    const { inProgress } = this.props.uiStore;
    if (this.props.userStore.isAdmin && this.props.userStore.isApplicationManager) {
      disableFileUpload = false;
    }
    if (docLoading || docIdsLoading) {
      return <InlineLoader />;
    }
    return (
      <div className={hideFields ? 'inner-content-spacer' : 'ui container'}>
        <Form className="issuer-signup">
          {!hideFields
            && (
            <FormElementWrap
              as="h1"
              header={`${currentApplicationType === 'business' ? 'Business' : 'Real Estate'} Details`}
              subHeader={currentApplicationType === 'business' ? 'Quickly, safely and accurately submit your business information.' : 'Quickly, safely and accurately submit your real estate information.'}
            />
            )
          }
          <FormElementWrap
            hideFields={hideFields}
            header={currentApplicationType === 'business' ? 'Business Plan or Investment Prospectus' : 'Business Plan'}
            subHeader={(
              <>
                {currentApplicationType === 'business' ? 'This document is intended to describe the who, what, when, where, how and why of your project.*' : 'Upload your Investment Summary or Business Plan.*'}
                <Popup
                  trigger={<Icon className="ns-help-circle" />}
                  content="Property description (as-is), related parties, legal/entity structure, control persons, sponsor/issuer overview, current capital stack (if applicable), proposed capital stack, source(s) of funds, uses of funds, debt assumptions, exit plan including targeted buyer,  construction, property management including day-to-day operations and services, leasing and marketing plans including target tenants and competitive position, potential regulatory restrictions."
                  position="top center"
                  className={this.props.toolTipClassName ? this.props.toolTipClassName : 'center-align'}
                  wide
                />
                {!hideFields && currentApplicationType === 'business'
                  && <Link to={this.props.match.url} className="link" onClick={() => this.handleLearnMore()}><small>Learn More</small></Link>
                }
              </>
            )}
          >
            <DropZone
              sharableLink
              toolTipClassName="left-align justify-text"
              hideFields={hideFields}
              disabled={formReadOnlyMode && disableFileUpload}
              multiple
              asterisk="true"
              name="businessPlan"
              fielddata={BUSINESS_DETAILS_FRM.fields.businessPlan}
              ondrop={(files, fieldName) => businessAppUploadFiles(files, fieldName, 'BUSINESS_DETAILS_FRM', null, this.props.userStore.isApplicationManager)}
              onremove={(fieldName, index) => businessAppRemoveFiles(fieldName, 'BUSINESS_DETAILS_FRM', index)}
            />
          </FormElementWrap>
          <FormElementWrap
            hideFields={hideFields}
            header="Sources & Uses"
            subHeader="Unless provided in your business plan or financial projections, please provide a table clearly outlining all sources of capital for your project (including the proposed NextSeed amount) and the proposed uses of capital."
          >
            <Grid>
              <Grid.Column largeScreen={7} computer={7} tablet={8} mobile={8}>
                <Header as="h4">Source</Header>
                <Table inverted className="form-table source-table">
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell>Souce of Funds</Table.HeaderCell>
                      <Table.HeaderCell>Amount</Table.HeaderCell>
                      <Table.HeaderCell />
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {BUSINESS_DETAILS_FRM.fields.sources.length ? BUSINESS_DETAILS_FRM.fields.sources.map((source, index) => (
                      <Table.Row>
                        <Table.Cell width={7}>
                          <FormInput
                            readOnly={formReadOnlyMode}
                            containerclassname={formReadOnlyMode ? 'display-only' : ''}
                            type="text"
                            asterisk="true"
                            name="name"
                            fielddata={source.name}
                            changed={(e, res) => businessDetailsChange(e, res, 'sources', index)}
                          />
                        </Table.Cell>
                        <Table.Cell>
                          <MaskedInput
                            readOnly={formReadOnlyMode}
                            containerclassname={formReadOnlyMode ? 'display-only' : ''}
                            prefix="$ "
                            currency
                            type="text"
                            name="amount"
                            hidelabel
                            fielddata={source.amount}
                            onblur={() => totalChange('sources', 'sourcesTotal')}
                            changed={(values, field) => businessDetailsMaskingChange(field, values, 'sources', index)}
                          />
                        </Table.Cell>
                        <Table.Cell collapsing>
                          <Button type="button" disabled={formReadOnlyMode} icon className="link-button pull-right" onClick={() => this.toggleConfirm('sources', index)}>
                            <Icon className="ns-trash" />
                          </Button>
                        </Table.Cell>
                      </Table.Row>
                    )) : ''}
                    <Table.Row>
                      <Table.Cell colspan="3">
                        <Button size="small" className="link-button" type="button" disabled={formReadOnlyMode} onClick={e => addMoreForms(e, 'sources')} color="green" content="+ Add Source" />
                      </Table.Cell>
                    </Table.Row>
                  </Table.Body>
                  {BUSINESS_DETAILS_FRM.fields.sources.length
                    && (
                    <Table.Footer>
                      <Table.Row>
                        <Table.HeaderCell width={7}>
                          Total
                        </Table.HeaderCell>
                        <Table.HeaderCell>
                          ${sourcesTotal}
                          </Table.HeaderCell>
                        <Table.HeaderCell />
                      </Table.Row>
                    </Table.Footer>
                    )
                  }
                </Table>
              </Grid.Column>
              <Grid.Column largeScreen={7} computer={7} tablet={8} mobile={8}>
                <Header as="h4">Uses</Header>
                <Table inverted className="form-table source-table">
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell>Use of Funds</Table.HeaderCell>
                      <Table.HeaderCell>Amount</Table.HeaderCell>
                      <Table.HeaderCell />
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {BUSINESS_DETAILS_FRM.fields.uses.length ? BUSINESS_DETAILS_FRM.fields.uses.map((use, index) => (
                      <Table.Row>
                        <Table.Cell width={7}>
                          <FormInput
                            readOnly={formReadOnlyMode}
                            containerclassname={formReadOnlyMode ? 'display-only' : ''}
                            type="text"
                            asterisk="true"
                            name="name"
                            fielddata={use.name}
                            changed={(e, res) => businessDetailsChange(e, res, 'uses', index)}
                          />
                        </Table.Cell>
                        <Table.Cell>
                          <MaskedInput
                            readOnly={formReadOnlyMode}
                            containerclassname={formReadOnlyMode ? 'display-only' : ''}
                            prefix="$ "
                            currency
                            type="text"
                            name="amount"
                            hidelabel
                            fielddata={use.amount}
                            onblur={() => totalChange('uses', 'usesTotal')}
                            changed={(values, field) => businessDetailsMaskingChange(field, values, 'uses', index)}
                          />
                        </Table.Cell>
                        <Table.Cell collapsing>
                          <Button type="button" disabled={formReadOnlyMode} icon className="link-button pull-right" onClick={() => this.toggleConfirm('uses', index)}>
                            <Icon className="ns-trash" />
                          </Button>
                        </Table.Cell>
                      </Table.Row>
                    )) : ''}
                    <Table.Row>
                      <Table.Cell colspan="3">
                        <Button size="small" className="link-button" type="button" disabled={formReadOnlyMode} onClick={e => addMoreForms(e, 'uses')} color="green" content="+ Add Use" />
                      </Table.Cell>
                    </Table.Row>
                  </Table.Body>
                  {BUSINESS_DETAILS_FRM.fields.uses.length
                    ? (
                    <Table.Footer>
                      <Table.Row>
                        <Table.HeaderCell width={7}>
                          Total
                        </Table.HeaderCell>
                        <Table.HeaderCell>
                          ${usesTotal}
                          </Table.HeaderCell>
                        <Table.HeaderCell />
                      </Table.Row>
                    </Table.Footer>
                    ) : ''}
                </Table>
              </Grid.Column>
            </Grid>
          </FormElementWrap>
          <FormElementWrap
            hideFields={hideFields}
            header="Existing Debt"
            subHeader="What are the outstanding debt obligations for the business?"
          >
            {BUSINESS_DETAILS_FRM.fields.debts.length
            && BUSINESS_DETAILS_FRM.fields.debts.map((debt, index) => (
              <Grid>
                <Grid.Column largeScreen={14} computer={14} tablet={16} mobile={16}>
                  <div className="field-wrap">
                    <Header as={hideFields ? 'h6' : 'h5'} className="mb-20">Existing Debt {index + 1}
                      {!hideFields && BUSINESS_DETAILS_FRM.fields.debts.length > 1
                        && (
                        <Button type="button" disabled={formReadOnlyMode} icon className="link-button pull-right" onClick={() => this.toggleConfirm('debts', index)}>
                          <Icon color="red" size="small" className="ns-trash" />
                        </Button>
                        )
                      }
                    </Header>
                    <Form.Group widths="equal">
                      <MaskedInput
                        readOnly={formReadOnlyMode}
                        containerclassname={formReadOnlyMode ? 'display-only' : ''}
                        prefix="$ "
                        currency
                        type="text"
                        name="amount"
                        fielddata={debt.amount}
                        changed={(values, field) => businessDetailsMaskingChange(field, values, 'debts', index)}
                      />
                      <MaskedInput
                        readOnly={formReadOnlyMode}
                        containerclassname={formReadOnlyMode ? 'display-only' : ''}
                        percentage
                        type="text"
                        name="interestExpenses"
                        fielddata={debt.interestExpenses}
                        changed={(values, field) => businessDetailsMaskingChange(field, values, 'debts', index)}
                      />
                    </Form.Group>
                    <Form.Group widths="equal">
                      <MaskedInput
                        readOnly={formReadOnlyMode}
                        containerclassname={formReadOnlyMode ? 'display-only' : ''}
                        prefix="$ "
                        currency
                        type="text"
                        name="remainingPrincipal"
                        fielddata={debt.remainingPrincipal}
                        changed={(values, field) => businessDetailsMaskingChange(field, values, 'debts', index)}
                      />
                      <MaskedInput
                        readOnly={formReadOnlyMode}
                        containerclassname={formReadOnlyMode ? 'display-only' : ''}
                        number
                        type="text"
                        name="term"
                        fielddata={debt.term}
                        changed={(values, field) => businessDetailsMaskingChange(field, values, 'debts', index)}
                      />
                    </Form.Group>
                  </div>
                </Grid.Column>
              </Grid>
            ))
            }
            <Divider hidden />
            {!hideFields
              && <Button type="button" disabled={formReadOnlyMode} size="tiny" onClick={e => addMoreForms(e, 'debts')} color="violet" className="ghost-button additional-field" content="+ Add additional debt" />
            }
          </FormElementWrap>
          <FormElementWrap
            hideFields={hideFields}
            noDivider={hideFields || formReadOnlyMode}
            header="Owners"
            subHeader="Please list all individuals with at least 20% ownership."
          >
            {!hideFields
              && (
              <Accordion>
                <Accordion.Title onClick={this.toggleHandel} active={this.state.legalNoteToggle}>
                  <Icon className="ns-chevron-up" />
                  {this.state.legalNoteToggle ? 'Hide' : 'Show'} legal note
                </Accordion.Title>
                <Accordion.Content active={this.state.legalNoteToggle}>
                  <p>
                    You hereby authorize NextSeed Management LLC, its assignee, assigns or
                    potential assigns to review your personal credit and business profile
                    provided by national credit bureaus in considering this application and
                    for the purpose of determining your eligibility to raise funds under an
                    applicable exemption provided by the U.S. Securities Act of 1933 and related
                    regulations. You hereby authorize the above listed parties to release all
                    credit information and bank information and you represent and warrant that all
                    information submitted to NextSeed Management LLC, including without limitation
                    information on this application, any attachments, any supplemental, or other
                    information herein is true, complete and accurate. You agree to immediately
                    notify NextSeed Management LLC if any of such information changes materially in
                    the 60 days after the date of this application. A fascimile, electronic or
                    other copy of this authorization shall be as valid as the original.<br />
                    NOTE: This will not impact your credit score. All information you provide
                    to us is strictly confidential and we will never disclose it to anyone
                    without your express consent unless required by applicable law or regulation
                  </p>
                </Accordion.Content>
              </Accordion>
              )
            }
            {BUSINESS_DETAILS_FRM.fields.owners.length
            && BUSINESS_DETAILS_FRM.fields.owners.map((owner, index) => (
              <Grid>
                <Grid.Column largeScreen={14} computer={14} tablet={16} mobile={16}>
                  <Header as={hideFields ? 'h6' : 'h5'}>Owner {index + 1}
                    {!hideFields && BUSINESS_DETAILS_FRM.fields.owners.length > 1
                      && (
                      <Button type="button" disabled={formReadOnlyMode} icon className="link-button pull-right" onClick={() => this.toggleConfirm('owners', index)}>
                        <Icon color="red" size="small" className="ns-trash" />
                      </Button>
                      )
                    }
                  </Header>
                  <div className="field-wrap">
                    <Form.Group widths="equal">
                      {
                        ['fullLegalName', 'title'].map(field => (
                          <FormInput
                            readOnly={formReadOnlyMode}
                            containerclassname={formReadOnlyMode ? 'display-only' : ''}
                            key={field}
                            type="text"
                            asterisk="true"
                            name={field}
                            fielddata={owner[field]}
                            changed={(e, res) => businessDetailsChange(e, res, 'owners', index)}
                          />
                        ))
                      }
                    </Form.Group>
                    <Form.Group widths="equal">
                      <MaskedInput
                        readOnly={formReadOnlyMode}
                        containerclassname={formReadOnlyMode ? 'display-only' : ''}
                        number
                        type="text"
                        name="yearsOfExp"
                        asterisk="true"
                        fielddata={owner.yearsOfExp}
                        changed={(values, field) => businessDetailsMaskingChange(field, values, 'owners', index)}
                      />
                      <MaskedInput
                        readOnly={formReadOnlyMode}
                        containerclassname={formReadOnlyMode ? 'display-only' : ''}
                        percentage
                        type="text"
                        asterisk="true"
                        name="companyOwnerShip"
                        fielddata={owner.companyOwnerShip}
                        changed={(values, field) => businessDetailsMaskingChange(field, values, 'owners', index)}
                      />
                    </Form.Group>
                    <Form.Group widths="equal">
                      <MaskedInput
                        name="dateOfService"
                        readOnly={formReadOnlyMode}
                        containerclassname={formReadOnlyMode ? 'display-only' : ''}
                        fielddata={owner.dateOfService}
                        asterisk="true"
                        format="##/##/####"
                        changed={values => businessDetailsDateChange('dateOfService', values.formattedValue, index)}
                        dateOfBirth
                      />
                      {formReadOnlyMode
                        ? (
                          <FormInput
                            key="ssn"
                            name="ssn"
                            fielddata={Helper.encrypSsnNumberByForm(owner).ssn}
                            displayMode={formReadOnlyMode}
                          />
                        )
                        : (
                          <MaskedInput
                            readOnly={formReadOnlyMode}
                            containerclassname={formReadOnlyMode ? 'display-only' : ''}
                            ssn
                            type="text"
                            name="ssn"
                            asterisk="true"
                            fielddata={owner.ssn}
                            changed={(values, field) => businessDetailsMaskingChange(field, values, 'owners', index)}
                          />
                        )}
                    </Form.Group>
                    <Form.Group widths="equal">
                      <FormInput
                        readOnly={formReadOnlyMode}
                        containerclassname={formReadOnlyMode ? 'display-only' : ''}
                        type="text"
                        name="linkedInUrl"
                        fielddata={owner.linkedInUrl}
                        changed={(e, res) => businessDetailsChange(e, res, 'owners', index)}
                      />
                      <Form.Field>
                        <DropZone
                          sharableLink
                          hideFields={hideFields}
                          disabled={formReadOnlyMode && disableFileUpload}
                          name="resume"
                          asterisk="true"
                          fielddata={owner.resume}
                          ondrop={(files, fieldName) => businessAppUploadFiles(files, fieldName, 'BUSINESS_DETAILS_FRM', index, this.props.userStore.isApplicationManager)}
                          onremove={fieldName => businessAppRemoveFiles(fieldName, 'BUSINESS_DETAILS_FRM', index)}
                        />
                      </Form.Field>
                    </Form.Group>
                  </div>
                </Grid.Column>
              </Grid>
            ))
            }
            {!hideFields && BUSINESS_DETAILS_FRM.fields.owners.length !== 5
              && (
              <>
                <Divider hidden />
                <Button type="button" disabled={formReadOnlyMode} size="tiny" onClick={e => addMoreForms(e, 'owners')} color="violet" className="ghost-button additional-field" content="+ Add other owners" />
              </>
              )
            }
          </FormElementWrap>
          <AppNavigation
            hideFields={hideFields}
            isFileUploading={this.props.businessAppStore.isFileUploading}
          />
        </Form>
        <Confirm
          header="Confirm"
          content={`Are you sure you want to remove this ${this.state.currentForm.slice(0, -1)}?`}
          open={this.state.showPartialSaveModal}
          onCancel={() => this.toggleConfirm(this.state.currentForm, this.state.currentIndex)}
          onConfirm={e => this.removeForm(e)}
          size="mini"
          className="deletion"
        />
        {this.props.userStore.isAdmin && this.props.userStore.isApplicationManager
          ? (
<div className="right aligned">
            <Button
              inverted
              type="button"
              onClick={() => businessAppParitalSubmit(true)}
              className="align-right right-align"
              color="green"
              content="Save"
              disabled={!(businessApplicationDetailsAdmin.applicationStage === 'COMPLETED' ? enableSave && BUSINESS_DETAILS_FRM.meta.isValid : enableSave)}
              loading={inProgress}
            />
          </div>
          )
          : ''}
      </div>
    );
  }
}
