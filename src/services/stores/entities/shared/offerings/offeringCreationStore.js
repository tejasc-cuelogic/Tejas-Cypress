/* eslint-disable no-unused-vars, arrow-body-style, max-len, no-param-reassign, no-underscore-dangle */
import { observable, toJS, action, computed } from 'mobx';
import { includes, sortBy, get, has, map, startCase, set, filter, forEach, find, orderBy, kebabCase, mergeWith } from 'lodash';
import graphql from 'mobx-apollo';
import moment from 'moment';
import omitDeep from 'omit-deep';
import cleanDeep from 'clean-deep';
import {
  DEFAULT_TIERS, ADD_NEW_TIER, MISC, AFFILIATED_ISSUER, LEADER, MEDIA,
  RISK_FACTORS, GENERAL, ISSUER, LEADERSHIP, LEADERSHIP_EXP, OFFERING_DETAILS, CONTINGENCIES,
  ADD_NEW_CONTINGENCY, COMPANY_LAUNCH, CLOSURE_SUMMARY, KEY_TERMS, OFFERING_OVERVIEW,
  OFFERING_COMPANY, OFFER_CLOSE, ADD_NEW_BONUS_REWARD, NEW_OFFER, DOCUMENTATION, EDIT_CONTINGENCY,
  ADMIN_DOCUMENTATION, OFFERING_CREATION_ARRAY_KEY_LIST, DATA_ROOM, POC_DETAILS, CLOSING_BINDING,
  OFFERING_CLOSE_4, OFFERING_CLOSE_2, OFFERING_CLOSE_3, OFFERING_CLOSE_1, OFFERING_CLOSE_EXPORT_ENVELOPES,
} from '../../../../constants/admin/offerings';
import { FormValidator as Validator, DataFormatter } from '../../../../../helper';
import { deleteBonusReward, updateOffering,
  getOfferingDetails, getOfferingBac, createBac, updateBac, offerClose, deleteBac, upsertBonusReward,
  getBonusRewards, getOfferingFilingList, initializeClosingBinder,
  generateBusinessFiling, upsertOffering } from '../../../queries/offerings/manage';
import { GqlClient as client } from '../../../../../api/gqlApi';
import Helper from '../../../../../helper/utility';
import { offeringsStore, uiStore, userDetailsStore, commonStore, activityHistoryStore, offeringInvestorStore } from '../../../index';
import { fileUpload } from '../../../../actions';
import { XML_STATUSES } from '../../../../../constants/business';
import { INDUSTRY_TYPES } from '../../../../../constants/offering';
import { ACTIVITY_HISTORY_TYPES, ACTIVITY_HISTORY_SCOPE } from '../../../../../constants/common';
import { US_STATES } from '../../../../../constants/account';

export class OfferingCreationStore {
  @observable NEW_OFFER_FRM = Validator.prepareFormObject(NEW_OFFER);

  @observable KEY_TERMS_FRM = Validator.prepareFormObject(KEY_TERMS);

  @observable OFFERING_OVERVIEW_FRM = Validator.prepareFormObject(OFFERING_OVERVIEW);

  @observable OFFERING_COMPANY_FRM = Validator.prepareFormObject(OFFERING_COMPANY);

  @observable COMPANY_LAUNCH_FRM = Validator.prepareFormObject(COMPANY_LAUNCH);

  @observable CLOSURE_SUMMARY_FRM = Validator.prepareFormObject(CLOSURE_SUMMARY);

  @observable OFFERING_MISC_FRM = Validator.prepareFormObject(MISC);

  @observable LAUNCH_CONTITNGENCIES_FRM =
    Validator.prepareFormObject({ launch: [] }, false, true, false, { launch: CONTINGENCIES.data });

  @observable CLOSING_CONTITNGENCIES_FRM =
    Validator.prepareFormObject({ close: [] }, false, true, false, { close: CONTINGENCIES.data });

  @observable ADD_NEW_CONTINGENCY_FRM = Validator.prepareFormObject(ADD_NEW_CONTINGENCY);

  @observable OFFERING_DETAILS_FRM = Validator.prepareFormObject(OFFERING_DETAILS);

  @observable OFFERING_CLOSE_FRM = Validator.prepareFormObject(OFFER_CLOSE);

  @observable OFFERING_CLOSE_1 = Validator.prepareFormObject(OFFERING_CLOSE_1);

  @observable OFFERING_CLOSE_2 = Validator.prepareFormObject(OFFERING_CLOSE_2);

  @observable OFFERING_CLOSE_3 = Validator.prepareFormObject(OFFERING_CLOSE_3);

  @observable OFFERING_CLOSE_4 = Validator.prepareFormObject(OFFERING_CLOSE_4);

  @observable OFFERING_CLOSE_EXPORT_ENVELOPES_FRM = Validator.prepareFormObject(OFFERING_CLOSE_EXPORT_ENVELOPES);

  @observable MEDIA_FRM = Validator.prepareFormObject(MEDIA);

  @observable LEADERSHIP_FRM =
    Validator.prepareFormObject(
      LEADERSHIP,
      false,
      true,
      false,
      { leadership: LEADERSHIP.leadership },
    );

  @observable LEADERSHIP_EXP_FRM = Validator.prepareFormObject(LEADERSHIP_EXP);

  @observable GENERAL_FRM = Validator.prepareFormObject(GENERAL);

  @observable ISSUER_FRM = Validator.prepareFormObject(ISSUER);

  @observable AFFILIATED_ISSUER_FRM =
    Validator.prepareFormObject(
      AFFILIATED_ISSUER,
      false,
      true,
      false,
      { getOfferingBac: AFFILIATED_ISSUER.getOfferingBac },
    );

  @observable LEADER_FRM = Validator.prepareFormObject(LEADER);

  @observable RISK_FACTORS_FRM = Validator.prepareFormObject(RISK_FACTORS);

  @observable ADD_NEW_TIER_FRM = Validator.prepareFormObject(ADD_NEW_TIER);

  @observable ADD_NEW_BONUS_REWARD_FRM = Validator.prepareFormObject(ADD_NEW_BONUS_REWARD);

  @observable DOCUMENTATION_FRM = Validator.prepareFormObject(DOCUMENTATION);

  @observable EDIT_CONTINGENCY_FRM = Validator.prepareFormObject(EDIT_CONTINGENCY);

  @observable ADMIN_DOCUMENTATION_FRM = Validator.prepareFormObject(ADMIN_DOCUMENTATION);

  @observable DATA_ROOM_FRM = Validator.prepareFormObject(DATA_ROOM);

  @observable CLOSING_BINDER_FRM = Validator.prepareFormObject(CLOSING_BINDING);

  @observable POC_DETAILS_FRM = Validator.prepareFormObject(POC_DETAILS);

  @observable contingencyFormSelected = undefined;

  @observable confirmModal = false;

  @observable confirmModalName = null;

  @observable removeIndex = null;

  @observable initLoad = [];

  @observable currentOfferingId = null;

  @observable currentOfferingSlug = null;

  @observable issuerOfferingBac = {};

  @observable affiliatedIssuerOfferingBac = {};

  @observable offeringFilingList = {};

  @observable filingListApiRes = {};

  @observable leadershipOfferingBac = {};

  @observable bonusRewardsTiers = {};

  @observable bonusRewards = {};

  @observable tierTobeUnlinked = {};

  @observable leadershipExperience = {
    0: LEADERSHIP_EXP.employer,
    1: LEADERSHIP_EXP.employer,
    2: LEADERSHIP_EXP.employer,
    3: LEADERSHIP_EXP.employer,
    4: LEADERSHIP_EXP.employer,
    5: LEADERSHIP_EXP.employer,
    6: LEADERSHIP_EXP.employer,
    7: LEADERSHIP_EXP.employer,
    8: LEADERSHIP_EXP.employer,
    9: LEADERSHIP_EXP.employer,
  };

  @observable requestState = {
    search: {},
  };

  @observable removeFileIdsList = [];

  @observable removeFileNamesList = [];

  @observable isUploadingFile = false;

  @observable isListingPage = false;

  @observable outputMsg = null;

  @action
  setFieldValue = (field, value, field2 = false, objRef = false) => {
    if (objRef) {
      set(this[field], objRef, value);
    } else if (field2) {
      this[field][field2] = value;
    } else {
      this[field] = value;
    }
  }

  @action
  resetBonusRewardForm = () => {
    this.ADD_NEW_BONUS_REWARD_FRM = Validator.prepareFormObject(ADD_NEW_BONUS_REWARD);
    this.setTiersForBonusRewardsForm();
  }

  @action
  setTierToBeUnlinked = (tier) => {
    this.tierTobeUnlinked = tier ? {
      amount: tier.amount,
      earlyBirdQuantity: tier.earlyBirdQuantity,
    } : {};
  }

  @action
  setDefaultTiers = () => {
    DEFAULT_TIERS.map((tier) => {
      if (this.bonusRewardsTiers.data && this.bonusRewardsTiers.data.getBonusRewardTiers) {
        const isExisted = find(this.bonusRewardsTiers.data.getBonusRewardTiers, { amount: tier.amount });
        if (!isExisted) {
          this.bonusRewardsTiers.data.getBonusRewardTiers.push(tier);
        }
      } else {
        this.bonusRewardsTiers.data = {};
        this.bonusRewardsTiers.data.getBonusRewardTiers = [];
        const isExisted = find(this.bonusRewardsTiers.data.getBonusRewardTiers, { amount: tier.amount });
        if (!isExisted) {
          this.bonusRewardsTiers.data.getBonusRewardTiers.unshift(tier);
        }
      }
      this.bonusRewardsTiers.data.getBonusRewardTiers = orderBy([...new Set(toJS(this.bonusRewardsTiers.data.getBonusRewardTiers))], ['amount'], ['asc']);
      return this.bonusRewardsTiers;
    });
  }

  @action
  setCurrentOfferingId = (id) => {
    this.currentOfferingId = id;
  }

  @action
  resetOfferingId = () => {
    this.currentOfferingId = null;
  }

  @action
  setProfilePhoto(attr, value, field) {
    this.MEDIA_FRM.fields[field][attr] = value;
  }

  @action
  setLeadershipProfilePhoto(attr, value, field, index) {
    this.LEADERSHIP_FRM.fields.leadership[index][field][attr] = value;
  }

