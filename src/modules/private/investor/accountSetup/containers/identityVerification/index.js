import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { get, find } from 'lodash';
import Helper from '../../../../../../helper/utility';
import LegalDetails from '../../components/identityVerification/LegalDetails';
import LegalDocuments from '../../components/identityVerification/LegalDocuments';
import LegalIdentityQuestions from '../../components/identityVerification/LegalIdentityQuestions';
import ConfirmPhoneNumber from '../../../../../auth/containers/ConfirmPhoneNumber';
import { DataFormatter } from '../../../../../../helper';

const isMobile = document.documentElement.clientWidth < 768;

@inject('uiStore', 'identityStore', 'userStore', 'userDetailsStore', 'accountStore')
@withRouter
@observer
export default class IdentityVerification extends Component {
  constructor(props) {
    super(props);
    this.props.identityStore.setCipDetails();
    this.props.uiStore.setErrors(null);
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

  handleVerifyUserIdentity = (e) => {
    e.preventDefault();
    this.props.identityStore.setFormError();
    if (this.props.identityStore.ID_VERIFICATION_FRM.meta.isValid) {
      this.props.identityStore.checkValidAddress()
        .then((res) => {
          if (res.valid) {
            const ssnValue = this.props.identityStore.ID_VERIFICATION_FRM.fields.ssn.value;
            this.props.identityStore.isSsnExist(ssnValue)
              .then((isSSNPresent) => {
                if (isSSNPresent) {
                  // set error
                  this.props.identityStore.setFieldValue('signUpLoading', false);
                  this.props.uiStore.showErrorMessage('The SSN entered is already in use.');
                  throw new Error('Stop the execution');
                }
                this.props.uiStore.setErrors(null);
                this.props.identityStore.verifyUserIdentity()
                  .then(() => {
                    const {
                      key,
                      alertMsg,
                      msgType,
                      route,
                      display,
                    } = this.props.identityStore.userVerficationStatus;
                    if ((key === 'id.success') || this.props.identityStore.isUserCipOffline) {
                      const { phoneVerification } = this.props.userDetailsStore.signupStatus;
                      const {
                        isCipExpired,
                        accountForWhichCipExpired,
                      } = this.props.userDetailsStore;
                      if (phoneVerification === 'DONE') {
                        Helper.toast(alertMsg, msgType);
                        if (isCipExpired && accountForWhichCipExpired) {
                          this.props.history.push(`/app/summary/account-creation/${accountForWhichCipExpired}`);
                        } else {
                          this.props.history.push(route);
                        }
                      } else {
                        this.props.identityStore.startPhoneVerification('NEW', undefined, isMobile).then(() => {
                          this.props.history.push('/app/summary/identity-verification/3');
                        })
                          .catch((err) => {
                            this.props.uiStore.showErrorMessage(err.graphQLErrors[0].message);
                          });
                      }
                    } else {
                      if (display !== false) {
                        Helper.toast(alertMsg, msgType);
                      }
                      if (key === 'id.failure') {
                        this.props.identityStore.setIdentityQuestions();
                      }
                      this.props.history.push(route);
                    }
                  }).catch(() => { });
              })
              .catch(() => { });
          } else {
            const defaultMsg = 'Please enter a valid residential address.';
            this.props.uiStore.showErrorMessage(res.message || defaultMsg, true);
            this.props.identityStore.setFieldValue('signUpLoading', false);
          }
        });
    }
  }

  handleUploadDocuments = (e) => {
    e.preventDefault();
    this.props.identityStore.setSubmitVerificationDocs(true);
    const { phoneVerification } = this.props.userDetailsStore.signupStatus;
    this.props.identityStore.setFieldValue('signUpLoading', true);
    this.props.identityStore.uploadAndUpdateCIPInfo().then(() => {
      if (phoneVerification === 'DONE') {
        const { accountForWhichCipExpired } = this.props.userDetailsStore;
        this.props.uiStore.removeOneFromProgressArray('submitAccountLoader');
        const expiredAccountFromLocalStorage = window.sessionStorage.getItem('AccountCipExp');
        if (window.sessionStorage.getItem('cipErrorMessage')) {
          this.submitAccountToProcessing(accountForWhichCipExpired || expiredAccountFromLocalStorage);
        } else if (accountForWhichCipExpired || expiredAccountFromLocalStorage) {
          this.props.history.push(`/app/summary/account-creation/${accountForWhichCipExpired}`);
          this.props.identityStore.setFieldValue('signUpLoading', false);
        } else {
          this.props.history.push('/app/summary');
          this.props.identityStore.setFieldValue('signUpLoading', false);
        }
      } else {
        this.props.identityStore.startPhoneVerification('NEW', undefined, isMobile).then(() => {
          this.props.identityStore.setFieldValue('signUpLoading', false);
          this.props.history.push('/app/summary/identity-verification/3');
        })
          .catch((err) => {
            this.props.uiStore.setErrors(DataFormatter.getJsonFormattedError(err));
          });
      }
    })
      .catch(() => { });
  }

  submitAccountToProcessing = (accountType) => {
    const accountDetails = find(this.props.userDetailsStore.currentUser.data.user.roles, { name: accountType });
    const accountId = get(accountDetails, 'details.accountId');
    const accountvalue = accountType === 'individual' ? 0 : accountType === 'ira' ? 1 : 2;
    this.props.identityStore.setFieldValue('signUpLoading', true);
    this.props.accountStore.updateToAccountProcessing(accountId, accountvalue).then(() => {
      this.props.identityStore.setFieldValue('signUpLoading', false);
      const url = this.props.accountStore.ACC_TYPE_MAPPING[accountvalue].store.showProcessingModal ? `/app/summary/account-creation/${accountType}/processing` : '/app/summary';
      this.props.history.push(url);
      this.props.userDetailsStore.getUser(this.props.userStore.currentUser.sub);
    });
  }

  handleSubmitIdentityQuestions = (e) => {
    e.preventDefault();
    const { phoneVerification } = this.props.userDetailsStore.signupStatus;
    this.props.identityStore.setFieldValue('signUpLoading', true);
    this.props.identityStore.submitConfirmIdentityQuestions().then((result) => {
      /* eslint-disable no-underscore-dangle */
      if (result.data.verifyCIPAnswers.__typename === 'UserCIPPass') {
        Helper.toast('Identity questions verified.', 'success');
        if (phoneVerification === 'DONE') {
          const { accountForWhichCipExpired } = this.props.userDetailsStore;
          this.props.uiStore.removeOneFromProgressArray('submitAccountLoader');
          const expiredAccountFromLocalStorage = window.sessionStorage.getItem('AccountCipExp');
          if (window.sessionStorage.getItem('cipErrorMessage')) {
            this.submitAccountToProcessing(accountForWhichCipExpired || expiredAccountFromLocalStorage);
          } else if (accountForWhichCipExpired || expiredAccountFromLocalStorage) {
            this.props.history.push(`/app/summary/account-creation/${accountForWhichCipExpired}`);
            this.props.identityStore.setFieldValue('signUpLoading', false);
          } else {
            this.props.history.push('/app/summary');
            this.props.identityStore.setFieldValue('signUpLoading', false);
          }
        } else {
          this.props.identityStore.startPhoneVerification('NEW', undefined, isMobile).then(() => {
            this.props.identityStore.setFieldValue('signUpLoading', false);
            this.props.history.push('/app/summary/identity-verification/3');
          })
            .catch((err) => {
              this.props.uiStore.setErrors(DataFormatter.getJsonFormattedError(err));
              this.props.identityStore.setFieldValue('signUpLoading', false);
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
