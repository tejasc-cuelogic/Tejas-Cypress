import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import Aux from 'react-aux';
import { Header, Table, Icon, Item, Form, Confirm, Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { FormSelect, FormInput, DropZone } from '../../../../../../../theme/form';
import { SOCIAL_MEDIA_LABELS } from '../../../../../../../services/constants/admin/businessApplication';

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
  index !== 0 &&
    <Table.Cell collapsing>
      <Link to={match.url} className="icon-link" onClick={e => toggleConfirmModal(e, index, formName)} >
        <Icon className="ns-close-circle" color="grey" />
      </Link>
    </Table.Cell>
);

const AddMore = ({
  match, addMore, formName, title,
}) => (
  <Table.Row>
    <Table.Cell collapsing>
      <Link color="blue" to={match.url} className="link" onClick={e => addMore(e, formName)}><small>+ {title}</small></Link>
    </Table.Cell>
  </Table.Row>
);

@inject('businessAppReviewStore', 'uiStore')
@observer
export default class Miscellaneous extends Component {
  onFileDrop = (files, name, index) => {
    this.props.businessAppReviewStore.setFileUploadDataWithIndex('OTHER_DOCUMENTATION_FRM', name, files, index);
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
    this.props.businessAppReviewStore.removeUploadedDataWithIndex('OTHER_DOCUMENTATION_FRM', field, index);
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
      socialMediaChange,
      otherDocumentationChange,
      confirmModal,
      confirmModalName,
      removeData,
    } = this.props.businessAppReviewStore;
    const { confirmBox } = this.props.uiStore;
    return (
      <div className="inner-content-spacer">
        <Form>
          <SectionHeader header="Social Media" />
          <Table basic compact inverted className="grey-table">
            <TableHeader labels={['Label', 'URL']} />
            <Table.Body>
              {
                SOCIAL_MEDIA_FRM.fields.data.length ?
                SOCIAL_MEDIA_FRM.fields.data.map((socialMedia, index) => (
                  <Table.Row>
                    <Table.Cell collapsing>
                      <FormSelect
                        name="label"
                        fielddata={socialMedia.label}
                        options={SOCIAL_MEDIA_LABELS}
                        changed={(e, result) => socialMediaChange(e, result, index)}
                      />
                    </Table.Cell>
                    <Table.Cell>
                      <FormInput
                        type="text"
                        name="url"
                        fielddata={socialMedia.url}
                        changed={(e, result) => socialMediaChange(e, result, index)}
                      />
                    </Table.Cell>
                    <RemoveIcon match={this.props.match} index={index} formName="SOCIAL_MEDIA_FRM" toggleConfirmModal={this.toggleConfirmModal} />
                  </Table.Row>
                )) : ''
              }
              <AddMore match={this.props.match} addMore={this.addMore} formName="SOCIAL_MEDIA_FRM" title="Add social media" />
            </Table.Body>
          </Table>
          <SectionHeader header="Other Documentation Uploads" subheader="(e.g. Material Sales Agreements and Contracts, Equity/Debt Agreements, etc.)" />
          <Table basic compact inverted className="grey-table">
            <TableHeader labels={['Label', 'Comment']} />
            <Table.Body>
              {
              OTHER_DOCUMENTATION_FRM.fields.data.length ?
              OTHER_DOCUMENTATION_FRM.fields.data.map((document, index) => (
                <Table.Row >
                  <Table.Cell collapsing>
                    <FormInput
                      name="label"
                      fielddata={document.label}
                      changed={(e, result) => otherDocumentationChange(e, result, index)}
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
                  <RemoveIcon match={this.props.match} index={index} formName="OTHER_DOCUMENTATION_FRM" toggleConfirmModal={this.toggleConfirmModal} />
                </Table.Row>
              )) : ''
              }
              <AddMore match={this.props.match} addMore={this.addMore} formName="OTHER_DOCUMENTATION_FRM" title="Add new document" />
            </Table.Body>
          </Table>
          <SectionHeader header="NS Admin Uploaded Documents" subheader="Uploaded via the Activity History" />
          <div className="featured-section">
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
          <Button.Group className="pull-right">
            <Button
              disabled={!(OTHER_DOCUMENTATION_FRM.meta.isValid && SOCIAL_MEDIA_FRM.meta.isValid)}
              className="relaxed"
              secondary
            >
              Save
            </Button>
            <Button disabled={!(OTHER_DOCUMENTATION_FRM.meta.isValid && SOCIAL_MEDIA_FRM.meta.isValid)} primary type="button">Submit for Approval</Button>
          </Button.Group>
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
      </div>
    );
  }
}
