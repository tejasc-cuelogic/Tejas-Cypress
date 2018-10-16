/* eslint-disable no-unused-vars, no-param-reassign, no-underscore-dangle */
import { observable, toJS, action, computed } from 'mobx';
import { map, startCase, filter, forEach, find, orderBy } from 'lodash';
import graphql from 'mobx-apollo';
import moment from 'moment';
import { DEFAULT_TIERS, ADD_NEW_TIER, AFFILIATED_ISSUER, LEADER, MEDIA,
  RISK_FACTORS, GENERAL, ISSUER, LEADERSHIP, LEADERSHIP_EXP, OFFERING_DETAILS, CONTINGENCIES,
  ADD_NEW_CONTINGENCY, COMPANY_LAUNCH, SIGNED_LEGAL_DOCS, KEY_TERMS, OFFERING_OVERVIEW,
  OFFERING_COMPANY, OFFER_CLOSE, ADD_NEW_BONUS_REWARD, NEW_OFFER, DOCUMENTATION, EDIT_CONTINGENCY } from '../../../../constants/admin/offerings';
import { FormValidator as Validator, DataFormatter } from '../../../../../helper';
import { updateBonusReward, deleteBonusReward, deleteBonusRewardsTierByOffering, updateOffering,
  getOfferingDetails, getOfferingBac, createBac, updateBac, deleteBac, createBonusReward,
  getBonusRewards, createBonusRewardsTier, getBonusRewardsTiers, getOfferingFilingList,
  generateBusinessFiling, unlinkTiersFromBonusRewards, allOfferings, createOffer } from '../../../queries/offerings/manage';
import { GqlClient as client } from '../../../../../api/gqlApi';
import Helper from '../../../../../helper/utility';
import { offeringsStore, uiStore } from '../../../index';
import { fileUpload } from '../../../../actions';
import { XML_STATUSES } from '../../../../../constants/business';

