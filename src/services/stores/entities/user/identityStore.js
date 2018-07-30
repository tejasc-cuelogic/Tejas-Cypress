import { observable, action, computed } from 'mobx';
import { mapValues, keyBy, find, flatMap, map } from 'lodash';
import Validator from 'validatorjs';
import { USER_IDENTITY, IDENTITY_DOCUMENTS, PHONE_VERIFICATION, UPDATE_PROFILE_INFO, COUNTRY_CODES } from '../../../constants/user';
import { FormValidator, DataFormatter } from '../../../../helper';
import { uiStore, userStore, userDetailsStore } from '../../index';
import { verifyCIPUser, updateUserCIPInfo, startUserPhoneVerification, verifyCIPAnswers, checkUserPhoneVerificationCode, updateUserPhoneDetail, updateUserProfileData } from '../../queries/profile';
import { GqlClient as client } from '../../../../api/gqlApi';
import Helper from '../../../../helper/utility';
import validationService from '../../../../api/validation';
import { fileUpload } from '../../../actions';
import identityHelper from '../../../../modules/private/investor/accountSetup/containers/identityVerification/helper';
import apiService from '../../../../api/restApi';

export class IdentityStore {
  @observable ID_VERIFICATION_FRM = FormValidator.prepareFormObject(USER_IDENTITY);
  @observable ID_VERIFICATION_DOCS_FRM = FormValidator.prepareFormObject(IDENTITY_DOCUMENTS);
  @observable ID_VERIFICATION_QUESTIONS = FormValidator.prepareFormObject([]);
  @observable ID_PHONE_VERIFICATION = FormValidator.prepareFormObject(PHONE_VERIFICATION);
  @observable ID_PROFILE_INFO = FormValidator.prepareFormObject(UPDATE_PROFILE_INFO);
  @observable submitVerificationsDocs = false;
  @observable reSendVerificationCode = false;

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
  get formattedUserInfo() {
    const { fields } = this.ID_VERIFICATION_FRM;
    const { phone } = userDetailsStore.userDetails.contactDetails;
    const userInfo = {
      firstLegalName: fields.firstLegalName.value,
      lastLegalName: fields.lastLegalName.value,
      dateOfBirth: fields.dateOfBirth.value,
      ssn: fields.ssn.value,
      legalAddress: {
        street: fields.residentalStreet.value,
        city: fields.city.value,
        state: fields.state.value,
        zipCode: fields.zipCode.value,
      },
    };
    const number = fields.phoneNumber.value ? fields.phoneNumber.value : phone.number;
    const phoneDetails = { number, countryCode: COUNTRY_CODES.US };
    return { userInfo, phoneDetails };
  }

