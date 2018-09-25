/* eslint-disable no-unused-vars, no-param-reassign, no-underscore-dangle */
import { observable, toJS, action } from 'mobx';
import { map } from 'lodash';
import { ADD_NEW_TIER, AFFILIATED_ISSUER, LEADER, MEDIA, RISK_FACTORS, GENERAL, ISSUER, LEADERSHIP, OFFERING_DETAILS, CONTINGENCIES, ADD_NEW_CONTINGENCY, COMPANY_LAUNCH, SIGNED_LEGAL_DOCS, KEY_TERMS, OFFERING_OVERVIEW, OFFERING_HIGHLIGHTS, OFFERING_COMPANY, COMPANY_HISTORY, OFFER_CLOSE, ADD_NEW_BONUS_REWARD } from '../../../../constants/admin/offerings';
import { FormValidator as Validator, DataFormatter } from '../../../../../helper';
import { updateOffering } from '../../../queries/offerings/manage';
import { GqlClient as client } from '../../../../../api/gqlApi';
import Helper from '../../../../../helper/utility';
import { offeringsStore, uiStore } from '../../../index';

const emptyDataSet = { data: [] };

export class OfferingCreationStore {
  @observable KEY_TERMS_FRM = Validator.prepareFormObject(KEY_TERMS);
  @observable OFFERING_OVERVIEW_FRM = Validator.prepareFormObject(OFFERING_OVERVIEW);
  @observable OFFERING_HIGHLIGHTS_FRM = Validator.prepareFormObject(OFFERING_HIGHLIGHTS);
  @observable OFFERING_COMPANY_FRM = Validator.prepareFormObject(OFFERING_COMPANY);
  @observable COMPANY_HISTORY_FRM = Validator.prepareFormObject(COMPANY_HISTORY);
  @observable SIGNED_LEGAL_DOCS_FRM = Validator.prepareFormObject(SIGNED_LEGAL_DOCS);
  @observable COMPANY_LAUNCH_FRM = Validator.prepareFormObject(COMPANY_LAUNCH);
  @observable LAUNCH_CONTITNGENCIES_FRM = Validator.prepareFormObject(emptyDataSet);
  @observable CLOSING_CONTITNGENCIES_FRM = Validator.prepareFormObject(emptyDataSet);
  @observable ADD_NEW_CONTINGENCY_FRM = Validator.prepareFormObject(ADD_NEW_CONTINGENCY);
  @observable OFFERING_DETAILS_FRM = Validator.prepareFormObject(OFFERING_DETAILS);
  @observable OFFERING_CLOSE_FRM = Validator.prepareFormObject(OFFER_CLOSE);
  @observable MEDIA_FRM = Validator.prepareFormObject(MEDIA);
  @observable LEADERSHIP_FRM = Validator.prepareFormObject(LEADERSHIP);
  @observable GENERAL_FRM = Validator.prepareFormObject(GENERAL);
  @observable ISSUER_FRM = Validator.prepareFormObject(ISSUER);
  @observable AFFILIATED_ISSUER_FRM = Validator.prepareFormObject(AFFILIATED_ISSUER);
  @observable LEADER_FRM = Validator.prepareFormObject(LEADER);
  @observable RISK_FACTORS_FRM = Validator.prepareFormObject(RISK_FACTORS);
  @observable ADD_NEW_TIER_FRM = Validator.prepareFormObject(ADD_NEW_TIER);
  @observable ADD_NEW_BONUS_REWARD_FRM = Validator.prepareFormObject(ADD_NEW_BONUS_REWARD);
  @observable contingencyFormSelected = undefined;
  @observable confirmModal = false;
  @observable confirmModalName = null;
  @observable removeIndex = null;
  @observable initLoad = [];
  @observable currentOfferingId = null;

