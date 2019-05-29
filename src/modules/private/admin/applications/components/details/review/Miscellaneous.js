import React, { Component } from 'react';
import Aux from 'react-aux';
import { observer, inject } from 'mobx-react';
import { Header, Table, Icon, Item, Form, Confirm, Button, Dropdown } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { FormInput, DropZoneConfirm as DropZone } from '../../../../../../../theme/form';
import { SOCIAL_MEDIA_LABELS } from '../../../../../../../services/constants/admin/businessApplication';
import ManagerOverview from './ManagerOverview';
import ButtonGroup from './ButtonGroup';
import { InlineLoader } from '../../../../../../../theme/shared';

const SectionHeader = ({ header, subheader }) => (
  <Aux>
    <Header as="h4">
      {header}
    </Header>
    {subheader && <p>{subheader}</p> }
  </Aux>
);

const UploadedDocument = ({
  match, index, toggleConfirmModal, document,
}) => (
  <Item>
    <Item.Content>
      <Item.Header>
        <Link to="/">
          <Icon className="ns-file" color="blue" />{document.fileName}
        </Link>
        <span>Attached: {document.attachedDate} by {document.byUser}</span>
        <Link to={match.url} className="icon-link" onClick={e => toggleConfirmModal(e, index, 'UPLOADED_DOCUMENTS_FRM')} >
          <Icon className="ns-close-circle" color="grey" />
        </Link>
      </Item.Header>
      <Item.Description className="caption">
        <i>
          {document.description}
        </i>
      </Item.Description>
    </Item.Content>
  </Item>
);

const TableHeader = ({ labels, isReadonly }) => (
  <Table.Header>
    <Table.Row>
      {
        labels.map(data => (
          <Aux>
            <Table.HeaderCell>{data}</Table.HeaderCell>
          </Aux>
        ))
      }
      {!isReadonly && <Table.HeaderCell /> }
    </Table.Row>
  </Table.Header>
);

const RemoveIcon = ({
  match, index, toggleConfirmModal, formName, arrayName,
}) => (
  <Link to={match.url} className="icon-link" onClick={e => toggleConfirmModal(e, index, formName, arrayName)} >
    <Icon className="ns-close-circle" color="grey" />
  </Link>
);

const AddMore = ({
  addMore, formName, title, arrayName,
}) => (
  <Table.Row>
    <Table.Cell colSpan="3">
      <Button size="small" color="blue" className="link-button" onClick={e => addMore(e, formName, arrayName)}>+ {title}</Button>
    </Table.Cell>
  </Table.Row>
);

