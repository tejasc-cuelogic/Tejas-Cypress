/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */
import graphql from 'mobx-apollo';
import { observable, action, computed, toJS } from 'mobx';
import moment from 'moment';
import { mapValues, keyBy, find, flatMap, map, omit, get, uniqWith, isEqual } from 'lodash';
import Validator from 'validatorjs';
import { USER_IDENTITY, IDENTITY_DOCUMENTS, PHONE_VERIFICATION, UPDATE_PROFILE_INFO } from '../../../constants/user';
import { FormValidator, DataFormatter } from '../../../../helper';
import { uiStore, authStore, userStore, userDetailsStore } from '../../index';
import { requestOtpWrapper, verifyOTPWrapper, verifyOtp, requestOtp, checkValidAddress, isUniqueSSN, verifyCIPUser, updateUserCIPInfo, verifyCIPAnswers, updateUserPhoneDetail, updateUserProfileData } from '../../queries/profile';
import { GqlClient as client } from '../../../../api/gqlApi';
import { GqlClient as publicClient } from '../../../../api/publicApi';
import Helper from '../../../../helper/utility';
import validationService from '../../../../api/validation';
import { fileUpload } from '../../../actions';
import identityHelper from '../../../../modules/private/investor/accountSetup/containers/identityVerification/helper';
import { US_STATES_FOR_INVESTOR, FILE_UPLOAD_STEPS } from '../../../../constants/account';

export class IdentityStore {
  @observable ID_VERIFICATION_FRM = FormValidator.prepareFormObject(USER_IDENTITY);

  @observable ID_VERIFICATION_DOCS_FRM = FormValidator.prepareFormObject(IDENTITY_DOCUMENTS);

  @observable ID_VERIFICATION_QUESTIONS = FormValidator.prepareFormObject([]);

  @observable ID_PHONE_VERIFICATION = FormValidator.prepareFormObject(PHONE_VERIFICATION);

  @observable ID_PROFILE_INFO = FormValidator.prepareFormObject(UPDATE_PROFILE_INFO);

  @observable submitVerificationsDocs = false;

  @observable reSendVerificationCode = false;

  @observable confirmMigratedUserPhoneNumber = false;

  @observable requestOtpResponse = {};

  @observable userCipStatus = '';

  @observable isOptConfirmed = false;

  @observable sendOtpToMigratedUser = [];

  @observable signUpLoading = false;

  @observable isAdmin = false;


  @action
  setFieldValue = (field, value) => {
    this[field] = value;
  }

  @action
  setSendOtpToMigratedUser = (step) => {
    this.sendOtpToMigratedUser.push(step);
  }

  @action
  setIsOptConfirmed = (status) => {
    this.isOptConfirmed = status;
  }

  @action
  setConfirmMigratedUserPhoneNumber = (status) => {
    this.confirmMigratedUserPhoneNumber = status;
  }

  @action setRequestOtpResponse = (result) => {
    this.requestOtpResponse = result;
  }

  @action setCipStatus = (status) => {
    this.userCipStatus = status;
  }

  @action
  setSubmitVerificationDocs(status) {
    this.submitVerificationsDocs = status;
  }

  @action
  setReSendVerificationCode(status) {
    this.reSendVerificationCode = status;
  }

  @action
  personalInfoChange = (e, result) => {
    this.ID_VERIFICATION_FRM = FormValidator.onChange(
      this.ID_VERIFICATION_FRM,
      FormValidator.pullValues(e, result),
    );
  };

  @action
  personalInfoMaskedChange = (values, field) => {
    const finalValue = (field === 'dateOfBirth') ? values.formattedValue : values.value;
    this.ID_VERIFICATION_FRM = FormValidator.onChange(
      this.ID_VERIFICATION_FRM,
      { name: field, value: finalValue },
    );
  }

  @action
  phoneNumberChange = (value) => {
    this.ID_VERIFICATION_FRM = FormValidator.onChange(
      this.ID_VERIFICATION_FRM,
      { name: 'phoneNumber', value },
    );
  }

  @action
  phoneTypeChange = (value) => {
    this.ID_VERIFICATION_FRM = FormValidator.onChange(
      this.ID_VERIFICATION_FRM,
      { name: 'mfaMethod', value },
    );
  }

  @action
  profileInfoChange = (e, result) => {
    this.ID_PROFILE_INFO = FormValidator.onChange(
      this.ID_PROFILE_INFO,
      FormValidator.pullValues(e, result),
    );
  }

  @action
  profileInfoMaskedChange = (values, field) => {
    const finalValue = values.value;
    this.ID_PROFILE_INFO = FormValidator.onChange(
      this.ID_PROFILE_INFO,
      { name: field, value: finalValue },
    );
  }

