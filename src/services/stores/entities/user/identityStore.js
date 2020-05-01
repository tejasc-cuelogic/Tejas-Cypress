/* eslint-disable no-unused-expressions */
import graphql from 'mobx-apollo';
import { observable, action, computed, toJS } from 'mobx';
import moment from 'moment';
import { mapValues, keyBy, find, flatMap, map, get, isEmpty, intersection } from 'lodash';
import Validator from 'validatorjs';
import { USER_IDENTITY, IDENTITY_DOCUMENTS, PHONE_VERIFICATION, UPDATE_PROFILE_INFO, VERIFY_OTP } from '../../../constants/user';
import { FormValidator, DataFormatter } from '../../../../helper';
import { uiStore, authStore, userStore, userDetailsStore, multiFactorAuthStore } from '../../index';
import { sendOtpEmail, verifyOtpEmail, sendOtp, isUniqueSSN, cipLegalDocUploads, verifyOtpPhone, changeLinkedBankRequest, changePhoneRequest, changeEmailRequest, verifyOtpEmailPrivate, verifyCipSoftFail, verifyCip, verifyCipHardFail, updateUserProfileData } from '../../queries/profile';
import { GqlClient as client } from '../../../../api/gqlApi';
import { GqlClient as publicClient } from '../../../../api/publicApi';
import Helper from '../../../../helper/utility';
import validationService from '../../../../api/validation';
import { fileUpload, authActions } from '../../../actions';
import { INVESTOR_URLS } from '../../../constants/url';
import identityHelper from '../../../../modules/private/investor/accountSetup/containers/cipVerification/helper/index';
import { US_STATES, FILE_UPLOAD_STEPS, US_STATES_FOR_INVESTOR } from '../../../../constants/account';
import commonStore from '../commonStore';
import bankAccountStore from '../shared/bankAccountStore';

export class IdentityStore {
  @observable ID_VERIFICATION_FRM = FormValidator.prepareFormObject(USER_IDENTITY);

  @observable ID_VERIFICATION_DOCS_FRM = FormValidator.prepareFormObject(IDENTITY_DOCUMENTS);

  @observable ID_VERIFICATION_QUESTIONS = FormValidator.prepareFormObject([]);

  @observable ID_PHONE_VERIFICATION = FormValidator.prepareFormObject(PHONE_VERIFICATION);

  @observable OTP_VERIFY_META = FormValidator.prepareFormObject(VERIFY_OTP);

  @observable ID_PROFILE_INFO = FormValidator.prepareFormObject(UPDATE_PROFILE_INFO);

  @observable submitVerificationsDocs = false;

  @observable reSendVerificationCode = false;

  @observable confirmMigratedUserPhoneNumber = false;

  @observable requestOtpResponse = {};

  @observable userCipStatus = '';

  @observable isOptConfirmed = false;

  @observable isAddressFailed = false;

  @observable isPhoneFailed = false;

  @observable cipBackUrl = [INVESTOR_URLS.cipForm];

  @observable cipErrors = undefined;

  @observable sendOtpToMigratedUser = [];

  @observable signUpLoading = false;

  @observable isAdmin = false;

  cipStepUrlMapping = {
    ciphardFail: { steps: ['userCIPHardFail', 'userCIPFail'], url: INVESTOR_URLS.cipHardFail, status: 'HARD_FAIL' },
    cipSoftFail: { steps: ['userCIPSoftFail'], url: INVESTOR_URLS.cipSoftFail, status: 'SOFT_FAIL' },
    cipPass: { steps: ['userCIPPass', 'OFFLINE', 'phoneMfa'], url: INVESTOR_URLS.phoneVerification, status: 'PASS' },
    cip: { steps: ['UNIQUE_SSN'], url: INVESTOR_URLS.cipForm },
    cipAddressFail: { steps: ['ADDRESS_VERIFICATION'], url: INVESTOR_URLS.cipAddressFail },
    cipPhoneFail: { steps: ['PHONE_VERIFICATION'], url: INVESTOR_URLS.cipPhoneFail },
  }

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
  personalInfoChange = (e, result, form) => {
    this[form] = FormValidator.onChange(
      this[form],
      FormValidator.pullValues(e, result),
    );
  };

