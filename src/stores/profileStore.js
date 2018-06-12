import { observable, action, computed } from 'mobx';
import Validator from 'validatorjs';
import mapValues from 'lodash/mapValues';
import _ from 'lodash';
import { GqlClient as client } from '../services/graphql';
import { updateUserProfileData, requestEmailChnage, verifyAndUpdateEmail, updateUserPhoneDetail, verifyCIPUser, verifyCIPAnswers, checkUserPhoneVerificationCode, startUserPhoneVerification, updateUserCIPInfo } from '../stores/queries/profile';
import { createUploadEntry, removeUploadedFile } from '../stores/queries/common';

import api from '../ns-api';
import authStore from './authStore';
import uiStore from './uiStore';
import userStore from './userStore';
import userDetailsStore from './user/userDetailsStore';
import Helper from '../helper/utility';

import {
  UPDATE_PROFILE_INFO,
  VERIFY_IDENTITY_STEP_01,
  VERIFY_IDENTITY_STEP_04,
  CONFIRM_IDENTITY_DOCUMENTS,
} from '../constants/profile';

export class ProfileStore {
  @observable profile = undefined;

  @observable verifyIdentity01 = { fields: { ...VERIFY_IDENTITY_STEP_01 }, meta: { isValid: false, error: '' }, response: {} };

  @observable verifyIdentity02 = { fields: [], meta: { isValid: false, error: '' } };

  @observable verifyIdentity04 = { fields: { ...VERIFY_IDENTITY_STEP_04 }, meta: { isValid: false, error: '' } };

  @observable confirmIdentityDocuments = { fields: { ...CONFIRM_IDENTITY_DOCUMENTS }, meta: { isValid: false, error: '' } };
  @observable investmentLimits = {
    annualIncome: {
      value: '',
      label: 'Annual Income',
      error: undefined,
      rule: 'required',
      tooltip: 'Mention your Annual Income here',
    },
    netWorth: {
      value: '',
      label: 'Net Worth',
      error: undefined,
      rule: 'required',
      tooltip: 'Mention your Net Worth here',
    },
    otherRegulation: {
      value: '',
      label: 'Other Regulation Crowdfunding investments made in prior 12 months',
      error: undefined,
      rule: 'required',
      tooltip: 'Other Regulation Crowdfunding investments made in prior 12 months',
    },
  };

  @observable updateProfileInfo = { fields: { ...UPDATE_PROFILE_INFO }, meta: { isValid: false, error: '' } };

  @observable
  reSendVerificationCode = false;

  @action
  setReSendVerificationCode(status) {
    this.reSendVerificationCode = status;
  }

  @action loadProfile(username) {
    uiStore.setProgress(true);
    api.User.get(username)
      .then(action((profile) => { this.profile = profile; }))
      .finally(action(() => { uiStore.setProgress(false); }));
  }

  /**
   * @desc Handle functions for Verify Identity Form 1 fields.
   */
  @action
  verifyIdentityEleChange = (e, result) => {
    const fieldName = typeof result === 'undefined' ? e.target.name : result.name;
    const fieldValue = typeof result === 'undefined' ? e.target.value : result.value;
    this.onFieldChange('verifyIdentity01', fieldName, fieldValue);
  };

  @action
  verifyIdentityDateChange = (date) => {
    this.onFieldChange('verifyIdentity01', 'dateOfBirth', date);
  };

  @action
  setVerifyIdentityResponse = (response) => {
    this.verifyIdentity01.response = response;
  }

  @action
  reset() {
    Object.keys(this.verifyIdentity01.fields).map((field) => {
      this.verifyIdentity01.fields[field].value = '';
      this.verifyIdentity01.fields[field].error = undefined;
      return true;
    });
    this.verifyIdentity01.meta.isValid = false;
    this.verifyIdentity01.meta.error = '';
    if (this.verifyIdentity01.response.key !== 'id.success') {
      this.verifyIdentity01.response = {};
    }
  }

  @action
  resetVerificationCode() {
    Object.keys(this.verifyIdentity04.fields).map((field) => {
      this.verifyIdentity04.fields[field].value = '';
      this.verifyIdentity04.fields[field].error = undefined;
      return true;
    });
    this.verifyIdentity04.meta.isValid = false;
    this.verifyIdentity04.meta.error = '';
    this.verifyIdentity04.response = {};
  }

