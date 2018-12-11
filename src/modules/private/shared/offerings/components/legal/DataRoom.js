import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import ReactDragList from 'react-drag-list';
import { Form, Header, Button, Divider, Table, Icon, Confirm } from 'semantic-ui-react';
import { FormInput, DropZoneConfirm as DropZone } from '../../../../../../theme/form';
import ButtonGroup from '../ButtonGroup';

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
  handleSubmitDataRoom = () => {
    const { DATA_ROOM_FRM, updateOffering, currentOfferingId } = this.props.offeringCreationStore;
    updateOffering(currentOfferingId, DATA_ROOM_FRM.fields, 'legal', 'dataRoom', true, undefined);
  }
  handleFormSubmit = (isApproved = null) => {
    const { DATA_ROOM_FRM, updateOffering, currentOfferingId } = this.props.offeringCreationStore;
    updateOffering(currentOfferingId, DATA_ROOM_FRM.fields, 'legal', 'dataRoom', true, undefined, isApproved);
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
    const submitted = (offer && offer.legal && offer.legal.riskFactors &&
      offer.legal.riskFactors.submitted) ? offer.legal.riskFactors.submitted : null;
    const approved = (offer && offer.legal && offer.legal.riskFactors &&
      offer.legal.riskFactors.approved) ? offer.legal.riskFactors.approved : null;
    const issuerSubmitted = (offer && offer.legal && offer.legal.riskFactors &&
      offer.legal.riskFactors.issuerSubmitted) ? offer.legal.riskFactors.issuerSubmitted : null;
    const {
      DATA_ROOM_FRM,
      formArrayChange,
      confirmModal,
      confirmModalName,
      removeData,
    } = this.props.offeringCreationStore;
    const formName = 'DATA_ROOM_FRM';
    console.log(DATA_ROOM_FRM.fields.documents);
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
                <Table.HeaderCell>&nbsp;</Table.HeaderCell>
                <Table.HeaderCell>&nbsp;</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {
                DATA_ROOM_FRM.fields.documents.length &&
                DATA_ROOM_FRM.fields.documents.map((document, index) => (
                  <Table.Row>
                    <Table.Cell>
                      <FormInput
                        name="documentName"
                        fielddata={document.documentName}
                        size="small"
                        changed={(e, result) => formArrayChange(e, result, formName, 'documents', index)}
                      />
                    </Table.Cell>
                    <Table.Cell>
                      <DropZone
                        size="small"
                        // className="secondary"
                        name="dataRoom"
                        fielddata={document.dataRoom}
                        uploadtitle="Upload"
                        ondrop={(files, name) => this.onFileDrop(files, name, index)}
                        onremove={fieldName => this.handleDelDoc(fieldName, index)}
                      />
                    </Table.Cell>
                    <Table.Cell collapsing>
                      <Button icon circular color={document.accreditedOnly ? 'green' : 'red'} className="link-button">
                        <Icon className={document.accreditedOnly ? 'ns-unlock' : 'ns-lock'} onClick={() => this.handleLockUnlock(index)} />
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
          {/* <Button onClick={this.handleSubmitDataRoom}
          type="button" primary content="Submit" disabled={!DATA_ROOM_FRM.meta.isValid} /> */}
          <ButtonGroup
            isIssuer={isIssuer}
            submitted={submitted}
            isManager={isManager}
            formValid={DATA_ROOM_FRM.meta.isValid}
            approved={approved}
            updateOffer={this.handleFormSubmit}
            issuerSubmitted={issuerSubmitted}
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