  @action
  resetProfilePhoto = (field) => {
    const attributes = ['src', 'error', 'meta'];
    attributes.forEach((val) => {
      if ((typeof this.MEDIA_FRM.fields[field][val] === 'object') && (this.MEDIA_FRM.fields[field][val] !== null)) {
        this.MEDIA_FRM.fields[field][val] = {};
      } else {
        this.MEDIA_FRM.fields[field][val] = '';
      }
    });
  }

  @action
  resetLeadershipProfilePhoto = (field, index) => {
    const attributes = ['src', 'error', 'meta'];
    attributes.forEach((val) => {
      if ((typeof this.LEADERSHIP_FRM.fields.leadership[index][field][val] === 'object') && (this.LEADERSHIP_FRM.fields.leadership[index][field][val] !== null)) {
        this.LEADERSHIP_FRM.fields.leadership[index][field][val] = {};
      } else {
        this.LEADERSHIP_FRM.fields.leadership[index][field][val] = '';
      }
    });
  }

  @action
  resetForm = (form, targetedFields = []) => {
    Validator.resetFormData(this[form], targetedFields);
  }

  @action
  resetAllForms = () => {
    offeringInvestorStore.setData('db', undefined);
    offeringInvestorStore.setData('data', []);
    const forms = ['OFFERING_CLOSE_EXPORT_ENVELOPES_FRM', 'KEY_TERMS_FRM', 'OFFERING_OVERVIEW_FRM', 'OFFERING_COMPANY_FRM', 'COMPANY_LAUNCH_FRM', 'CLOSURE_SUMMARY_FRM', 'OFFERING_MISC_FRM', 'LAUNCH_CONTITNGENCIES_FRM', 'CLOSING_CONTITNGENCIES_FRM', 'ADD_NEW_CONTINGENCY_FRM', 'OFFERING_DETAILS_FRM', 'OFFERING_CLOSE_FRM', 'MEDIA_FRM', 'LEADERSHIP_FRM', 'LEADERSHIP_EXP_FRM', 'GENERAL_FRM', 'ISSUER_FRM', 'AFFILIATED_ISSUER_FRM', 'LEADER_FRM', 'RISK_FACTORS_FRM', 'ADD_NEW_TIER_FRM', 'ADD_NEW_BONUS_REWARD_FRM', 'DOCUMENTATION_FRM', 'EDIT_CONTINGENCY_FRM', 'ADMIN_DOCUMENTATION_FRM', 'DATA_ROOM_FRM', 'POC_DETAILS_FRM'];
    forms.forEach((f) => {
      this[f] = Validator.resetFormData(this[f]);
    });
    this.initLoad = [];
  }

  @action
  resetFormField = (form, field, fileObj, RemoveIndex) => {
    if (fileObj && Array.isArray(toJS(this.MEDIA_FRM.fields[field].preSignedUrl))) {
      this.MEDIA_FRM.fields[field].preSignedUrl.push(fileObj.location);
      this.MEDIA_FRM.fields[field].fileId.push(`${Date.now()}_${fileObj.fileName}`);
      this.MEDIA_FRM.fields[field].value.push(fileObj.fileName);
    } else if (fileObj) {
      this.MEDIA_FRM.fields[field].preSignedUrl = fileObj.location;
      this.MEDIA_FRM.fields[field].value = fileObj.fileName;
      this.MEDIA_FRM.fields[field].fileId = `${Date.now()}_${fileObj.fileName}`;
    } else if (RemoveIndex > -1 && Array.isArray(toJS(this.MEDIA_FRM.fields[field].preSignedUrl))) {
      this.MEDIA_FRM.fields[field].preSignedUrl.splice(RemoveIndex, 1);
      this.MEDIA_FRM.fields[field].value.splice(RemoveIndex, 1);
    } else if (RemoveIndex === undefined) {
      this.MEDIA_FRM.fields[field].preSignedUrl = '';
      this.MEDIA_FRM.fields[field].value = '';
    }
    this[form].fields[field] = {
      ...this.MEDIA_FRM.fields[field],
      ...{
        src: '',
        meta: {},
      },
    };
  }

  @action
  resetFormFieldForLeadership = (form, field, fileObj, RemoveIndex, index) => {
    if (fileObj
      && Array.isArray(toJS(this.LEADERSHIP_FRM.fields.leadership[index][field].preSignedUrl))) {
      this.LEADERSHIP_FRM.fields.leadership[index][field].preSignedUrl.push(fileObj.location);
      this.LEADERSHIP_FRM.fields.leadership[index][field].fileId.push(`${Date.now()}_${fileObj.fileName}`);
      this.LEADERSHIP_FRM.fields.leadership[index][field].value.push(fileObj.fileName);
    } else if (fileObj) {
      this.LEADERSHIP_FRM.fields.leadership[index][field].preSignedUrl = fileObj.location;
      this.LEADERSHIP_FRM.fields.leadership[index][field].value = fileObj.fileName;
      this.LEADERSHIP_FRM.fields.leadership[index][field].fileId = `${Date.now()}_${fileObj.fileName}`;
    } else if (RemoveIndex > -1
      && Array.isArray(toJS(this.LEADERSHIP_FRM.fields.leadership[index][field].preSignedUrl))) {
      this.LEADERSHIP_FRM.fields.leadership[index][field].preSignedUrl.splice(RemoveIndex, 1);
      this.LEADERSHIP_FRM.fields.leadership[index][field].value.splice(RemoveIndex, 1);
    } else if (RemoveIndex === undefined) {
      this.LEADERSHIP_FRM.fields.leadership[index][field].preSignedUrl = '';
      this.LEADERSHIP_FRM.fields.leadership[index][field].value = '';
    }
    this[form].fields[field] = {
      ...this.LEADERSHIP_FRM.fields.leadership[index][field],
      ...{
        src: '',
        meta: {},
      },
    };
  }

  @action
  resetAffiliatedIssuerForm = () => {
    this.AFFILIATED_ISSUER_FRM = Validator.prepareFormObject(
      AFFILIATED_ISSUER,
      false,
      true,
      false,
      { getOfferingBac: AFFILIATED_ISSUER.getOfferingBac },
    );
    this.initLoad.splice(this.initLoad.indexOf('AFFILIATED_ISSUER_FRM'), 1);
  }

  @action
  removeMedia = (name, index = undefined) => {
    let filename = '';
    if (index === undefined) {
      filename = this.MEDIA_FRM.fields[name].value;
    } else {
      filename = this.MEDIA_FRM.fields[name].value[index];
    }
    commonStore.deleteCdnS3File(`offerings/${this.currentOfferingId}/${this.MEDIA_FRM.fields[name].value}`)
      .then((res) => {
        Helper.toast(`${this.MEDIA_FRM.fields[name].label} removed successfully.`, 'success');
        this.resetFormField('MEDIA_FRM', name, undefined, index);
        this.updateOffering(this.currentOfferingId, this.MEDIA_FRM.fields, 'media', false, false);
      })
      .catch((err) => {
        this.resetFormField('MEDIA_FRM', name, undefined, index);
        this.updateOffering(this.currentOfferingId, this.MEDIA_FRM.fields, 'media', false, false);
        console.log(err);
      });
  }

  @action
  removeMediaForLeadership = (name, index = undefined) => {
    let filename = '';
    if (index === undefined) {
      filename = this.LEADERSHIP_FRM.fields.leadership[index][name].value;
    } else {
      filename = this.LEADERSHIP_FRM.fields.leadership[index][name].value[index];
    }
    commonStore.deleteCdnS3File(`offerings/${this.currentOfferingId}/${this.LEADERSHIP_FRM.fields.leadership[index][name].value}`)
      .then((res) => {
        Helper.toast(`${this.LEADERSHIP_FRM.fields.leadership[index][name].label} removed successfully.`, 'success');
        this.resetFormFieldForLeadership('LEADERSHIP_FRM', name, undefined, index);
        this.updateOffering(this.currentOfferingId, this.LEADERSHIP_FRM.fields, 'leadership', null, true, null, null, true, index);
      })
      .catch((err) => {
        this.resetFormFieldForLeadership('LEADERSHIP_FRM', name, undefined, index);
        this.updateOffering(this.currentOfferingId, this.LEADERSHIP_FRM.fields, 'leadership', null, true, null, null, true, index);
        console.log(err);
      });
  }

  @action
  uploadMedia = (name, form = 'MEDIA_FRM') => {
    const fileObj = {
      obj: this[form].fields[name].base64String,
      name: Helper.sanitize(this[form].fields[name].fileName),
    };
    fileUpload.uploadToS3(fileObj, `offerings/${this.currentOfferingId}`)
      .then((res) => {
        Helper.toast(`${this[form].fields[name].label} uploaded successfully.`, 'success');
        this.resetFormField(form, name, { fileName: fileObj.name, location: res });
        this.updateOffering(this.currentOfferingId, this[form].fields, 'media', false, false);
      })
      .catch(() => {
        Helper.toast('Something went wrong, please try again later.', 'error');
      });
  }

  @action
  uploadMediaForLeadership = (name, form = 'LEADERSHIP_FRM', index) => {
    const fileObj = {
      obj: this[form].fields.leadership[index][name].base64String,
      type: this[form].fields.leadership[index][name].meta.type,
      name: this[form].fields.leadership[index][name].fileName,
    };
    fileUpload.uploadToS3(fileObj, `offerings/${this.currentOfferingId}`)
      .then((res) => {
        Helper.toast(`${this[form].fields.leadership[index][name].label} uploaded successfully.`, 'success');
        this.resetFormFieldForLeadership(form, name, {
          fileName: fileObj.name, location: res,
        }, undefined, index);
        this.updateOffering(this.currentOfferingId, this[form].fields, 'leadership', null, true, null, null, true, index);
      })
      .catch((err) => {
        Helper.toast('Something went wrong, please try again later.', 'error');
        console.log(err);
      });
  }

  @action
  uploadFileToS3 = (form, name, files, key, index, fullPath = false) => {
    let fileField = '';
    if (key) {
      fileField = this[form].fields[key][index][name];
    } else {
      fileField = this[form].fields[name];
    }
    fileField.showLoader = true;
    const fileObj = {
      obj: files[0],
      name: Helper.sanitize(files[0].name),
    };
    fileUpload.uploadToS3(fileObj, `offerings/${this.currentOfferingId}`, fullPath)
      .then(action((res) => {
        Helper.toast('file uploaded successfully', 'success');
        fileField.value = files[0].name;
        fileField.preSignedUrl = res;
        fileField.fileId = `${files[0].name}${Date.now()}`;
        fileField.fileName = `${files[0].name}${Date.now()}`;
      }))
      .catch(action((err) => {
        Helper.toast('Something went wrong, please try again later.', 'error');
        fileField.showLoader = false;
      }))
      .finally(action(() => {
        fileField.showLoader = false;
      }));
  }