  @action
  resetUpdateProfileDetails() {
    Object.keys(this.updateProfileInfo.fields).map((field) => {
      this.updateProfileInfo.fields[field].value = '';
      this.updateProfileInfo.fields[field].error = undefined;
      return true;
    });
    this.updateProfileInfo.meta.isValid = false;
    this.updateProfileInfo.meta.error = '';
    this.updateProfileInfo.response = {};
  }

  @computed
  get formattedUserInfo() {
    const userInfo = {
      firstLegalName: this.verifyIdentity01.fields.firstLegalName.value,
      lastLegalName: this.verifyIdentity01.fields.lastLegalName.value,
      dateOfBirth: this.verifyIdentity01.fields.dateOfBirth.value,
      ssn: Helper.unMaskInput(this.verifyIdentity01.fields.ssn.value),
      legalAddress: {
        street: this.verifyIdentity01.fields.residentalStreet.value,
        city: this.verifyIdentity01.fields.city.value,
        state: this.verifyIdentity01.fields.state.value,
        zipCode: this.verifyIdentity01.fields.zipCode.value,
      },
    };
    return userInfo;
  }

  @computed
  get formattedPhoneDetails() {
    const phoneDetails = {
      number: Helper.unMaskInput(this.verifyIdentity01.fields.phoneNumber.value),
      countryCode: '1',
    };
    return phoneDetails;
  }

  /**
   * @desc Functions for Verify Identity Form 2.
   */
  @action
  setIdentityQuestions = () => {
    const { questions } = this.verifyIdentity01.response;
    const questionsArray = [];
    let optionsArray = [];
    _.forEach(questions, (question) => {
      const questionObj = { rule: 'required', error: undefined };
      optionsArray = [];
      _.forEach(question.choices, (choice) => {
        optionsArray.push({ key: choice.text, value: choice.text, text: choice.text });
      });
      questionObj.label = question.prompt;
      questionObj.key = question.type;
      questionObj.options = optionsArray;
      questionObj.value = '';
      questionsArray.push(questionObj);
    });
    this.verifyIdentity02.fields = questionsArray;
  }

  @action
  identityQuestionAnswerChange = (e, { name, value }) => {
    const changedAnswer = _.find(this.verifyIdentity02.fields, { key: name });
    changedAnswer.value = value;

    const validation = new Validator(
      mapValues(_.keyBy(this.verifyIdentity02.fields, 'key'), f => f.value),
      mapValues(_.keyBy(this.verifyIdentity02.fields, 'key'), f => f.rule),
    );
    this.verifyIdentity02.meta.isValid = validation.passes();
    changedAnswer.error = validation.errors.first(changedAnswer.key);
  }

  @computed
  get formattedIdentityQuestionsAnswers() {
    const formattedIdentityQuestionsAnswers =
    _.flatMap(this.verifyIdentity02.fields, n => [{ type: n.key, text: n.value }]);
    return formattedIdentityQuestionsAnswers;
  }

  /**
   * @desc Handle function for Verify Identity Form 4 field.
   */
  @action
  verifyVerificationCodeChange = (e, { name, value }) => {
    this.onFieldChange('verifyIdentity04', name, value);
  };

  /**
   * @desc Generic function for on change of each form field.
   */
  @action
  onFieldChange = (currentForm, field, value) => {
    const form = currentForm || 'formFinInfo';
    this[form].fields[field].value = value;
    const validation = new Validator(
      mapValues(this[form].fields, f => f.value),
      mapValues(this[form].fields, f => f.rule),
    );
    if (currentForm !== 'updateProfileInfo') {
      this[form].meta.isValid = validation.passes();
    } else if (field !== 'phoneNumber' && field !== 'email') {
      this[form].meta.isValid = validation.passes();
    }
    this[form].fields[field].error = validation.errors.first(field);
  };

