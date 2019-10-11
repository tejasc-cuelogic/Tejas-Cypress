import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { get, find } from 'lodash';
import LegalDetails from '../../components/identityVerification/LegalDetails';
import LegalDocuments from '../../components/identityVerification/LegalDocuments';
import LegalIdentityQuestions from '../../components/identityVerification/LegalIdentityQuestions';
import ConfirmPhoneNumber from '../../../../../auth/containers/ConfirmPhoneNumber';


@inject('uiStore', 'identityStore', 'userStore', 'userDetailsStore', 'accountStore')
@withRouter
@observer
export default class IdentityVerification extends Component {
  constructor(props) {
    super(props);
    this.props.identityStore.setCipDetails();
  }

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
    this.props.uiStore.setErrors(null);
    this.props.uiStore.removeOneFromProgressArray('submitAccountLoader');
    this.props.history.push('/app/summary');
  }

  redirectTo = (url) => {
    if (url) {
      this.props.history.push(url);
    }
  }

  handleCipExpiration = async () => {
    let url;
    const { phoneVerification } = this.props.userDetailsStore.signupStatus;
    if (phoneVerification === 'DONE') {
      const { accountForWhichCipExpired, isUserVerified } = this.props.userDetailsStore;
      this.props.uiStore.setFieldvalue('inProgressArray', []);
      const expiredAccountFromLocalStorage = window.sessionStorage.getItem('AccountCipExp');
      if (window.sessionStorage.getItem('cipErrorMessage') && !isUserVerified) {
        url = await this.props.accountStore.accountProcessingWrapper(
          accountForWhichCipExpired || expiredAccountFromLocalStorage, this.props.match,
        );
      } else if (accountForWhichCipExpired || expiredAccountFromLocalStorage) {
        this.props.history.push(`/app/summary/account-creation/${accountForWhichCipExpired}`);
        this.props.identityStore.setFieldValue('signUpLoading', false);
      } else {
        this.props.history.push('/app/summary');
        this.props.identityStore.setFieldValue('signUpLoading', false);
      }
    }
    return url;
  }

  handleVerifyUserIdentity = async (e) => {
    e.preventDefault();
    // this.props.identityStore.setFormError();
    if (this.props.identityStore.ID_VERIFICATION_FRM.meta.isValid) {
      const { url } = await this.props.identityStore.verifyCip();
      this.redirectTo(url);
    }
  }

  handleUploadDocuments = async (e) => {
    e.preventDefault();
    this.props.identityStore.setSubmitVerificationDocs(true);
    this.props.identityStore.setFieldValue('signUpLoading', true);
    let { url } = await this.props.identityStore.verifyCipHardFail();
    const { accountForWhichCipExpired, userDetails } = this.props.userDetailsStore;
    if (userDetails.legalDetails.status === 'OFFLINE' || accountForWhichCipExpired) {
      url = await this.handleCipExpiration();
    }
    this.redirectTo(url);
  }

  submitAccountToProcessing = async (accountType) => {
    const accountDetails = find(this.props.userDetailsStore.currentUser.data.user.roles, { name: accountType });
    const accountvalue = accountType === 'individual' ? 0 : accountType === 'ira' ? 1 : 2;
    const { store } = this.props.accountStore.ACC_TYPE_MAPPING[accountvalue];
    const accountId = get(accountDetails, 'details.accountId') || store[`${accountType}AccountId`];
    await this.props.accountStore.updateToAccountProcessing(accountId, accountvalue);
    const url = store.storeshowProcessingModal ? `/app/summary/account-creation/${accountType}/processing` : '/app/summary';
    store.setFieldValue('showProcessingModal', false);
    this.props.userDetailsStore.getUser(this.props.userStore.currentUser.sub);
    return url;
  }

  handleSubmitIdentityQuestions = async (e) => {
    e.preventDefault();
    this.props.identityStore.setFieldValue('signUpLoading', true);
    let { url } = await this.props.identityStore.verifyCipSoftFail();
    const { accountForWhichCipExpired, userDetails } = this.props.userDetailsStore;
    if ((userDetails.legalDetails.status === 'OFFLINE' || accountForWhichCipExpired)
      && this.props.identityStore.cipStepUrlMapping.ciphardFail.url !== url) {
      url = await this.handleCipExpiration();
    }
    this.redirectTo(url);
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
      signUpLoading,
    } = this.props.identityStore;
    const { errors, confirmBox, inProgress } = this.props.uiStore;
    const { givenName } = this.props.userStore.currentUser;
    const { step } = this.props.match.params;
    return (
      <div>
        {step === '0'
          ? (
            <LegalDetails
              form={ID_VERIFICATION_FRM}
              name={givenName}
              inProgress={signUpLoading}
              close={this.handleCloseModal}
              change={personalInfoChange}
              maskChange={personalInfoMaskedChange}
              autoComplete={setAddressFieldsForUserVerification}
              onSubmit={this.handleVerifyUserIdentity}
              errors={errors}
            />
          )
          : step === '1'
            ? (
              <LegalDocuments
                form={ID_VERIFICATION_DOCS_FRM}
                confirmBox={confirmBox}
                inProgress={inProgress || signUpLoading}
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
            )
            : step === '2'
              ? (
                <LegalIdentityQuestions
                  form={ID_VERIFICATION_QUESTIONS}
                  inProgress={inProgress || signUpLoading}
                  close={this.handleCloseModal}
                  identityQuestionAnswerChange={identityQuestionAnswerChange}
                  onSubmit={this.handleSubmitIdentityQuestions}
                  errors={errors}
                />
              )
              : step === '3'
                ? <ConfirmPhoneNumber />
                : null
        }
      </div>
    );
  }
}