export class OfferingCreationStore {
  @observable NEW_OFFER_FRM = Validator.prepareFormObject(NEW_OFFER);
  @observable KEY_TERMS_FRM = Validator.prepareFormObject(KEY_TERMS);
  @observable OFFERING_OVERVIEW_FRM = Validator.prepareFormObject(OFFERING_OVERVIEW);
  @observable OFFERING_COMPANY_FRM = Validator.prepareFormObject(OFFERING_COMPANY);
  @observable SIGNED_LEGAL_DOCS_FRM = Validator.prepareFormObject(SIGNED_LEGAL_DOCS);
  @observable COMPANY_LAUNCH_FRM = Validator.prepareFormObject(COMPANY_LAUNCH);
  @observable LAUNCH_CONTITNGENCIES_FRM =
    Validator.prepareFormObject({ launch: [] }, false, true, false, { launch: CONTINGENCIES.data });
  @observable CLOSING_CONTITNGENCIES_FRM =
    Validator.prepareFormObject({ close: [] }, false, true, false, { close: CONTINGENCIES.data });
  @observable ADD_NEW_CONTINGENCY_FRM = Validator.prepareFormObject(ADD_NEW_CONTINGENCY);
  @observable OFFERING_DETAILS_FRM = Validator.prepareFormObject(OFFERING_DETAILS);
  @observable OFFERING_CLOSE_FRM = Validator.prepareFormObject(OFFER_CLOSE);
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
  @observable contingencyFormSelected = undefined;
  @observable confirmModal = false;
  @observable confirmModalName = null;
  @observable removeIndex = null;
  @observable initLoad = [];
  @observable currentOfferingId = null;
  @observable issuerOfferingBac = {};
  @observable affiliatedIssuerOfferingBac = {};
  @observable offeringFilingList = {};
  @observable leadershipOfferingBac = {};
  @observable bonusRewardsTiers = {};
  @observable bonusRewards = {};
  @observable currentRewardId = null;
  @observable tierTobeUnlinked = {};
  @observable leadershipExperience = {
    0: LEADERSHIP_EXP.employer,
    1: LEADERSHIP_EXP.employer,
    2: LEADERSHIP_EXP.employer,
    3: LEADERSHIP_EXP.employer,
    4: LEADERSHIP_EXP.employer,
  };
  @observable requestState = {
    search: {},
  };
  @observable removeFileIdsList = [];

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
        const isExisted =
        find(this.bonusRewardsTiers.data.getBonusRewardTiers, { amount: tier.amount });
        if (!isExisted) {
          this.bonusRewardsTiers.data.getBonusRewardTiers.push(tier);
        }
      } else {
        this.bonusRewardsTiers.data = {};
        this.bonusRewardsTiers.data.getBonusRewardTiers = [];
        const isExisted =
        find(this.bonusRewardsTiers.data.getBonusRewardTiers, { amount: tier.amount });
        if (!isExisted) {
          this.bonusRewardsTiers.data.getBonusRewardTiers.unshift(tier);
        }
      }
      this.bonusRewardsTiers.data.getBonusRewardTiers =
      orderBy([...new Set(toJS(this.bonusRewardsTiers.data.getBonusRewardTiers))], ['amount'], ['asc']);
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
  setCurrentRewardId = (id) => {
    this.currentRewardId = id;
  }

  @action
  resetRewardId = () => {
    this.currentRewardId = null;
  }

  @action
  setProfilePhoto(attr, value, field) {
    this.MEDIA_FRM.fields[field][attr] = value;
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
  resetForm = (form) => {
    Validator.resetFormData(this[form]);
  }

  @action
  resetFormField = (form, field, fileObj, RemoveIndex) => {
    if (fileObj && Array.isArray(toJS(this.MEDIA_FRM.fields[field].preSignedUrl))) {
      this.MEDIA_FRM.fields[field].preSignedUrl.push(fileObj.location);
      this.MEDIA_FRM.fields[field].value.push(fileObj.fileName);
    } else if (fileObj) {
      this.MEDIA_FRM.fields[field].preSignedUrl = fileObj.location;
      this.MEDIA_FRM.fields[field].value = fileObj.fileName;
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
  removeMedia = (name, index = undefined) => {
    let filename = '';
    if (index === undefined) {
      filename = this.MEDIA_FRM.fields[name].value;
    } else {
      filename = this.MEDIA_FRM.fields[name].value[index];
    }
    fileUpload.deleteFromS3(this.MEDIA_FRM.fields[name].value)
      .then((res) => {
        Helper.toast(`${this.MEDIA_FRM.fields[name].label} removed successfully.`, 'success');
        this.resetFormField('MEDIA_FRM', name, undefined, index);
        this.updateOffering(this.currentOfferingId, this.MEDIA_FRM.fields, 'media', false, false);
      })
      .catch((err) => {
        // force record deletion from db;
        this.resetFormField('MEDIA_FRM', name, undefined, index);
        this.updateOffering(this.currentOfferingId, this.MEDIA_FRM.fields, 'media', false, false);
        console.log(err);
      });
  }

  @action
  uploadMedia = (name) => {
    const fileObj = {
      obj: this.MEDIA_FRM.fields[name].base64String,
      type: this.MEDIA_FRM.fields[name].meta.type,
      name: this.MEDIA_FRM.fields[name].fileName,
    };
    fileUpload.uploadToS3(fileObj)
      .then((res) => {
        Helper.toast(`${this.MEDIA_FRM.fields[name].label} uploaded successfully.`, 'success');
        this.resetFormField('MEDIA_FRM', name, res);
        this.updateOffering(this.currentOfferingId, this.MEDIA_FRM.fields, 'media', false, false);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  @action
  uploadFileToS3 = (form, name, files, key, index) => {
    fileUpload.uploadToS3(files[0])
      .then(action((res) => {
        Helper.toast('file uploaded successfully', 'success');
        this[form].fields[key][index][name].value = res.fileName;
        this[form].fields[key][index][name].preSignedUrl = res.location;
      }))
      .catch((err) => {
        Helper.toast('Something went wrong, please try again later.', 'error');
        console.log(err);
      });
  }

  @action
  removeFileFromS3 = (form, name, key, index) => {
    fileUpload.deleteFromS3(this[form].fields[key][index][name].fileName)
      .then(action((res) => {
        ['fileId', 'fileName', 'fileData', 'value', 'preSignedUrl'].forEach((subKey) => {
          this[form].fields[key][index][name][subKey] = '';
        });
        Helper.toast('file Deleted successfully', 'success');
      }))
      .catch((err) => {
        Helper.toast('Something went wrong, please try again later.', 'error');
        console.log(err);
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
    if (!isApiDelete) {
      this[formName].fields[subForm].splice(this.removeIndex, 1);
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
  formChange = (e, result, form, isArr = true) => {
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
  rtEditorChange = (field, value, form) => {
    this[form].fields[field].value = value;
    this[form] = Validator.validateForm(this[form], true, false, false);
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
    const fieldValue =
    (field === 'terminationDate' || field === 'expirationDate' || field === 'targetDate' || field === 'expectedOpsDate') ? values.formattedValue : values.floatValue;
    this[form] = Validator.onChange(
      this[form],
      { name: field, value: fieldValue },
    );
  }

  @action
  maskArrayChange = (values, form, field, subForm = '', index, index2) => {
    const fieldValue = (field === 'maturityDate' || field === 'dob' || field === 'dateOfService') ? values.formattedValue : values.floatValue;
    this[form] = Validator.onArrayFieldChange(
      this[form],
      { name: field, value: fieldValue }, subForm, index,
    );
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
    if (index && arrayName) {
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
  setFileUploadDataMulitple = (form, arrayName, field, files, stepName, index = null) => {
    if (typeof files !== 'undefined' && files.length) {
      forEach(files, (file) => {
        const fileData = Helper.getFormattedFileData(file);
        this.setFormFileArray(form, arrayName, field, 'showLoader', true, index);
        fileUpload.setFileUploadData('', fileData, stepName, 'ADMIN', '', this.currentOfferingId).then((result) => {
          const { fileId, preSignedUrl } = result.data.createUploadEntry;
          fileUpload.putUploadedFileOnS3({ preSignedUrl, fileData: file }).then(() => {
            this.setFormFileArray(form, arrayName, field, 'fileData', file, index);
            this.setFormFileArray(form, arrayName, field, 'preSignedUrl', preSignedUrl, index);
            this.setFormFileArray(form, arrayName, field, 'fileId', fileId, index);
            this.setFormFileArray(form, arrayName, field, 'value', fileData.fileName, index);
            this.setFormFileArray(form, arrayName, field, 'error', undefined, index);
          }).catch((error) => {
            Helper.toast('Something went wrong, please try again later.', 'error');
            uiStore.setErrors(error.message);
          });
        }).catch((error) => {
          Helper.toast('Something went wrong, please try again later.', 'error');
          uiStore.setErrors(error.message);
        }).finally(() => {
          this.setFormFileArray(form, arrayName, field, 'showLoader', false, index);
        });
      });
    }
  }

  @action
  removeUploadedDataMultiple = (form, field, index = undefined, arrayName) => {
    let removeFileIds = '';
    if (index && arrayName) {
      const { fileId } = this[form].fields[arrayName][index][field];
      removeFileIds = fileId;
    } else if (index !== undefined) {
      const filesId = this[form].fields[field].fileId;
      removeFileIds = filesId[index];
    } else {
      const { fileId } = this[form].fields[field];
      removeFileIds = fileId;
    }
    this.removeFileIdsList = [...this.removeFileIdsList, removeFileIds];
    this.setFormFileArray(form, arrayName, field, 'fileId', '', index);
    this.setFormFileArray(form, arrayName, field, 'fileData', '', index);
    this.setFormFileArray(form, arrayName, field, 'value', '', index);
    this.setFormFileArray(form, arrayName, field, 'error', undefined, index);
    this.setFormFileArray(form, arrayName, field, 'showLoader', false, index);
    this.setFormFileArray(form, arrayName, field, 'preSignedUrl', '', index);
  }

  @action
  setFileUploadData = (form, field, files, subForm = '', index = null, stepName) => {
    if (stepName) {
      uiStore.setProgress();
      const file = files[0];
      const fileData = Helper.getFormattedFileData(file);
      fileUpload.setFileUploadData('', fileData, stepName, 'ADMIN', '', this.currentOfferingId).then(action((result) => {
        const { fileId, preSignedUrl } = result.data.createUploadEntry;
        this[form].fields[field].fileId = fileId;
        this[form].fields[field].preSignedUrl = preSignedUrl;
        this[form].fields[field].fileData = file;
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
  removeUploadedData = (form, subForm = 'data', field, index = null, stepName) => {
    if (stepName) {
      const currentStep = { name: stepName };
      const { fileId } = this[form].fields[field];
      fileUpload.removeUploadedData(fileId).then(action(() => {
        this[form] = Validator.onChange(
          this[form],
          { name: field, value: '' },
        );
        this[form].fields[field].fileId = '';
        this[form].fields[field].preSignedUrl = '';
        this.createAccount(currentStep, 'draft', true, field);
      }))
        .catch(() => { });
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
  addMore = (form, key) => {
    this[form] = Validator.addMoreRecordToSubSection(this[form], key, 1, true);
    if (form === 'LEADER_FRM') {
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
    Validator.setAddressFieldsIndex(place, this.LEADERSHIP_FRM, 'LEADERSHIP_FRM', 'leadership', index);
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
    const { offer } = offeringsStore;
    if (!offer) {
      return false;
    }
    if (form === 'MEDIA_FRM') {
      this.MEDIA_FRM = Validator.prepareFormObject(MEDIA);
    }
    this[form] = Validator.setFormData(this[form], offer, ref, keepAtLeastOne);
    this.initLoad.push(form);
    if (form === 'LEADERSHIP_FRM') {
      forEach(offer.leadership, (emp, key) => {
        this.LEADERSHIP_EXP_FRM =
        Validator.setFormData(
          this.LEADERSHIP_EXP_FRM,
          offer.leadership[key],
          ref, keepAtLeastOne,
        );
        this.leadershipExperience[key] = this.LEADERSHIP_EXP_FRM;
      });
    }
    const multiForm = this.getActionType(form, 'isMultiForm');
    this.checkFormValid(form, multiForm, false);
    return false;
  }

  getActionType = (formName, getField = 'actionType') => {
    const metaDataMapping = {
      MEDIA_FRM: { isMultiForm: false },
      KEY_TERMS_FRM: { isMultiForm: false },
      OFFERING_OVERVIEW_FRM: { isMultiForm: true },
      OFFERING_COMPANY_FRM: { isMultiForm: true },
      COMPANY_LAUNCH_FRM: { isMultiForm: false },
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

  addNewOffer = () => {
    const params = {};
    uiStore.setProgress();
    client
      .mutate({
        mutation: createOffer,
        variables: params,
        refetchQueries: [{
          query: allOfferings,
          variables: { stage: ['CREATION'] },
        }],
      })
      .then(() => Helper.toast('Offering created successfully.', 'success'))
      .catch(() => {
        Helper.toast('Error while creating offer', 'error');
      })
      .finally(() => {
        uiStore.setProgress(false);
      });
  }
  updateOffering = (
    id,
    fields, keyName, subKey, notify = true, successMsg = undefined, isApproved,
  ) => {
    const { getOfferingById } = offeringsStore.offerData.data;
    let payloadData = {
      applicationId: getOfferingById.applicationId,
      issuerId: getOfferingById.issuerId,
    };
    if (keyName) {
      if (keyName === 'legal') {
        console.log(isApproved);
        payloadData[keyName] = {};
        const generalInfo = Validator.evaluateFormData(this.GENERAL_FRM.fields);
        if (generalInfo.websiteUrl) {
          payloadData[keyName].general = generalInfo;
        }
        payloadData[keyName].riskFactors = Validator.evaluateFormData(this.RISK_FACTORS_FRM.fields);
        payloadData[keyName].documentation[subKey] =
        Validator.evaluateFormData(this.DOCUMENTATION_FRM.fields);
      } else if (keyName === 'offering') {
        payloadData[keyName] = {};
        payloadData[keyName].about = Validator.evaluateFormData(this.OFFERING_COMPANY_FRM.fields);
        payloadData[keyName].launch = Validator.evaluateFormData(this.COMPANY_LAUNCH_FRM.fields);
        payloadData[keyName].overview =
          Validator.evaluateFormData(this.OFFERING_OVERVIEW_FRM.fields);
        payloadData[keyName].overview = {
          ...payloadData[keyName].overview,
          ...this.evaluateFormFieldToArray(this.OFFERING_OVERVIEW_FRM.fields),
        };
      } else if (keyName === 'media') {
        payloadData = { ...payloadData, [keyName]: Validator.evaluateFormData(fields) };
        const mediaObj = {};
        payloadData[keyName] = Object.keys(payloadData[keyName]).map((k) => {
          const mediaItem = toJS(payloadData[keyName][k].url);
          mediaObj[k] = Array.isArray(mediaItem) ?
            mediaItem.map((item, index) => {
              const itemOfMedia = {
                id: 1, url: item, fileName: payloadData[keyName][k].fileName[index], isPublic: true,
              };
              return itemOfMedia;
            }) : payloadData[keyName][k].fileName &&
            {
              id: 1,
              url: k === 'heroVideo' ? payloadData[keyName][k].fileName : payloadData[keyName][k].url,
              fileName: payloadData[keyName][k].fileName,
              isPublic: true,
            };
          return mediaObj;
        });
        payloadData[keyName] = mediaObj;
      } else if (keyName === 'leadership') {
        let leadershipFields = Validator.evaluateFormData(fields);
        leadershipFields = leadershipFields.leadership.map((leadership, index) => {
          const employer =
          Validator.evaluateFormData(toJS(this.leadershipExperience[index]).fields);
          return { ...leadership, ...{ employer: employer.employer } };
        });
        payloadData = { ...payloadData, [keyName]: leadershipFields };
      } else {
        payloadData = { ...payloadData, [keyName]: Validator.evaluateFormData(fields) };
      }
    } else {
      payloadData = { ...payloadData, ...Validator.evaluateFormData(fields) };
    }
    uiStore.setProgress();
    client
      .mutate({
        mutation: updateOffering,
        variables: {
          id,
          offeringDetails: payloadData,
        },
        refetchQueries: [{
          query: getOfferingDetails,
          variables: { id: getOfferingById.id },
        }],
      })
      .then(() => {
        if (successMsg) {
          Helper.toast(`${successMsg}`, 'success');
        } else if (notify) {
          Helper.toast(`${startCase(keyName) || 'Offering'} has been saved successfully.`, 'success');
        }
      })
      .catch((err) => {
        uiStore.setErrors(DataFormatter.getSimpleErr(err));
        Helper.toast('Something went wrong.', 'error');
      })
      .finally(() => {
        uiStore.setProgress(false);
      });
  }

  @action
  getOfferingBac = (offeringId, bacType) => {
    this.issuerOfferingBac = graphql({
      client,
      query: getOfferingBac,
      variables: { offeringId, bacType },
      onFetch: (res) => {
        if (res && res.getOfferingBac) {
          this.setBacFormData('ISSUER_FRM', res.getOfferingBac[0] || {});
        }
      },
    });
  }

  @action
  getAffiliatedIssuerOfferingBac = (offeringId, bacType) => {
    this.affiliatedIssuerOfferingBac = graphql({
      client,
      fetchPolicy: 'network-only',
      query: getOfferingBac,
      variables: { offeringId, bacType },
      onFetch: (res) => {
        if (res && res.getOfferingBac) {
          this.setBacFormData('AFFILIATED_ISSUER_FRM', res || {}, false);
        }
      },
    });
  }

  @action
  getLeadershipOfferingBac = (offeringId, bacType) => {
    this.leaderShipOfferingBac = graphql({
      client,
      fetchPolicy: 'network-only',
      query: getOfferingBac,
      variables: { offeringId, bacType },
      onFetch: (res) => {
        if (res && res.getOfferingBac) {
          this.setBacFormData('LEADER_FRM', res || {}, false);
          const leadersCount = this.LEADERSHIP_FRM.fields.leadership.length;
          if (leadersCount !==
            this.LEADER_FRM.fields.getOfferingBac.length && (leadersCount - 1 !== 0)) {
            this.addMore('LEADER_FRM', 'getOfferingBac', leadersCount - 1);
          }
        }
      },
    });
  }

  createOrUpdateOfferingBac = (
    bacType,
    fields,
    issuerNumber = undefined,
    leaderNumber = undefined,
    afIssuerId,
  ) => {
    const { getOfferingById } = offeringsStore.offerData.data;
    const issuerBacId = getOfferingById.legal && getOfferingById.legal.issuerBacId;
    const offeringBacDetails = Validator.evaluateFormData(fields);
    offeringBacDetails.offeringId = getOfferingById.id;
    offeringBacDetails.bacType = bacType;
    let mutation = createBac;
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
        payload.email = leadership[leaderNumber].email;
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
    uiStore.setProgress();
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

  addNewTier = () => {
    let payloadData = {};
    const { fields } = this.ADD_NEW_TIER_FRM;
    const isEarlyBirds = fields.isEarlyBirds.value;
    if (isEarlyBirds.length > 0) {
      payloadData = {
        amount: fields.amountForEarlyBird.value,
        earlyBirdQuantity: fields.earlyBirdQuantity.value,
      };
    } else {
      payloadData = {
        amount: fields.amountForThisTier.value,
        earlyBirdQuantity: 0,
      };
    }
    uiStore.setProgress();
    client
      .mutate({
        mutation: createBonusRewardsTier,
        variables: {
          bonusRewardTierDetails: payloadData,
        },
        refetchQueries: [
          { query: getBonusRewardsTiers },
        ],
      })
      .then(() => {
        Helper.toast('Tier has been created successfully', 'success');
        Validator.resetFormData(this.ADD_NEW_TIER_FRM);
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
  getBonusRewardsTiers = () => {
    this.bonusRewardsTiers = graphql({
      client,
      fetchPolicy: 'network-only',
      query: getBonusRewardsTiers,
      onFetch: (res) => {
        if (res) {
          this.setTiersForBonusRewardsForm();
          this.setDefaultTiers();
          this.setUpdateBonusRewardsData(
            this.bonusRewards.data.getBonusRewards,
            this.currentRewardId,
          );
        }
      },
    });
  }

  @action
  setTiersForBonusRewardsForm = () => {
    const tiers = this.bonusRewardsTiers.data.getBonusRewardTiers;
    const tiersArray = [];
    forEach(tiers, (tier, index) => {
      const tierFieldObj = { rule: 'alpha_dash', error: undefined };
      tierFieldObj.values = [{ label: `Invest ${Helper.CurrencyFormat(tier.amount)} or more`, value: tier.amount }];
      tierFieldObj.key = tier.amount;
      tierFieldObj.earlyBirdQuantity = tier.earlyBirdQuantity;
      tierFieldObj.value = [];
      tierFieldObj.seqNum = index;
      tiersArray.push(tierFieldObj);
    });
    this.ADD_NEW_BONUS_REWARD_FRM.fields =
      { ...this.ADD_NEW_BONUS_REWARD_FRM.fields, ...tiersArray };
  };

  @action
  bonusRewardTierChange = (e, seqNum, result) => {
    const index = this.ADD_NEW_BONUS_REWARD_FRM.fields[seqNum].value.indexOf(result.value);
    if (index === -1) {
      this.ADD_NEW_BONUS_REWARD_FRM.fields[seqNum].value.push(result.value);
    } else {
      this.ADD_NEW_BONUS_REWARD_FRM.fields[seqNum].value.splice(index, 1);
    }
  }

  createBonusReward = () => {
    const { fields } = this.ADD_NEW_BONUS_REWARD_FRM;
    const tiers = [];
    map(fields, ((field) => {
      if ((field.key || field.earlyBirdQuantity) &&
      field.value.length && field.value.length === 1) {
        const tierObj = {};
        tierObj.amount = field.key;
        tierObj.earlyBirdQuantity = field.earlyBirdQuantity;
        tiers.push(tierObj);
      }
    }));
    let payloadData = {};
    payloadData = {
      offeringId: this.currentOfferingId,
      title: fields.name.value,
      description: fields.description.value,
      rewardStatus: 'In Review',
      expirationDate: moment(fields.expirationDate.value).toISOString(),
      tiers,
    };
    uiStore.setProgress();
    client
      .mutate({
        mutation: createBonusReward,
        variables: {
          bonusRewardDetails: payloadData,
        },
      })
      .then(() => {
        Helper.toast('Bonus Reward has been added successfully', 'success');
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
    return (this.bonusRewards &&
    toJS(this.bonusRewards)) || [];
  }

  @action
  deleteBonusReward = (id) => {
    uiStore.setProgress();
    client
      .mutate({
        mutation: deleteBonusReward,
        variables: {
          id,
          offeringId: this.currentOfferingId,
        },
        refetchQueries: [
          { query: getBonusRewards, variables: { offeringId: this.currentOfferingId } },
          { query: getBonusRewardsTiers },
        ],
      })
      .then(() => {
        Helper.toast('Bonus Reward has been deleted successfully.', 'success');
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
  deleteBonusRewardTier = (amount, earlyBirdQuantity) => {
    uiStore.setProgress();
    client
      .mutate({
        mutation: deleteBonusRewardsTierByOffering,
        variables: {
          offeringId: this.currentOfferingId,
          bonusRewardTierId: {
            amount,
            earlyBirdQuantity,
          },
        },
        refetchQueries: [
          { query: getBonusRewards, variables: { offeringId: this.currentOfferingId } },
          { query: getBonusRewardsTiers },
        ],
      })
      .then(() => {
        Helper.toast('Tier has been deleted successfully.', 'success');
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
  setUpdateBonusRewardsData = (bonusRewards, rewardId) => {
    const { fields } = this.ADD_NEW_BONUS_REWARD_FRM;
    if (bonusRewards) {
      bonusRewards.map((reward) => {
        if (reward.id === rewardId) {
          fields.name.value = reward.title;
          fields.description.value = reward.description;
          fields.expirationDate.value = moment(reward.expirationDate).format('MM/DD/YYYY');
          reward.tiers.map((tier) => {
            const isExisted = find(fields, { key: tier.amount });
            if (isExisted && !isExisted.value.includes(tier.amount) &&
              Array.isArray(toJS(isExisted.value))) {
              isExisted.value.push(tier.amount);
              isExisted.value = [...new Set(toJS(isExisted.value))];
            } else {
              const isEarlyBird = find(fields, { earlyBirdQuantity: 50 });
              if (isEarlyBird && !isEarlyBird.value.includes('EARLY_BIRDS') &&
              Array.isArray(toJS(isEarlyBird.value))) {
                isEarlyBird.value.push('EARLY_BIRDS');
              }
            }
            return null;
          });
        }
        return null;
      });
    }
  }

  updateBonusReward = (id) => {
    const { fields } = this.ADD_NEW_BONUS_REWARD_FRM;
    const tiers = [];
    map(fields, ((field) => {
      if ((field.key || field.earlyBirdQuantity) &&
      field.value.length && field.value.length === 1) {
        const tierObj = {};
        tierObj.amount = field.key;
        tierObj.earlyBirdQuantity = field.earlyBirdQuantity;
        tiers.push(tierObj);
      }
    }));
    let payloadData = {};
    payloadData = {
      offeringId: this.currentOfferingId,
      title: fields.name.value,
      description: fields.description.value,
      rewardStatus: 'In Review',
      expirationDate: moment(fields.expirationDate.value).toISOString(),
      tiers,
    };
    uiStore.setProgress();
    client
      .mutate({
        mutation: updateBonusReward,
        variables: {
          id,
          bonusRewardDetails: payloadData,
        },
      })
      .then(() => {
        Helper.toast('Bonus Reward has been updated successfully', 'success');
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
    graphql({
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
  unlinkTierFromBonusReward = (id, tier) => {
    uiStore.setProgress();
    client
      .mutate({
        mutation: unlinkTiersFromBonusRewards,
        variables: {
          bonusRewardId: id,
          offeringId: this.currentOfferingId,
          bonusRewardTierId: this.tierTobeUnlinked,
        },
        refetchQueries: [
          { query: getBonusRewards, variables: { offeringId: this.currentOfferingId } },
          { query: getBonusRewardsTiers },
        ],
      })
      .then(() => {
        Helper.toast('Bonus Reward has been deleted successfully.', 'success');
        this.setTierToBeUnlinked(null);
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
}

export default new OfferingCreationStore();