  getCipStatus = (cipIdentityResponse) => {
    const { key, questions } = cipIdentityResponse;
    if (key === 'id.error') {
      return 'FAIL';
    } else if (key === 'id.failure' && questions) {
      return 'SOFT_FAIL';
    } else if (key === 'id.success') {
      return 'PASS';
    }
    return 'HARD_FAIL';
  }

  /* eslint-disable arrow-body-style */
  submitInvestorPersonalDetails = () => {
    uiStore.setProgress();
    return new Promise((resolve, reject) => {
      client
        .mutate({
          mutation: verifyCIPUser,
          variables: {
            userId: userStore.currentUser.sub,
            user: this.formattedUserInfo,
          },
        })
        .then((data) => {
          this.setVerifyIdentityResponse(data.data.verifyCIPIdentity);
          const cipStatus = this.getCipStatus(data.data.verifyCIPIdentity);
          client
            .mutate({
              mutation: updateUserCIPInfo,
              variables: {
                userId: userStore.currentUser.sub,
                user: this.formattedUserInfo,
                phoneDetails: this.formattedPhoneDetails,
                cipStatus: {
                  status: cipStatus,
                },
              },
            })
            .then((result) => {
              userDetailsStore.getUser(userStore.currentUser.sub);
              console.log(result);
            })
            .catch(() => {});
          resolve();
        })
        .catch((err) => {
          uiStore.setErrors(this.simpleErr(err));
          reject(err);
        })
        .finally(() => {
          uiStore.setProgress(false);
        });
    });
  }

  @action
  setConfirmIdentityDocuments(field, value) {
    this.onFieldChange('confirmIdentityDocuments', field, value);
  }

  @action
  setConfirmIdentityDocumentsError(field, error) {
    this.confirmIdentityDocuments[field].error = error;
  }

  @action
  setFileUploadData(field, files) {
    const fileData = Helper.getFormattedFileData(files);
    this.onFieldChange('confirmIdentityDocuments', field, fileData.fileName);
    uiStore.setProgress();
    return new Promise((resolve, reject) => {
      client
        .mutate({
          mutation: createUploadEntry,
          variables: {
            userId: userStore.currentUser.sub,
            stepName: 'CIPDocuments',
            fileData,
          },
        })
        .then((result) => {
          const { fileId, preSignedUrl } = result.data.createUploadEntry;
          this.confirmIdentityDocuments.fields[field].fileId = fileId;
          this.confirmIdentityDocuments.fields[field].preSignedUrl = preSignedUrl;
          resolve();
        })
        .catch((err) => {
          uiStore.setErrors(this.simpleErr(err));
          reject(err);
        })
        .finally(() => {
          uiStore.setProgress(false);
        });
    });
  }

  @action
  removeUploadedData(field) {
    uiStore.setProgress();
    return new Promise((resolve, reject) => {
      client
        .mutate({
          mutation: removeUploadedFile,
          variables: {
            fileId: this.confirmIdentityDocuments.fields[field].fileId,
          },
        })
        .then((result) => {
          this.onFieldChange('confirmIdentityDocuments', field, '');
          this.confirmIdentityDocuments.fields[field].fileId = '';
          this.confirmIdentityDocuments.fields[field].preSignedUrl = '';
          console.log(result);
          resolve();
        })
        .catch((err) => {
          uiStore.setErrors(this.simpleErr(err));
          reject(err);
        })
        .finally(() => {
          uiStore.setProgress(false);
        });
    });
  }

  @computed
  get canSubmitConfirmIdentityDocumentsForm() {
    return _.isEmpty(_.filter(this.confirmIdentityDocuments, field => field.error));
  }

