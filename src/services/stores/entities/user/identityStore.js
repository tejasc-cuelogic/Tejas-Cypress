import { observable, action, computed } from 'mobx';
import { mapValues, keyBy, find, flatMap } from 'lodash';
import Validator from 'validatorjs';
import { USER_IDENTITY, IDENTITY_DOCUMENTS, PHONE_VERIFICATION } from '../../../constants/user';
import { FormValidator, DataFormatter } from '../../../../helper';
import { uiStore, userStore, userDetailsStore } from '../../index';
import { verifyCIPUser, updateUserCIPInfo, startUserPhoneVerification, verifyCIPAnswers, checkUserPhoneVerificationCode, updateUserPhoneDetail } from '../../queries/profile';
import { GqlClient as client } from '../../../../api/gqlApi';
import Helper from '../../../../helper/utility';
import { createUploadEntry, removeUploadedFile } from '../../queries/common';
import { COUNTRY_CODES } from '../../../../constants/profile';
import identityHelper from '../../../../modules/private/investor/accountSetup/containers/identityVerification/helper';

export class IdentityStore {
  @observable ID_VERIFICATION_FRM = FormValidator.prepareFormObject(USER_IDENTITY);
  @observable ID_VERIFICATION_DOCS_FRM = FormValidator.prepareFormObject(IDENTITY_DOCUMENTS);
  @observable ID_VERIFICATION_QUESTIONS = FormValidator.prepareFormObject([]);
  @observable ID_PHONE_VERIFICATION = FormValidator.prepareFormObject(PHONE_VERIFICATION);
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
  setAddressFieldsOnGoogleAutocomplete = (place) => {
    Helper.setAddressFields(place, this.ID_VERIFICATION_FRM);
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
          uiStore.setErrors(DataFormatter.getSimpleErr(err));
          reject(err);
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
    this.ID_VERIFICATION_DOCS_FRM.fields[field].fileData = files;
    const fileData = Helper.getFormattedFileData(files);
    this.ID_VERIFICATION_DOCS_FRM = FormValidator.onChange(
      this.ID_VERIFICATION_DOCS_FRM,
      { name: field, value: fileData.fileName },
    );
    uiStore.setProgress();
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
        this.ID_VERIFICATION_DOCS_FRM.fields[field].fileId = fileId;
        this.ID_VERIFICATION_DOCS_FRM.fields[field].preSignedUrl = preSignedUrl;
      })
      .catch((err) => {
        uiStore.setErrors(DataFormatter.getSimpleErr(err));
      })
      .finally(() => {
        uiStore.setProgress(false);
      });
  }

  @action
  removeUploadedData(field) {
    uiStore.setProgress();
    client
      .mutate({
        mutation: removeUploadedFile,
        variables: {
          fileId: this.ID_VERIFICATION_DOCS_FRM.fields[field].fileId,
        },
      })
      .then(() => {
        this.ID_VERIFICATION_DOCS_FRM = FormValidator.onChange(
          this.ID_VERIFICATION_DOCS_FRM,
          { name: field, value: '' },
        );
        this.ID_VERIFICATION_DOCS_FRM.fields[field].fileId = '';
        this.ID_VERIFICATION_DOCS_FRM.fields[field].preSignedUrl = '';
      })
      .catch((err) => {
        uiStore.setErrors(DataFormatter.getSimpleErr(err));
      })
      .finally(() => {
        uiStore.setProgress(false);
      });
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
    console.log(cipStatus);
    return new Promise((resolve, reject) => {
      client
        .mutate({
          mutation: updateUserCIPInfo,
          variables: {
            userId: userStore.currentUser.sub,
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
      .then(action(() => {
        this.ID_VERIFICATION_FRM = FormValidator.onChange(
          this.ID_VERIFICATION_FRM,
          { name: 'phoneNumber', value: this.ID_VERIFICATION_FRM.fields.phoneNumber.value },
        );
      }))
      .catch(() => { });
  }

  @computed
  get userVerficationStatus() {
    const { key, questions } = this.ID_VERIFICATION_FRM.response;
    const verificationDetails = identityHelper.getVerificationStatus(key, questions);
    return verificationDetails;
  }
}

export default new IdentityStore();
