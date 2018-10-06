import React, { Component } from 'react';
import Aux from 'react-aux';
import { inject, observer } from 'mobx-react';
import { Form, Header, Button, Divider, Confirm, Icon, Popup } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { FormInput, MaskedInput, FormTextarea, DropZone, AutoComplete, FormCheckbox } from '../../../../../../theme/form';
import Helper from '../../../../../../helper/utility';

const HeaderWithTooltip = ({ header, tooltip }) => (
  <Header as="h4">
    {header}
    <Popup
      trigger={<Icon className="ns-help-circle" />}
      content={tooltip}
      position="top center"
      className="center-align"
      wide
    />
  </Header>
);

@inject('offeringCreationStore', 'uiStore', 'userStore')
@withRouter
@observer
export default class Leader extends Component {
  onFileDrop = (files, name, index) => {
    this.props.offeringCreationStore.setFileUploadData('LEADERSHIP_FRM', name, files, 'leadership', index);
  }
  confirmRemoveDoc = (e, name, index) => {
    e.preventDefault();
    this.props.uiStore.setConfirmBox(name, index);
  }
  handleDelCancel = () => {
    this.props.uiStore.setConfirmBox('');
  }
  handleDelDoc = (field, index) => {
    this.props.offeringCreationStore.removeUploadedData('LEADERSHIP_FRM', field, index);
    this.props.uiStore.setConfirmBox('');
  }
  toggleConfirmModal = (e, index, formName) => {
    e.preventDefault();
    this.props.offeringCreationStore.toggleConfirmModal(index, formName);
  }
  removeData = (confirmModalName) => {
    this.props.offeringCreationStore.removeData(confirmModalName);
    Helper.toast('Leader has been deleted successfully.', 'success');
    this.props.history.push(`${this.props.refLink}/leader/1`);
  }
  handleFormSubmit = () => {
    const { LEADERSHIP_FRM, updateOffering, currentOfferingId } = this.props.offeringCreationStore;
    updateOffering(currentOfferingId, LEADERSHIP_FRM.fields);
  }
  render() {
    const leaderNumber = this.props.index;
    const formName = 'LEADERSHIP_FRM';
    const index = leaderNumber || 0;
    const {
      confirmModal,
      confirmModalName,
      LEADERSHIP_FRM,
      formArrayChange,
      maskArrayChange,
      setAddressFields,
    } = this.props.offeringCreationStore;
    const { confirmBox } = this.props.uiStore;
    const { match } = this.props;
    const { isIssuer } = this.props.userStore;
    return (
      <Aux>
        <Form className={isIssuer && !match.url.includes('offering-creation') ? 'ui card fluid form-card' : ''}>
          <Header as="h4">
            {`Leader ${index + 1}`}
            <Button.Group size="mini" floated="right">
              <Button secondary className="relaxed" content="Save" onClick={this.handleFormSubmit} disabled={!LEADERSHIP_FRM.meta.isValid} />
              <Button inverted color="red" content="Delete Leader" onClick={e => this.toggleConfirmModal(e, index, formName)} />
            </Button.Group>
          </Header>
          <FormCheckbox
            fielddata={LEADERSHIP_FRM.fields.leadership[index].isPublic}
            name="isPublic"
            changed={(e, result) => formArrayChange(e, result, formName, 'leadership', index)}
            defaults
            containerclassname="ui relaxed list"
          />
          <Header as="h4">Personal Info</Header>
          <Form.Group widths={2}>
            {
              ['firstName', 'lastName', 'email'].map(field => (
                <FormInput
                  name={field}
                  fielddata={LEADERSHIP_FRM.fields.leadership[index][field]}
                  changed={(e, result) => formArrayChange(e, result, formName, 'leadership', index)}
                />
              ))
            }
            <MaskedInput
              name="number"
              fielddata={LEADERSHIP_FRM.fields.leadership[index].number}
              format="###-###-####"
              changed={(values, name) => maskArrayChange(values, formName, name, 'leadership', index)}
              phoneNumber
            />
          </Form.Group>
          <Form.Group widths={3}>
            <MaskedInput
              name="dob"
              fielddata={LEADERSHIP_FRM.fields.leadership[index].dob}
              format="##/##/####"
              changed={(values, name) => maskArrayChange(values, formName, name, 'leadership', index)}
              dateOfBirth
            />
            <MaskedInput
              name="ssn"
              type="tel"
              fielddata={LEADERSHIP_FRM.fields.leadership[index].ssn}
              ssn
              changed={(values, name) => maskArrayChange(values, formName, name, 'leadership', index)}
            />
            <FormInput
              name="citizenship"
              fielddata={LEADERSHIP_FRM.fields.leadership[index].citizenship}
              changed={(e, result) => formArrayChange(e, result, formName, 'leadership', index)}
            />
            <MaskedInput
              name="percentOwned"
              fielddata={LEADERSHIP_FRM.fields.leadership[index].percentOwned}
              percentage
              changed={(values, name) => maskArrayChange(values, formName, name, 'leadership', index)}
            />
            <FormInput
              name="companyPosition"
              fielddata={LEADERSHIP_FRM.fields.leadership[index].companyPosition}
              changed={(e, result) => formArrayChange(e, result, formName, 'leadership', index)}
            />
            <MaskedInput
              name="dateOfService"
              fielddata={LEADERSHIP_FRM.fields.leadership[index].dateOfService}
              format="##-##-####"
              changed={(values, name) => maskArrayChange(values, formName, name, 'leadership', index)}
              dateOfBirth
            />
          </Form.Group>
          <Header as="h4">Address</Header>
          <AutoComplete
            name="street"
            fielddata={LEADERSHIP_FRM.fields.leadership[index].street}
            onplaceselected={place => setAddressFields(place, index)}
            changed={(e, result) => formArrayChange(e, result, formName, 'leadership', index)}
            placeHolder="Street Address, City, State, Zip"
          />
          <Form.Group widths="equal">
            {
              ['city', 'state'].map(field => (
                <FormInput
                  name={field}
                  fielddata={LEADERSHIP_FRM.fields.leadership[index][field]}
                  changed={(e, result) => formArrayChange(e, result, formName, 'leadership', index)}
                />
              ))
            }
            <MaskedInput
              name="zip"
              fielddata={LEADERSHIP_FRM.fields.leadership[index].zip}
              changed={(values, name) => maskArrayChange(values, formName, name, 'leadership', index)}
              zipCode
            />
          </Form.Group>
          <HeaderWithTooltip header="Bio" tooltip="To be used on the public offering page" />
          <FormTextarea
            name="bio"
            fielddata={LEADERSHIP_FRM.fields.leadership[index].bio}
            changed={(e, result) => formArrayChange(e, result, formName, 'leadership', index)}
            containerclassname="secondary"
            hidelabel
          />
          <Divider section />
          <HeaderWithTooltip header="Website and Social Profiles" tooltip="To be used on the public offering page" />
          {
            ['website', 'facebook', 'linkedin', 'twitter'].map(field => (
              <FormInput
                name={field}
                fielddata={LEADERSHIP_FRM.fields.leadership[index][field]}
                changed={(e, result) => formArrayChange(e, result, formName, 'leadership', index)}
              />
            ))
          }
          <Divider section />
          <Header as="h4">Uploads</Header>
          <Form.Group widths="equal">
            {
              ['headshot', 'heroImage', 'license'].map(field => (
                <DropZone
                  name={field}
                  fielddata={LEADERSHIP_FRM.fields.leadership[index][field]}
                  ondrop={(files, name) => this.onFileDrop(files, name, index)}
                  onremove={(e, name) => this.confirmRemoveDoc(e, name, index)}
                  uploadtitle="Upload a file"
                  tooltip={field !== 'license' ? 'To be used on the public offering page' : false}
                  containerclassname="field"
                />
              ))
            }
          </Form.Group>
          <Divider section />
          <Header as="h4">Other Business Information</Header>
          {
            ['otherEntities', 'promoters'].map(field => (
              <FormTextarea
                name={field}
                fielddata={LEADERSHIP_FRM.fields.leadership[index][field]}
                changed={(e, result) => formArrayChange(e, result, formName, 'leadership', index)}
                containerclassname="secondary"
              />
            ))
          }
          <Divider hidden />
          <div className="clearfix mb-20">
            <Button as="span" className="time-stamp">
              <Icon className="ns-check-circle" color="green" />
              Submitted by ISSUER_NAME on 2/3/2018
            </Button>
          </div>
          <div className="clearfix">
            <Button as="span" className="time-stamp">
              <Icon className="ns-check-circle" color="green" />
              Approved by MANAGER_NAME on 2/3/2018
            </Button>
          </div>
        </Form>
        <Confirm
          header="Confirm"
          content="Are you sure you want to remove this file?"
          open={confirmBox.entity === 'headShot' || confirmBox.entity === 'heroImage' || confirmBox.entity === 'driverLicense'}
          onCancel={this.handleDelCancel}
          onConfirm={() => this.handleDelDoc(confirmBox.entity, confirmBox.refId)}
          size="mini"
          className="deletion"
        />
        <Confirm
          header="Confirm"
          content="Are you sure you want to remove this leader?"
          open={confirmModal}
          onCancel={this.toggleConfirmModal}
          onConfirm={() => this.removeData(confirmModalName)}
          size="mini"
          className="deletion"
        />
      </Aux>
    );
  }
}