  @computed
  get canSubmitNewPhoneNumber() {
    return ((typeof this.verifyIdentity01.fields.phoneNumber.error !== 'undefined' &&
    !_.isEmpty(this.verifyIdentity01.fields.phoneNumber.value)) ||
    _.isEmpty(this.verifyIdentity01.fields.phoneNumber.value));
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
              id: this.verifyIdentity01.response.softFailId,
              answers: this.formattedIdentityQuestionsAnswers,
            },
          },
        })
        .then((result) => {
          /* eslint-disable no-underscore-dangle */
          if (result.data.verifyCIPAnswers.__typename === 'UserCIPPass') {
            client
              .mutate({
                mutation: updateUserCIPInfo,
                variables: {
                  userId: userStore.currentUser.sub,
                  user: this.formattedUserInfo,
                  phoneDetails: this.formattedPhoneDetails,
                  cipStatus: {
                    status: 'PASS',
                  },
                },
              })
              .then((data) => {
                resolve(data);
              })
              .catch(() => {});
          }
          resolve(result);
        })
        .catch((err) => {
          uiStore.setErrors(this.simpleErr(err));
          reject();
        })
        .finally(() => {
          uiStore.setProgress(false);
        });
    });
  }

  /* eslint-disable arrow-body-style */
  startPhoneVerification = () => {
    uiStore.clearErrors();
    uiStore.setProgress();
    return new Promise((resolve, reject) => {
      client
        .mutate({
          mutation: startUserPhoneVerification,
          variables: {
            phoneDetails: this.formattedPhoneDetails,
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

  confirmPhoneNumber = () => {
    uiStore.setProgress();
    return new Promise((resolve, reject) => {
      client
        .mutate({
          mutation: checkUserPhoneVerificationCode,
          variables: {
            phoneDetails: this.formattedPhoneDetails,
            verificationCode: this.verifyIdentity04.fields.code.value,
          },
        })
        .then(() => {
          client
            .mutate({
              mutation: updateUserCIPInfo,
              variables: {
                userId: userStore.currentUser.sub,
                user: this.formattedUserInfo,
                phoneDetails: this.formattedPhoneDetails,
                cipStatus: {
                  status: 'PASS',
                },
              },
            });
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

  /**
   * @desc Handle function for update profile info change.
   */
  @action
  updateProfileInfoChange = (e, result) => {
    const fieldName = typeof result === 'undefined' ? e.target.name : result.name;
    const fieldValue = typeof result === 'undefined' ? e.target.value : result.value;
    this.onFieldChange('updateProfileInfo', fieldName, fieldValue);
  };

  @action
  setProfileInfo = (userDetails) => {
    this.resetUpdateProfileDetails();
    const {
      email,
      address,
      legalDetails,
      contactDetails,
    } = userDetails;
    if (userDetails.firstName) {
      this.onFieldChange('updateProfileInfo', 'firstName', userDetails.firstName);
    }
    if (userDetails.lastName) {
      this.onFieldChange('updateProfileInfo', 'lastName', userDetails.lastName);
    } else if (legalDetails && legalDetails.legalName !== null) {
      this.onFieldChange('updateProfileInfo', 'firstName', legalDetails.legalName.firstLegalName);
      this.onFieldChange('updateProfileInfo', 'lastName', legalDetails.legalName.lastLegalName);
    }
    this.onFieldChange('updateProfileInfo', 'email', email);
    if (contactDetails && contactDetails.phone !== null) {
      this.onFieldChange('updateProfileInfo', 'phoneNumber', contactDetails.phone.number);
    }
    if (address === null) {
      if (legalDetails && legalDetails.legalAddress !== null) {
        this.onFieldChange('updateProfileInfo', 'street', legalDetails.legalAddress.street);
        this.onFieldChange('updateProfileInfo', 'city', legalDetails.legalAddress.city);
        this.onFieldChange('updateProfileInfo', 'state', legalDetails.legalAddress.state);
        this.onFieldChange('updateProfileInfo', 'zipCode', legalDetails.legalAddress.zipCode);
      }
    } else if (address && address.mailing) {
      if (address.mailing.street !== null) {
        this.onFieldChange('updateProfileInfo', 'street', address.mailing.street);
      }
      if (address.mailing.city !== null) {
        this.onFieldChange('updateProfileInfo', 'city', address.mailing.city);
      }
      if (address.mailing.state !== null) {
        this.onFieldChange('updateProfileInfo', 'state', address.mailing.state);
      }
      if (address.mailing.zipCode !== null) {
        this.onFieldChange('updateProfileInfo', 'zipCode', address.mailing.zipCode);
      }
    }
  }

  @computed
  get profileDetails() {
    const profileDetails = {
      firstName: this.updateProfileInfo.fields.firstName.value,
      lastName: this.updateProfileInfo.fields.lastName.value,
      address: {
        mailing: {
          street: this.updateProfileInfo.fields.street.value,
          city: this.updateProfileInfo.fields.city.value,
          state: this.updateProfileInfo.fields.state.value,
          zipCode: this.updateProfileInfo.fields.zipCode.value,
        },
      },
    };
    return profileDetails;
  }

 setAddressFields = (place) => {
   const data = Helper.gAddressClean(place);
   this.onFieldChange('updateProfileInfo', 'street', data.residentalStreet);
   this.onFieldChange('updateProfileInfo', 'city', data.city);
   this.onFieldChange('updateProfileInfo', 'state', data.state);
   this.onFieldChange('updateProfileInfo', 'zipCode', data.zipCode);
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
         userStore.setGivenName(this.updateProfileInfo.fields.firstName.value);
         userStore.setFamilyName(this.updateProfileInfo.fields.lastName.value);
         resolve();
       })
       .catch((err) => {
         uiStore.setErrors(this.simpleErr(err));
         reject(err);
       })
       .finally(() => {
         uiStore.setProgress(false);
       });
   });
 }

 requestEmailChange = () => {
   uiStore.reset();
   uiStore.setProgress();
   return new Promise((resolve, reject) => {
     client
       .mutate({
         mutation: requestEmailChnage,
         variables: {
           userId: userStore.currentUser.sub,
           newEmail: authStore.values.email.value,
         },
       })
       .then(() => {
         resolve();
       })
       .catch((err) => {
         uiStore.setErrors(this.simpleErr(err));
         reject(err);
       })
       .finally(() => {
         uiStore.setProgress(false);
       });
   });
 }

 verifyAndUpdateEmail = () => {
   uiStore.setProgress();
   return new Promise((resolve, reject) => {
     client
       .mutate({
         mutation: verifyAndUpdateEmail,
         variables: {
           userId: userStore.currentUser.sub,
           confirmationCode: authStore.values.code.value,
         },
       })
       .then(() => {
         resolve();
       })
       .catch((err) => {
         uiStore.setErrors(this.simpleErr(err));
         reject(err);
       })
       .finally(() => {
         uiStore.setProgress(false);
       });
   });
 }

 verifyAndUpdatePhoneNumber = () => {
   uiStore.setProgress();
   return new Promise((resolve, reject) => {
     client
       .mutate({
         mutation: checkUserPhoneVerificationCode,
         variables: {
           phoneDetails: this.formattedPhoneDetails,
           verificationCode: this.verifyIdentity04.fields.code.value,
         },
       })
       .then(() => {
         client
           .mutate({
             mutation: updateUserPhoneDetail,
             variables: {
               userId: userStore.currentUser.sub,
               phoneDetails: {
                 number: Helper.unMaskInput(this.verifyIdentity01.fields.phoneNumber.value),
                 countryCode: '1',
               },
             },
           })
           .then(() => {
             this.onFieldChange('updateProfileInfo', 'phoneNumber', this.verifyIdentity01.fields.phoneNumber.value);
           })
           .catch(() => { });
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

  uploadAndUpdateCIPInfo = () => {
    uiStore.setProgress();
    const { photoId, proofOfResidence } = this.confirmIdentityDocuments.fields;
    return new Promise((resolve, reject) => {
      Helper.putUploadedFile([photoId, proofOfResidence])
        .then(() => {
          client
            .mutate({
              mutation: updateUserCIPInfo,
              variables: {
                userId: userStore.currentUser.sub,
                user: this.formattedUserInfo,
                phoneDetails: this.formattedPhoneDetails,
                cipStatus: {
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
                },
              },
            })
            .then(() => {
              const message = { message: 'MANUAL_VERIFICATION_PENDING' };
              this.setVerifyIdentityResponse(message);
              resolve();
            })
            .catch((err) => {
              reject(err);
              uiStore.setErrors(this.simpleErr(err));
            })
            .finally(() => {
              uiStore.setProgress(false);
            });
        })
        .catch((err) => {
          uiStore.setErrors(this.simpleErr(err));
          reject();
        });
    });
  }

  simpleErr = err => ({
    statusCode: err.statusCode,
    code: err.code,
    message: err.message,
  });
}
export default new ProfileStore();