  @action
  removeFileFromS3 = (form, name) => {
    commonStore.deleteCdnS3File(`offerings/${this.currentOfferingId}/${this[form].fields[name].value}`)
      .then(action((res) => {
        ['fileId', 'fileName', 'fileData', 'value', 'preSignedUrl'].forEach((subKey) => {
          this[form].fields[name][subKey] = '';
        });
        Helper.toast('file Deleted successfully', 'success');
      }))
      .catch((err) => {
        Helper.toast('Something went wrong, please try again later.', 'error');
      });
  }

  @action
  setContingencyFormSelected = (formName) => {
    this.contingencyFormSelected = formName;
  }

  @action
  toggleConfirmModal = (index, formName = null) => {
    this.confirmModal = !this.confirmModal;
    this.confirmModalName = formName;
    this.removeIndex = this.confirmModal ? index : null;
  }

  @action
  removeData = (formName, subForm = 'data', isApiDelete = false) => {
    const subArray = formName === 'CLOSING_BINDER_FRM' ? 'closingBinder' : subForm;
    if (!isApiDelete) {
      if (['OFFERING_CLOSE_EXPORT_ENVELOPES_FRM', 'CLOSING_BINDER_FRM', 'DATA_ROOM_FRM'].includes(formName)) {
        let removeFileIds = '';
        const { fileId } = this[formName].fields[subArray][this.removeIndex].upload;
        removeFileIds = fileId;
        this.removeFileIdsList = removeFileIds ? [...this.removeFileIdsList, removeFileIds] : [...this.removeFileIdsList];
      }
      this[formName].fields[subArray].splice(this.removeIndex, 1);
    }
    Validator.validateForm(this[formName], true, false, false);
    this.confirmModal = !this.confirmModal;
    this.confirmModalName = null;
    if (subForm === 'leadership') {
      this.leadershipExperience[this.removeIndex] = LEADERSHIP_EXP.employer;
    }
    this.removeIndex = null;
  }

  @action
  offerCreateChange = (formName, field) => {
    if (field !== 'offeringSlug') {
      const { value } = this[formName].fields[field];
      if (field === 'legalBusinessName') {
        this[formName].fields.shorthandBusinessName.value = value;
      }
      this[formName].fields.offeringSlug.value = kebabCase(value);
    }
  }

  @action
  formChange = (e, result, form, isArr = true, type = undefined) => {
    if (result && (result.type === 'checkbox') && !isArr) {
      this[form] = Validator.onChange(
        this[form],
        Validator.pullValues(e, result),
        '',
        true,
        { value: result.checked },
      );
    } else {
      this[form] = Validator.onChange(
        this[form],
        Validator.pullValues(e, result),
        type,
      );
    }
  }

  @action
  verifyExpDate = (date) => {
    this.ADD_NEW_BONUS_REWARD_FRM = Validator.onChange(
      this.ADD_NEW_BONUS_REWARD_FRM,
      { name: 'expirationDate', value: date },
    );
  };

  @action
  formArrayChange = (e, result, form, subForm = '', index, index2) => {
    if (result && (result.type === 'checkbox')) {
      this[form] = Validator.onArrayFieldChange(
        this[form],
        Validator.pullValues(e, result),
        subForm,
        index,
        '',
        { value: result.checked },
      );
    } else {
      this[form] = Validator.onArrayFieldChange(
        this[form],
        Validator.pullValues(e, result),
        subForm,
        index,
      );
      if (form === 'LEADERSHIP_EXP_FRM') {
        this.leadershipExperience[index2] = this[form];
      }
    }
  }

  @action
  rtEditorChange = (field, value, form, ref, index = undefined) => {
    if (index !== undefined) {
      this[form].fields[ref][index][field].value = value;
    } else {
      this[form].fields[field].value = value;
      this[form] = Validator.validateForm(this[form], true, false, false);
    }
  }

  @action
  formChangeWithIndex = (e, result, form, index) => {
    this[form] = Validator.onArrayFieldChange(
      this[form],
      Validator.pullValues(e, result), 'data', index,
    );
  }

  @action
  maskChange = (values, form, field) => {
    const cMap = ['launchDate', 'processingDate', 'terminationDate', 'expirationDate', 'targetDate', 'expectedOpsDate', 'notePurchaseDate', 'maturityDate', 'hardCloseDate', 'anticipatedPaymentStartDate'];
    const fieldValue = (cMap.includes(field)) ? values.formattedValue : values.floatValue;
    this[form] = Validator.onChange(
      this[form],
      { name: field, value: fieldValue },
    );
  }

  @action
  maskArrayChange = (values, form, field, subForm = '', index, index2) => {
    const fieldValue = includes(['maturityDate', 'dob', 'dateOfService', 'dlExpirationDate', 'dlIssuedDate'], field) ? values.formattedValue : includes(['maturity', 'startupPeriod'], field) ? Math.abs(values.floatValue) || '' : includes(['interestRate', 'ssn'], field) ? values.value : values.floatValue;
    if (form === 'KEY_TERMS_FRM' && includes(['minOfferingAmount506', 'maxOfferingAmount506'], field)) {
      this[form] = Validator.onArrayFieldChange(
        this[form],
        { name: field, value: fieldValue }, subForm, index,
      );
      this[form] = Validator.onArrayFieldChange(
        this[form],
        { name: `${field}C`, value: fieldValue }, subForm, index,
      );
    } else if (!includes(['minOfferingAmount506C', 'maxOfferingAmount506C'], field)) {
      this[form] = Validator.onArrayFieldChange(
        this[form],
        { name: field, value: fieldValue }, subForm, index,
      );
    }

    if (form === 'LEADERSHIP_EXP_FRM') {
      this.leadershipExperience[index2] = this[form];
    }
  }

  @action
  maskChangeWithIndex = (values, form, field, index) => {
    this[form] = Validator.onArrayFieldChange(
      this[form],
      { name: field, value: values.floatValue }, 'data', index,
    );
  }

  @action
  setFormFileArray = (formName, arrayName, field, getField, value, index = undefined) => {
    if (index !== undefined && arrayName) {
      this[formName].fields[arrayName][index][field][getField] = value;
    } else if (index !== null) {
      if (getField === 'error' || getField === 'showLoader') {
        this[formName].fields[field][getField] = value;
      } else {
        this[formName].fields[field][getField].splice(index, 1);
      }
    } else if (Array.isArray(toJS(this[formName].fields[field][getField]))) {
      this[formName].fields[field][getField].push(value);
    } else {
      this[formName].fields[field][getField] = value;
    }
  }

  @action
  setFileUploadDataMulitple =
    (form, arrayName, field, files, stepName, index = null, multiForm = false) => {
      if (typeof files !== 'undefined' && files.length) {
        forEach(files, (file) => {
          const fileData = Helper.getFormattedFileData(file);
          this.isUploadingFile = true;
          this.setFormFileArray(form, arrayName, field, 'showLoader', true, index);
          fileUpload.setFileUploadData('', fileData, stepName, 'ADMIN', '', this.currentOfferingId).then((result) => {
            const { fileId, preSignedUrl } = result.data.createUploadEntry;
            fileUpload.putUploadedFileOnS3({ preSignedUrl, fileData: file, fileType: fileData.fileType }).then(action(() => {
              this.setFormFileArray(form, arrayName, field, 'fileData', file, index);
              this.setFormFileArray(form, arrayName, field, 'preSignedUrl', preSignedUrl, index);
              this.setFormFileArray(form, arrayName, field, 'fileId', fileId, index);
              this.setFormFileArray(form, arrayName, field, 'value', fileData.fileName, index);
              this.setFormFileArray(form, arrayName, field, 'error', undefined, index);
              this.checkFormValid(form, multiForm);
              this.setFormFileArray(form, arrayName, field, 'showLoader', false, index);
              this.isUploadingFile = false;
            })).catch(action((error) => {
              Helper.toast('Something went wrong, please try again later.', 'error');
              uiStore.setErrors(error.message);
              this.isUploadingFile = false;
              this.setFormFileArray(form, arrayName, field, 'showLoader', false, index);
            }));
          }).catch(action((error) => {
            Helper.toast('Something went wrong, please try again later.', 'error');
            this.isUploadingFile = false;
            this.setFormFileArray(form, arrayName, field, 'showLoader', false, index);
            uiStore.setErrors(error.message);
          }));
        });
      }
    }

  @action
  removeUploadedDataMultiple = (form, field, index = null, arrayName, fromS3 = false) => {
    if (fromS3) {
      let removeFileNames = '';
      if (index !== null && arrayName) {
        const { value } = this[form].fields[arrayName][index][field];
        removeFileNames = value;
      } else if (index !== null) {
        const { value } = this[form].fields[field];
        removeFileNames = value[index];
      } else {
        const { value } = this[form].fields[field];
        removeFileNames = value;
      }
      this.removeFileNamesList = [...this.removeFileNamesList, removeFileNames];
      this.setFormFileArray(form, arrayName, field, 'fileName', '', index);
    } else {
      let removeFileIds = '';
      if (index !== null && arrayName) {
        const { fileId } = this[form].fields[arrayName][index][field];
        removeFileIds = fileId;
      } else if (index !== null) {
        const filesId = this[form].fields[field].fileId;
        removeFileIds = filesId[index];
      } else {
        const { fileId } = this[form].fields[field];
        removeFileIds = fileId;
      }
      this.removeFileIdsList = [...this.removeFileIdsList, removeFileIds];
      this.setFormFileArray(form, arrayName, field, 'fileId', '', index);
    }
    this.setFormFileArray(form, arrayName, field, 'fileData', '', index);
    this.setFormFileArray(form, arrayName, field, 'value', '', index);
    this.setFormFileArray(form, arrayName, field, 'error', undefined, index);
    this.setFormFileArray(form, arrayName, field, 'showLoader', false, index);
    this.setFormFileArray(form, arrayName, field, 'preSignedUrl', '', index);
    const multiForm = this.getActionType(form, 'isMultiForm');
    this.checkFormValid(form, multiForm);
  }