  @action
  setAddressFieldsForUserVerification = (place) => {
    FormValidator.setAddressFields(place, this.ID_VERIFICATION_FRM);
  }

  @action
  setAddressFieldsForProfile = (place) => {
    FormValidator.setAddressFields(place, this.ID_PROFILE_INFO);
  }

  @action
  setVerifyIdentityResponse = (response) => {
    const IDENTITY_FORM = this.ID_VERIFICATION_FRM;
    IDENTITY_FORM.response = response;
    this.ID_VERIFICATION_FRM = { ...IDENTITY_FORM };
  }

  @action
  phoneVerificationChange = (e) => {
    uiStore.setErrors('');
    this.ID_PHONE_VERIFICATION = FormValidator.onChange(
      this.ID_PHONE_VERIFICATION,
      { name: 'code', value: e },
    );
  };

  @action
  resetFormData = (form) => {
    const resettedForm = FormValidator.resetFormData(this[form]);
    this[form] = resettedForm;
  }

  @computed
  get formattedUserInfoForCip() {
    const { fields } = this.ID_VERIFICATION_FRM;
    const selectedState = find(US_STATES_FOR_INVESTOR, { value: fields.state.value });
    const roles = get(userStore.currentUser, 'roles');
    const { phone, legalDetails } = roles.includes('investor') ? userDetailsStore.userDetails : userDetailsStore.detailsOfUser.data.user;
    const userInfo = {
      legalName: {
        salutation: fields.title.value,
        firstLegalName: fields.firstLegalName.value,
        lastLegalName: fields.lastLegalName.value,
      },
      dateOfBirth: fields.dateOfBirth.value,
      ssn: fields.ssn.value,
      legalAddress: {
        street: fields.residentalStreet.value,
        city: fields.city.value,
        state: selectedState ? selectedState.key : null,
        zipCode: fields.zipCode.value,
        streetTwo: fields.zipCode.value,
      },
    };
    const { photoId, proofOfResidence } = this.ID_VERIFICATION_DOCS_FRM.fields;
    const verificationDocs = {
      idProof: {
        fileId: photoId.fileId || get(legalDetails, 'verificationDocs.idProof.fileId'),
        fileName: photoId.value || get(legalDetails, 'verificationDocs.idProof.fileName'),
      },
      addressProof: {
        fileId: proofOfResidence.fileId || get(legalDetails, 'verificationDocs.addressProof.fileId'),
        fileName: proofOfResidence.value || get(legalDetails, 'verificationDocs.addressProof.fileName'),
      },
    };
    if (photoId.fileId || get(legalDetails, 'verificationDocs.idProof.fileId')) {
      userInfo.verificationDocs = verificationDocs;
    }
    const number = fields.phoneNumber.value ? fields.phoneNumber.value : phone !== null ? phone.number : '';
    const phoneDetails = { number };
    return { userInfo, phoneDetails };
  }

  checkIncorrectAns = res => res.key && (res.key.split('.').includes('incorrect') || res.key.split('.').includes('incomplete'))

  CipFailReasons = (failReasonArr, obj) => {
    failReasonArr.push(obj);
    // eslint-disable-next-line no-shadow
    const filteredArr = map(failReasonArr, obj => (omit(obj, [['__typename']])));
    return uniqWith(filteredArr, isEqual);
  }