  @action
  personalInfoMaskedChange = (values, field, form) => {
    const finalValue = (field === 'dateOfBirth') ? values.formattedValue : values.value;
    this[form] = FormValidator.onChange(
      this[form],
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
  setAddressFieldsForUserVerification = (place, form) => {
    if (this.isStreetCodeExistInAutoComplete(place)) {
      FormValidator.setAddressFields(place, this[form]);
      const state = US_STATES.find(s => s.text === this[form].fields.state.value.toUpperCase());
      this[form].fields.state.value = state ? state.key : '';
    } else {
      this[form] = FormValidator.onChange(
        this[form],
        { name: 'street', value: Helper.gAddressClean(place).residentalStreet },
      );
      ['city', 'state', 'zipCode'].forEach((field) => { this[form].fields[field].value = ''; });
    }
  }

  isStreetCodeExistInAutoComplete = place => place.address_components.find(c => intersection(c.types, ['street_number']).length > 0)

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
    const user = FormValidator.evaluateFormData(fields);

    if (userDetailsStore.isLegalDocsPresent) {
      user.verificationDocs = this.verificationDocs();
    }
    const phoneDetails = { number: fields.phoneNumber.value };
    return { user, phoneDetails };
  }

  @computed
  get formattedCipAnswers() {
    return Object.keys(this.ID_VERIFICATION_QUESTIONS.fields).map(type => ({
      type, text: this.ID_VERIFICATION_QUESTIONS.fields[type].value,
    }));
  }

  @action
  setStateValue = (stateValue) => {
    this.ID_PROFILE_INFO.fields.state.value = stateValue;
  }

  verificationDocs = () => {
    const { legalDetails } = this.isAdmin ? userDetailsStore.detailsOfUser.data.user : userDetailsStore.userDetails;
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

    return verificationDocs;
  }

  @computed get cipStatus() {
    const { key, questions } = this.ID_VERIFICATION_FRM.response;
    const cipStatus = identityHelper.getCipStatus(key, questions);
    return cipStatus;
  }

  @action
  verifyCip = async (isAdmin = false) => {
    this.setFieldValue('isAdmin', isAdmin);
    this.setCipDetails();
    delete this.formattedUserInfoForCip.user.verificationDocs;
    let variables = { isCipOffline: false, ...this.formattedUserInfoForCip };
    variables = isAdmin ? { ...variables, userId: userDetailsStore.selectedUserId } : { ...variables };
    const payLoad = {
      mutation: verifyCip,
      mutationName: 'verifyCip',
      variables,
    };
    const { res, url } = await this.cipWrapper(payLoad);
    let redirectUrl = url;
    const resData = res.data.verifyCip;

    if (resData.questions) {
      this.setIdentityQuestions(resData.questions);
    }

    if (resData.step === 'ADDRESS_VERIFICATION' && this.isAddressFailed) {
      redirectUrl = INVESTOR_URLS.cipHardFail;
    }

    if (res.data.verifyCip.step === 'OFFLINE') {
      userDetailsStore.mergeUserData('legalDetails', { status: 'OFFLINE' });
      window.sessionStorage.setItem('cipErrorMessage',
        JSON.stringify(resData.errorMessage));
    }
    this.setVerifyIdentityResponse(resData);
    return { res, url: redirectUrl };
  }

  updateUserDataAndSendOtp = async () => {
    if (userDetailsStore.signupStatus.phoneVerification !== 'DONE') {
      await this.sendOtp('PHONE_CONFIGURATION');
    }
    userDetailsStore.mergeUserData('legalDetails', this.formattedUserInfoForCip.user);
    userDetailsStore.mergeUserData('phone', this.formattedUserInfoForCip.phoneDetails);
  }

  @action
  verifyCipSoftFail = async () => {
    const payLoad = {
      mutation: verifyCipSoftFail,
      mutationName: 'verifyCipSoftFail',
      variables: {
        answers: this.formattedCipAnswers,
      },
    };
    const { res, url } = await this.cipWrapper(payLoad);
    return { res, url };
  }


  @action
  cipLegalDocUploads = async () => {
    const payLoad = {
      mutation: cipLegalDocUploads,
      mutationName: 'cipLegalDocUploads',
      variables: {
        license: this.verificationDocs().idProof.fileId,
        residence: this.verificationDocs().addressProof.fileId,
      },
    };
    const { res: response } = await this.cipWrapper(payLoad);
    if (response.data.cipLegalDocUploads) {
      const { res, url } = await this.verifyCip();
      this.setFieldValue('isAddressFailed', false);
      this.setFieldValue('cipBackUrl', [...this.cipBackUrl, ...[INVESTOR_URLS.cipForm]]);
      return { res, url };
    }
    return false;
  }

  @action
  changeSsnRules = (isRequired = false) => {
    this.ID_VERIFICATION_FRM.fields.ssn.rule = this.ID_VERIFICATION_FRM.fields.ssn.value.includes('X') && !isRequired ? 'optional|maskedSSN' : 'required|maskedSSN';
  }

  @action
  verifyCipHardFail = async () => {
    const payLoad = {
      mutation: verifyCipHardFail,
      mutationName: 'verifyCipHardFail',
      variables: {
        license: this.verificationDocs().idProof.fileId,
        residence: this.verificationDocs().addressProof.fileId,
      },
      cipPassStatus: 'MANUAL_VERIFICATION_PENDING',
    };
    this.setFieldValue('userCipStatus', 'MANUAL_VERIFICATION_PENDING');
    const { res, url } = await this.cipWrapper(payLoad);
    userDetailsStore.mergeUserData('legalDetails', { verificationDocs: this.verificationDocs() });

    return { res, url };
  }

  cipWrapper = async (payLoad) => {
    try {
      this.setFieldValue('signUpLoading', true);
      this.setFieldValue('cipErrors', null);
      const res = await client
        .mutate({
          mutation: payLoad.mutation,
          variables: payLoad.variables,
        });
      const stepName = Object.keys(this.cipStepUrlMapping).find((key => (
        this.cipStepUrlMapping[key].steps.includes(get(res, `data.${payLoad.mutationName}.step`))
      )));
      // eslint-disable-next-line prefer-destructuring
      const url = get(this.cipStepUrlMapping[stepName], 'url');
      const { message } = !get(res, `data.${payLoad.mutationName}.status`) && res.data[`${payLoad.mutationName}`];

      if (stepName === 'cipPass') {
        await authActions.refreshCurrentSession();
        await this.updateUserDataAndSendOtp();
      }

      if ((stepName === 'cip' && message) || (stepName === 'cipPhoneFail' && this.isPhoneFailed && message)) {
        this.setFieldValue('cipErrors',
          DataFormatter.getSimpleErr({
            message,
          }));
      }

      if (stepName !== 'cip' && get(this.cipStepUrlMapping[stepName], 'status')) {
        const userObj = {
          legalDetails: {
            status: this.cipStepUrlMapping[stepName].status || payLoad.mutation.cipPassStatus,
          },
          cip: {
            expiration: Helper.getDaysfromNow(21),
          },
          info: {
            firstName: this.ID_VERIFICATION_FRM.fields.firstLegalName.value,
            lastName: this.ID_VERIFICATION_FRM.fields.lastLegalName.value,
          },
        };
        Object.keys(userObj).forEach(key => userDetailsStore.mergeUserData(key, userObj[key]));
        this.setProfileInfo(userDetailsStore.userDetails);
      }

      this.setFieldValue('signUpLoading', false);

      return { res, url };
    } catch (err) {
      this.setFieldValue('cipErrors', DataFormatter.getSimpleErr(err));
      this.setFieldValue('signUpLoading', false);
      return Promise.reject(err);
    }
  }

  @action
  setCipStatusWithUserDetails = () => {
    this.userCipStatus = userDetailsStore.userDetails.legalDetails.status;
  }

  @action
  setIdentityQuestions = (response) => {
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

  sendOtpAttributes = (type) => {
    let to;
    let method;
    const { user } = userDetailsStore.currentUser.data;
    const { mfaMethod, phoneNumber } = this.ID_VERIFICATION_FRM.fields;
    const phone = phoneNumber.value || get(user, 'phone.number');
    const { value: multiFactorMfaValue } = multiFactorAuthStore.MFA_MODE_TYPE_META.fields.mfaModeTypes;
    const emailAddress = authStore.CONFIRM_FRM.fields.email.value || get(user, 'email.address');
    if (type.startsWith('EMAIL') || [mfaMethod.value, multiFactorMfaValue].includes('EMAIL')) {
      to = emailAddress.toLowerCase();
      method = 'EMAIL';
    } else if (type === 'BANK_CHANGE') {
      to = phone;
      method = multiFactorMfaValue || 'TEXT';
    } else {
      to = phone;
      method = mfaMethod.value === '' ? 'TEXT' : mfaMethod.value;
    }
    return { to, method, emailAddress, phone };
  }

  @action
  sendOtp = async (type, isMobile = false) => {
    try {
      const { method, to, emailAddress, phone } = this.sendOtpAttributes(type);
      uiStore.clearErrors();
      uiStore.setProgress();
      this.setReSendVerificationCode(true);
      this.setFieldValue('signUpLoading', true);
      const res = await client
        .mutate({
          mutation: sendOtp,
          variables: {
            type,
            method,
            to,
          },
        });
      const requestMode = method === 'EMAIL' ? `code sent to ${emailAddress}` : (method === 'CALL' ? `call to ${phone}` : `code texted to ${phone}`);
      if (method === 'EMAIL') {
        this.setSendOtpToMigratedUser('EMAIL');
      } else {
        this.setConfirmMigratedUserPhoneNumber(true);
        this.setSendOtpToMigratedUser('PHONE');
      }
      this.setRequestOtpResponse(res.data.sendOtp);
      if (!isMobile && !userStore.isInvestor) {
        Helper.toast(`Verification ${requestMode}.`, 'success');
      }
      this.setFieldValue('signUpLoading', false);
      uiStore.setProgress(false);
      this.setReSendVerificationCode(false);
      return true;
    } catch (err) {
      this.setFieldValue('signUpLoading', false);
      uiStore.setProgress(false);
      this.setReSendVerificationCode(false);
      uiStore.setErrors(toJS(DataFormatter.getSimpleErr(err)));
      return false;
    }
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

  @computed
  get formattedIdentityQuestionsAnswers() {
    const formattedIdentityQuestionsAnswers = flatMap(this.ID_VERIFICATION_QUESTIONS.fields, n => [{ type: n.key, text: n.value }]);
    return formattedIdentityQuestionsAnswers;
  }

  verifyOtpPhone = async () => {
    uiStore.setProgress();
    const payLoad = {
      mutation: verifyOtpPhone,
      mutationName: 'verifyOtpPhone',
      variables: {
        resourceId: this.requestOtpResponse,
        verificationCode: this.ID_PHONE_VERIFICATION.fields.code.value,
        phone: this.ID_VERIFICATION_FRM.fields.phoneNumber.value,
      },
    };
    const res = await this.otpWrapper(payLoad);

    if (res) {
      userDetailsStore.mergeUserData('phone', {
        ...this.formattedUserInfoForCip.phoneDetails,
        verified: moment().tz('America/Chicago').toISOString(),
      });
    }

    return res;
  }

  @action
  verifyVerificationCodeChange = (value) => {
    this.OTP_VERIFY_META = FormValidator.onChange(
      this.OTP_VERIFY_META,
      { name: 'code', value },
    );
  };

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
  resetStoreData = () => {
    this.resetFormData('ID_VERIFICATION_FRM');
    this.ID_VERIFICATION_DOCS_FRM = FormValidator.prepareFormObject(IDENTITY_DOCUMENTS);
    this.resetFormData('ID_PHONE_VERIFICATION');
    this.resetFormData('ID_VERIFICATION_QUESTIONS');
    this.confirmMigratedUserPhoneNumber = false;
    this.isAdmin = false;
    this.signUpLoading = false;
    this.isOptConfirmed = false;
  }

  @action
  setCipDetails = () => {
    const { legalDetails, phone } = this.isAdmin ? userDetailsStore.detailsOfUser.data.user : userDetailsStore.userDetails;
    const { fields, meta } = this.ID_VERIFICATION_FRM;
    if (!meta.isValid && get(legalDetails, 'legalAddress')) {
      if (get(legalDetails, 'legalName')) {
        fields.salutation.value = legalDetails.legalName.salutation;
        fields.firstLegalName.value = legalDetails.legalName.firstLegalName;
        fields.lastLegalName.value = legalDetails.legalName.lastLegalName;
      }
      if (get(legalDetails, 'legalAddress')) {
        fields.city.value = legalDetails.legalAddress.city;
        const state = US_STATES.find(s => s.key === legalDetails.legalAddress.state);
        const selectedState = state ? state.key : fields.state.value;
        if (selectedState) {
          fields.state.value = selectedState;
        }
        fields.street.value = legalDetails.legalAddress.street;
        fields.streetTwo.value = legalDetails.legalAddress.streetTwo;
        fields.zipCode.value = legalDetails.legalAddress.zipCode;
      }
      if (get(legalDetails, 'dateOfBirth')) {
        fields.dateOfBirth.value = legalDetails.dateOfBirth;
      }
      if (get(legalDetails, 'ssn')) {
        fields.ssn.value = legalDetails.ssn;
      }
      if (legalDetails && phone && phone.number) {
        fields.phoneNumber.value = get(fields, 'phoneNumber.value') && !this.isAdmin ? fields.phoneNumber.value : phone.number;
      }
    }
  }

  @action
  sendOtpEmail = async () => {
    uiStore.setProgress();
    const { email } = FormValidator.ExtractValues(authStore.SIGNUP_FRM.fields);
    const emailInCookie = authStore.CONFIRM_FRM.fields.email.value;
    let variables = {
      email: (email || emailInCookie).toLowerCase(),
    };
    const tags = JSON.parse(window.localStorage.getItem('tags'));
    variables = !isEmpty(tags) ? { ...variables, tags } : { ...variables };
    const payLoad = {
      mutation: sendOtpEmail,
      mutationName: 'sendOtpEmail',
      variables,
    };
    const res = await this.otpWrapper(payLoad, true);
    commonStore.removeLocalStorage(['tags']);
    this.setRequestOtpResponse(res);
    return res;
  }

  @action
  verifyOtpEmail = async () => {
    uiStore.setProgress();
    const { email, code } = FormValidator.ExtractValues(authStore.CONFIRM_FRM.fields);
    const verifyOTPData = {
      verificationCode: code,
      email,
    };

    const payLoad = {
      mutation: verifyOtpEmail,
      mutationName: 'verifyOtpEmail',
      variables: { verifyOTPData },
    };

    const res = await this.otpWrapper(payLoad, true);
    return res;
  }

  @action
  changeLinkedBankRequest = async (investorAccountType) => {
    uiStore.setProgress();
    const { bankLinkInterface, formLinkBankManually, newPlaidAccDetails } = bankAccountStore;
    const { accountNumber, routingNumber, accountType, bankName } = FormValidator.ExtractValues(formLinkBankManually.fields);
    let variables = {
      resourceId: this.requestOtpResponse,
      verificationCode: this.OTP_VERIFY_META.fields.code.value,
      accountId: bankAccountStore.CurrentAccountId,
    };

    if (bankLinkInterface === 'form') {
      variables = { ...variables, bankAccountNumber: accountNumber, bankRoutingNumber: routingNumber, accountType, bankName };
    } else {
      variables = { ...variables, plaidAccountId: newPlaidAccDetails.account_id, plaidPublicToken: newPlaidAccDetails.public_token };
    }

    const payLoad = {
      mutation: changeLinkedBankRequest,
      mutationName: 'changeLinkedBankRequest',
      variables,
    };
    const res = await this.otpWrapper(payLoad);
    uiStore.setProgress();
    if (res) {
      const result = await userDetailsStore.bankChangeRequestQuery(investorAccountType);
      if (result) {
        bankAccountStore.setCurrentAccount(investorAccountType);
      }
      uiStore.setProgress(false);
    } else {
      uiStore.setProgress(false);
    }

    return res;
  }

  @action
  changeEmailRequest = async () => {
    uiStore.setProgress();
    const { email, code } = FormValidator.ExtractValues(authStore.CONFIRM_FRM.fields);
    const payLoad = {
      mutation: changeEmailRequest,
      mutationName: 'changeEmailRequest',
      variables: {
        resourceId: this.requestOtpResponse,
        verificationCode: code,
      },
    };
    const res = await this.otpWrapper(payLoad);
    if (res) {
      this.props.userDetailsStore.mergeUserData('email', { address: email });
    }
    return res;
  }

  @action
  changeEmailRequest = async () => {
    uiStore.setProgress();
    const { email, code } = FormValidator.ExtractValues(authStore.CONFIRM_FRM.fields);
    const payLoad = {
      mutation: changeEmailRequest,
      mutationName: 'changeEmailRequest',
      variables: {
        resourceId: this.requestOtpResponse,
        verificationCode: code,
      },
    };
    const res = await this.otpWrapper(payLoad);
    if (res) {
      userDetailsStore.mergeUserData('email', { address: email });
    }
    return res;
  }

  @action
  changePhoneRequest = async () => {
    uiStore.setProgress();
    const { phoneNumber } = FormValidator.ExtractValues(this.ID_VERIFICATION_FRM.fields);
    const payLoad = {
      mutation: changePhoneRequest,
      mutationName: 'changePhoneRequest',
      variables: {
        resourceId: this.requestOtpResponse,
        verificationCode: this.ID_PHONE_VERIFICATION.fields.code.value,
        phone: phoneNumber,
      },
    };
    const res = await this.otpWrapper(payLoad);
    if (res) {
      userDetailsStore.mergeUserData('phone', { number: phoneNumber });
    }
    return res;
  }

  @action
  otpWrapper = async (payLoad, isPublicClient = false) => {
    try {
      const apolloClient = isPublicClient ? publicClient : client;
      const res = await apolloClient.mutate({
        mutation: payLoad.mutation,
        variables: payLoad.variables,
      });
      uiStore.setProgress(false);
      return res.data[`${payLoad.mutationName}`];
    } catch (err) {
      uiStore.setProgress(false);
      uiStore.setErrors(DataFormatter.getSimpleErr(err));
      return false;
    }
  }

  @action
  confirmEmailForMigratedUser = async () => {
    uiStore.setProgress();
    const payLoad = {
      mutation: verifyOtpEmailPrivate,
      mutationName: 'verifyOtpEmail',
      variables: {
        resourceId: this.requestOtpResponse,
        verificationCode: authStore.CONFIRM_FRM.fields.code.value,
        email: get(userDetailsStore, 'currentUser.data.user.email.address'),
      },
    };

    const res = await this.otpWrapper(payLoad);
    return res;
  }

  @action
  validateForm = (form) => {
    FormValidator.validateForm(this[form], false, true);
  }

  resetCipData = () => {
    this.changeSsnRules(true);
    this.setFieldValue('cipBackUrl', [INVESTOR_URLS.cipForm]);
    this.isAddressFailed = false;
    this.isPhoneFailed = false;
  }
}

export default new IdentityStore();
