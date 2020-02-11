/*  eslint-disable jsx-a11y/label-has-for */
import React, { Component } from 'react';
import { Header, Form, Message, Button } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { DropZoneConfirm as DropZone } from '../../../../../../../theme/form';
import { ListErrors } from '../../../../../../../theme/shared';

const isMobile = document.documentElement.clientWidth < 768;

@inject('uiStore', 'iraAccountStore')
@observer
export default class Identity extends Component {
  onIdentityDocDrop = (files) => {
    this.props.iraAccountStore.setFileUploadData('identityDoc', files, !isMobile);
  }

  onIdentityDocRemove = () => {
    this.props.iraAccountStore.removeUploadedData('identityDoc');
    this.props.uiStore.setConfirmBox('');
  }

  handleContinueButton = () => {
    const { createAccount, stepToBeRendered } = this.props.iraAccountStore;
    const { multiSteps } = this.props.uiStore;
    createAccount(multiSteps[stepToBeRendered]);
  }

  render() {
    const { IDENTITY_FRM } = this.props.iraAccountStore;
    const { errors } = this.props.uiStore;
    return (
      <>
        <Header as="h4">Confirm your identity</Header>
        <Form className={!isMobile ? 'file-uploader-large' : ''}>
          <p className={`${isMobile ? 'mb-30' : ''} grey-header`}>Upload a Photo ID (Upload your Driver’s License, state-issued ID, or U.S. passport)</p>
          <DropZone
            name="identityDoc"
            fielddata={IDENTITY_FRM.fields.identityDoc}
            ondrop={this.onIdentityDocDrop}
            onremove={this.onIdentityDocRemove}
            uploadtitle="Choose file"
            containerclassname="mt-40 fluid"
          />
        </Form>
        {errors
          && (
            <Message error className="mt-30">
              <ListErrors errors={[errors.message]} />
            </Message>
          )
        }
        <Button fluid={isMobile} primary className="relaxed mt-40" content="Continue" disabled={!IDENTITY_FRM.meta.isValid} onClick={this.handleContinueButton} />
        <p className={`${isMobile ? 'mobile-bottom-notes' : 'mt-40'} grey-header`}>NextSeed is a regulated financial services company operating in the US. To comply with KYC/AML regulations, we need to verify your identity in order to set up your account.</p>
      </>
    );
  }
}