  @computed
  get formattedUserInfo() {
    const { fields, response } = this.ID_VERIFICATION_FRM;
    const legalCip = {};
    // eslint-disable-next-line no-unused-vars
    const roles = get(userStore.currentUser, 'roles');
    const { phone, cip, legalDetails } = roles.includes('investor') ? userDetailsStore.userDetails : userDetailsStore.detailsOfUser.data.user;
    if (response.key === 'id.error') {
      legalCip.expiration = Helper.getDaysfromNow(21);
      legalCip.requestId = 'ERROR_NO_REQUEST_ID';
    } else if (response.message === 'PASS' || (response.summary && response.summary === 'pass')) {
      legalCip.expiration = Helper.getDaysfromNow(21);
      legalCip.requestId = response.passId;
      if (response.key && Helper.matchRegexWithString(/\bcorrect(?![-])\b/, response.message)) {
        legalCip.failReason = !get(cip, 'failReason') ? [{ key: response.key, message: response.message }]
          : this.CipFailReasons(cip.failReason, { key: response.key, message: response.message });
        legalCip.failType = 'FAIL_WITH_QUESTIONS';
      }
    } else if (response.message === 'FAIL' && response.questions) {
      legalCip.expiration = Helper.getDaysfromNow(21);
      legalCip.requestId = response.softFailId;
      legalCip.failType = 'FAIL_WITH_QUESTIONS';
      legalCip.failReason = !get(cip, 'failReason') ? [omit(response.qualifiers && response.qualifiers[0], ['__typename'])]
        : this.CipFailReasons(cip.failReason, omit(response.qualifiers && response.qualifiers[0], ['__typename']));
    } else if (this.checkIncorrectAns(response) && response.hardFailId) {
      legalCip.expiration = Helper.getDaysfromNow(21);
      legalCip.requestId = response.hardFailId;
      legalCip.failType = 'FAIL_WITH_UPLOADS';
      legalCip.failReason = !get(cip, 'failReason') ? [{ key: response.key, message: response.message }]
        : this.CipFailReasons(cip.failReason, { key: response.key, message: response.message });
    } else {
      legalCip.expiration = this.isUserCipOffline ? moment().subtract(1, 'days').toISOString() : Helper.getDaysfromNow(21);
      legalCip.requestId = response.hardFailId || '-1';
      if (this.userCipStatus !== 'OFFLINE') {
        legalCip.failType = 'FAIL_WITH_UPLOADS';
      }
      if (response.qualifiers && response.qualifiers !== null) {
        legalCip.failReason = !get(cip, 'failReason') ? [omit(response.qualifiers && response.qualifiers[0], ['__typename'])]
          : this.CipFailReasons(cip.failReason, omit(response.qualifiers && response.qualifiers[0], ['__typename']));
      }
    }
    const selectedState = find(US_STATES_FOR_INVESTOR, { value: fields.state.value });
    const userInfo = {
      legalName: {
        salutation: fields.title.value,
        firstLegalName: fields.firstLegalName.value,
        lastLegalName: fields.lastLegalName.value,
      },
      status: this.userCipStatus !== '' ? this.userCipStatus : this.cipStatus,
      dateOfBirth: fields.dateOfBirth.value,
      ssn: fields.ssn.value,
      legalAddress: {
        street: fields.residentalStreet.value,
        city: fields.city.value,
        state: selectedState ? selectedState.key : null,
        zipCode: fields.zipCode.value,
        streetTwo: fields.streetTwo.value,
      },
    };
    const { photoId, proofOfResidence } = this.ID_VERIFICATION_DOCS_FRM.fields;
    const verificationDocs = {
      idProof: {
        fileId: photoId.fileId || get(legalDetails, 'verificationDocs.idProof.fileId'),
        fileName: photoId.value || get(legalDetails, 'verificationDocs.idProof.fileName'),
      },
      addressProof: {
        fileId: proofOfResidence.fileId || get(legalDetails, 'verificationDocs.addressProof.fileId'),
        fileName: proofOfResidence.value || get(legalDetails, 'verificationDocs.addressProof.fileName'),
      },
    };
    if (photoId.fileId || get(legalDetails, 'verificationDocs.idProof.fileId')) {
      userInfo.verificationDocs = verificationDocs;
    }
    const number = fields.phoneNumber.value ? fields.phoneNumber.value : phone !== null ? phone.number : '';
    const phoneDetails = { number };
    return { userInfo, phoneDetails, legalCip };
  }

  @action
  setStateValue = (stateValue) => {
    this.ID_PROFILE_INFO.fields.state.value = stateValue;
  }

  @computed get cipStatus() {
    const { key, questions } = this.ID_VERIFICATION_FRM.response;
    const cipStatus = identityHelper.getCipStatus(key, questions);
    return cipStatus;
  }

  @action
  verifyUserIdentity = () => {
    this.ID_VERIFICATION_FRM.response = {};
    this.setCipStatus('');
    let userId = userStore.currentUser.sub;
    const roles = get(userStore.currentUser, 'roles');
    if (roles.includes('admin')) {
      this.setCipDetails();
      userId = userDetailsStore.selectedUserId;
    }
    return new Promise((resolve, reject) => {
      client
        .mutate({
          mutation: verifyCIPUser,
          variables: {
            userId,
            user: this.formattedUserInfoForCip.userInfo,
          },
        })
        .then((data) => {
          this.setVerifyIdentityResponse(data.data.verifyCIPIdentity);
          const requestId = data.data.verifyCIPIdentity.passId
          || data.data.verifyCIPIdentity.softFailId
          || data.data.verifyCIPIdentity.hardFailId;
          if (requestId) {
            this.updateUserInfo().then(() => {
              this.setFieldValue('signUpLoading', false);
              resolve(requestId);
            }).catch((err) => {
              console.log('error update user', err);
              this.setFieldValue('signUpLoading', false);
              reject();
            });
          } else {
            this.setFieldValue('signUpLoading', false);
            uiStore.setErrors(data.data.verifyCIPIdentity.message);
          }
        })
        .catch((err) => {
          if (err.response || err.message) {
            uiStore.setErrors(DataFormatter.getSimpleErr(err));
            this.setFieldValue('signUpLoading', false);
            reject(err);
          } else {
            // uiStore.setErrors(JSON.stringify('Something went wrong'));
            this.setCipStatus('OFFLINE');
            window.sessionStorage.setItem('cipErrorMessage', JSON.stringify(err));
            this.updateUserInfo().then(() => {
              this.setFieldValue('signUpLoading', false);
              resolve();
            }).catch(() => {
              this.setFieldValue('signUpLoading', false);
              reject();
            });
          // reject(err);
          }
        });
      // .finally(() => {
      //   uiStore.setProgress(false);
      // });
    });
  }

