import graphql from 'mobx-apollo';
import { observable, action, computed } from 'mobx';
import { mapValues, keyBy, find, flatMap, map, omit } from 'lodash';
import Validator from 'validatorjs';
import { USER_IDENTITY, IDENTITY_DOCUMENTS, PHONE_VERIFICATION, UPDATE_PROFILE_INFO } from '../../../constants/user';
import { FormValidator, DataFormatter } from '../../../../helper';
import { uiStore, userStore, userDetailsStore } from '../../index';
import { isSsnExistQuery, verifyCIPUser, updateUserCIPInfo, startUserPhoneVerification, verifyCIPAnswers, checkUserPhoneVerificationCode, updateUserPhoneDetail, updateUserProfileData } from '../../queries/profile';
import { GqlClient as client } from '../../../../api/gqlApi';
import Helper from '../../../../helper/utility';
import validationService from '../../../../api/validation';
import { fileUpload } from '../../../actions';
import identityHelper from '../../../../modules/private/investor/accountSetup/containers/identityVerification/helper';
import apiService from '../../../../api/restApi';
import { US_STATES_FOR_INVESTOR } from '../../../../constants/account';

export class IdentityStore {
  @observable ID_VERIFICATION_FRM = FormValidator.prepareFormObject(USER_IDENTITY);
  @observable ID_VERIFICATION_DOCS_FRM = FormValidator.prepareFormObject(IDENTITY_DOCUMENTS);
  @observable ID_VERIFICATION_QUESTIONS = FormValidator.prepareFormObject([]);
  @observable ID_PHONE_VERIFICATION = FormValidator.prepareFormObject(PHONE_VERIFICATION);
  @observable ID_PROFILE_INFO = FormValidator.prepareFormObject(UPDATE_PROFILE_INFO);
  @observable submitVerificationsDocs = false;
  @observable reSendVerificationCode = false;
  @observable userCipStatus = 'FAIL';
  @observable confirmMigratedUserPhoneNumber = false;

  @action
  setConfirmMigratedUserPhoneNumber = (status) => {
    this.confirmMigratedUserPhoneNumber = status;
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
    this.ID_VERIFICATION_FRM.response = response;
  }

  @action
  phoneVerificationChange = (e) => {
    this.ID_PHONE_VERIFICATION = FormValidator.onChange(
      this.ID_PHONE_VERIFICATION,
      { name: 'code', value: e },
    );
  };

  @action
  resetFormData(form) {
    const resettedForm = FormValidator.resetFormData(this[form]);
    this[form] = resettedForm;
  }

  @computed
  get formattedUserInfoForCip() {
    const { fields } = this.ID_VERIFICATION_FRM;
    const selectedState = find(US_STATES_FOR_INVESTOR, { value: fields.state.value });
    const { phone } = userDetailsStore.userDetails;
    const userInfo = {
      legalName: {
        firstLegalName: fields.firstLegalName.value,
        lastLegalName: fields.lastLegalName.value,
      },
      status: this.userCipStatus,
      dateOfBirth: fields.dateOfBirth.value,
      ssn: fields.ssn.value,
      legalAddress: {
        street: fields.residentalStreet.value,
        city: fields.city.value,
        state: selectedState ? selectedState.key : null,
        zipCode: fields.zipCode.value,
      },
    };
    const { photoId, proofOfResidence } = this.ID_VERIFICATION_DOCS_FRM.fields;
    const verificationDocs = {
      idProof: {
        fileId: photoId.fileId,
        fileName: photoId.value,
      },
      addressProof: {
        fileId: proofOfResidence.fileId,
        fileName: proofOfResidence.value,
      },
    };
    userInfo.verificationDocs = this.userCipStatus === 'MANUAL_VERIFICATION_PENDING' ? verificationDocs : null;
    const number = fields.phoneNumber.value ? fields.phoneNumber.value : phone !== null ? phone.number : '';
    const phoneDetails = { number };
    return { userInfo, phoneDetails };
  }