  @computed
  get cipStatus() {
    const { key, questions } = this.ID_VERIFICATION_FRM.response;
    const cipStatus = identityHelper.getCipStatus(key, questions);
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
            user: this.formattedUserInfo.userInfo,
          },
        })
        .then((data) => {
          this.setVerifyIdentityResponse(data.data.verifyCIPIdentity);
          const cipStatus = { status: this.cipStatus };
          this.updateUserInfo(cipStatus);
          resolve();
        })
        .catch((err) => {
          if (err.response) {
            uiStore.setErrors(DataFormatter.getSimpleErr(err));
            reject(err);
          } else {
            // uiStore.setErrors(JSON.stringify('Something went wrong'));
            const status = { status: 'FAIL' };
            this.updateUserInfo(status);
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
        .then(() => {})
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
    const { photoId, proofOfResidence } = this.ID_VERIFICATION_DOCS_FRM.fields;
    const cipStatus = {
      status: 'MANUAL_VERIFICATION_PENDING',
      verificationDocs:
      {
        idProof: {
          fileId: photoId.fileId,
          fileName: photoId.value,
        },
        addressProof: {
          fileId: proofOfResidence.fileId,
          fileName: proofOfResidence.value,
        },
      },
    };
    return new Promise((resolve, reject) => {
      this.updateUserInfo(cipStatus)
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
            phoneDetails: this.formattedUserInfo.phoneDetails,
            method: 'sms',
          },
        })
        .then(() => {
          Helper.toast('Verification code sent to user.', 'success');
          resolve();
        })
        .catch((err) => {
          uiStore.setErrors(JSON.stringify(err.message));
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
            userId: userStore.currentUser.sub,
            cipAnswers: {
              id: this.ID_VERIFICATION_FRM.response.softFailId,
              answers: this.formattedIdentityQuestionsAnswers,
            },
          },
        })
        .then((result) => {
          /* eslint-disable no-underscore-dangle */
          if (result.data.verifyCIPAnswers.__typename === 'UserCIPPass') {
            const cipStatus = { status: 'PASS' };
            this.updateUserInfo(cipStatus);
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
            phoneDetails: this.formattedUserInfo.phoneDetails,
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
            phoneDetails: this.formattedUserInfo.phoneDetails,
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

  updateUserInfo = (cipStatus) => {
    const userId = userStore.currentUser.sub;
    return new Promise((resolve, reject) => {
      client
        .mutate({
          mutation: updateUserCIPInfo,
          variables: {
            userId,
            user: this.formattedUserInfo.userInfo,
            phoneDetails: this.formattedUserInfo.phoneDetails,
            cipStatus,
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
  }

  updateUserPhoneDetails = () => {
    client
      .mutate({
        mutation: updateUserPhoneDetail,
        variables: {
          userId: userStore.currentUser.sub,
          phoneDetails: {
            number: this.ID_VERIFICATION_FRM.fields.phoneNumber.value,
            countryCode: COUNTRY_CODES.US,
          },
        },
      })
      .then(() => { })
      .catch(() => { });
  }

  uploadProfilePhoto = (history, refLink) => {
    uiStore.setProgress();
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
            userDetailsStore.setProfilePhoto(response.body.fileFullPath);
            Helper.toast('Profile photo updated successfully', 'success');
            this.resetProfilePhoto();
            history.push(refLink);
          })
            .catch((err) => {
              uiStore.setErrors(DataFormatter.getSimpleErr(err));
            });
        } else {
          this.setProfilePhoto('error', 'Something went wrong.');
          this.setProfilePhoto('value', '');
        }
      }))
      .finally(action(() => { uiStore.setProgress(false); }));
  }

  updateUserProfileData = () => {
    uiStore.setProgress();
    return new Promise((resolve, reject) => {
      client
        .mutate({
          mutation: updateUserProfileData,
          variables: {
            userId: userStore.currentUser.sub,
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
      firstName: fields.firstName.value,
      lastName: fields.lastName.value,
      address: {
        mailing: {
          street: fields.street.value,
          city: fields.city.value,
          state: fields.state.value,
          zipCode: fields.zipCode.value,
        },
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
    map(this.ID_VERIFICATION_FRM.fields, (value) => {
      const { key } = value;
      const { errors } = validationService.validate(value);
      // store errors to store if any or else 'undefied' will get set to it
      FormValidator.setFormError(this.ID_VERIFICATION_FRM, key, errors && errors[key][0]);
    });
  }

  @action
  setProfileInfo = (userDetails) => {
    this.resetFormData('ID_PROFILE_INFO');
    const {
      email,
      address,
      legalDetails,
      contactDetails,
    } = userDetails;
    if (userDetails.firstName) {
      this.setProfileInfoField('firstName', userDetails.firstName);
    }
    if (userDetails.lastName) {
      this.setProfileInfoField('lastName', userDetails.lastName);
    } else if (legalDetails && legalDetails.legalName !== null) {
      this.setProfileInfoField('firstName', legalDetails.legalName.firstLegalName);
      this.setProfileInfoField('firstName', legalDetails.legalName.lastLegalName);
    }
    this.setProfileInfoField('email', email);
    if (contactDetails && contactDetails.phone !== null &&
      contactDetails.phone.verificationDate !== null
    ) {
      this.setProfileInfoField('phoneNumber', contactDetails.phone.number);
    }
    if (address === null) {
      const addressFields = ['street', 'city', 'state', 'zipCode'];
      if (legalDetails && legalDetails.legalAddress !== null) {
        addressFields.forEach((val) => {
          this.setProfileInfoField(val, legalDetails.legalAddress[val]);
        });
      }
    } else if (address && address.mailing) {
      const mailingAddressFields = ['street', 'city', 'state', 'zipCode'];
      mailingAddressFields.forEach((val) => {
        if (address.mailing[val] !== null) {
          this.setProfileInfoField(val, address.mailing[val]);
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
    return this.ID_PROFILE_INFO.fields.profilePhoto.value !== '';
  }
}

export default new IdentityStore();
