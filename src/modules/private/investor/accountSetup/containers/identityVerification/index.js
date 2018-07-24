import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import Helper from '../../../../../../helper/utility';
import LegalDetails from '../../components/identityVerification/LegalDetails';
import LegalDocuments from '../../components/identityVerification/LegalDocuments';
import LegalIdentityQuestions from '../../components/identityVerification/LegalIdentityQuestions';
import ConfirmPhoneNumber from '../../../../../auth/containers/ConfirmPhoneNumber';

@inject('uiStore', 'identityStore', 'userStore', 'userDetailsStore')
@withRouter
@observer
export default class IdentityVerification extends Component {
  onPhotoIdDrop = (files) => {
    this.props.identityStore.setFileUploadData('photoId', files);
  }

  onProofOfResidenceDrop = (files) => {
    this.props.identityStore.setFileUploadData('proofOfResidence', files);
  }

  confirmRemoveDoc = (e, name) => {
    e.preventDefault();
    this.props.uiStore.setConfirmBox(name);
  }

  handleDelCancel = () => {
    this.props.uiStore.setConfirmBox('');
  }

  handleDelDoc = (field) => {
    this.props.identityStore.removeUploadedData(field);
    this.props.uiStore.setConfirmBox('');
  }

  handleCloseModal = () => {
    this.props.history.push('/app/summary');
  }

  handleVerifyUserIdentity = (e) => {
    e.preventDefault();
    this.props.identityStore.setFormError();
    if (this.props.identityStore.ID_VERIFICATION_FRM.meta.isValid) {
      this.props.identityStore.verifyUserIdentity().then(() => {
        const {
          key,
          alertMsg,
          msgType,
          route,
        } = this.props.identityStore.userVerficationStatus;
        if (key === 'id.success') {
          const { phoneVerification } = this.props.userDetailsStore.signupStatus;
          if (phoneVerification === 'DONE') {
            Helper.toast(alertMsg, msgType);
            this.props.history.push(route);
          } else {
            this.props.identityStore.startPhoneVerification().then(() => {
              this.props.history.push('/app/summary/identity-verification/3');
            })
              .catch((err) => { this.props.uiStore.setErrors(JSON.stringify(err.message)); });
          }
        } else {
          Helper.toast(alertMsg, msgType);
          if (key === 'id.failure') {
            this.props.identityStore.setIdentityQuestions();
          }
          this.props.history.push(route);
        }
      })
        .catch(() => { });
    }
  }

  handleUploadDocuments = (e) => {
    e.preventDefault();
    this.props.identityStore.setSubmitVerificationDocs(true);
    const { phoneVerification } = this.props.userDetailsStore.signupStatus;
    this.props.identityStore.uploadAndUpdateCIPInfo().then(() => {
      if (phoneVerification === 'DONE') {
        this.props.history.push('/app/summary');
      } else {
        this.props.identityStore.startPhoneVerification().then(() => {
          this.props.history.push('/app/summary/identity-verification/3');
        })
          .catch((err) => {
            this.props.uiStore.setErrors(JSON.stringify(err.message));
          });
      }
    })
      .catch(() => { });
  }

  handleSubmitIdentityQuestions = (e) => {
    e.preventDefault();
    const { phoneVerification } = this.props.userDetailsStore.signupStatus;
    this.props.identityStore.submitConfirmIdentityQuestions().then((result) => {
      /* eslint-disable no-underscore-dangle */
      if (result.data.verifyCIPAnswers.__typename === 'UserCIPPass') {
        Helper.toast('Identity questions verified.', 'success');
        if (phoneVerification === 'DONE') {
          this.props.history.push('/app/summary');
        } else {
          this.props.identityStore.startPhoneVerification().then(() => {
            this.props.history.push('/app/summary/identity-verification/3');
          })
            .catch((err) => {
              this.props.uiStore.setErrors(JSON.stringify(err.message));
            });
        }
      } else {
        Helper.toast('Identity questions not verified.', 'error');
        this.props.history.push('/app/summary/identity-verification/1');
      }
    });
  }

  render() {
    const {
      ID_VERIFICATION_FRM,
      ID_VERIFICATION_DOCS_FRM,
      ID_VERIFICATION_QUESTIONS,
      personalInfoChange,
      submitVerificationsDocs,
      personalInfoMaskedChange,
      identityQuestionAnswerChange,
      setAddressFieldsForUserVerification,
    } = this.props.identityStore;
    const { errors, confirmBox, inProgress } = this.props.uiStore;
    const { givenName } = this.props.userStore.currentUser;
    const { step } = this.props.match.params;
    return (
      <div>
        {step === '0' &&
          <LegalDetails
            form={ID_VERIFICATION_FRM}
            name={givenName}
            inProgress={inProgress}
            close={this.handleCloseModal}
            change={personalInfoChange}
            maskChange={personalInfoMaskedChange}
            autoComplete={setAddressFieldsForUserVerification}
            onSubmit={this.handleVerifyUserIdentity}
            errors={errors}
          />
        }
        {step === '1' &&
          <LegalDocuments
            form={ID_VERIFICATION_DOCS_FRM}
            confirmBox={confirmBox}
            inProgress={inProgress}
            close={this.handleCloseModal}
            onPhotoIdDrop={this.onPhotoIdDrop}
            onProofOfResidenceDrop={this.onProofOfResidenceDrop}
            confirmRemoveDoc={this.confirmRemoveDoc}
            handleDelCancel={this.handleDelCancel}
            handleDelDoc={this.handleDelDoc}
            submitVerificationsDocs={submitVerificationsDocs}
            onSubmit={this.handleUploadDocuments}
            errors={errors}
          />
        }
        {step === '2' &&
          <LegalIdentityQuestions
            form={ID_VERIFICATION_QUESTIONS}
            inProgress={inProgress}
            close={this.handleCloseModal}
            identityQuestionAnswerChange={identityQuestionAnswerChange}
            onSubmit={this.handleSubmitIdentityQuestions}
            errors={errors}
          />
        }
        {step === '3' &&
          <ConfirmPhoneNumber />
        }
      </div>
    );
  }
}
