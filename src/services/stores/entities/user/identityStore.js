import { observable, action, computed } from 'mobx';
import { mapValues, keyBy, find, flatMap } from 'lodash';
import Validator from 'validatorjs';
import { USER_IDENTITY, IDENTITY_DOCUMENTS, PHONE_VERIFICATION, UPDATE_PROFILE_INFO } from '../../../constants/user';
import { FormValidator, DataFormatter } from '../../../../helper';
import { uiStore, userStore, userDetailsStore } from '../../index';
import { verifyCIPUser, updateUserCIPInfo, startUserPhoneVerification, verifyCIPAnswers, checkUserPhoneVerificationCode, updateUserPhoneDetail, updateUserProfileData } from '../../queries/profile';
import { GqlClient as client } from '../../../../api/gqlApi';
import Helper from '../../../../helper/utility';
import { accountActions } from '../../../actions';
import { COUNTRY_CODES } from '../../../../constants/profile';
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
  dobChange = (date) => {
    this.ID_VERIFICATION_FRM = FormValidator.onChange(
      this.ID_VERIFICATION_FRM,
      { name: 'dateOfBirth', value: date },
    );
  };

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
  phoneVerificationChange = (e, result) => {
    this.ID_PHONE_VERIFICATION = FormValidator.onChange(
      this.ID_PHONE_VERIFICATION,
      FormValidator.pullValues(e, result),
    );
  };

  @action
  resetFormData(form) {
    const resettedForm = FormValidator.resetFormData(this[form]);
    this[form] = resettedForm;
  }

  @computed
  get formattedUserInfo() {
    const userInfo = {
      firstLegalName: this.ID_VERIFICATION_FRM.fields.firstLegalName.value,
      lastLegalName: this.ID_VERIFICATION_FRM.fields.lastLegalName.value,
      dateOfBirth: this.ID_VERIFICATION_FRM.fields.dateOfBirth.value,
      ssn: Helper.unMaskInput(this.ID_VERIFICATION_FRM.fields.ssn.value),
      legalAddress: {
        street: this.ID_VERIFICATION_FRM.fields.residentalStreet.value,
        city: this.ID_VERIFICATION_FRM.fields.city.value,
        state: this.ID_VERIFICATION_FRM.fields.state.value,
        zipCode: this.ID_VERIFICATION_FRM.fields.zipCode.value,
      },
    };

    const number = this.ID_VERIFICATION_FRM.fields.phoneNumber.value ?
      this.ID_VERIFICATION_FRM.fields.phoneNumber.value :
      userDetailsStore.userDetails.contactDetails.phone.number;
    const phoneDetails = {
      number: Helper.unMaskInput(number),
      countryCode: COUNTRY_CODES.US,
    };

    const userData = {
      userInfo,
      phoneDetails,
    };

    return userData;
  }

  @computed
  get cipStatus() {
    const { key, questions } = this.ID_VERIFICATION_FRM.response;
    const cipStatus = identityHelper.getCipStatus(key, questions);
    return cipStatus;
  }

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
            uiStore.setErrors(JSON.stringify('Something went wrong'));
            reject(err);
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
  setFileUploadData(field, files) {
    accountActions.setFileUploadData(this.ID_VERIFICATION_DOCS_FRM, field, files, 'PROFILE_CIP');
  }

  @action
  removeUploadedData(field) {
    accountActions.removeUploadedData(this.ID_VERIFICATION_DOCS_FRM, field, 'PROFILE_CIP').then(() => {
      this.ID_VERIFICATION_DOCS_FRM = FormValidator.onChange(
        this.ID_VERIFICATION_DOCS_FRM,
        { name: field, value: '' },
      );
      this.ID_VERIFICATION_DOCS_FRM.fields[field].fileId = '';
      this.ID_VERIFICATION_DOCS_FRM.fields[field].preSignedUrl = '';
    })
      .catch(() => { });
  }

  uploadAndUpdateCIPInfo = () => {
    uiStore.setProgress();
    const { photoId, proofOfResidence } = this.ID_VERIFICATION_DOCS_FRM.fields;
    return new Promise((resolve, reject) => {
      Helper.putUploadedFile([photoId, proofOfResidence])
        .then(() => {
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
          this.updateUserInfo(cipStatus);
          resolve();
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
            number: Helper.unMaskInput(this.ID_VERIFICATION_FRM.fields.phoneNumber.value),
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
    const profileDetails = {
      firstName: this.ID_PROFILE_INFO.fields.firstName.value,
      lastName: this.ID_PROFILE_INFO.fields.lastName.value,
      address: {
        mailing: {
          street: this.ID_PROFILE_INFO.fields.street.value,
          city: this.ID_PROFILE_INFO.fields.city.value,
          state: this.ID_PROFILE_INFO.fields.state.value,
          zipCode: this.ID_PROFILE_INFO.fields.zipCode.value,
        },
      },
      avatar: {
        name: this.ID_PROFILE_INFO.fields.profilePhoto.value,
        url: this.ID_PROFILE_INFO.fields.profilePhoto.responseUrl,
      },
    };
    return profileDetails;
  }

  @action
  resetProfilePhoto = () => {
    this.ID_PROFILE_INFO.fields.profilePhoto.src = '';
    this.ID_PROFILE_INFO.fields.profilePhoto.error = '';
    this.ID_PROFILE_INFO.fields.profilePhoto.value = '';
    this.ID_PROFILE_INFO.fields.profilePhoto.base64String = '';
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
    if (contactDetails && contactDetails.phone !== null) {
      this.setProfileInfoField('phoneNumber', contactDetails.phone.number);
    }
    if (address === null) {
      if (legalDetails && legalDetails.legalAddress !== null) {
        this.setProfileInfoField('street', legalDetails.legalAddress.street);
        this.setProfileInfoField('city', legalDetails.legalAddress.city);
        this.setProfileInfoField('state', legalDetails.legalAddress.state);
        this.setProfileInfoField('zipCode', legalDetails.legalAddress.zipCode);
      }
    } else if (address && address.mailing) {
      if (address.mailing.street !== null) {
        this.setProfileInfoField('street', address.mailing.street);
      }
      if (address.mailing.city !== null) {
        this.setProfileInfoField('city', address.mailing.city);
      }
      if (address.mailing.state !== null) {
        this.setProfileInfoField('state', address.mailing.state);
      }
      if (address.mailing.zipCode !== null) {
        this.setProfileInfoField('zipCode', address.mailing.zipCode);
      }
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
