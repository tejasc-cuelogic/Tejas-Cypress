import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import ReactDragList from 'react-drag-list';
import { Form, Header, Button, Divider, Table, Icon, Confirm } from 'semantic-ui-react';
import { FormInput, DropZoneConfirm as DropZone } from '../../../../../../theme/form';
import ButtonGroupType2 from '../ButtonGroupType2';

const dataArray = [
  {
    color: '#FF5500',
    title: 'Senior Product Designer',
    text: 'Senior Product Designer',
  },
  {
    color: '#5FC296',
    title: 'Senior Animator',
    text: 'Senior Animator',
  },
  {
    color: '#2DB7F5',
    title: 'Visual Designer',
    text: 'Visual Designer',
  },
  {
    color: '#FFAA00',
    title: 'Computer Engineer',
    text: 'Computer Engineer',
  },
];

@inject('offeringCreationStore', 'userStore', 'offeringsStore')
@observer
export default class DataRoom extends Component {
  state = {
    dataSource: dataArray,
  };
  componentWillMount() {
    if (!this.props.offeringCreationStore.initLoad.includes('DATA_ROOM_FRM')) {
      this.props.offeringCreationStore.setFormData('DATA_ROOM_FRM', 'legal.dataroom');
    }
  }
  onFileDrop = (files, name, index) => {
    this.props.offeringCreationStore.setFileUploadDataMulitple('DATA_ROOM_FRM', 'documents', name, files, 'DOCUMENTS_LEGAL_DATAROOM', index, true);
  }
  handleDelDoc = (field, index = undefined) => {
    this.props.offeringCreationStore.removeUploadedDataMultiple('DATA_ROOM_FRM', field, index, 'documents');
  }
  toggleConfirmModal = (e, index, formName) => {
    e.preventDefault();
    this.props.offeringCreationStore.toggleConfirmModal(index, formName);
  }
  addMore = (e, formName) => {
    e.preventDefault();
    this.props.offeringCreationStore.addMore(formName, 'documents');
  }
  handleLockUnlock = (index) => {
    this.props.offeringCreationStore.setAccreditedOnlyField(index);
  }
  handleFormSubmit = (isApproved = null) => {
    const { DATA_ROOM_FRM, updateOffering, currentOfferingId } = this.props.offeringCreationStore;
    updateOffering(currentOfferingId, DATA_ROOM_FRM.fields, 'legal', 'dataroom', true, undefined, isApproved);
  }
  handleUpdate = (evt, updated) => {
    console.log(evt); // tslint:disable-line
    console.log(updated); // tslint:disable-line
    // this.setState({
    //   dataSource: [...updated, {
    //     color: '#FFAA00',
    //     title: 'Added Engineer',
    //     text: 'Added Engineer',
    //   }]
    // })
  }
  render() {
    const { match } = this.props;
    const { isIssuer } = this.props.userStore;
    const access = this.props.userStore.myAccessForModule('OFFERINGS');
    const isManager = access.asManager;
    const { offer } = this.props.offeringsStore;
    const submitted = (offer && offer.legal && offer.legal.dataroom &&
      offer.legal.dataroom.submitted) ? offer.legal.dataroom.submitted : null;
    const approved = (offer && offer.legal && offer.legal.dataroom &&
      offer.legal.dataroom.approved) ? offer.legal.dataroom.approved : null;
    const isReadonly = ((submitted && !isManager) || (isManager && approved && approved.status));
    const {
      DATA_ROOM_FRM,
      formArrayChange,
      confirmModal,
      confirmModalName,
      removeData,
    } = this.props.offeringCreationStore;
    const formName = 'DATA_ROOM_FRM';
    console.log(DATA_ROOM_FRM.fields.documents);
    console.log(offer);
    return (
      <div className={isIssuer || (isIssuer && !match.url.includes('offering-creation')) ? 'ui card fluid form-card' : ''}>
        <Form>
          <Header as="h4">
            Data Room Documents
            <Button.Group size="mini" floated="right">
              <Button onClick={e => this.addMore(e, formName)} primary compact content="Add" />
            </Button.Group>
          </Header>
          <Divider hidden />
          <Table basic compact className="form-table">
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Document Name</Table.HeaderCell>
                <Table.HeaderCell>Document</Table.HeaderCell>
                <Table.HeaderCell>Actions</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {
                DATA_ROOM_FRM.fields.documents.length &&
                DATA_ROOM_FRM.fields.documents.map((document, index) => (
                  <Table.Row>
                    <Table.Cell>
                      <FormInput
                        displayMode={isReadonly}
                        name="name"
                        fielddata={document.name}
                        size="small"
                        changed={(e, result) => formArrayChange(e, result, formName, 'documents', index)}
                        ishidelabel
                      />
                    </Table.Cell>
                    <Table.Cell>
                      <DropZone
                        disabled={isReadonly}
                        size="small"
                        className="secondary"
                        name="upload"
                        fielddata={document.upload}
                        uploadtitle="Upload"
                        ondrop={(files, name) => this.onFileDrop(files, name, index)}
                        onremove={fieldName => this.handleDelDoc(fieldName, index)}
                      />
                    </Table.Cell>
                    <Table.Cell collapsing>
                      <Button icon circular color={document.accreditedOnly.value ? 'red' : 'green'} className="link-button">
                        <Icon className={document.accreditedOnly.value ? 'ns-lock' : 'ns-unlock'} onClick={() => this.handleLockUnlock(index)} />
                      </Button>
                      <Button icon circular className="link-button">
                        <Icon className="ns-trash" onClick={e => this.toggleConfirmModal(e, index, formName)} />
                      </Button>
                    </Table.Cell>
                  </Table.Row>
                ))
              }
            </Table.Body>
          </Table>
          <ButtonGroupType2
            submitted={submitted}
            isManager={isManager}
            approved={approved}
            updateOffer={this.handleFormSubmit}
          />
        </Form>
        <Confirm
          header="Confirm"
          content="Are you sure you want to remove this document?"
          open={confirmModal}
          onCancel={this.toggleConfirmModal}
          onConfirm={() => removeData(confirmModalName, 'documents')}
          size="mini"
          className="deletion"
        />
        <ReactDragList
          dataSource={this.state.dataSource}
          rowKey="title"
          row={(record, index) => (
            <div key={index} style={{ color: record.color }}>
              <div className="simple-drag-row-title">{record.title}</div>
              <span>{record.text}</span>
            </div>
          )}
          handles={false}
          className="simple-drag"
          rowClassName="simple-drag-row"
          onUpdate={this.handleUpdate}
        />
      </div>
    );
  }
}