  @computed
  get formattedUserInfo() {
    const { fields, response } = this.ID_VERIFICATION_FRM;
    const cip = {};
    if (response.key === 'id.error') {
      cip.expiration = Helper.getDaysfromNow(21);
      cip.requestId = 'ERROR_NO_REQUEST_ID';
    } else if (response.message === 'PASS' || (response.summary && response.summary === 'pass')) {
      cip.expiration = Helper.getDaysfromNow(21);
      cip.requestId = response.passId;
    } else if (response.message === 'FAIL' && response.questions) {
      cip.expiration = Helper.getDaysfromNow(21);
      cip.requestId = response.softFailId;
      cip.failType = 'FAIL_WITH_QUESTIONS';
      // omitDeep, cleanDeep
      cip.failReason = [omit(response.qualifiers && response.qualifiers[0], ['__typename'])];
    } else {
      cip.expiration = Helper.getDaysfromNow(21);
      cip.requestId = response.hardFailId;
      cip.failType = 'FAIL_WITH_UPLOADS';
      if (response.qualifiers !== null) {
        cip.failReason = [omit(response.qualifiers && response.qualifiers[0], ['__typename'])];
      }
    }
    const selectedState = find(US_STATES_FOR_INVESTOR, { value: fields.state.value });
    const { phone } = userDetailsStore.userDetails;
    const userInfo = {
      legalName: {
        firstLegalName: fields.firstLegalName.value,
        lastLegalName: fields.lastLegalName.value,
      },
      status: this.userCipStatus,
      dateOfBirth: fields.dateOfBirth.value,
      ssn: fields.ssn.value,
      legalAddress: {
        street: fields.residentalStreet.value,
        city: fields.city.value,
        state: selectedState ? selectedState.key : null,
        zipCode: fields.zipCode.value,
      },
    };
    const { photoId, proofOfResidence } = this.ID_VERIFICATION_DOCS_FRM.fields;
    const verificationDocs = {
      idProof: {
        fileId: photoId.fileId,
        fileName: photoId.value,
      },
      addressProof: {
        fileId: proofOfResidence.fileId,
        fileName: proofOfResidence.value,
      },
    };
    userInfo.verificationDocs = this.userCipStatus === 'MANUAL_VERIFICATION_PENDING' ? verificationDocs : null;
    const number = fields.phoneNumber.value ? fields.phoneNumber.value : phone !== null ? phone.number : '';
    const phoneDetails = { number };
    return { userInfo, phoneDetails, cip };
  }

  @action
  setStateValue = (stateValue) => {
    this.ID_PROFILE_INFO.fields.state.value = stateValue;
  }

  @computed
  get cipStatus() {
    const { key, questions } = this.ID_VERIFICATION_FRM.response;
    const cipStatus = identityHelper.getCipStatus(key, questions);
    this.setCipStatus(cipStatus);
    return cipStatus;
  }
  @action
  verifyUserIdentity = () => {
    uiStore.setProgress();
    return new Promise((resolve, reject) => {
      client
        .mutate({
          mutation: verifyCIPUser,
          variables: {
            userId: userStore.currentUser.sub,
            user: this.formattedUserInfoForCip.userInfo,
          },
        })
        .then((data) => {
          this.setVerifyIdentityResponse(data.data.verifyCIPIdentity);
          this.updateUserInfo();
          resolve();
        })
        .catch((err) => {
          if (err.response) {
            uiStore.setErrors(DataFormatter.getSimpleErr(err));
            reject(err);
          } else {
            // uiStore.setErrors(JSON.stringify('Something went wrong'));
            this.setCipStatus('FAIL');
            this.updateUserInfo();
            resolve();
            // reject(err);
          }
        })
        .finally(() => {
          uiStore.setProgress(false);
        });
    });
  }

  @action
  setIdentityQuestions = () => {
    const { response } = this.ID_VERIFICATION_FRM;
    const questionsArray = identityHelper.setIdentityQuestions(response);
    this.ID_VERIFICATION_QUESTIONS.fields = questionsArray;
  }