  @action
  setCipStatusWithUserDetails = () => {
    this.userCipStatus = userDetailsStore.userDetails.legalDetails.status;
  }

  @action
  setIdentityQuestions = () => {
    const { response } = this.ID_VERIFICATION_FRM;
    const questionsArray = identityHelper.setIdentityQuestions(response);
    this.ID_VERIFICATION_QUESTIONS.fields = questionsArray;
    this.setFieldValue('signUpLoading', false);
  }

  @action
  setFileUploadData = (field, files) => {
    uiStore.setProgress();
    const file = files[0];
    const stepName = FILE_UPLOAD_STEPS[field];
    const fileData = Helper.getFormattedFileData(file);
    fileUpload.setFileUploadData('', fileData, stepName, 'INVESTOR').then(action((result) => {
      const { fileId, preSignedUrl } = result.data.createUploadEntry;
      this.ID_VERIFICATION_DOCS_FRM.fields[field].fileId = fileId;
      this.ID_VERIFICATION_DOCS_FRM.fields[field].preSignedUrl = preSignedUrl;
      this.ID_VERIFICATION_DOCS_FRM.fields[field].fileData = file;
      this.ID_VERIFICATION_DOCS_FRM = FormValidator.onChange(
        this.ID_VERIFICATION_DOCS_FRM,
        { name: field, value: fileData.fileName },
      );
      fileUpload.putUploadedFileOnS3({ preSignedUrl, fileData: file, fileType: fileData.fileType })
        .then(() => { })
        .catch((err) => {
          Helper.toast('Something went wrong, please try again later.', 'error');
          uiStore.setErrors(DataFormatter.getSimpleErr(err));
        })
        .finally(() => {
          uiStore.setProgress(false);
        });
    }));
  }

  @action
  removeUploadedData(field) {
    const { fileId } = this.ID_VERIFICATION_DOCS_FRM.fields[field];
    fileUpload.removeUploadedData(fileId).then(action(() => {
      this.ID_VERIFICATION_DOCS_FRM = FormValidator.onChange(
        this.ID_VERIFICATION_DOCS_FRM,
        { name: field, value: '' },
      );
      this.ID_VERIFICATION_DOCS_FRM.fields[field].fileId = '';
      this.ID_VERIFICATION_DOCS_FRM.fields[field].preSignedUrl = '';
    }))
      .catch(() => { });
  }

  uploadAndUpdateCIPInfo = () => {
    uiStore.setProgress();
    const cipStatus = 'MANUAL_VERIFICATION_PENDING';
    this.setCipStatus(cipStatus);
    console.log('upload mutation');
    return new Promise((resolve, reject) => {
      this.updateUserInfo()
        .then(() => {
          uiStore.setProgress(false);
          resolve();
        })
        .catch((err) => {
          console.log('upload error', err);
          uiStore.setProgress(false);
          reject(err);
        });
      // .finally(() => {
      // });
    });
  }