  @observable requestState = {
    search: {},
  };

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
  resetProfilePhoto = (field) => {
    const attributes = ['src', 'error', 'value', 'base64String'];
    attributes.forEach((val) => {
      this.MEDIA_FRM.fields[field][val] = '';
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
  removeData = (formName, subForm = 'data') => {
    // this[formName].fields[subForm].splice(this.removeIndex, 1);
    Validator.validateForm(this[formName], true, false, false);
    this.confirmModal = !this.confirmModal;
    this.confirmModalName = null;
    this.removeIndex = null;
  }

  @action
  formChange = (e, result, form) => {
    if (result && result.name === 'isEarlyBirds' && !result.checked) {
      this[form] = Validator.onChange(
        this[form],
        Validator.pullValues(e, result),
        '',
        true,
        result.checked,
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
  formArrayChange = (e, result, form, subForm = '', index) => {
    this[form] = Validator.onArrayFieldChange(
      this[form],
      Validator.pullValues(e, result),
      subForm,
      index,
    );
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
    const fieldValue = field === 'terminationDate' ? values.formattedValue : values.floatValue;
    this[form] = Validator.onChange(
      this[form],
      { name: field, value: fieldValue },
    );
  }

  @action
  maskArrayChange = (values, form, field, subForm = '', index) => {
    const fieldValue = field === 'maturityDate' ? values.formattedValue : values.floatValue;
    this[form] = Validator.onArrayFieldChange(
      this[form],
      { name: field, value: fieldValue }, subForm, index,
    );
  }

  @action
  maskChangeWithIndex = (values, form, field, index) => {
    this[form] = Validator.onArrayFieldChange(
      this[form],
      { name: field, value: values.floatValue }, 'data', index,
    );
  }

  @action
  setFileUploadData = (form, field, files, index = null) => {
    const file = files[0];
    const fileData = Helper.getFormattedFileData(file);
    if (index !== null) {
      this[form] = Validator.onArrayFieldChange(
        this[form],
        { name: field, value: fileData.fileName }, 'data', index,
      );
    } else {
      this[form] = Validator.onChange(
        this[form],
        { name: field, value: fileData.fileName },
      );
    }
  }

  @action
  removeUploadedData = (form, field, index = null) => {
    if (index !== null) {
      this[form] = Validator.onArrayFieldChange(
        this[form],
        { name: field, value: '' }, 'data', index,
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
      OFFERING_HIGHLIGHTS_FRM: OFFERING_HIGHLIGHTS,
      COMPANY_HISTORY_FRM: COMPANY_HISTORY,
      LAUNCH_CONTITNGENCIES_FRM: CONTINGENCIES,
      CLOSING_CONTITNGENCIES_FRM: CONTINGENCIES,
      LEADERSHIP_FRM: LEADERSHIP,
      GENERAL_FRM: GENERAL,
      AFFILIATED_ISSUER_FRM: AFFILIATED_ISSUER,
      LEADER_FRM: LEADER,
    };
    return metaDataMapping[metaData];
  }

  @action
  addMore = (formName, arrayName = 'data', addFieldValues = false) => {
    this[formName] = {
      ...this[formName],
      fields: {
        ...this[formName].fields,
      },
      meta: {
        ...this[formName].meta,
        isValid: false,
      },
    };
    const arrayData = [
      ...this[formName].fields[arrayName],
      this.getMetaData(formName)[arrayName][0],
    ];
    this[formName].fields[arrayName] = arrayData;
    if (addFieldValues) {
      const dataLength = this[formName].fields.data.length;
      this[formName].fields.data[dataLength - 1].contingency.value =
      this.ADD_NEW_CONTINGENCY_FRM.fields.contingency.value;
      this[formName].fields.data[dataLength - 1].acceptance.value =
      this.ADD_NEW_CONTINGENCY_FRM.fields.acceptance.value;
    }
    Validator.resetFormData(this.ADD_NEW_CONTINGENCY_FRM);
  }

  @action
  setAddressFields = (place, index) => {
    Validator.setAddressFieldsIndex(place, this.LEADERSHIP_FRM, 'data', index);
  }

  @action
  resetMe = (form, ref) => {
    this[form] = Validator.prepareFormObject(ref || emptyDataSet);
  }
  /*
  *  Set form data
  */
  @action
  setDataForFields = (fields, data, form) => {
    Object.keys(fields).map((key) => {
      try {
        if (fields[key] && Array.isArray(toJS(fields[key]))) {
          if (data[key] && data[key].length > 0) {
            const addRec = data[key].length - toJS(fields[key]).length;
            for (let i = addRec; i > 0; i -= 1) {
              this.addMore(form, key);
            }
            data[key].forEach((record, index) => {
              this.setDataForFields(fields[key][index], data[key][index]);
            });
          }
        } else if (fields[key].objRef) {
          let tempRef = false;
          fields[key].objRef.split('.').map((k) => {
            tempRef = !tempRef ? data[k] : tempRef[k];
            return tempRef;
          });
          if (typeof tempRef[key] === 'object' && tempRef[key].__typename === 'FileObjectType') {
            fields[key].value = tempRef[key].fileName;
            fields[key].fileId = tempRef[key].fileId;
          } else {
            const fieldref = key.split('_');
            fields[key].value = fields[key].find ?
              tempRef.find(o => o[fields[key].find].toLowerCase() === fieldref[0])[fieldref[1]] :
              tempRef[key];
          }
        } else {
          fields[key].value = data && typeof data === 'string' ? data : data[key];
        }
        if (fields[key].refSelector) {
          fields[key].refSelector.value = fields[key].value !== '';
        }
      } catch (e) {
        // do nothing
      }
      return null;
    });
  }
  @action
  setFormData = (form, ref, ref2, ref3) => {
    const { offer } = offeringsStore;
    if (!offer) {
      return false;
    }
    const { fields } = this[form];
    const data = ref ? (ref2 ? (ref3 ? offer[ref][ref2][ref3] : offer[ref][ref2]) : offer[ref]) :
      offer;
    if (this[form].fields.data && Array.isArray(toJS(this[form].fields.data))) {
      this.resetMe(form);
      if (data && data.length > 0) {
        data.forEach((record, index) => {
          this.addMore(form);
          this.setDataForFields(this[form].fields.data[index], data[index], form);
        });
      }
    } else {
      this.setDataForFields(this[form].fields, data, form);
    }
    this.initLoad.push(form);
    return false;
  }

  @action
  evaluateFormData = (fields) => {
    let inputData = {};
    map(fields, (ele, key) => {
      try {
        const records = toJS(fields[key]);
        if (fields[key] && Array.isArray(records)) {
          if (fields[key] && fields[key].length > 0) {
            inputData = { ...inputData, [key]: [] };
            let arrObj = [];
            records.forEach((field) => {
              let arrayFieldsKey = {};
              let arrayFields = [];
              map(field, (eleV, keyRef1) => {
                if (field[keyRef1].objType !== 'array') {
                  arrayFields = {};
                }
                if (eleV.objRefOutput) {
                  if (field[keyRef1].objType && field[keyRef1].objType === 'FileObjectType') {
                    const fileObj =
                      { fileId: field[keyRef1].fileId, fileName: field[keyRef1].value };
                    arrayFields = { ...arrayFields, [keyRef1]: fileObj };
                  } else {
                    arrayFields =
                      { ...arrayFields, [keyRef1]: field[keyRef1].value };
                  }
                } else if (field[keyRef1].objType && field[keyRef1].objType === 'FileObjectType') {
                  const fileObj =
                      { fileId: field[keyRef1].fileId, fileName: field[keyRef1].value };
                  arrayFields = { ...arrayFields, [keyRef1]: fileObj };
                } else if (field[keyRef1].objType === 'array') {
                  arrayFields.push(field[keyRef1].value);
                } else {
                  arrayFields = { [keyRef1]: field[keyRef1].value };
                }
                if (field[keyRef1].objType === 'array') {
                  arrayFieldsKey = { ...arrayFieldsKey, [keyRef1]: arrayFields };
                } else {
                  arrayFieldsKey = { ...arrayFieldsKey, ...arrayFields };
                  // if (eleV.objRefOutput) {
                  //   arrayFieldsKey = has(arrayFieldsKey, [eleV.objRefOutput]) ?
                  //     { ...arrayFieldsKey, [eleV.objRefOutput]: arrayFieldsKey } :
                  //     { [eleV.objRefOutput]: arrayFieldsKey };
                  // }
                }
              });
              arrObj = [...arrObj, arrayFieldsKey];
              inputData = { ...inputData, [key]: { ...inputData[key], ...arrObj } };
            });
          }
        } else if (fields[key].objRefOutput) {
          if (fields[key].objType && fields[key].objType === 'FileObjectType') {
            const fileObj = { fileId: fields[key].fileId, fileName: fields[key].value };
            inputData = { ...inputData, [fields[key].objRefOutput]: { [key]: fileObj } };
          } else {
            inputData = { ...inputData, [fields[key].objRefOutput]: { [key]: fields[key].value } };
          }
        } else if (fields[key].objType && fields[key].objType === 'FileObjectType') {
          const fileObj = { fileId: fields[key].fileId, fileName: fields[key].value };
          inputData = { ...inputData, [key]: fileObj };
        } else {
          inputData = { ...inputData, [key]: fields[key].value };
        }
      } catch (e) {
        // do nothing
      }
    });
    return inputData;
  }

  updateOffering = (id, fields, keyName, subkey) => {
    const { getOfferingById } = offeringsStore.offerData.data;
    const payloadData = {
      applicationId: getOfferingById.applicationId,
      issuerId: getOfferingById.issuerId,
    };
    if (subkey) {
      payloadData[keyName] = {};
      payloadData[keyName][subkey] = this.evaluateFormData(fields);
    } else {
      payloadData[keyName] = this.evaluateFormData(fields);
    }
    uiStore.setProgress();
    client
      .mutate({
        mutation: updateOffering,
        variables: {
          id,
          offeringDetails: payloadData,
        },
      })
      .then(() => {
        Helper.toast(`${keyName} has been saved successfully.`, 'success');
      })
      .catch((err) => {
        uiStore.setErrors(DataFormatter.getSimpleErr(err));
        Helper.toast('Something went wrong.', 'error');
      })
      .finally(() => {
        uiStore.setProgress(false);
      });
  }
}

export default new OfferingCreationStore();