  @action
  setFileUploadData = (field, files) => {
    uiStore.setProgress();
    const file = files[0];
    const fileData = Helper.getFormattedFileData(file);
    fileUpload.setFileUploadData('', fileData, 'PROFILE_CIP', 'INVESTOR').then(action((result) => {
      const { fileId, preSignedUrl } = result.data.createUploadEntry;
      this.ID_VERIFICATION_DOCS_FRM.fields[field].fileId = fileId;
      this.ID_VERIFICATION_DOCS_FRM.fields[field].preSignedUrl = preSignedUrl;
      this.ID_VERIFICATION_DOCS_FRM.fields[field].fileData = file;
      this.ID_VERIFICATION_DOCS_FRM = FormValidator.onChange(
        this.ID_VERIFICATION_DOCS_FRM,
        { name: field, value: fileData.fileName },
      );
      fileUpload.putUploadedFileOnS3({ preSignedUrl, fileData: file })
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
    return new Promise((resolve, reject) => {
      this.updateUserInfo()
        .then(() => {
          resolve();
        })
        .catch(() => {
          reject();
        })
        .finally(() => {
          uiStore.setProgress(false);
        });
    });
  }

  startPhoneVerification = () => {
    uiStore.clearErrors();
    uiStore.setProgress();
    return new Promise((resolve, reject) => {
      client
        .mutate({
          mutation: startUserPhoneVerification,
          variables: {
            phoneDetails: this.formattedUserInfoForCip.phoneDetails,
            method: 'sms',
          },
        })
        .then(() => {
          Helper.toast('Verification code sent to user.', 'success');
          resolve();
        })
        .catch((err) => {
          uiStore.setErrors(DataFormatter.getJsonFormattedError(err));
          reject(err);
        })
        .finally(() => {
          uiStore.setProgress(false);
        });
    });
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
          if (result.data.verifyCIPAnswers.__typename === 'UserCIPPass') {
            this.setCipStatus('PASS');
            this.updateUserInfo();
          }
          resolve(result);
        })
        .catch((err) => {
          uiStore.setErrors(DataFormatter.getSimpleErr(err));
          reject();
        })
        .finally(() => {
          uiStore.setProgress(false);
        });
    });
  }

  @computed
  get formattedIdentityQuestionsAnswers() {
    const formattedIdentityQuestionsAnswers =
      flatMap(this.ID_VERIFICATION_QUESTIONS.fields, n => [{ type: n.key, text: n.value }]);
    return formattedIdentityQuestionsAnswers;
  }

  verifyAndUpdatePhoneNumber = () => {
    uiStore.setProgress();
    return new Promise((resolve, reject) => {
      client
        .mutate({
          mutation: checkUserPhoneVerificationCode,
          variables: {
            phoneDetails: this.formattedUserInfoForCip.phoneDetails,
            verificationCode: this.ID_PHONE_VERIFICATION.fields.code.value,
          },
        })
        .then(() => {
          this.updateUserPhoneDetails();
          resolve();
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
          mutation: checkUserPhoneVerificationCode,
          variables: {
            phoneDetails: this.formattedUserInfoForCip.phoneDetails,
            verificationCode: this.ID_PHONE_VERIFICATION.fields.code.value,
          },
        })
        .then(() => {
          this.updateUserPhoneDetails();
          resolve();
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

  updateUserInfo = () => new Promise((resolve, reject) => {
    client
      .mutate({
        mutation: updateUserCIPInfo,
        variables: {
          user: this.formattedUserInfo.userInfo,
          phoneDetails: this.formattedUserInfo.phoneDetails,
          cip: this.formattedUserInfo.cip,
        },
      })
      .then((data) => {
        userDetailsStore.getUser(userStore.currentUser.sub);
        resolve(data);
      })
      .catch((err) => {
        uiStore.setErrors(DataFormatter.getSimpleErr(err));
        reject(err);
      });
  });

  updateUserPhoneDetails = () => {
    client
      .mutate({
        mutation: updateUserPhoneDetail,
        variables: {
          phoneDetails: {
            number: this.ID_VERIFICATION_FRM.fields.phoneNumber.value,
          },
        },
      })
      .then(() => { })
      .catch(() => { });
  }

  uploadProfilePhoto = () => {
    uiStore.setProgress();
    return new Promise((resolve, reject) => {
      const profileData = this.ID_PROFILE_INFO.fields.profilePhoto.base64String;
      const b64Text = profileData.split(',')[1];
      const payload = {
        userId: userStore.currentUser.sub,
        base64String: b64Text,
      };
      apiService.post('/upload/file', payload)
        .then(action((response) => {
          if (!response.body.errorMessage) {
            this.setProfilePhoto('responseUrl', response.body.fileFullPath);
            this.updateUserProfileData().then(() => {
              userDetailsStore.setProfilePhoto(response.body.fileFullPath, response.body.name);
              Helper.toast('Profile photo updated successfully', 'success');
              this.resetProfilePhoto();
              resolve(response);
            })
              .catch((err) => {
                uiStore.setErrors(DataFormatter.getSimpleErr(err));
                reject(err);
              });
          } else {
            this.setProfilePhoto('error', 'Something went wrong.');
            this.setProfilePhoto('value', '');
          }
        }))
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

  @computed
  get profileDetails() {
    const { fields } = this.ID_PROFILE_INFO;
    const profileDetails = {
      salutation: fields.firstName.value,
      firstName: fields.firstName.value,
      lastName: fields.lastName.value,
      mailingAddress: {
        street: fields.street.value,
        city: fields.city.value,
        state: fields.state.value,
        zipCode: fields.zipCode.value,
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
    const attributes = ['src', 'error', 'value', 'base64String'];
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
      const addressFields = ['street', 'city', 'state', 'zipCode'];
      if (legalDetails && legalDetails.legalAddress !== null) {
        addressFields.forEach((val) => {
          this.setProfileInfoField(val, legalDetails.legalAddress[val]);
        });
      }
    } else if (info && info.mailingAddress) {
      const mailingAddressFields = ['street', 'city', 'state', 'zipCode'];
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
    return this.ID_PROFILE_INFO.fields.profilePhoto.fileName !== '';
  }

  @action
  isSsnExist = ssn => new Promise((resolve) => {
    uiStore.setProgress();
    graphql({
      client,
      query: isSsnExistQuery,
      fetchPolicy: 'network-only',
      variables: { ssn },
      onFetch: (data) => {
        resolve(data.checkUserSSNCollision.alreadyExists);
      },
    });
  })

  @action
  resetStoreData = () => {
    this.resetFormData('ID_VERIFICATION_FRM');
    this.resetFormData('ID_VERIFICATION_DOCS_FRM');
    this.resetFormData('ID_PHONE_VERIFICATION');
    this.resetFormData('ID_VERIFICATION_QUESTIONS');
  }

  @action
  setCipDetails = () => {
    const { legalDetails, phone } = userDetailsStore.userDetails;
    const { fields } = this.ID_VERIFICATION_FRM;
    if (userDetailsStore.isCipExpired) {
      if (legalDetails && legalDetails.legalName) {
        fields.firstLegalName.value = legalDetails.legalName.firstLegalName;
        fields.lastLegalName.value = legalDetails.legalName.lastLegalName;
      }
      if (legalDetails && legalDetails.legalAddress) {
        fields.city.value = legalDetails.legalAddress.city;
        const selectedState =
        find(US_STATES_FOR_INVESTOR, { key: legalDetails.legalAddress.state });
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
        fields.ssn.value = legalDetails.ssn;
      }
      if (legalDetails && phone && phone.number) {
        fields.phoneNumber.value = phone.number;
      }
    }
  }
}

export default new IdentityStore();