@inject('businessAppReviewStore', 'businessAppStore', 'userStore')
@observer
export default class Miscellaneous extends Component {
  componentWillMount() {
    if (!this.props.businessAppReviewStore.initLoad.includes('MISCELLANEOUS_FRM')) {
      this.props.businessAppReviewStore.setFormData('MISCELLANEOUS_FRM', 'review.miscellaneous');
    }
    this.props.businessAppReviewStore.setFormData('MANAGERS_FRM', 'review.miscellaneous.managerOverview');
  }
  onFileDrop = (files, name, index) => {
    this.props.businessAppReviewStore.setFileUploadData('MISCELLANEOUS_FRM', 'otherDocs', name, files, index);
  }
  addMore = (e, formName, arrayName) => {
    e.preventDefault();
    this.props.businessAppReviewStore.addMore(formName, arrayName);
  }
  handleDelDoc = (field, index) => {
    this.props.businessAppReviewStore.removeUploadedData('MISCELLANEOUS_FRM', field, index, 'otherDocs');
  }
  toggleConfirmModal = (e, index, formName, arrayName) => {
    e.preventDefault();
    this.props.businessAppReviewStore.toggleConfirmModal(index, formName, arrayName);
  }
  submit = () => {
    this.props.businessAppReviewStore.saveReviewForms('MISCELLANEOUS_FRM');
  }
  submitWithApproval = (form, action) => {
    this.props.businessAppReviewStore.saveReviewForms(form, action);
  }
  render() {
    const {
      UPLOADED_DOCUMENTS_FRM, MISCELLANEOUS_FRM, formChangeWithIndex, confirmModal,
      confirmModalName, removeData, inProgress,
    } = this.props.businessAppReviewStore;
    const access = this.props.userStore.myAccessForModule('APPLICATIONS');
    const isManager = access.asManager;
    const {
      businessApplicationDetailsAdmin, applicationReviewLoading,
    } = this.props.businessAppStore;
    const { review, applicationStatus } = businessApplicationDetailsAdmin;
    const submitted = (review && review.miscellaneous && review.miscellaneous &&
      review.miscellaneous.submitted) ? review.miscellaneous.submitted : null;
    const approved = (review && review.miscellaneous && review.miscellaneous &&
      review.miscellaneous.approved) ? review.miscellaneous.approved : null;
    const isReadonly = ((((approved && approved.status) || (submitted))
      && !isManager) || (isManager && approved && approved.status));
    if (applicationReviewLoading) {
      return <InlineLoader />;
    }
    return (
      <Aux>
        <Form size="small" onSubmit={this.submit}>
          <ManagerOverview applicationStatus={applicationStatus} submitted={submitted} isManager={isManager} approved={approved} isReadonly={isReadonly} isValid={MISCELLANEOUS_FRM.meta.isValid} formName="MISCELLANEOUS_FRM" />
          <SectionHeader header="Social Media" />
          <Table basic compact className="form-table">
            <TableHeader isReadonly={isReadonly} labels={['Label', 'URL']} />
            <Table.Body>
              {
                MISCELLANEOUS_FRM.fields.socialMedia.length ?
                MISCELLANEOUS_FRM.fields.socialMedia.map((socialMedia, index) => (
                  <Table.Row>
                    <Table.Cell width={3}>
                      <Dropdown
                        className={isReadonly ? 'display-only secondary' : 'secondary'}
                        readOnly={isReadonly}
                        name="label"
                        placeholder="eg. Facebook"
                        fluid
                        selection
                        value={socialMedia.label.value}
                        options={SOCIAL_MEDIA_LABELS}
                        onChange={(e, result) => formChangeWithIndex(e, result, 'MISCELLANEOUS_FRM', 'socialMedia', index)}
                      />
                    </Table.Cell>
                    <Table.Cell>
                      <FormInput
                        containerclassname={isReadonly ? 'display-only' : ''}
                        readOnly={isReadonly}
                        type="text"
                        name="url"
                        fielddata={socialMedia.url}
                        changed={(e, result) => formChangeWithIndex(e, result, 'MISCELLANEOUS_FRM', 'socialMedia', index)}
                      />
                    </Table.Cell>
                    {!isReadonly &&
                    <Table.Cell collapsing>
                      {MISCELLANEOUS_FRM.fields.socialMedia.length > 1 &&
                      <RemoveIcon match={this.props.match} index={index} formName="MISCELLANEOUS_FRM" arrayName="socialMedia" toggleConfirmModal={e => this.toggleConfirmModal(e, index, 'socialMedia')} />
                      }
                    </Table.Cell>
                    }
                  </Table.Row>
                )) : ''
              }
              {!isReadonly && MISCELLANEOUS_FRM.fields.socialMedia.length < 5 &&
              <AddMore addMore={this.addMore} formName="MISCELLANEOUS_FRM" arrayName="socialMedia" title="Add social media" />
              }
            </Table.Body>
          </Table>
          <SectionHeader header="Other Documentation Uploads" subheader="(e.g. Material Sales Agreements and Contracts, Equity/Debt Agreements, etc.)" />
          <Table basic compact className="form-table">
            <TableHeader isReadonly={isReadonly} labels={['Label', 'Comment']} />
            <Table.Body>
              {
              MISCELLANEOUS_FRM.fields.otherDocs.length ?
              MISCELLANEOUS_FRM.fields.otherDocs.map((document, index) => (
                <Table.Row verticalAlign="top">
                  <Table.Cell width={5}>
                    <FormInput
                      containerclassname={isReadonly ? 'display-only' : ''}
                      readOnly={isReadonly}
                      name="label"
                      fielddata={document.label}
                      changed={(e, result) => formChangeWithIndex(e, result, 'MISCELLANEOUS_FRM', 'otherDocs', index)}
                    />
                  </Table.Cell>
                  <Table.Cell>
                    <DropZone
                      size="small"
                      hideFields={isReadonly}
                      className={isReadonly ? 'display-only secondary' : 'secondary'}
                      disabled={isReadonly}
                      name="docDetails"
                      fielddata={document.docDetails}
                      ondrop={(files, name) => this.onFileDrop(files, name, index)}
                      onremove={field => this.handleDelDoc(field, index)}
                      uploadtitle="Choose document to upload"
                    />
                  </Table.Cell>
                  {!isReadonly &&
                  <Table.Cell collapsing>
                    {MISCELLANEOUS_FRM.fields.otherDocs.length > 1 &&
                    <RemoveIcon match={this.props.match} index={index} formName="MISCELLANEOUS_FRM" arrayName="otherDocs" toggleConfirmModal={e => this.toggleConfirmModal(e, index, 'otherDocs')} />
                    }
                  </Table.Cell>
                  }
                </Table.Row>
              )) : ''
              }
              {!isReadonly && MISCELLANEOUS_FRM.fields.otherDocs.length < 5 &&
              <AddMore addMore={this.addMore} formName="MISCELLANEOUS_FRM" arrayName="otherDocs" title="Add new document" />
              }
            </Table.Body>
          </Table>
          <SectionHeader header="NS Admin Uploaded Documents" subheader="Uploaded via the Activity History" />
          <div className="featured-section mb-20">
            <Item.Group relaxed="very">
              {
              UPLOADED_DOCUMENTS_FRM.fields.data.length ?
              UPLOADED_DOCUMENTS_FRM.fields.data.map((document, index) => (
                <Aux>
                  <UploadedDocument
                    match={this.props.match}
                    index={index}
                    toggleConfirmModal={this.toggleConfirmModal}
                    document={document.document}
                  />
                </Aux>
              )) :
              <p>No documents to show</p>
              }
            </Item.Group>
          </div>
          <ButtonGroup
            inProgress={inProgress}
            formName="MISCELLANEOUS_FRM"
            isReadonly={isReadonly}
            isManager={isManager}
            submitted={submitted}
            approved={approved}
            formValid={MISCELLANEOUS_FRM.meta.isValid}
            submitWithApproval={this.submitWithApproval}
          />
        </Form>
        <Confirm
          header="Confirm"
          content={`Are you sure you want to remove this ${confirmModalName === 'socialMedia' ? 'social media' :
          'document'}?`}
          open={confirmModal}
          onCancel={this.toggleConfirmModal}
          onConfirm={() => removeData('MISCELLANEOUS_FRM', confirmModalName)}
          size="mini"
          className="deletion"
        />
      </Aux>
    );
  }
}
