import React, { Component } from 'react';
import Aux from 'react-aux';
import { inject, observer } from 'mobx-react';
import { Form, Header, Button, Divider, Confirm, Icon, Popup } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { FormCheckbox, FormInput, MaskedInput, FormTextarea, DropZone, AutoComplete } from '../../../../../../theme/form';

@inject('offeringCreationStore', 'uiStore')
@withRouter
@observer
export default class Leader extends Component {
  onFileDrop = (files) => {
    this.props.offeringCreationStore.setFileUploadData('KEY_TERMS_FRM', 'proFormas', files);
  }
  confirmRemoveDoc = (e, name) => {
    e.preventDefault();
    this.props.uiStore.setConfirmBox(name);
  }
  handleDelCancel = () => {
    this.props.uiStore.setConfirmBox('');
  }
  handleDelDoc = (field) => {
    this.props.offeringCreationStore.removeUploadedData('KEY_TERMS_FRM', field);
    this.props.uiStore.setConfirmBox('');
  }
  render() {
    const leaderNumber = this.props.index;
    const index = leaderNumber || 0;
    const {
      LEADERSHIP_FRM,
      formChangeWithIndex,
      maskChangeWithIndex,
      setAddressFields,
    } = this.props.offeringCreationStore;
    const { confirmBox } = this.props.uiStore;
    return (
      <Aux>
        <Form>
          <Header as="h4">
            {`Leader ${index + 1}`}
            <Button.Group className="pull-right">
              <Button secondary className="relaxed" disabled={!LEADERSHIP_FRM.meta.isValid} >Save</Button>
              <Button inverted color="red" content="Delete Leader" />
            </Button.Group>
          </Header>
          <FormCheckbox
            fielddata={LEADERSHIP_FRM.fields.data[index].includeInOfferingPage}
            name="includeInOfferingPage"
            changed={(e, result) => formChangeWithIndex(e, result, 'LEADERSHIP_FRM', index)}
            defaults
            containerclassname="ui relaxed list"
          />
          <Header as="h4">
            Personal Info
          </Header>
          <Form.Group widths="equal">
            {
              ['firstName', 'lastName'].map(field => (
                <FormInput
                  name={field}
                  fielddata={LEADERSHIP_FRM.fields.data[index][field]}
                  changed={(e, result) => formChangeWithIndex(e, result, 'LEADERSHIP_FRM', index)}
                />
              ))
            }
          </Form.Group>
          <Form.Group widths="equal">
            <FormInput
              name="emailAddress"
              fielddata={LEADERSHIP_FRM.fields.data[index].emailAddress}
              changed={(e, result) => formChangeWithIndex(e, result, 'LEADERSHIP_FRM', index)}
            />
            <MaskedInput
              name="phoneNumber"
              fielddata={LEADERSHIP_FRM.fields.data[index].phoneNumber}
              format="###-###-####"
              changed={(values, name) => maskChangeWithIndex(values, 'LEADERSHIP_FRM', name, index)}
              phoneNumber
            />
          </Form.Group>
          <Form.Group widths="equal">
            <MaskedInput
              name="dob"
              fielddata={LEADERSHIP_FRM.fields.data[index].dob}
              format="##/##/####"
              changed={(values, name) => maskChangeWithIndex(values, 'LEADERSHIP_FRM', name, index)}
              dateOfBirth
            />
            <MaskedInput
              name="ssn"
              type="tel"
              fielddata={LEADERSHIP_FRM.fields.data[index].ssn}
              ssn
              changed={(values, name) => maskChangeWithIndex(values, 'LEADERSHIP_FRM', name, index)}
            />
            <FormInput
              name="countryOfCitizanship"
              fielddata={LEADERSHIP_FRM.fields.data[index].countryOfCitizanship}
              changed={(e, result) => formChangeWithIndex(e, result, 'LEADERSHIP_FRM', index)}
            />
          </Form.Group>
          <Form.Group widths="equal">
            <MaskedInput
              name="percentageOwned"
              fielddata={LEADERSHIP_FRM.fields.data[index].percentageOwned}
              percentage
              changed={(values, name) => maskChangeWithIndex(values, 'LEADERSHIP_FRM', name, index)}
            />
            <FormInput
              name="companyPosition"
              fielddata={LEADERSHIP_FRM.fields.data[index].companyPosition}
              changed={(e, result) => formChangeWithIndex(e, result, 'LEADERSHIP_FRM', index)}
            />
            <MaskedInput
              name="startDateOfService"
              fielddata={LEADERSHIP_FRM.fields.data[index].startDateOfService}
              format="##-##-####"
              changed={(values, name) => maskChangeWithIndex(values, 'LEADERSHIP_FRM', name, index)}
              dateOfBirth
            />
          </Form.Group>
          <Header as="h4">
            Address
          </Header>
          <AutoComplete
            name="residentialStreet"
            fielddata={LEADERSHIP_FRM.fields.data[index].residentialStreet}
            onplaceselected={place => setAddressFields(place, index)}
            changed={(e, result) => formChangeWithIndex(e, result, 'LEADERSHIP_FRM', index)}
            placeHolder="Street Address, City, State, Zip"
          />
          <Form.Group widths="equal">
            {
              ['city', 'state'].map(field => (
                <FormInput
                  name={field}
                  fielddata={LEADERSHIP_FRM.fields.data[index][field]}
                  changed={(e, result) => formChangeWithIndex(e, result, 'LEADERSHIP_FRM', index)}
                />
              ))
            }
            <MaskedInput
              name="zipCode"
              fielddata={LEADERSHIP_FRM.fields.data[index].zipCode}
              changed={(values, name) => maskChangeWithIndex(values, 'LEADERSHIP_FRM', name, index)}
              zipCode
            />
          </Form.Group>
          <Header as="h4">
            Bio
          </Header>
          <Popup
            trigger={<Icon className="ns-help-circle" />}
            content="To be used on the public offering page"
            position="top center"
            className="center-align"
            wide
          />
          <FormTextarea
            name="bio"
            fielddata={LEADERSHIP_FRM.fields.data[index].bio}
            changed={(e, result) => formChangeWithIndex(e, result, 'LEADERSHIP_FRM', index)}
            containerclassname="secondary"
            hidelabel
          />
          <Divider section />
          <Header as="h4">
            Website and Social Profiles
          </Header>
          <Popup
            trigger={<Icon className="ns-help-circle" />}
            content="To be used on the public offering page"
            position="top center"
            className="center-align"
            wide
          />
          {
            ['website', 'facebook', 'linkedIn', 'twitter'].map(field => (
              <FormInput
                name={field}
                fielddata={LEADERSHIP_FRM.fields.data[index][field]}
                changed={(e, result) => formChangeWithIndex(e, result, 'LEADERSHIP_FRM', index)}
              />
            ))
          }
          <Divider section />
          <Header as="h4">
            Uploads
          </Header>
          <Form.Group widths="equal">
            {
              ['headShot', 'heroImage', 'driverLicense'].map(field => (
                <DropZone
                  name={field}
                  fielddata={LEADERSHIP_FRM.fields.data[index][field]}
                  ondrop={this.onFileDrop}
                  onremove={this.confirmRemoveDoc}
                  uploadtitle="Upload a file"
                  tooltip={field !== 'driverLicense' ? 'To be used on the public offering page' : false}
                />
              ))
            }
          </Form.Group>
          <Divider section />
          <Header as="h4">
            Other Business Information
          </Header>
          {
            ['namesOfOtherEntities', 'namesOfPromoters'].map(field => (
              <FormTextarea
                name={field}
                fielddata={LEADERSHIP_FRM.fields.data[index][field]}
                changed={(e, result) => formChangeWithIndex(e, result, 'LEADERSHIP_FRM', index)}
                containerclassname="secondary"
              />
            ))
          }
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
          onConfirm={() => this.handleDelDoc(confirmBox.entity)}
          size="mini"
          className="deletion"
        />
      </Aux>
    );
  }
}