  @action
  removeUploadedFiles = (fromS3) => {
    if (fromS3) {
      const fileList = toJS(this.removeFileNamesList);
      if (fileList.length) {
        forEach(fileList, (fileName) => {
          commonStore.deleteCdnS3File(`offerings/${this.currentOfferingId}/${fileName}`).then(() => {
          }).catch((error) => {
            uiStore.setErrors(error.message);
          });
        });
        this.removeFileNamesList = [];
      }
    } else {
      const fileList = toJS(this.removeFileIdsList);
      if (fileList.length) {
        forEach(fileList, (fileId) => {
          fileUpload.removeUploadedData(fileId).then(() => {
          }).catch((error) => {
            uiStore.setErrors(error.message);
          });
        });
        this.removeFileIdsList = [];
      }
    }
  }

  @action
  setFileUploadData = (form, field, files, subForm = '', index = null, stepName, updateOnUpload = false, isMultiform = false) => {
    if (stepName) {
      uiStore.setProgress();
      const file = files[0];
      const fileData = Helper.getFormattedFileData(file);
      if (this[form].fields[field].showLoader !== undefined) {
        this[form].fields[field].showLoader = true;
      }
      fileUpload.setFileUploadData('', fileData, stepName, 'ADMIN', '', this.currentOfferingId).then(action((result) => {
        const { fileId, preSignedUrl } = result.data.createUploadEntry;
        this[form].fields[field].fileId = fileId;
        this[form].fields[field].preSignedUrl = preSignedUrl;
        this[form].fields[field].fileData = file;
        if (index !== null || isMultiform) {
          this[form] = Validator.onArrayFieldChange(
            this[form],
            { name: field, value: fileData.fileName }, subForm, index,
          );
        } else {
          this[form] = Validator.onChange(
            this[form],
            { name: field, value: fileData.fileName },
          );
        }
        fileUpload.putUploadedFileOnS3({ preSignedUrl, fileData: file, fileType: fileData.fileType })
          .then(() => {
            if (updateOnUpload) {
              this.updateOffering(this.currentOfferingId, this.ADMIN_DOCUMENTATION_FRM.fields, 'legal', 'admin', true, `${this[form].fields[field].label} uploaded successfully.`);
            }
          })
          .catch((err) => {
            Helper.toast('Something went wrong, please try again later.', 'error');
            uiStore.setErrors(DataFormatter.getSimpleErr(err));
          })
          .finally(action(() => {
            uiStore.setProgress(false);
            if (this[form].fields[field].showLoader !== undefined) {
              this[form].fields[field].showLoader = false;
            }
          }));
      }));
    } else {
      const file = files[0];
      const fileData = Helper.getFormattedFileData(file);
      if (index !== null) {
        this[form] = Validator.onArrayFieldChange(
          this[form],
          { name: field, value: fileData.fileName }, subForm, index,
        );
      } else {
        this[form] = Validator.onChange(
          this[form],
          { name: field, value: fileData.fileName },
        );
      }
    }
  }

  @action
  removeUploadedData = (form, subForm = 'data', field, index = null, stepName, updateOnRemove = false) => {
    if (stepName) {
      const { fileId } = this[form].fields[field];
      if (this[form].fields[field].showLoader !== undefined) {
        this[form].fields[field].showLoader = true;
      }
      fileUpload.removeUploadedData(fileId).then(action(() => {
        this[form] = Validator.onChange(
          this[form],
          { name: field, value: '' },
        );
        this[form].fields[field].fileId = '';
        this[form].fields[field].preSignedUrl = '';
        if (updateOnRemove) {
          this.updateOffering(this.currentOfferingId, this.ADMIN_DOCUMENTATION_FRM.fields, 'legal', 'admin', true, `${this[form].fields[field].label} Removed successfully.`);
        }
      }))
        .catch(() => { })
        .finally(action(() => {
          uiStore.setProgress(false);
          if (this[form].fields[field].showLoader !== undefined) {
            this[form].fields[field].showLoader = false;
          }
        }));
    } else if (index !== null) {
      this[form] = Validator.onArrayFieldChange(
        this[form],
        { name: field, value: '' }, subForm, index,
      );
    } else {
      this[form] = Validator.onChange(
        this[form],
        { name: field, value: '' },
      );
    }
  }

  getMetaData = (metaData) => {
    const metaDataMapping = {
      LAUNCH_CONTITNGENCIES_FRM: CONTINGENCIES,
      CLOSING_CONTITNGENCIES_FRM: CONTINGENCIES,
      LEADERSHIP_FRM: LEADERSHIP,
      GENERAL_FRM: GENERAL,
      AFFILIATED_ISSUER_FRM: AFFILIATED_ISSUER,
      LEADER_FRM: LEADER,
      OFFERING_COMPANY_FRM: OFFERING_COMPANY,
    };
    return metaDataMapping[metaData];
  }

  @action
  addMore = (form, key, count = 1) => {
    this[form] = Validator.addMoreRecordToSubSection(this[form], key, count, true);
    if (form === 'DATA_ROOM_FRM' && key === 'documents') {
      this[form].fields[key][this[form].fields[key].length - 1].upload.showLoader = false;
    } else if (form === 'LEADER_FRM') {
      this.initLoad.push('LEADERS_ADDED');
    }
  }

  @action
  setContingencyDataOnAdd = (formName, arrayKey) => {
    const { fields } = this.ADD_NEW_CONTINGENCY_FRM;
    const dataLength = this[formName].fields[arrayKey].length;
    this[formName].fields[arrayKey][dataLength - 1].contingency.value = fields.contingency.value;
    this[formName].fields[arrayKey][dataLength - 1].acceptance.value = fields.acceptance.value;
    Validator.resetFormData(this.ADD_NEW_CONTINGENCY_FRM);
  }

  @action
  setAddressFields = (place, index) => {
    Validator.setAddressFieldsIndex(place, this.LEADERSHIP_FRM, 'LEADERSHIP_FRM', 'leadership', index, true, US_STATES);
  }


  @action
  setLeadershipExpData = (index) => {
    const formData = Validator.evaluateFormData(toJS(this.leadershipExperience[index]).fields);
    this.LEADERSHIP_EXP_FRM = Validator.prepareFormObject(LEADERSHIP_EXP);
    this.LEADERSHIP_EXP_FRM = Validator.setFormData(this.LEADERSHIP_EXP_FRM, formData);
    this.LEADERSHIP_EXP_FRM = Validator.validateForm(this.LEADERSHIP_EXP_FRM, true, false, false);
  }

  /*
  *  Set form data
  */
  @action
  setFormData = (form, ref, keepAtLeastOne) => {
    this.resetForm(form);
    let { offer } = offeringsStore;
    if (!offer) {
      return false;
    }
    offer = Helper.replaceKeysDeep(toJS(offer), { aliasId: 'id' });
    offer = {
      ...offer,
      closureSummary: Helper.replaceKeysDeep(toJS(get(offer, 'closureSummary')), { aliasAccreditedOnly: 'accreditedOnly' }),
      closingBinder: Helper.replaceKeysDeep(toJS(get(offer, 'closingBinder')), { aliasAccreditedOnly: 'accreditedOnly' }),
    };
    if (form === 'MEDIA_FRM') {
      this.MEDIA_FRM = Validator.prepareFormObject(MEDIA);
    }
    this[form] = Validator.setFormData(this[form], offer, ref, keepAtLeastOne);
    this.initLoad.push(form);
    if (form === 'KEY_TERMS_FRM') {
      this.KEY_TERMS_FRM.fields.regulation.value = offer.regulation;
    }
    if (form === 'COMPANY_LAUNCH_FRM' && get(offer, 'goldstar')) {
      ['contactId', 'esAccountNumber', 'isin', 'sfAccountNumber', 'esAccountNumberRegD', 'isinRegD', 'sfAccountNumberRegD'].forEach((f) => {
        this.COMPANY_LAUNCH_FRM.fields[f].value = get(offer, `goldstar.${f}`);
      });
    }
    if (form === 'LEADERSHIP_FRM') {
      forEach(offer.leadership, (emp, key) => {
        this.LEADERSHIP_EXP_FRM = Validator.setFormData(
          this.LEADERSHIP_EXP_FRM,
          offer.leadership[key],
          ref, keepAtLeastOne,
        );
        this.leadershipExperience[key] = this.LEADERSHIP_EXP_FRM;
      });
    } else if (form === 'RISK_FACTORS_FRM') {
      this.stringTemplateFormatting(
        'RISK_FACTORS_FRM',
        {
          location: offer && offer.keyTerms ? `${offer.keyTerms.city || ''} ${offer.keyTerms.state || ''}` : '',
          industry: offer && offer.keyTerms ? `${INDUSTRY_TYPES[offer.keyTerms.industry] || ''}` : '',
          shorthand_name: offer && offer.keyTerms ? `${offer.keyTerms.shorthandBusinessName || ''}` : '',
          state_of_formation: offer && offer.keyTerms ? `${offer.keyTerms.stateOfFormation || ''}` : '',
        },
      );
    }
    const multiForm = this.getActionType(form, 'isMultiForm');
    this.checkFormValid(form, multiForm, false);
    return false;
  }

  @action
  stringTemplateFormatting = (form, data) => {
    const currentForm = this[form];
    forEach(currentForm.fields, (field, key) => {
      if (has(field, 'defaultValue') && form === 'RISK_FACTORS_FRM') {
        this[form].fields[key].defaultValue = DataFormatter.stringTemplateFormatting(field.defaultValue, data);
      }
    });
  }

  getActionType = (formName, getField = 'actionType') => {
    const metaDataMapping = {
      MEDIA_FRM: { isMultiForm: false },
      KEY_TERMS_FRM: { isMultiForm: true },
      OFFERING_OVERVIEW_FRM: { isMultiForm: true },
      OFFERING_COMPANY_FRM: { isMultiForm: true },
      OFFERING_MISC_FRM: { isMultiForm: false },
      COMPANY_LAUNCH_FRM: { isMultiForm: false },
      CLOSURE_SUMMARY_FRM: { isMultiForm: false },
      LAUNCH_CONTITNGENCIES_FRM: { isMultiForm: true },
      CLOSING_CONTITNGENCIES_FRM: { isMultiForm: true },
      OFFERING_DETAILS_FRM: { isMultiForm: false },
      OFFERING_CLOSE_FRM: { isMultiForm: false },
      LEADERSHIP_FRM: { isMultiForm: true },
      LEADERSHIP_EXP_FRM: { isMultiForm: true },
      AFFILIATED_ISSUER_FRM: { isMultiForm: true },
      LEADER_FRM: { isMultiForm: true },
      GENERAL_FRM: { isMultiForm: true },
      ISSUER_FRM: { isMultiForm: false },
      RISK_FACTORS_FRM: { isMultiForm: false },
      DOCUMENTATION_FRM: { isMultiForm: false },
      ADMIN_DOCUMENTATION_FRM: { isMultiForm: false },
      DATA_ROOM_FRM: { isMultiForm: true },
      CLOSING_BINDER_FRM: { isMultiForm: true },
      POC_DETAILS_FRM: { isMultiForm: false },
      OFFERING_CLOSE_1: { isMultiForm: false },
      OFFERING_CLOSE_EXPORT_ENVELOPES_FRM: { isMultiForm: true },
    };
    return metaDataMapping[formName][getField];
  }