  startPhoneVerification = (type, address = undefined, isMobile = false) => {
    const { user } = userDetailsStore.currentUser.data;
    const phoneNumber = address || get(user, 'phone.number');
    const emailAddress = get(user, 'email.address');
    const userAddress = type === 'EMAIL' ? emailAddress.toLowerCase() : phoneNumber;
    const { mfaMethod } = this.ID_VERIFICATION_FRM.fields;
    uiStore.clearErrors();
    uiStore.setProgress();
    this.setFieldValue('signUpLoading', true);
    return new Promise((resolve, reject) => {
      client
        .mutate({
          mutation: requestOtp,
          variables: {
            userId: userStore.currentUser.sub || authStore.userId,
            type: type || (mfaMethod.value !== '' ? mfaMethod.value : 'NEW'),
            address: userAddress || '',
          },
        })
        .then((result) => {
          const requestMode = type === 'EMAIL' ? `code sent to ${emailAddress}` : (type === 'CALL' ? `call to ${phoneNumber}` : `code texted to ${phoneNumber}`);
          if (type === 'EMAIL') {
            this.setSendOtpToMigratedUser('EMAIL');
          } else {
            this.setConfirmMigratedUserPhoneNumber(true);
            this.setSendOtpToMigratedUser('PHONE');
          }
          this.setRequestOtpResponse(result.data.requestOtp);
          if (!isMobile) {
            Helper.toast(`Verification ${requestMode}.`, 'success');
          }
          this.setFieldValue('signUpLoading', false);
          resolve();
        })
        .catch((err) => {
          // uiStore.setErrors(DataFormatter.getJsonFormattedError(err));
          this.setFieldValue('signUpLoading', false);
          uiStore.setErrors(toJS(DataFormatter.getSimpleErr(err)));
          reject(err);
        })
        .finally(() => {
          uiStore.setProgress(false);
        });
    });
  }

  @computed get isUserCipOffline() {
    return this.userCipStatus === 'OFFLINE';
  }

  @action
  identityQuestionAnswerChange = (e, { name, value }) => {
    const changedAnswer = find(this.ID_VERIFICATION_QUESTIONS.fields, { key: name });
    changedAnswer.value = value;

    const validation = new Validator(
      mapValues(keyBy(this.ID_VERIFICATION_QUESTIONS.fields, 'key'), f => f.value),
      mapValues(keyBy(this.ID_VERIFICATION_QUESTIONS.fields, 'key'), f => f.rule),
    );
    this.ID_VERIFICATION_QUESTIONS.meta.isValid = validation.passes();
    changedAnswer.error = validation.errors.first(changedAnswer.key);
  }

  submitConfirmIdentityQuestions = () => {
    uiStore.setProgress();
    return new Promise((resolve, reject) => {
      client
        .mutate({
          mutation: verifyCIPAnswers,
          variables: {
            cipAnswers: {
              id: this.ID_VERIFICATION_FRM.response.softFailId,
              answers: this.formattedIdentityQuestionsAnswers,
            },
          },
        })
        .then((result) => {
          /* eslint-disable no-underscore-dangle */
          this.setVerifyIdentityResponse(result.data.verifyCIPAnswers);
          // eslint-disable-next-line no-unused-expressions
          result.data.verifyCIPAnswers.__typename === 'UserCIPPass'
            ? this.setCipStatus('PASS') : this.setCipStatus('HARD_FAIL');
          this.updateUserInfo();
          uiStore.setProgress(false);
          this.setFieldValue('signUpLoading', false);
          resolve(result);
        })
        .catch((err) => {
          uiStore.setErrors(DataFormatter.getSimpleErr(err));
          uiStore.setProgress(false);
          this.setFieldValue('signUpLoading', false);
          reject();
        });
      // .finally(() => {
      //   uiStore.setProgress(false);
      // });
    });
  }

  @computed
  get formattedIdentityQuestionsAnswers() {
    const formattedIdentityQuestionsAnswers = flatMap(this.ID_VERIFICATION_QUESTIONS.fields, n => [{ type: n.key, text: n.value }]);
    return formattedIdentityQuestionsAnswers;
  }

  verifyAndUpdatePhoneNumber = () => {
    uiStore.setProgress();
    return new Promise((resolve, reject) => {
      client
        .mutate({
          mutation: verifyOtp,
          variables: {
            resourceId: this.requestOtpResponse,
            verificationCode: this.ID_PHONE_VERIFICATION.fields.code.value,
          },
        })
        .then((result) => {
          if (result.data.verifyOtp) {
            this.updateUserPhoneDetails();
            userDetailsStore.getUser(userStore.currentUser.sub).then(() => {
              resolve();
            });
          } else {
            const error = {
              message: 'Please enter correct verification code.',
            };
            uiStore.setErrors(error);
            reject();
          }
        })
        .catch(action((err) => {
          uiStore.setErrors(JSON.stringify(err.message));
          reject(err);
        }))
        .finally(() => {
          uiStore.setProgress(false);
        });
    });
  }

