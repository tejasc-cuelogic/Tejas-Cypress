import React, { Component } from 'react';
import { Header, Form, Message, Button } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { ListErrors } from '../../../../../../../theme/shared';
import { FormInput, DropZoneConfirm as DropZone } from '../../../../../../../theme/form';

const isMobile = document.documentElement.clientWidth < 768;

@inject('uiStore', 'userStore', 'entityAccountStore')
@observer
export default class PersonalInformation extends Component {
  onLegalDocUrlDrop = (files) => {
    this.props.entityAccountStore.setFileUploadData('PERSONAL_INFO_FRM', 'legalDocUrl', files);
  }

  handleDelLegalDocUrl = () => {
    this.props.entityAccountStore.removeUploadedData('PERSONAL_INFO_FRM', 'legalDocUrl', 'Personal info');
    this.props.uiStore.setConfirmBox('');
  }

  handleContinueButton = () => {
    const { createAccount, stepToBeRendered } = this.props.entityAccountStore;
    const { multiSteps } = this.props.uiStore;
    createAccount(multiSteps[stepToBeRendered]);
  }

  render() {
    const {
      PERSONAL_INFO_FRM,
      personalInfoChange,
    } = this.props.entityAccountStore;
    const { currentUser } = this.props.userStore;
    const { errors } = this.props.uiStore;
    return (
      <>
      <Header as="h4" textAlign={isMobile ? '' : 'center'}>Authorized Signatory Information</Header>
        <p className={`${isMobile ? 'mb-30 mt-0' : 'center-align'} account-type-tab`}>Please provide your title and a copy of your photo ID.</p>
        <p className="grey-header"><b>Authorized Signatory’s</b></p>
        <Form error>
          <Form.Group widths="equal" className={isMobile ? '' : 'field-wrap no-bg small'}>
            <Form.Input
              label="First Name (Legal)"
              value={currentUser.givenName}
              className="readonly"
              readOnly
            />
            <Form.Input
              label="Last Name (Legal)"
              value={currentUser.familyName}
              className="readonly"
              readOnly
            />
          </Form.Group>
          <div className={isMobile ? '' : 'field-wrap small'}>
            <FormInput
              name="title"
              fielddata={PERSONAL_INFO_FRM.fields.title}
              changed={personalInfoChange}
              showerror
            />
          </div>
          <DropZone
            name="legalDocUrl"
            fielddata={PERSONAL_INFO_FRM.fields.legalDocUrl}
            ondrop={this.onLegalDocUrlDrop}
            onremove={this.handleDelLegalDocUrl}
            uploadtitle={isMobile ? 'Choose file' : 'Choose a file or drag it here'}
            containerclassname={`${isMobile ? 'mt-30 mb-30' : ''} fluid`}
          />
          {errors
            && (
              <Message error className="mt-30">
                <ListErrors errors={[errors.message]} />
              </Message>
            )
          }
          {isMobile && (
            <Button fluid primary className="relaxed" content="Continue" disabled={!PERSONAL_INFO_FRM.meta.isValid || errors} onClick={this.handleContinueButton} />
          )
          }
        </Form>
      </>
    );
  }
}