  @action
  checkFormValid = (form, multiForm, showErrors) => {
    this[form] = Validator.validateForm(this[form], multiForm, showErrors, false);
  }

  @action
  setBacFormData = (form, data, ref) => {
    if (!this.initLoad.includes(form)) {
      this.initLoad.push(form);
      this[form] = Validator.setFormData(this[form], data, ref);
    }
  }

  @action
  evaluateFormFieldToArray = (fields) => {
    const social = [];
    const highlight = [];
    map(fields, (ele, key) => {
      try {
        const records = toJS(fields[key]);
        if (fields[key].ArrayObjItem) {
          const toObj = social.find(obj => obj.type === records.type);
          if (toObj) {
            if (key === `${records.type}_url`) {
              toObj.url = records.value || null;
            }
            if (key === `${records.type}_shareLink`) {
              toObj.shareLink = records.value || null;
            }
            if (key === `${records.type}_blurb`) {
              toObj.blurb = records.value || null;
            }
            if (key === `${records.type}_featuredImageUpload`) {
              toObj.featuredImageUpload = {
                id: records.fileId,
                url: records.preSignedUrl,
                fileName: records.value,
                isPublic: true,
              };
            }
          } else {
            const object = {};
            object.type = records.type;
            if (key === `${records.type}_url`) {
              object.url = records.value || null;
            }
            if (key === `${records.type}_shareLink`) {
              object.shareLink = records.value || null;
            }
            if (key === `${records.type}_blurb`) {
              object.blurb = records.value || null;
            }
            if (key === `${records.type}_featuredImageUpload`) {
              object.featuredImageUpload = {
                id: records.fileId,
                url: records.preSignedUrl,
                fileName: records.fileName,
                isPublic: true,
              };
            }
            social.push(object);
          }
        }
        if (Array.isArray(toJS(fields[key]))) {
          records.forEach((field) => {
            highlight.push(field.highlight.value);
          });
        }
      } catch (e) {
        console.log(e);
      }
    });
    return { social, highlight };
  }

  generateActivityHistory = (resourceId, activityType, activityTitle, subType) => {
    const payload = {
      resourceId,
      activityType,
      activityTitle,
      subType,
      scope: ACTIVITY_HISTORY_SCOPE.DEV,
    };
    activityHistoryStore.createActivityHistory(payload);
  }

  addNewOffer = () => {
    const offeringDetails = Validator.evaluateFormData(this.NEW_OFFER_FRM.fields);
    uiStore.addMoreInProgressArray('upsert');
    client
      .mutate({
        mutation: upsertOffering,
        variables: { offeringDetails },
      })
      .then((res) => {
        uiStore.removeOneFromProgressArray(false);
        offeringsStore.addNewOne(res.data.upsertOffering, 'creation');
        this.generateActivityHistory(res.data.upsertOffering.id, ACTIVITY_HISTORY_TYPES.CREATION, 'Application Created by Admin.', 'STARTED');
        Helper.toast('Offering created successfully.', 'success');
      })
      .catch(() => {
        uiStore.removeOneFromProgressArray(false);
        Helper.toast('Error while creating offer', 'error');
      });
  }

  @action
  updateOfferingMutation = (
    id,
    payload, keyName, notify = true,
    successMsg = undefined, fromS3 = false, res, rej, msgType = 'success', isLaunchContingency = false, approvedObj, emptyPayload = null,
  ) => {
    uiStore.setProgress(approvedObj && approvedObj.status ? approvedObj.status : 'save');
    const variables = {
      id,
      offeringDetails: payload,
    };
    if (keyName === 'editPocForm') {
      variables.issuerId = this.POC_DETAILS_FRM.fields.issuerId.value;
      if (this.POC_DETAILS_FRM.fields.id.value) {
        variables.adminId = this.POC_DETAILS_FRM.fields.id.value;
      }
    }
    if (emptyPayload) {
      variables.offeringDetails = { ...variables.offeringDetails, ...emptyPayload };
    }
    client
      .mutate({
        mutation: updateOffering,
        variables,
      })
      .then((result) => {
        let upatedOffering = null;
        if (get(result, 'data.updateOffering')) {
          upatedOffering = Helper.replaceKeysDeep(toJS(get(result, 'data.updateOffering')), { aliasId: 'id', aliasAccreditedOnly: 'isVisible' });
          offeringsStore.updateOfferingList(id, upatedOffering, keyName);
        }
        this.removeUploadedFiles(fromS3);
        if (successMsg) {
          Helper.toast(`${successMsg}`, msgType);
        } else if (notify) {
          Helper.toast(`${startCase(keyName) || 'Offering'} has been saved successfully.`, 'success');
        }
        offeringsStore.getOne(id, false);
        if (keyName === 'contingencies' && successMsg === null) {
          const activityTitle = isLaunchContingency ? 'All launch contingencies have been signed off' : 'All close contingencies have been signed off';
          this.generateActivityHistory(id, ACTIVITY_HISTORY_TYPES.OFFERING, activityTitle, isLaunchContingency ? 'LAUNCH_CONTINGENCIES' : 'CLOSE_CONTINGENCIES');
        } else if (keyName === 'offering' && successMsg === null) {
          const activityTitle = `Issuer has confirmed the launch (${variables.offeringDetails.offering.launch.targetDate}), close (${variables.offeringDetails.offering.launch.terminationDate}), and expected opening (${variables.offeringDetails.offering.launch.expectedOpsDate}) dates`;
          this.generateActivityHistory(id, ACTIVITY_HISTORY_TYPES.OFFERING, activityTitle, 'LAUNCH_CONFIRMATION');
        } else if (keyName === false && payload.stage === 'LIVE') {
          this.generateActivityHistory(id, ACTIVITY_HISTORY_TYPES.LIVE, 'Application launched!', 'LAUNCHED');
        }
        res();
      })
      .catch((err) => {
        uiStore.setErrors(DataFormatter.getSimpleErr(err));
        console.log('Error', err);
        Helper.toast('Something went wrong.', 'error');
        rej();
      })
      .finally(() => {
        uiStore.setProgress(false);
      });
  }

  // eslint-disable-next-line consistent-return
  mergeCustomize = (objValue, srcValue, key, object, source, stack) => {
    if (OFFERING_CREATION_ARRAY_KEY_LIST.includes(key)) {
      return srcValue;
    } if (srcValue === undefined || srcValue === null || srcValue === '') {
      return null;
    }
  };

