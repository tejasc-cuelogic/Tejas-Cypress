import React, { Component } from 'react';
import Aux from 'react-aux';
import { observer, inject } from 'mobx-react';
import { Header, Table, Icon, Item, Form, Confirm, Button, Divider, Dropdown } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { FormInput, DropZone } from '../../../../../../../theme/form';
import { SOCIAL_MEDIA_LABELS } from '../../../../../../../services/constants/admin/businessApplication';
import ManagerOverview from './ManagerOverview';

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

const TableHeader = ({ labels }) => (
  <Table.Header>
    <Table.Row>
      {
        labels.map(data => (
          <Aux>
            <Table.HeaderCell>{data}</Table.HeaderCell>
          </Aux>
        ))
      }
      <Table.HeaderCell />
    </Table.Row>
  </Table.Header>
);

const RemoveIcon = ({
  match, index, toggleConfirmModal, formName,
}) => (
  <Link to={match.url} className="icon-link" onClick={e => toggleConfirmModal(e, index, formName)} >
    <Icon className="ns-close-circle" color="grey" />
  </Link>
);

const AddMore = ({
  addMore, formName, title,
}) => (
  <Table.Row>
    <Table.Cell colSpan="3">
      <Button size="small" color="blue" className="link-button" onClick={e => addMore(e, formName)}>+ {title}</Button>
    </Table.Cell>
  </Table.Row>
);

@inject('businessAppReviewStore', 'uiStore')
@observer
export default class Miscellaneous extends Component {
  onFileDrop = (files, name, index) => {
    this.props.businessAppReviewStore.setFileUploadData('OTHER_DOCUMENTATION_FRM', name, files, index);
  }
  addMore = (e, formName) => {
    e.preventDefault();
    this.props.businessAppReviewStore.addMore(formName);
  }
  confirmRemoveDoc = (e, name, index) => {
    e.preventDefault();
    this.props.uiStore.setConfirmBox(name, index);
  }
  handleDelCancel = () => {
    this.props.uiStore.setConfirmBox('');
  }
  handleDelDoc = (field, index) => {
    this.props.businessAppReviewStore.removeUploadedData('OTHER_DOCUMENTATION_FRM', field, index);
    this.props.uiStore.setConfirmBox('');
  }
  toggleConfirmModal = (e, index, formName) => {
    e.preventDefault();
    this.props.businessAppReviewStore.toggleConfirmModal(index, formName);
  }

  render() {
    const {
      UPLOADED_DOCUMENTS_FRM,
      OTHER_DOCUMENTATION_FRM,
      SOCIAL_MEDIA_FRM,
      formChangeWithIndex,
      confirmModal,
      confirmModalName,
      removeData,
      MISCELLANEOUS_MANAGER_FRM,
    } = this.props.businessAppReviewStore;
    const { confirmBox } = this.props.uiStore;
    return (
      <Aux>
        <Form size="small">
          <SectionHeader header="Social Media" />
          <Table basic compact className="form-table">
            <TableHeader labels={['Label', 'URL']} />
            <Table.Body>
              {
                SOCIAL_MEDIA_FRM.fields.data.length ?
                SOCIAL_MEDIA_FRM.fields.data.map((socialMedia, index) => (
                  <Table.Row verticalAlign="top">
                    <Table.Cell width={3}>
                      <Dropdown
                        name="label"
                        placeholder="eg. Facebook"
                        fluid
                        selection
                        options={SOCIAL_MEDIA_LABELS}
                        onChange={(e, result) => formChangeWithIndex(e, result, 'SOCIAL_MEDIA_FRM', index)}
                      />
                    </Table.Cell>
                    <Table.Cell>
                      <FormInput
                        type="text"
                        name="url"
                        fielddata={socialMedia.url}
                        changed={(e, result) => formChangeWithIndex(e, result, 'SOCIAL_MEDIA_FRM', index)}
                      />
                    </Table.Cell>
                    <Table.Cell collapsing>
                      <RemoveIcon match={this.props.match} index={index} formName="SOCIAL_MEDIA_FRM" toggleConfirmModal={this.toggleConfirmModal} />
                    </Table.Cell>
                  </Table.Row>
                )) : ''
              }
              <AddMore addMore={this.addMore} formName="SOCIAL_MEDIA_FRM" title="Add social media" />
            </Table.Body>
          </Table>
          <SectionHeader header="Other Documentation Uploads" subheader="(e.g. Material Sales Agreements and Contracts, Equity/Debt Agreements, etc.)" />
          <Table basic compact className="form-table">
            <TableHeader labels={['Label', 'Comment']} />
            <Table.Body>
              {
              OTHER_DOCUMENTATION_FRM.fields.data.length ?
              OTHER_DOCUMENTATION_FRM.fields.data.map((document, index) => (
                <Table.Row verticalAlign="top">
                  <Table.Cell width={5}>
                    <FormInput
                      name="label"
                      fielddata={document.label}
                      changed={(e, result) => formChangeWithIndex(e, result, 'OTHER_DOCUMENTATION_FRM', index)}
                    />
                  </Table.Cell>
                  <Table.Cell>
                    <DropZone
                      name="comment"
                      fielddata={document.comment}
                      ondrop={(files, name) => this.onFileDrop(files, name, index)}
                      onremove={(e, name) => this.confirmRemoveDoc(e, name, index)}
                      uploadtitle="Choose document to upload"
                    />
                  </Table.Cell>
                  <Table.Cell collapsing>
                    <RemoveIcon match={this.props.match} index={index} formName="OTHER_DOCUMENTATION_FRM" toggleConfirmModal={this.toggleConfirmModal} />
                  </Table.Cell>
                </Table.Row>
              )) : ''
              }
              <AddMore addMore={this.addMore} formName="OTHER_DOCUMENTATION_FRM" title="Add new document" />
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
          <div className="right-align">
            <Button.Group>
              <Button
                disabled={!(OTHER_DOCUMENTATION_FRM.meta.isValid && SOCIAL_MEDIA_FRM.meta.isValid)}
                className="relaxed"
                secondary
              >
                Save
              </Button>
              <Button disabled={!(OTHER_DOCUMENTATION_FRM.meta.isValid && SOCIAL_MEDIA_FRM.meta.isValid)} primary type="button">Submit for Approval</Button>
            </Button.Group>
          </div>
          <Divider section />
          <ManagerOverview form={MISCELLANEOUS_MANAGER_FRM} formName="MISCELLANEOUS_MANAGER_FRM" />
        </Form>
        <Confirm
          header="Confirm"
          content="Are you sure you want to remove this file?"
          open={confirmBox.entity === 'comment'}
          onCancel={this.handleDelCancel}
          onConfirm={() => this.handleDelDoc(confirmBox.entity, confirmBox.refId)}
          size="mini"
          className="deletion"
        />
        <Confirm
          header="Confirm"
          content={`Are you sure you want to remove this ${confirmModalName === 'SOCIAL_MEDIA_FRM' ? 'social media' :
          'document'}?`}
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