  confirmPhoneNumber = () => {
    uiStore.setProgress();
    return new Promise((resolve, reject) => {
      client
        .mutate({
          mutation: verifyOtp,
          variables: {
            resourceId: this.requestOtpResponse,
            verificationCode: this.ID_PHONE_VERIFICATION.fields.code.value,
          },
        })
        .then((result) => {
          if (result.data.verifyOtp) {
            this.updateUserPhoneDetails();
            resolve();
          } else {
            const error = {
              message: 'Please enter correct verification code.',
            };
            uiStore.setErrors(error);
            reject();
          }
        })
        .catch(action((err) => {
          uiStore.setErrors(DataFormatter.getJsonFormattedError(err));
          reject(err);
        }))
        .finally(() => {
          uiStore.setProgress(false);
        });
    });
  }

  updateUserInfo = () => {
    const roles = get(userStore.currentUser, 'roles');
    this.setCipDetails(roles.includes('admin'));
    const payLoad = {
      user: this.formattedUserInfo.userInfo,
      phoneDetails: this.formattedUserInfo.phoneDetails,
      cip: this.formattedUserInfo.legalCip,
    };
    if (roles.includes('admin')) {
      payLoad.userId = userDetailsStore.selectedUserId;
    }
    return new Promise((resolve, reject) => {
      client
        .mutate({
          mutation: updateUserCIPInfo,
          variables: payLoad,
        })
        .then((data) => {
          const getUserQuery = roles.includes('investor') ? 'getUser' : 'getUserProfileDetails';
          const userId = roles.includes('investor') ? userStore.currentUser.sub : userDetailsStore.selectedUserId;
          userDetailsStore[getUserQuery](userId).then((d) => {
            if (d) {
              this.setCipStatusWithUserDetails();
              resolve(data);
            }
          });
        })
        .catch((err) => {
          uiStore.setErrors(DataFormatter.getSimpleErr(err));
          reject(err);
        });
    });
  };

  updateUserPhoneDetails = () => new Promise((res, rej) => {
    client
      .mutate({
        mutation: updateUserPhoneDetail,
        variables: {
          phoneDetails: {
            number: this.ID_VERIFICATION_FRM.fields.phoneNumber.value,
          },
        },
      })
      .then(() => { res(); })
      .catch(() => { rej(); });
  })

  uploadProfilePhoto = () => {
    uiStore.setProgress();
    return new Promise((resolve, reject) => {
      // const b64Text = profileData.split(',')[1];
      const fileObj = {
        name: `${moment().unix()}.${get(this.ID_PROFILE_INFO, 'fields.profilePhoto.meta.ext') || 'jpg'}`,
        obj: this.ID_PROFILE_INFO.fields.profilePhoto.base64String,
        type: get(this.ID_PROFILE_INFO, 'fields.profilePhoto.meta.type'),
      };
      fileUpload.uploadToS3(fileObj, `profile-photo/${userStore.currentUser.sub}`)
        .then(action((response) => {
          if (response) {
            this.setProfilePhoto('responseUrl', response);
            this.updateUserProfileData().then(() => {
              userDetailsStore.setProfilePhoto(response);
              Helper.toast('Profile photo updated successfully', 'success');
              this.resetProfilePhoto();
              resolve(response);
            })
              .catch((err) => {
                uiStore.setErrors(DataFormatter.getSimpleErr(err));
                Helper.toast('Something went wrong, please try again later.', 'error');
                reject(err);
              });
          } else {
            this.setProfilePhoto('error', 'Something went wrong.');
            this.setProfilePhoto('value', '');
          }
        })).catch((err) => {
          uiStore.setErrors(DataFormatter.getSimpleErr(err));
          Helper.toast('Something went wrong, please try again later.', 'error');
          reject(err);
        })
        .finally(action(() => { uiStore.setProgress(false); }));
    });
  }

  updateUserProfileData = () => {
    uiStore.setProgress();
    return new Promise((resolve, reject) => {
      client
        .mutate({
          mutation: updateUserProfileData,
          variables: {
            profileDetails: this.profileDetails,
          },
        })
        .then(() => {
          userDetailsStore.getUser(userStore.currentUser.sub).then(() => resolve());
        })
        .catch((err) => {
          uiStore.setErrors(DataFormatter.getSimpleErr(err));
          reject(err);
        })
        .finally(() => {
          uiStore.setProgress(false);
        });
    });
  }

  @computed
  get profileDetails() {
    const { fields } = this.ID_PROFILE_INFO;
    const selectedState = find(US_STATES_FOR_INVESTOR, { value: fields.state.value });
    const profileDetails = {
      firstName: fields.firstName.value,
      lastName: fields.lastName.value,
      mailingAddress: {
        street: fields.street.value,
        city: fields.city.value,
        state: selectedState ? selectedState.key : '',
        zipCode: fields.zipCode.value,
        streetTwo: fields.streetTwo.value,
      },
      avatar: {
        name: fields.profilePhoto.value,
        url: fields.profilePhoto.responseUrl,
      },
    };
    return profileDetails;
  }