  @action
  updateOffering = (
    id,
    fields, keyName, subKey, notify = true, successMsg = undefined,
    approvedObj, fromS3 = false, leaderIndex,
    msgType = 'success', isLaunchContingency = false,
  ) => new Promise((res, rej) => {
    let { getOfferingById } = offeringsStore.offerData.data;
    getOfferingById = Helper.replaceKeysDeep(toJS(getOfferingById), { aliasId: 'id', aliasAccreditedOnly: 'isVisible' });
    let payloadData = {
      applicationId: getOfferingById.applicationId,
      issuerId: getOfferingById.issuerId,
    };
    const { firstName, lastName } = userDetailsStore.userDetails.info;
    if (keyName) {
      if (keyName === 'legal') {
        payloadData[keyName] = {};
        payloadData[keyName].general = Validator.evaluateFormData(this.GENERAL_FRM.fields);
        payloadData[keyName].riskFactors = Validator.evaluateFormData(this.RISK_FACTORS_FRM.fields);
        payloadData[keyName].documentation = {};
        payloadData[keyName].documentation.issuer = {};
        payloadData[keyName].documentation.issuer = Validator.evaluateFormData(this.DOCUMENTATION_FRM.fields);
        payloadData[keyName].documentation.admin = {};
        payloadData[keyName].documentation.admin = Validator.evaluateFormData(this.ADMIN_DOCUMENTATION_FRM.fields);
        const dataRoomDocs = Validator.evaluateFormData(this.DATA_ROOM_FRM.fields).documents || [];
        const finalDataRoomDocs = [];
        dataRoomDocs.map((data, index) => {
          if (data.name !== '' || data.upload.fileId !== '') {
            finalDataRoomDocs.push(data);
          }
          return finalDataRoomDocs;
        });
        payloadData[keyName].dataroom = { documents: finalDataRoomDocs };
      } else if (keyName === 'offering') {
        payloadData[keyName] = {};
        payloadData[keyName].about = Validator.evaluateFormData(this.OFFERING_COMPANY_FRM.fields);
        payloadData[keyName].launch = Validator.evaluateFormData(this.COMPANY_LAUNCH_FRM.fields);
        payloadData[keyName].misc = Validator.evaluateFormData(this.OFFERING_MISC_FRM.fields);
        payloadData[keyName].overview = Validator.evaluateFormData(this.OFFERING_OVERVIEW_FRM.fields);
        payloadData[keyName].overview = {
          ...payloadData[keyName].overview,
          ...this.evaluateFormFieldToArray(this.OFFERING_OVERVIEW_FRM.fields),
        };
        if (subKey === 'launch') {
          const closureSummary = { ...getOfferingById.closureSummary };
          closureSummary.processingDate = get(payloadData[keyName].launch, 'terminationDate') || null;
          closureSummary.launchDate = get(payloadData[keyName].launch, 'targetDate') || null;
          payloadData.closureSummary = closureSummary;
          payloadData.closureSummary = mergeWith(
            toJS(getOfferingById.closureSummary),
            payloadData.closureSummary,
            this.mergeCustomize,
          );
          payloadData.closureSummary = omitDeep(payloadData.closureSummary, ['__typename', 'fileHandle']);
          payloadData.closureSummary = cleanDeep(payloadData.closureSummary);
        }
        if (get(payloadData, 'offering.launch.goldstar')) {
          payloadData.goldstar = { ...get(payloadData, 'offering.launch.goldstar') };
          payloadData.offering.launch.goldstar = undefined;
        }
      } else if (keyName === 'media') {
        payloadData = { ...payloadData, [keyName]: Validator.evaluateFormData(fields) };
      } else if (keyName === 'leadership') {
        let leadershipFields = Validator.evaluateFormData(fields);
        leadershipFields = leadershipFields.leadership.map((leadership, index) => {
          const employer = Validator.evaluateFormData(toJS(this.leadershipExperience[index]).fields);
          return { ...leadership, ...{ employer: employer.employer } };
        });
        payloadData = { ...payloadData, [keyName]: leadershipFields };
      } else if (keyName === 'editForm') {
        payloadData.closureSummary = Validator.evaluateFormData(this.CLOSURE_SUMMARY_FRM.fields);
        payloadData = {
          ...payloadData,
          keyTerms: Validator.evaluateFormData(this.KEY_TERMS_FRM.fields),
        };
        payloadData.keyTerms = mergeWith(
          toJS(getOfferingById.keyTerms),
          payloadData.keyTerms,
          this.mergeCustomize,
        );
        payloadData.closureSummary = mergeWith(
          toJS(getOfferingById.closureSummary),
          payloadData.closureSummary,
          this.mergeCustomize,
        );
        payloadData.keyTerms = omitDeep(payloadData.keyTerms, ['__typename', 'fileHandle']);
        payloadData.keyTerms = cleanDeep(payloadData.keyTerms);
        payloadData.closureSummary = omitDeep(payloadData.closureSummary, ['__typename', 'fileHandle']);
        payloadData.closureSummary = cleanDeep(payloadData.closureSummary);
      } else if (keyName === 'editPocForm') {
        if (get(getOfferingById, 'stage') === 'CREATION' && this.POC_DETAILS_FRM.fields.targetDate.value) {
          payloadData.closureSummary = {};
          payloadData.closureSummary.launchDate = this.POC_DETAILS_FRM.fields.targetDate.value;
          payloadData.closureSummary = mergeWith(
            toJS(getOfferingById.closureSummary),
            payloadData.closureSummary,
            this.mergeCustomize,
          );
          payloadData.closureSummary = omitDeep(payloadData.closureSummary, ['__typename', 'fileHandle']);
          payloadData.closureSummary = cleanDeep(payloadData.closureSummary);
        }
      } else if (keyName === 'BonusRewardTier') {
        const rewardsTiersData = getOfferingById.rewardsTiers || [];
        const isEarlyBirds = fields.isEarlyBirds.value;
        if (!subKey) {
          if (isEarlyBirds.length) {
            payloadData.earlyBird = {
              amount: fields.amountForEarlyBird.value,
              quantity: fields.earlyBirdQuantity.value,
              available: fields.earlyBirdQuantity.value,
            };
          } else {
            rewardsTiersData.push(fields.amountForThisTier.value);
            payloadData.rewardsTiers = sortBy(rewardsTiersData);
          }
        } else if (subKey.earlyBirdQuantity > 0) {
          payloadData.earlyBird = null;
        } else {
          payloadData.rewardsTiers = sortBy(rewardsTiersData.filter(r => r !== subKey.amount));
        }
      } else {
        payloadData = { ...payloadData, [keyName]: Validator.evaluateFormData(fields) };
      }
    } else {
      payloadData = { ...payloadData, ...Validator.evaluateFormData(fields) };
    }
    if (keyName === 'keyTerms') {
      payloadData.regulation = this.KEY_TERMS_FRM.fields.regulation.value;
      const closureSummary = { ...getOfferingById.closureSummary };
      const keyTerms = Validator.evaluateFormData(this.CLOSURE_SUMMARY_FRM.fields);
      closureSummary.keyTerms = { ...closureSummary.keyTerms, priceCalculation: keyTerms.priceCalculation, multiple: keyTerms.multiple, interestRate: get(payloadData, 'keyTerms.interestRate') };
      payloadData.closureSummary = closureSummary;
      payloadData.closureSummary = mergeWith(
        toJS(getOfferingById.closureSummary),
        payloadData.closureSummary,
        this.mergeCustomize,
      );
      payloadData.closureSummary = omitDeep(payloadData.closureSummary, ['__typename', 'fileHandle']);
      payloadData.closureSummary = cleanDeep(payloadData.closureSummary);
    }
    if (keyName !== 'BonusRewardTier' && keyName !== 'contingencies' && keyName !== 'editForm' && keyName !== 'editPocForm') {
      const payLoadDataOld = keyName ? subKey ? subKey === 'issuer' ? payloadData[keyName].documentation[subKey] : payloadData[keyName][subKey]
        : keyName === 'leadership' ? payloadData[keyName][leaderIndex] : payloadData[keyName] : payloadData;
      if (approvedObj !== null && approvedObj && approvedObj.isApproved) {
        if (approvedObj.status === 'manager_approved' || approvedObj.status === 'manager_edit') {
          payLoadDataOld.approved = {
            id: userDetailsStore.userDetails.id,
            by: `${firstName} ${lastName}`,
            date: moment().toISOString(),
            status: approvedObj.status === 'manager_approved',
          };
        } else if (approvedObj.status === 'support_submitted') {
          payLoadDataOld.submitted = {
            id: userDetailsStore.userDetails.id,
            by: `${firstName} ${lastName}`,
            date: moment().toISOString(),
          };
          if ((!payLoadDataOld.issuerSubmitted || payLoadDataOld.issuerSubmitted === '') && !approvedObj.isAdminOnly) {
            payLoadDataOld.issuerSubmitted = moment().toISOString();
          }
        } else if (approvedObj.status === 'issuer_submitted') {
          payLoadDataOld.issuerSubmitted = moment().toISOString();
        } else if (approvedObj.status === 'support_decline') {
          payLoadDataOld.approved = {
            id: userDetailsStore.userDetails.id,
            by: `${firstName} ${lastName}`,
            date: moment().toISOString(),
            status: false,
          };
          payLoadDataOld.submitted = null;
        } else if (approvedObj.status === 'issuer_decline') {
          payLoadDataOld.issuerSubmitted = '';
        }
      }
      if (keyName) {
        if (subKey) {
          if (subKey === 'issuer') {
            payloadData[keyName].documentation[subKey] = payLoadDataOld;
          } else {
            payloadData[keyName][subKey] = payLoadDataOld;
          }
        } else if (keyName === 'leadership') {
          payloadData[keyName][leaderIndex] = payLoadDataOld;
        } else {
          payloadData[keyName] = payLoadDataOld;
        }
      } else {
        payloadData = payLoadDataOld;
      }
      if (keyName) {
        if (keyName === 'leadership') {
          const leaders = [];
          forEach(payloadData[keyName], (ele, index) => {
            if (!this.removeIndex || this.removeIndex !== index) {
              leaders.push(mergeWith(
                toJS(getOfferingById[keyName] && getOfferingById[keyName].length
                  > index ? getOfferingById[keyName][index] : {}),
                payloadData[keyName][index],
                this.mergeCustomize,
              ));
            }
          });
          this.removeIndex = null;
          this.confirmModal = null;
          payloadData[keyName] = leaders;
        } else {
          payloadData[keyName] = mergeWith(
            getOfferingById[keyName],
            payloadData[keyName],
            this.mergeCustomize,
          );
        }
        payloadData[keyName] = omitDeep(payloadData[keyName], ['__typename', 'fileHandle']);
        if (keyName === 'keyTerms' && payloadData[keyName].uploadProformas) {
          const uploadProformas = {
            fileId: payloadData[keyName].uploadProformas.fileId,
            fileName: payloadData[keyName].uploadProformas.fileName,
          };
          payloadData[keyName] = omitDeep(payloadData[keyName], ['uploadProformas']);
          payloadData[keyName].uploadProformas = { ...uploadProformas };
        }
        payloadData[keyName] = cleanDeep(payloadData[keyName]);
      }
    } else if (keyName === 'contingencies') {
      ['launch', 'close'].forEach((c) => {
        forEach(payloadData.contingencies[c], (con, index) => {
          payloadData.contingencies[c][index].accepted = {
            ...payloadData.contingencies[c][index].accepted,
            id: userDetailsStore.userDetails.id,
            by: `${firstName} ${lastName}`,
            date: moment().toISOString(),
          };
        });
      });
    }
    this.updateOfferingMutation(
      id, payloadData, keyName, notify, successMsg,
      fromS3, res, rej, msgType, isLaunchContingency, approvedObj,
    );
  });

  @action
  getOfferingBac = (offeringId, bacType) => {
    this.issuerOfferingBac = graphql({
      client,
      query: getOfferingBac,
      fetchPolicy: 'network-only',
      variables: { offeringId, bacType },
      onFetch: (res) => {
        if (res && res.getOfferingBac && !this.issuerOfferingBac.loading && !this.isListingPage) {
          this.setBacFormData('ISSUER_FRM', res.getOfferingBac[0] || {});
        }
      },
    });
  }

  @computed get issuerOfferingBacData() {
    return (this.issuerOfferingBac && this.issuerOfferingBac.data
      && toJS(this.issuerOfferingBac.data.getOfferingBac)) || null;
  }

  @action
  getAffiliatedIssuerOfferingBac = (offeringId, bacType) => {
    this.affiliatedIssuerOfferingBac = graphql({
      client,
      fetchPolicy: 'network-only',
      query: getOfferingBac,
      variables: { offeringId, bacType },
      onFetch: (res) => {
        if (res && res.getOfferingBac && !this.affiliatedIssuerOfferingBac.loading && !this.isListingPage) {
          this.setBacFormData('AFFILIATED_ISSUER_FRM', res || {});
        }
      },
    });
  }

  @computed get affiliatedIssuerOfferingBacData() {
    return (this.affiliatedIssuerOfferingBac && this.affiliatedIssuerOfferingBac.data
      && toJS(this.affiliatedIssuerOfferingBac.data.getOfferingBac)) || null;
  }

