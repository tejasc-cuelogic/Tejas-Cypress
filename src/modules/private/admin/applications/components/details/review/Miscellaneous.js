import React, { Component } from 'react';
import Aux from 'react-aux';
import { observer, inject } from 'mobx-react';
import { Header, Table, Icon, Item, Form, Confirm, Button, Dropdown, Divider } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { FormInput, DropZone, FormTextarea } from '../../../../../../../theme/form';
import { SOCIAL_MEDIA_LABELS } from '../../../../../../../services/constants/admin/businessApplication';

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
      OTHER_DOCUMENTATION_FRM,
      SOCIAL_MEDIA_FRM,
      socialMediaChange,
      otherDocumentationChange,
      confirmModal,
      confirmModalName,
      removeData,
      MANAGERS_FRM,
      managerEleChange,
    } = this.props.businessAppReviewStore;
    const { confirmBox } = this.props.uiStore;
    return (
      <Aux>
        <Form size="small">
          <Header as="h4">
          Social Media
          </Header>
          <Table basic compact className="form-table">
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Label</Table.HeaderCell>
                <Table.HeaderCell>URL</Table.HeaderCell>
                <Table.HeaderCell />
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {
                SOCIAL_MEDIA_FRM.fields.data.length ?
                SOCIAL_MEDIA_FRM.fields.data.map((socialMedia, index) => (
                  <Table.Row verticalAlign="top">
                    <Table.Cell collapsing>
                      {/* <FormSelect
                        name="label"
                        fielddata={socialMedia.label}
                        options={SOCIAL_MEDIA_LABELS}
                        changed={(e, result) => socialMediaChange(e, result, index)}
                      /> */}
                      <Dropdown placeholder="eg. Facebook" fluid selection options={SOCIAL_MEDIA_LABELS} />
                    </Table.Cell>
                    <Table.Cell>
                      <FormInput
                        type="text"
                        name="url"
                        fielddata={socialMedia.url}
                        changed={(e, result) => socialMediaChange(e, result, index)}
                      />
                    </Table.Cell>
                    {index !== 0 &&
                      <Table.Cell collapsing>
                        <Link to={this.props.match.url} className="icon-link" onClick={e => this.toggleConfirmModal(e, index, 'SOCIAL_MEDIA_FRM')} >
                          <Icon className="ns-close-circle" color="grey" />
                        </Link>
                      </Table.Cell>
                    }
                  </Table.Row>
                )) : ''
              }
              <Table.Row>
                <Table.Cell collapsing>
                  <Button size="small" color="blue" className="link-button" onClick={e => this.addMore(e, 'SOCIAL_MEDIA_FRM')}>+ Add social media</Button>
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
          <Header as="h4">
          Other Documentation Uploads
          </Header>
          <p>(e.g. Material Sales Agreements and Contracts, Equity/Debt Agreements, etc.)</p>
          <Table basic compact className="form-table">
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Label</Table.HeaderCell>
                <Table.HeaderCell>Documents</Table.HeaderCell>
                <Table.HeaderCell />
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {
              OTHER_DOCUMENTATION_FRM.fields.data.length ?
              OTHER_DOCUMENTATION_FRM.fields.data.map((document, index) => (
                <Table.Row verticalAlign="top">
                  <Table.Cell>
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
                  {index !== 0 &&
                    <Table.Cell collapsing>
                      <Link to={this.props.match.url} className="icon-link" onClick={e => this.toggleConfirmModal(e, index, 'OTHER_DOCUMENTATION_FRM')} >
                        <Icon className="ns-close-circle" color="grey" />
                      </Link>
                    </Table.Cell>
                  }
                </Table.Row>
              )) : ''
              }
              <Table.Row>
                <Table.Cell>
                  <Button size="small" color="blue" className="link-button" onClick={e => this.addMore(e, 'OTHER_DOCUMENTATION_FRM')}>+ Add new document</Button>
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
          <Header as="h5">
          NS Admin Uploaded Documents
          </Header>
          <p>Uploaded via the Activity History</p>
          <div className="featured-section mb-20">
            <Item.Group relaxed="very">
              <Item>
                <Item.Content>
                  <Item.Header>
                    <Link to="/">
                      <Icon className="ns-file" color="blue" />Business_Plan.pdf
                    </Link>
                    <span>Attached: 7/10/2018 by Brandon Black</span>
                    <Link to="/" className="icon-link">
                      <Icon className="ns-close-circle" color="grey" />
                    </Link>
                  </Item.Header>
                  <Item.Description className="caption">
                    <i>
                    This was the original business plan given to me by the owner.He will be sending
                    an updated one to me next week.  Figured we could use this as reference for now.
                    </i>
                  </Item.Description>
                </Item.Content>
              </Item>
              <Item>
                <Item.Content>
                  <Item.Header>
                    <Link to="/">
                      <Icon className="ns-file" color="blue" />Business_Plan_2.pdf
                    </Link>
                    <span>Attached: 7/12/2018 by Barbara Birsands</span>
                    <Link to="/" className="icon-link">
                      <Icon className="ns-close-circle" color="grey" />
                    </Link>
                  </Item.Header>
                  <Item.Description className="caption">
                    <i>
                    Here’s the new business plan as expected!
                    </i>
                  </Item.Description>
                </Item.Content>
              </Item>
            </Item.Group>
          </div>
          <div className="right-align">
            <Button.Group>
              <Button disabled secondary className="relaxed">Save</Button>
              <Button disabled primary type="button">Submit for Approval</Button>
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