  @action
  resetProfilePhoto = () => {
    const attributes = ['src', 'error', 'value', 'base64String', 'fileName', 'meta'];
    attributes.forEach((val) => {
      this.ID_PROFILE_INFO.fields.profilePhoto[val] = '';
    });
  }

  @action
  setProfilePhoto(attr, value) {
    this.ID_PROFILE_INFO.fields.profilePhoto[attr] = value;
  }

  @action
  setProfileInfoField = (field, value) => {
    this.ID_PROFILE_INFO = FormValidator.onChange(
      this.ID_PROFILE_INFO,
      { name: field, value },
    );
  }

  @action
  setFormError = () => {
    // this.isSsnExist(this.ID_VERIFICATION_FRM.fields.ssn.value);
    map(this.ID_VERIFICATION_FRM.fields, (value) => {
      const { key } = value;
      const { errors } = validationService.validate(value);
      FormValidator.setFormError(this.ID_VERIFICATION_FRM, key, errors && errors[key][0]);
    });
  }

  @action
  setProfileInfo = (userDetails) => {
    this.resetFormData('ID_PROFILE_INFO');
    const {
      email,
      legalDetails,
      info,
      phone,
    } = userDetails;
    if (info) {
      this.setProfileInfoField('firstName', info.firstName);
    }
    if (info) {
      this.setProfileInfoField('lastName', info.lastName);
    } else if (legalDetails && legalDetails.legalName !== null) {
      this.setProfileInfoField('firstName', legalDetails.legalName.firstLegalName);
      this.setProfileInfoField('firstName', legalDetails.legalName.lastLegalName);
    }
    if (email) {
      this.setProfileInfoField('email', email.address);
    }
    if (phone && phone !== null && phone.verified) {
      this.setProfileInfoField('phoneNumber', phone.number);
    }
    if (info && info.mailingAddress === null) {
      const addressFields = ['street', 'city', 'state', 'zipCode', 'streetTwo'];
      if (legalDetails && legalDetails.legalAddress !== null) {
        addressFields.forEach((val) => {
          this.setProfileInfoField(val, legalDetails.legalAddress[val]);
        });
      }
    } else if (info && info.mailingAddress) {
      const mailingAddressFields = ['street', 'city', 'state', 'zipCode', 'streetTwo'];
      mailingAddressFields.forEach((val) => {
        if (info.mailingAddress[val] !== null) {
          this.setProfileInfoField(val, info.mailingAddress[val]);
        }
      });
    }
  }

  @computed
  get userVerficationStatus() {
    const { key, questions } = this.ID_VERIFICATION_FRM.response;
    const verificationDetails = identityHelper.getVerificationStatus(key, questions);
    return verificationDetails;
  }

  @computed
  get canUpdateProfilePhoto() {
    return this.ID_PROFILE_INFO.fields.profilePhoto.base64String !== '';
  }

  @action
  isSsnExist = ssn => new Promise((resolve) => {
    uiStore.setProgress();
    const result = graphql({
      client,
      query: isUniqueSSN,
      fetchPolicy: 'network-only',
      variables: { ssn },
      onFetch: (data) => {
        if (result && !result.loading) {
          resolve(data.isUniqueSSN.alreadyExists);
        }
      },
    });
  })

  @action
  checkValidAddress = () => new Promise((resolve) => {
    const {
      residentalStreet, state, city, zipCode, streetTwo,
    } = this.ID_VERIFICATION_FRM.fields;
    const payLoad = {
      street: residentalStreet.value,
      city: city.value,
      state: state.value,
      zipCode: zipCode.value,
      streetTwo: streetTwo.value,
    };
    this.setFieldValue('signUpLoading', true);
    const result = graphql({
      client,
      query: checkValidAddress,
      fetchPolicy: 'network-only',
      variables: payLoad,
      onFetch: (res) => {
        if (result && !result.loading) {
          if (res.checkValidInvestorAddress && res.checkValidInvestorAddress.valid === false) {
            this.setFieldValue('signUpLoading', false);
          }
          resolve(res.checkValidInvestorAddress);
        }
      },
      onError: (err) => {
        uiStore.setErrors(DataFormatter.getSimpleErr(err));
        this.setFieldValue('signUpLoading', false);
      },
    });
  })

  @action
  resetStoreData = () => {
    this.resetFormData('ID_VERIFICATION_FRM');
    this.ID_VERIFICATION_DOCS_FRM = FormValidator.prepareFormObject(IDENTITY_DOCUMENTS); 
    this.resetFormData('ID_PHONE_VERIFICATION');
    this.resetFormData('ID_VERIFICATION_QUESTIONS');
    this.confirmMigratedUserPhoneNumber = false;
    this.signUpLoading = false;
    this.isOptConfirmed = false;
  }