  @action
  getLeadershipOfferingBac = (offeringId, bacType) => {
    uiStore.addMoreInProgressArray('getLeadershipOfferingBac');
    this.leaderShipOfferingBac = graphql({
      client,
      fetchPolicy: 'network-only',
      query: getOfferingBac,
      variables: { offeringId, bacType },
      onFetch: (res) => {
        if (res && res.getOfferingBac && !this.leaderShipOfferingBac.loading) {
          this.setBacFormData('LEADER_FRM', res || {}, false);
          const leadersCount = this.LEADERSHIP_FRM.fields.leadership.length;
          if (leadersCount
            !== this.LEADER_FRM.fields.getOfferingBac.length && (leadersCount - 1 !== 0)) {
            this.addMore('LEADER_FRM', 'getOfferingBac', leadersCount - this.LEADER_FRM.fields.getOfferingBac.length);
          }
        }
        uiStore.removeOneFromProgressArray('getLeadershipOfferingBac');
      },
    });
  }

  @computed get leaderShipOfferingBacData() {
    return (this.leaderShipOfferingBac && this.leaderShipOfferingBac.data
      && toJS(this.leaderShipOfferingBac.data.getOfferingBac)) || null;
  }

  createOrUpdateOfferingBac = (
    bacType,
    fields,
    issuerNumber = undefined,
    leaderNumber = undefined,
    afIssuerId,
    approvedObj,
    index = undefined,
  ) => {
    const { getOfferingById } = offeringsStore.offerData.data;
    const issuerBacId = getOfferingById.legal && getOfferingById.legal.issuerBacId;
    const offeringBacDetails = Validator.evaluateFormData(fields);
    offeringBacDetails.offeringId = getOfferingById.id;
    offeringBacDetails.bacType = bacType;
    let mutation = issuerBacId ? updateBac : createBac;
    let variables = {
      offeringBacDetails,
    };
    if (issuerBacId) {
      mutation = updateBac;
      variables = {
        id: issuerBacId,
        offeringBacDetails,
      };
    }
    if (issuerNumber !== undefined) {
      const payload = { ...offeringBacDetails.getOfferingBac[issuerNumber] };
      payload.offeringId = getOfferingById.id;
      payload.bacType = bacType;
      if (!afIssuerId) {
        mutation = createBac;
        variables = {
          offeringBacDetails: payload,
        };
      } else {
        mutation = updateBac;
        variables = {
          offeringBacDetails: payload,
          id: afIssuerId,
        };
      }
    }
    if (leaderNumber !== undefined) {
      const payload = { ...offeringBacDetails.getOfferingBac[leaderNumber] };
      payload.offeringId = getOfferingById.id;
      payload.bacType = bacType;
      const { leadership } = getOfferingById;
      if (!afIssuerId) {
        mutation = createBac;
        payload.email = leadership[index].email;
        variables = {
          offeringBacDetails: payload,
        };
      } else {
        mutation = updateBac;
        variables = {
          offeringBacDetails: payload,
          id: afIssuerId,
        };
      }
    }
    const { firstName, lastName } = userDetailsStore.userDetails.info;
    const payLoadDataOld = {};
    if (approvedObj !== null && approvedObj && approvedObj.isApproved) {
      if (approvedObj.status === 'manager_approved' || approvedObj.status === 'manager_edit') {
        payLoadDataOld.approved = {
          id: userDetailsStore.userDetails.id,
          by: `${firstName} ${lastName}`,
          date: moment().toISOString(),
          status: approvedObj.status === 'manager_approved',
        };
      } else if (approvedObj.status === 'support_submitted') {
        payLoadDataOld.submitted = {
          id: userDetailsStore.userDetails.id,
          by: `${firstName} ${lastName}`,
          date: moment().toISOString(),
        };
        if ((!payLoadDataOld.issuerSubmitted || payLoadDataOld.issuerSubmitted === '') && !approvedObj.isAdminOnly) {
          payLoadDataOld.issuerSubmitted = moment().toISOString();
        }
      } else if (approvedObj.status === 'support_decline') {
        payLoadDataOld.approved = {
          id: userDetailsStore.userDetails.id,
          by: `${firstName} ${lastName}`,
          date: moment().toISOString(),
          status: false,
        };
        payLoadDataOld.submitted = null;
      }
    }
    variables.offeringBacDetails = { ...variables.offeringBacDetails, ...payLoadDataOld };
    uiStore.setProgress(approvedObj && approvedObj.status ? approvedObj.status : 'save');
    client
      .mutate({
        mutation,
        variables,
        refetchQueries: [{
          query: getOfferingDetails,
          variables: { id: getOfferingById.id },
        },
        {
          query: getOfferingBac,
          variables: { offeringId: getOfferingById.id, bacType: 'AFFILIATED_ISSUER' },
        },
        {
          query: getOfferingBac,
          variables: { offeringId: getOfferingById.id, bacType: 'ISSUER' },
        },
        ],
      })
      .then(() => {
        this.initLoad.splice(this.initLoad.indexOf('AFFILIATED_ISSUER_FRM'), 1);
        offeringsStore.getOne(getOfferingById.id);
        if (bacType === 'LEADERSHIP') {
          this.initLoad.splice(this.initLoad.indexOf('LEADER_FRM'), 1);
          this.getLeadershipOfferingBac(this.currentOfferingId, 'LEADERSHIP');
        }
        Helper.toast('Offering has been saved successfully.', 'success');
      })
      .catch((err) => {
        uiStore.setErrors(DataFormatter.getSimpleErr(err));
        Helper.toast('Something went wrong.', 'error');
      })
      .finally(() => {
        uiStore.setProgress(false);
      });
  }

  deleteBac = (afIssuerId) => {
    if (!afIssuerId) {
      this.removeData('AFFILIATED_ISSUER_FRM', 'getOfferingBac');
      Helper.toast('Affiliated Issuer has been deleted successfully.', 'success');
      return;
    }
    const bacType = 'AFFILIATED_ISSUER';
    uiStore.setProgress();
    client
      .mutate({
        mutation: deleteBac,
        variables: {
          id: afIssuerId,
          offeringId: this.currentOfferingId,
        },
        refetchQueries: [{
          query: getOfferingBac,
          variables: { offeringId: this.currentOfferingId, bacType },
        }],
      })
      .then(action((() => {
        this.confirmModal = !this.confirmModal;
        this.confirmModalName = null;
        this.removeIndex = null;
        uiStore.setConfirmBox('');
        this.initLoad.splice(this.initLoad.indexOf('AFFILIATED_ISSUER_FRM'), 1);
        Helper.toast('Affiliated Issuer has been deleted successfully.', 'success');
      })))
      .catch(action((err) => {
        uiStore.setErrors(DataFormatter.getSimpleErr(err));
        Helper.toast('Something went wrong.', 'error');
      }))
      .finally(() => {
        uiStore.setProgress(false);
      });
  }

  @action
  offeringClose = (params, step, scope) => new Promise((res, rej) => {
    uiStore.setProgress(params.process);
    this.setFieldValue('outputMsg', null);
    let formData = Validator.evaluateFormData(this[`OFFERING_CLOSE_${step}`].fields);
    formData = cleanDeep(formData);
    if (formData.payload) {
      if (scope) {
        formData.payload.scope = scope;
      }
      if (formData.payload.notePurchaseDate) {
        formData.payload.notePurchaseDate = moment(formData.payload.notePurchaseDate).format('MMMM D, YYYY');
      }
      if (formData.payload.maturityDate) {
        formData.payload.maturityDate = moment(formData.payload.maturityDate).format('MMMM D, YYYY');
      }
      if (formData.payload.hardCloseDate) {
        formData.payload.hardCloseDate = moment(formData.payload.hardCloseDate).format('MMMM D, YYYY');
      }
    } else if (!formData.payload && scope) {
      formData.payload = { scope };
    }
    client
      .mutate({
        mutation: offerClose,
        variables: { ...params, ...formData },
      }).then((data) => {
        uiStore.setProgress(false);
        this.setFieldValue('outputMsg', { type: 'success', data: get(data, 'data.offeringClose') });
        res(get(data, 'data.offeringClose'));
      }).catch((err) => {
        uiStore.setProgress(false);
        this.setFieldValue('outputMsg', { type: 'error', data: get(err, 'message') });
        console.log(err);
        Helper.toast('Something went wrong.', 'error');
        rej();
      });
  });

  updateBonusRewardTier = (isDelete = false, amount = 0, earlyBirdQuantity = 0) => {
    const { fields } = this.ADD_NEW_TIER_FRM;
    const msg = isDelete ? 'Tier has been deleted successfully' : 'Tier has been created successfully';
    const msgType = isDelete ? 'error' : 'success';
    const subKey = isDelete ? { amount, earlyBirdQuantity } : null;
    this.updateOffering(
      this.currentOfferingId,
      fields, 'BonusRewardTier', subKey, false, msg,
      null, false, null, msgType,
    ).then(() => {
      Validator.resetFormData(this.ADD_NEW_TIER_FRM);
    });
  }

  @action
  setTiersForBonusRewardsForm = () => {
    const tiers = get(offeringsStore.offer, 'rewardsTiers') || [];
    const earlyBird = get(offeringsStore.offer, 'earlyBird') || null;
    const tiersArray = [];
    forEach(tiers, (tier, index) => {
      const tierFieldObj = { rule: 'optional', error: undefined };
      tierFieldObj.values = [{ label: `Invest ${Helper.CurrencyFormat(tier)} or more`, value: tier }];
      tierFieldObj.key = tier;
      tierFieldObj.earlyBirdQuantity = get(earlyBird, 'quantity') !== 0 && get(earlyBird, 'amount') === tier ? get(earlyBird, 'quantity') : 0;
      tierFieldObj.value = [];
      tierFieldObj.seqNum = index;
      tiersArray.push(tierFieldObj);
    });
    this.ADD_NEW_BONUS_REWARD_FRM.fields = { ...this.ADD_NEW_BONUS_REWARD_FRM.fields, ...tiersArray };
  };

  @computed get isCheckedAtLeastOneTiers() {
    const tiers = get(offeringsStore.offer, 'rewardsTiers') || [];
    let hasTierVal = false;
    // eslint-disable-next-line consistent-return
    forEach(tiers, (tier, index) => {
      if (this.ADD_NEW_BONUS_REWARD_FRM.fields[index].value.length) {
        hasTierVal = true;
        return false;
      }
    });
    return hasTierVal || this.ADD_NEW_BONUS_REWARD_FRM.fields.isEarlyBirds.value.length;
  }

  @action
  bonusRewardTierChange = (e, seqNum, result) => {
    const index = this.ADD_NEW_BONUS_REWARD_FRM.fields[seqNum].value.indexOf(result.value);
    if (index === -1) {
      this.ADD_NEW_BONUS_REWARD_FRM.fields[seqNum].value.push(result.value);
    } else {
      this.ADD_NEW_BONUS_REWARD_FRM.fields[seqNum].value.splice(index, 1);
    }
    Validator.validateForm(this.ADD_NEW_BONUS_REWARD_FRM, false, false, false);
  }

  @action
  getBonusRewards = () => {
    this.bonusRewards = graphql({
      client,
      fetchPolicy: 'network-only',
      query: getBonusRewards,
      variables: { offeringId: this.currentOfferingId },
    });
  }

  @computed
  get allBonusRewards() {
    return (this.bonusRewards && this.bonusRewards.data && this.bonusRewards.data.getBonusRewards
      && orderBy(toJS(this.bonusRewards.data.getBonusRewards), 'created.date', 'asc')) || [];
  }

  @computed
  get allBonusRewardsLoading() {
    return this.bonusRewards.loading;
  }

  @action
  deleteBonusReward = id => new Promise((res, rej) => {
    uiStore.setProgress();
    client
      .mutate({
        mutation: deleteBonusReward,
        variables: {
          id,
          offeringId: this.currentOfferingId,
        },
        refetchQueries: [{
          query: getOfferingDetails,
          variables: { id: this.currentOfferingId },
        },
        {
          query: getBonusRewards,
          variables: { offeringId: this.currentOfferingId },
        }],
      })
      .then(() => {
        res();
        Helper.toast('Bonus Reward has been deleted successfully.', 'success');
      })
      .catch(action((err) => {
        rej();
        uiStore.setErrors(DataFormatter.getSimpleErr(err));
        Helper.toast('Something went wrong.', 'error');
      }))
      .finally(() => {
        uiStore.setProgress(false);
      });
  });

  @action
  setUpdateBonusRewardsData = (rewardId) => {
    this.resetBonusRewardForm();
    const { fields } = this.ADD_NEW_BONUS_REWARD_FRM;
    const bonusRewards = this.allBonusRewards;
    if (bonusRewards && bonusRewards.length) {
      bonusRewards.map((reward) => {
        if (reward.id === rewardId) {
          fields.name.value = reward.title;
          fields.description.value = reward.description ? reward.description : '';
          fields.expirationDate.value = reward.expirationDate ? moment(reward.expirationDate).format('MM/DD/YYYY') : '';
          map(fields, (f) => {
            if (f.earlyBirdQuantity > 0 && reward.earlyBirdQuantity > 0) {
              f.value.push('EARLY_BIRDS');
            }
            if (reward.tiers.includes(f.key)) {
              f.value.push(f.key);
            }
            return false;
          });
        }
        return null;
      });
    }
    Validator.validateForm(this.ADD_NEW_BONUS_REWARD_FRM);
  }

  createUpdateBonusReward = (earlyBirdQty, id = false) => {
    const { fields } = this.ADD_NEW_BONUS_REWARD_FRM;
    const tiers = [];
    map(fields, ((field) => {
      if ((field.key)
      && field.value.length && field.value.includes(field.key)) {
        tiers.push(field.key);
      }
    }));
    const payloadData = {
      bonusRewardDetails: {
        offeringId: this.currentOfferingId,
        title: fields.name.value,
        description: fields.description.value,
        rewardStatus: 'In Review',
        earlyBirdQuantity: fields.isEarlyBirds.value.length
          ? earlyBirdQty : 0,
        expirationDate: fields.expirationDate.value ? moment(new Date(fields.expirationDate.value)).toISOString() : '',
        tiers,
      },
    };
    if (id) {
      payloadData.id = id;
    }
    uiStore.setProgress();
    client
      .mutate({
        mutation: upsertBonusReward,
        variables: payloadData,
        refetchQueries: [{
          query: getOfferingDetails,
          variables: { id: this.currentOfferingId },
        },
        {
          query: getBonusRewards,
          variables: { offeringId: this.currentOfferingId },
        }],
      })
      .then(() => {
        Helper.toast(`Bonus Reward has been ${id ? 'updated' : 'added'} successfully`, 'success');
        Validator.resetFormData(this.ADD_NEW_BONUS_REWARD_FRM);
      })
      .catch(action((err) => {
        uiStore.setErrors(DataFormatter.getSimpleErr(err));
        Helper.toast('Something went wrong.', 'error');
      }))
      .finally(() => {
        uiStore.setProgress(false);
      });
  }

  createPoll = () => {
    setTimeout(() => this.getOfferingFilingList(this.currentOfferingId, false), 15 * 1000);
  }

  @action
  getOfferingFilingList = (offeringId) => {
    const params = { field: 'created', sort: 'asc' };
    this.filingListApiRes = graphql({
      client,
      fetchPolicy: 'network-only',
      query: getOfferingFilingList,
      variables: {
        offeringId,
        orderByBusinessFilingSubmission: params,
      },
      onFetch: (res) => {
        this.offeringFilingList = {};
        if (res && res.businessFilings) {
          this.offeringFilingList = res.businessFilings;
          filter(this.offeringFilingList, (filing) => {
            map(filing.submissions, (submission) => {
              if (submission.xmlSubmissionStatus === XML_STATUSES.created) {
                this.createPoll();
              }
            });
          });
        }
      },
    });
  }

  generateBusinessFiling = () => {
    uiStore.setProgress();
    client
      .mutate({
        mutation: generateBusinessFiling,
        variables: {
          offeringId: this.currentOfferingId,
        },
      })
      .then(() => {
        this.getOfferingFilingList(this.currentOfferingId);
        Helper.toast('Generate Docs created.', 'success');
      })
      .catch(action((err) => {
        uiStore.setErrors(DataFormatter.getSimpleErr(err));
        Helper.toast('Something went wrong.', 'error');
      }))
      .finally(() => {
        uiStore.setProgress(false);
      });
  }

  @action
  setDataForEditContingency = (form, dataKey, index) => {
    const { fields } = this.EDIT_CONTINGENCY_FRM;
    fields.contingency.value = form.fields[dataKey][index].contingency.value;
    fields.acceptance.value = form.fields[dataKey][index].acceptance.value;
    fields.comment.value = form.fields[dataKey][index].comment.value;
  }

  @action
  setDataForFormAfterEdit = (form, dataKey, index) => {
    const { fields } = this.EDIT_CONTINGENCY_FRM;
    form.fields[dataKey][index].contingency.value = fields.contingency.value;
    form.fields[dataKey][index].acceptance.value = fields.acceptance.value;
    form.fields[dataKey][index].comment.value = fields.comment.value;
  }

  @action resetInitLoad() {
    this.initLoad = [];
  }

  @action
  setAccreditedOnlyField = (formName, index) => {
    const arrName = formName === 'CLOSING_BINDER_FRM' ? 'closingBinder' : 'documents';
    this[formName] = Validator.onArrayFieldChange(
      this[formName],
      { name: 'accreditedOnly', value: !this[formName].fields[arrName][index].accreditedOnly.value },
      arrName,
      index,
    );
  }

  @action
  validateLeadership = () => {
    let isValid = false;
    this.LEADERSHIP_FRM.fields.leadership.forEach((leader) => {
      if (leader.email.value === '' && !this.LEADERSHIP_FRM.meta.error) {
        isValid = true;
      }
    });
    return isValid;
  }

  getClosureObject = (type) => {
    let { getOfferingById } = offeringsStore.offerData.data;
    let obj = {};
    if (type === 'CLOSING_BINDER') {
      obj = Validator.evaluateFormData(this.OFFERING_CLOSE_1.fields);
      const closerBinderDocs = Validator.evaluateFormData(this.CLOSING_BINDER_FRM.fields).closingBinder || [];
      const filteredCloserBinderDocs = closerBinderDocs.filter(d => d.name !== '' && d.upload.fileId !== '');
      obj.closingBinder = [...filteredCloserBinderDocs];
    } else if (type === 'EXPORT_ENVELOPES') {
      const fileSubstitution = Validator.evaluateFormData(this.OFFERING_CLOSE_EXPORT_ENVELOPES_FRM.fields).fileSubstitution || [];
      obj.closureSummary = { exportEnvelopes: { fileSubstitution } };
    } else {
      const supplementalAgreementsDocs = Validator.evaluateFormData(this.DATA_ROOM_FRM.fields).documents || [];
      const filteredSupplementalAgreementsDocs = supplementalAgreementsDocs.filter(d => d.name !== '' && d.upload.fileId !== '');
      set(obj, 'closureSummary.keyTerms.supplementalAgreements', { documents: filteredSupplementalAgreementsDocs });
    }
    getOfferingById = Helper.replaceKeysDeep(toJS(getOfferingById), { aliasId: 'id', aliasAccreditedOnly: 'isVisible' });
    obj = Helper.replaceKeysDeep(obj, { accreditedOnly: 'isVisible' });
    obj.closureSummary = mergeWith(
      toJS(getOfferingById.closureSummary),
      obj.closureSummary,
      this.mergeCustomize,
    );
    if (type === 'CLOSING_BINDER' && (!obj.closingBinder || !obj.closingBinder.length)) {
      // obj.closingBinder = mergeWith(
      //   toJS(getOfferingById.closingBinder),
      //   obj.closingBinder,
      //   this.mergeCustomize,
      // );
      obj.closingBinder = null;
    }
    obj = omitDeep(obj, ['__typename', 'fileHandle']);
    obj = cleanDeep(obj);
    return obj;
  }

  @action
  setDataRoomDocsOrder = (orderedForm) => {
    const dataRoomDocs = toJS(orderedForm).map((d) => {
      return {
        name: d.name.value,
        accreditedOnly: d.accreditedOnly.value,
        upload: { fileId: d.upload.fileId, fileName: d.upload.value },
      };
    });
    this.DATA_ROOM_FRM = Validator.setFormData(this.DATA_ROOM_FRM, { documents: dataRoomDocs });
  }

  @action
  initializeClosingBinder = () => {
    uiStore.setProgress();
    client
      .mutate({
        mutation: initializeClosingBinder,
        variables: {
          offeringId: this.currentOfferingId,
        },
      })
      .then(() => {
        offeringsStore.getOne(this.currentOfferingId, false);
        Helper.toast('Closing binder initiated.', 'success');
      })
      .catch(action((err) => {
        Helper.toast('Something went wrong.', 'error');
      }))
      .finally(() => {
        uiStore.setProgress(false);
      });
  }
}

export default new OfferingCreationStore();