  @action
  setCipDetails = (isAdmin = false) => {
    const { legalDetails, phone } = isAdmin ? userDetailsStore.detailsOfUser.data.user : userDetailsStore.userDetails;
    const { fields } = this.ID_VERIFICATION_FRM;
    if (legalDetails && legalDetails.legalName) {
      fields.title.value = legalDetails.legalName.salutation;
      fields.firstLegalName.value = legalDetails.legalName.firstLegalName;
      fields.lastLegalName.value = legalDetails.legalName.lastLegalName;
    }
    if (legalDetails && legalDetails.legalAddress) {
      fields.city.value = legalDetails.legalAddress.city;
      const selectedState = find(US_STATES_FOR_INVESTOR, { key: legalDetails.legalAddress.state });
      if (selectedState) {
        fields.state.value = selectedState.value;
      }
      fields.residentalStreet.value = legalDetails.legalAddress.street;
      fields.zipCode.value = legalDetails.legalAddress.zipCode;
    }
    if (legalDetails && legalDetails.dateOfBirth) {
      fields.dateOfBirth.value = legalDetails.dateOfBirth;
    }
    if (legalDetails && legalDetails.ssn) {
      if (!legalDetails.ssn.includes('X') || window.sessionStorage.getItem('AccountCipExp')) {
        fields.ssn.value = legalDetails.ssn;
      }
    }
    if (legalDetails && phone && phone.number) {
      fields.phoneNumber.value = get(fields, 'phoneNumber.value') ? fields.phoneNumber.value : phone.number;
    }
  }

  requestOtpWrapper = (isMobile = false) => {
    uiStore.setProgress();
    const { email, givenName } = authStore.SIGNUP_FRM.fields;
    const emailInCookie = authStore.CONFIRM_FRM.fields.email.value;
    const firstNameInCookie = authStore.CONFIRM_FRM.fields.givenName.value;
    return new Promise((resolve, reject) => {
      publicClient
        .mutate({
          mutation: requestOtpWrapper,
          variables: {
            address: (email.value || emailInCookie).toLowerCase(),
            firstName: givenName.value || firstNameInCookie,
          },
        })
        .then((result) => {
          this.setRequestOtpResponse(result.data.requestOTPWrapper);
          if (!isMobile) {
            Helper.toast(`Verification code sent to ${email.value || emailInCookie}.`, 'success');
          }
          resolve();
        })
        .catch((err) => {
          uiStore.setErrors(DataFormatter.getSimpleErr(err));
          reject(err);
        })
        .finally(() => {
          uiStore.setProgress(false);
        });
    });
  }

  verifyOTPWrapper = () => {
    uiStore.setProgress();
    const { email, code, givenName } = FormValidator.ExtractValues(authStore.CONFIRM_FRM.fields);
    const verifyOTPData = {
      resourceId: this.requestOtpResponse,
      confirmationCode: code,
      address: email,
      firstName: givenName,
    };
    return new Promise((resolve, reject) => {
      publicClient
        .mutate({
          mutation: verifyOTPWrapper,
          variables: {
            verifyOTPData,
          },
        })
        .then((result) => {
          if (result.data.verifyOTPWrapper) {
            resolve();
          } else {
            const error = {
              message: 'Please enter correct verification code.',
            };
            uiStore.setErrors(error);
            uiStore.setProgress(false);
            reject();
          }
        })
        .catch((err) => {
          uiStore.setProgress(false);
          uiStore.setErrors(DataFormatter.getSimpleErr(err));
          reject(err);
        });
    });
  }

  @action
  confirmEmailAddress = () => {
    uiStore.setProgress();
    return new Promise((resolve, reject) => {
      client
        .mutate({
          mutation: verifyOtp,
          variables: {
            resourceId: this.requestOtpResponse,
            verificationCode: authStore.CONFIRM_FRM.fields.code.value,
          },
        })
        .then((result) => {
          if (result.data.verifyOtp) {
            resolve();
          } else {
            const error = {
              message: 'Please enter correct verification code.',
            };
            uiStore.setProgress(false);
            uiStore.setErrors(error);
            reject();
          }
        })
        .catch(action((err) => {
          uiStore.setErrors(DataFormatter.getJsonFormattedError(err));
          uiStore.setProgress(false);
          reject(err);
        }));
    });
  }

  @action
  validateForm = (form) => {
    FormValidator.validateForm(this[form], false, true);
  }
}

export default new IdentityStore();
