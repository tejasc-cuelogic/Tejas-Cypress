/* eslint-disable no-underscore-dangle */
import { toJS } from 'mobx';
import Validator from 'validatorjs';
import moment from 'moment';
import { mapValues, replace, map, mapKeys, isArray, toArray, reduce, includes } from 'lodash';
import CustomValidations from './CustomValidations';
import Helper from '../utility';

class FormValidator {
  emptyDataSet = { data: [] };
  prepareFormObject =
    (fields, isDirty = false, isFieldValid = true, isValid = false, metaData) => ({
      fields: { ...fields },
      refMetadata: metaData ? { ...metaData } : { ...fields },
      meta: {
        isValid,
        error: '',
        isDirty,
        isFieldValid,
      },
      response: {},
    });
  pullValues = (e, data) => ({
    name: typeof data === 'undefined' ? e.target.name : data.name,
    value: typeof data === 'undefined' ? e.target.value : data.value,
  });
  pullValuesForPassword = e => ({
    name: 'password',
    value: e.password,
  });
  pullValuesForCangePassword = e => ({
    name: 'newPasswd',
    value: e.newPasswd,
  });
  onChange = (form, element, type, isDirty = true, checked = undefined) => {
    CustomValidations.loadCustomValidations(form);
    const currentForm = form;
    let customErrMsg = {};
    if (element && element.name) {
      if (type === 'checkbox' || (Array.isArray(toJS(currentForm.fields[element.name].value)) && type !== 'dropdown')) {
        const index = currentForm.fields[element.name].value.indexOf(element.value);
        if (index === -1) {
          currentForm.fields[element.name].value.push(element.value);
        } else {
          currentForm.fields[element.name].value.splice(index, 1);
        }
      } else if (checked) {
        currentForm.fields[element.name].value = checked.value;
      } else {
        currentForm.fields[element.name].value = element.value;
      }
      customErrMsg = (currentForm.fields[element.name] &&
        currentForm.fields[element.name].customErrors) ?
        currentForm.fields[element.name].customErrors : {};
    }
    const validation = new Validator(
      mapValues(currentForm.fields, f => f.value),
      mapValues(currentForm.fields, f => f.rule),
      customErrMsg,
    );
    currentForm.meta.isValid = validation.passes();
    if (element && element.name) {
      currentForm.fields[element.name].error = validation.errors.first(element.name);
      if (currentForm.fields[element.name].error === false) {
        currentForm.meta.isFieldValid = true;
      } else {
        currentForm.meta.isFieldValid = false;
      }
      currentForm.fields[element.name].error = validation.errors.first(element.name) ?
        replace(
          validation.errors.first(element.name),
          element.name,
          currentForm.fields[element.name].label,
        ) : undefined;
    }
    currentForm.meta.isDirty = isDirty;
    return currentForm;
  }
  validateForm = (form, isMultiForm = false, showErrors = false, isBusinessPlanRequired = true) => {
    CustomValidations.loadCustomValidations(form);
    const currentForm = form;
    let validation;
    if (!isMultiForm) {
      validation = new Validator(
        mapValues(currentForm.fields, f => f.value),
        mapValues(currentForm.fields, f => f.rule),
        {
          required: 'required',
          required_if: 'required',
        },
      );
    } else {
      const formData = this.ExtractFormValues(toJS(currentForm.fields));
      let formRules = this.ExtractFormRules(toJS(currentForm.fields));
      if (isBusinessPlanRequired) {
        formRules = {
          ...formRules,
          businessPlan: 'required',
        };
      } else {
        formRules = {
          ...formRules,
        };
      }
      validation = new Validator(
        formData,
        formRules,
        {
          required: 'required',
        },
      );
    }
    currentForm.meta.isValid = validation.passes();
    if (validation.errorCount && showErrors) {
      const { errors } = validation.errors;
      map(errors, (error, key) => {
        const [err] = error;
        if (includes(key, '.')) {
          const field = key.split('.');
          if (field[0] === 'businessPlan') {
            currentForm.fields[field[0]].error = err;
          } else {
            currentForm.fields[field[0]][field[1]][field[2]].error = err;
          }
        } else {
          currentForm.fields[key].error = err;
        }
      });
    }
    return currentForm;
  }

  onArrayFieldChange =
    (form, element, formName = null, formIndex = -1, type, checked = undefined) => {
      CustomValidations.loadCustomValidations(form);
      const currentForm = form;
      let currentFormRelative;
      let fieldName = element.name;
      let customErrMsg = {};
      if (formIndex > -1 && formName) {
        currentFormRelative = currentForm.fields[formName][formIndex];
        fieldName = `${formName}.${formIndex}.${element.name}`;
      } else if (formName) {
        currentFormRelative = currentForm.fields[formName];
        fieldName = `${formName}.${element.name}`;
      } else {
        currentFormRelative = currentForm.fields;
      }
      if (element.name) {
        if (type === 'checkbox' || (Array.isArray(toJS(currentFormRelative[element.name].value)) && type !== 'dropdown')) {
          const index = currentFormRelative[element.name]
            .value.indexOf(element.value);
          if (index === -1) {
            currentFormRelative[element.name].value.push(element.value);
          } else {
            currentFormRelative[element.name].value.splice(index, 1);
          }
        } else if (checked) {
          currentFormRelative[element.name].value = checked.value;
        } else {
          currentFormRelative[element.name].value = element.value;
        }
        customErrMsg = (currentFormRelative[element.name] &&
          currentFormRelative[element.name].customErrors) ?
          currentFormRelative[element.name].customErrors : {};
      }
      const formData = this.ExtractFormValues(toJS(currentForm.fields));
      const formRules = this.ExtractFormRules(toJS(currentForm.fields));
      const validation = new Validator(
        formData,
        formRules,
        customErrMsg,
      );
      currentForm.meta.isValid = validation.passes();
      if (element && element.name) {
        currentFormRelative[element.name].error = validation.errors.first(fieldName);
      }
      return currentForm;
    }
  ExtractValues = fields => mapValues(fields, f => f.value);
  ExtractFormValues = fields => mapValues(fields, f =>
    (isArray(f) ? toArray(mapValues(f, d => mapValues(d, s => s.value))) :
      f.value));
  ExtractFormRules = fields => reduce(mapValues(fields, (f, key) =>
    (isArray(f) ? mapKeys(mapValues(f[0], k => k.rule), (s, v) => `${key}.*.${v}`) :
      mapKeys(v => `${key}.${v.rule}`))), (a, b) => Object.assign(a, b));
  resetFormData = (form, targetedFields) => {
    const currentForm = form;
    const fieldsToReset = targetedFields || Object.keys(currentForm.fields);
    fieldsToReset.map((field) => {
      if (Array.isArray(toJS(currentForm.fields[field].value))) {
        currentForm.fields[field].value = [];
        if (currentForm.fields[field].objType === 'FileObjectType') {
          currentForm.fields[field].fileId = [];
          currentForm.fields[field].fileData = [];
          currentForm.fields[field].preSignedUrl = [];
        }
      } else {
        currentForm.fields[field].value = '';
        if (currentForm.fields[field].objType === 'FileObjectType') {
          currentForm.fields[field].fileId = '';
          currentForm.fields[field].fileData = '';
          currentForm.fields[field].preSignedUrl = '';
        }
      }
      currentForm.fields[field].error = undefined;
      currentForm.response = {};
      return true;
    });
    currentForm.meta.isValid = false;
    currentForm.meta.error = '';
    return currentForm;
  }
  setAddressFields = (place, form) => {
    const currentForm = form;
    const data = Helper.gAddressClean(place);
    if (currentForm.fields.street) {
      this.onChange(currentForm, { name: 'street', value: data.residentalStreet });
    } else {
      this.onChange(currentForm, { name: 'residentalStreet', value: data.residentalStreet });
    }
    this.onChange(currentForm, { name: 'state', value: data.state });
    this.onChange(currentForm, { name: 'city', value: data.city });
    this.onChange(currentForm, { name: 'zipCode', value: data.zipCode });
  }

  setAddressFieldsIndex = (place, form, formName, subForm = 'data', index) => {
    const currentForm = form;
    const data = Helper.gAddressClean(place);
    if (currentForm.fields[subForm][index].street) {
      this.onArrayFieldChange(currentForm, { name: 'street', value: data.residentalStreet }, subForm, index);
    } else {
      this.onArrayFieldChange(currentForm, { name: 'residentalStreet', value: data.residentalStreet }, subForm, index);
    }
    this.onArrayFieldChange(currentForm, { name: 'state', value: data.state }, subForm, index);
    this.onArrayFieldChange(currentForm, { name: 'city', value: data.city }, subForm, index);
    this.onArrayFieldChange(currentForm, { name: 'zip', value: data.zipCode }, subForm, index);
  }

  setIsDirty = (form, status) => {
    const currentForm = form;
    currentForm.meta.isDirty = status;
  }
  setFormError = (form, key, error) => {
    const currentForm = form;
    currentForm.fields[key].error = error;
    if (error) {
      currentForm.meta.isValid = false;
      currentForm.meta.isFieldValid = false;
    }
  }
  resetFormToEmpty = metaData => this.prepareFormObject(metaData || this.emptyDataSet);

  getMetaData = form => form.refMetadata;

  getRefFromObjRef = (objRef, data) => {
    let tempRef = false;
    objRef.split('.').map((k) => {
      tempRef = !tempRef ? data[k] : tempRef[k];
      return tempRef;
    });
    return tempRef;
  }
  addMoreRecordToSubSection = (form, key, count = 1, defaultBlank = false) => {
    const currentForm = form;
    currentForm.fields[key] = currentForm.fields[key] && currentForm.fields[key][0] ?
      this.addMoreFields(currentForm.fields[key], count) : (
        defaultBlank ? currentForm.refMetadata[key] : []
      );
    currentForm.meta = { ...currentForm.meta, isValid: false };
    return currentForm;
  }
  addMoreFields = (fields, count = 1) => {
    const arrayData = [...toJS(fields)];
    for (let i = count; i > 0; i -= 1) {
      arrayData.push(this.resetMoreFieldsObj(toJS(fields)[0]));
    }
    return arrayData;
  }
  resetMoreFieldsObj = (formFields) => {
    const fields = formFields;
    Object.keys(fields).forEach((key) => {
      if (fields[key] && Array.isArray(toJS(fields[key]))) {
        fields[key] = this.resetMoreFieldsObj(fields[key]);
      } else if (fields[key].objType === 'FileObjectType') {
        fields[key] = {
          ...fields[key],
          ...{
            value: '', fileId: '', preSignedUrl: '', fileData: '',
          },
        };
      } else {
        fields[key].value = typeof fields[key].value === 'number' ? 0 : '';
      }
    });
    return fields;
  }
  setDataForLevel = (refFields, data, keepAtLeastOne) => {
    const fields = { ...refFields };
    Object.keys(fields).map((key) => {
      try {
        if (fields[key] && Array.isArray(toJS(fields[key]))) {
          const tempRef = toJS(fields[key])[0].objRef ?
            this.getRefFromObjRef(fields[key][0].objRef, data) : false;
          if ((data && data[key] && data[key].length > 0) ||
            (tempRef && tempRef[key] && tempRef[key].length > 0)) {
            const addRec = ((data[key] && data[key].length) ||
              (tempRef[key] && tempRef[key].length)) - toJS(fields[key]).length;
            fields[key] = this.addMoreFields(fields[key], addRec);
            (data[key] || tempRef[key]).forEach((record, index) => {
              fields[key][index] = this.setDataForLevel(
                fields[key][index],
                (data[key] && data[key][index]) || (tempRef[key] && tempRef[key][index]),
                keepAtLeastOne,
              );
            });
          } else if (!keepAtLeastOne) {
            fields[key] = [];
          }
        } else if (fields[key].objRef) {
          const tempRef = this.getRefFromObjRef(fields[key].objRef, data);
          if (fields[key].objType === 'FileObjectType') {
            if (tempRef[key] && Array.isArray(toJS(tempRef[key])) &&
              fields[key] && Array.isArray(toJS(fields[key].value))) {
              if (tempRef[key].length > 0) {
                tempRef[key].map((item) => {
                  fields[key].value.push(item.fileName);
                  fields[key].fileId.push(item.fileId);
                  return false;
                });
              } else {
                fields[key].value = [];
                fields[key].fileId = [];
              }
            } else {
              fields[key].value = Array.isArray(toJS(tempRef[key])) ?
                tempRef[key][0].fileName : tempRef[key].fileName;
              fields[key].fileId = Array.isArray(toJS(tempRef[key])) ?
                tempRef[key][0].fileId : tempRef[key].fileId;
            }
            // fields[key].value = (tempRef[key] && Array.isArray(toJS(tempRef[key])) &&
            // tempRef[key].length) ? tempRef[key][0].fileName : tempRef[key].fileName;
            // fields[key].fileId = (tempRef[key] && Array.isArray(toJS(tempRef[key])) &&
            // tempRef[key].length) ? tempRef[key][0].fileId : tempRef[key].fileId;
          } else if (fields[key].objType === 's3File') {
            if (fields[key] && Array.isArray(fields[key])) {
              if (fields[key].length) {
                tempRef[key].map((item) => {
                  fields[key].preSignedUrl.push(item.url);
                  fields[key].value.push(item.fileName);
                  return false;
                });
              }
            } else {
              fields[key].value = tempRef[key].fileName;
              fields[key].preSignedUrl = tempRef[key].url;
            }
          } else if (fields[key].objType === 'DATE') {
            fields[key].value = tempRef[key] ? moment(tempRef[key]).format('MM/DD/YYYY') : '';
          } else {
            const fieldRef = key.split('_');
            fields[key].value = fields[key].find ?
              tempRef.find(o => o[fields[key].find].toLowerCase() === fieldRef[0])[fieldRef[1]] :
              tempRef[key];
          }
        } else if (key === 'value') {
          fields[key] = data && typeof data === 'string' ? data : data[key];
        } else if (fields[key].objType === 'FileObjectType') {
          if (data[key] && Array.isArray(toJS(data[key])) &&
            fields[key] && Array.isArray(toJS(fields[key].value))) {
            if (data[key].length > 0) {
              data[key].map((item) => {
                fields[key].value.push(item.fileName);
                fields[key].fileId.push(item.fileId);
                return false;
              });
            } else {
              fields[key].value = [];
              fields[key].fileId = [];
            }
          } else {
            fields[key].value = data && typeof data === 'string' ? data : Array.isArray(toJS(data[key])) ? data[key][0].fileName : data[key].fileName;
            fields[key].fileId = data && typeof data === 'string' ? data : Array.isArray(toJS(data[key])) ? data[key][0].fileId : data[key].fileId;
          }
        } else if (fields[key].objType === 's3File') {
          if (data[key] && Array.isArray(data[key])) {
            if (data[key].length) {
              data[key].map((item) => {
                fields[key].preSignedUrl.push(item.url);
                fields[key].value.push(item.fileName);
                return false;
              });
            }
          } else {
            fields[key].value = data && typeof data === 'string' ? data : data[key].fileName;
            fields[key].preSignedUrl = data && typeof data === 'string' ? data : data[key].url;
          }
        } else if (fields[key].objType === 'DATE') {
          fields[key].value = data && typeof data === 'string' ? moment(data).format('MM/DD/YYYY') : data[key] ? moment(data[key]).format('MM/DD/YYYY') : '';
        } else {
          fields[key].value = data && typeof data === 'object' ? (data[key] !== null && data[key] !== '' && data[key] !== undefined) ? data[key] : fields[key].value : data;
        }
        if (fields[key].refSelector) {
          fields[key].refSelectorValue = fields[key].value !== '';
          if (fields[key].value !== undefined) {
            fields[fields[key].refSelector].value = (fields[key].value !== null && fields[key].value !== '');
          }
        }
      } catch (e) {
        // do nothing
      }
      return fields;
    });
    return fields;
  }
  setFormData = (form, dataSrc, ref, keepAtLeastOne = true) => {
    let currentForm = form;
    const data = ref ? this.getRefFromObjRef(ref, dataSrc) : dataSrc;
    currentForm = this.resetFormToEmpty(currentForm.refMetadata);
    currentForm.fields = this.setDataForLevel(currentForm.fields, data, keepAtLeastOne);
    return currentForm;
  };
  evaluateObjectRef = (objRef, inputData, key, value) => {
    let tempRef = inputData;
    const rejObjects = objRef.split('.');
    if (rejObjects.length === 1) {
      tempRef = { ...inputData, [rejObjects[0]]: { ...inputData[[rejObjects[0]]], [key]: value } };
    } else if (rejObjects.length === 2) {
      tempRef = {
        ...inputData,
        [rejObjects[0]]: { [rejObjects[1]]: { ...inputData[[rejObjects[1]]], [key]: value } },
      };
    } else if (rejObjects.length === 3) {
      tempRef = {
        ...inputData,
        [rejObjects[0]]: {
          [rejObjects[1]]: { [rejObjects[2]]: { ...inputData[[rejObjects[2]]], [key]: value } },
        },
      };
    }
    return tempRef;
  }

  evalS3FileObj = (fileData) => {
    const fileObj = toJS(fileData);
    let fileObjOutput;
    if (Array.isArray(fileObj.preSignedUrl)) {
      fileObjOutput =
        map(fileObj.preSignedUrl, (file, index) => ({
          id: fileObj.fileId[index] || Helper.guid(),
          isPublic: true,
          url: file,
          fileName: fileObj.value[index],
        }));
    } else {
      fileObjOutput = fileObj.value ? {
        id: fileObj.fileId || Helper.guid(),
        url: fileObj.preSignedUrl || fileObj.value,
        fileName: fileObj.value,
        isPublic: true,
      } : null;
    }
    return fileObjOutput;
  }

  evalFileObj = (fileData) => {
    const fileObj = toJS(fileData);
    let fileObjOutput;
    if (Array.isArray(fileObj.fileId)) {
      fileObjOutput =
        map(fileObj.fileId, (file, index) => ({ fileId: file, fileName: fileObj.value[index] }));
    } else {
      fileObjOutput = { fileId: fileData.fileId ? fileData.fileId : '', fileName: fileData.value ? fileData.value : '' };
    }
    return fileObjOutput;
  }
  // evalFileObj = fileData => ({ fileId: fileData.fileId, fileName: fileData.value });

  evalDateObj = date => moment(date, 'MM/DD/YYYY').toISOString();

  evaluateFormData = (fields) => {
    let inputData = {};
    map(fields, (ele, key) => {
      try {
        if (!fields[key].skipField) {
          const records = toJS(fields[key]);
          let reference = false;
          if (fields[key] && Array.isArray(records)) {
            if (fields[key] && fields[key].length > 0) {
              const arrObj = [];
              records.forEach((field) => {
                let arrayFieldsKey = {};
                let arrayFields = {};
                map(field, (eleV, keyRef1) => {
                  if (!eleV.skipField) {
                    let reference2 = false;
                    let reference2Val = field[keyRef1].value;
                    if (eleV.objRefOutput && !reference) {
                      reference = eleV.objRefOutput;
                    }
                    if (eleV.objRefOutput2 && !reference2) {
                      reference2 = eleV.objRefOutput2;
                    }
                    if (field[keyRef1].objType && field[keyRef1].objType === 'FileObjectType') {
                      reference2Val = this.evalFileObj(field[keyRef1]);
                    } else if (field[keyRef1].objType && field[keyRef1].objType === 's3File') {
                      reference2Val = this.evalS3FileObj(field[keyRef1]);
                      // {
                      //   id: 1,
                      //   url: field[keyRef1].preSignedUrl,
                      //   fileName: field[keyRef1].value,
                      //   isPublic: true,
                      // };
                    } else if (field[keyRef1].objType && field[keyRef1].objType === 'DATE') {
                      reference2Val = this.evalDateObj(field[keyRef1].value);
                    }
                    if (reference2) {
                      arrayFields =
                        this.evaluateObjectRef(reference2, arrayFields, [keyRef1], reference2Val);
                    } else {
                      arrayFields = { ...arrayFields, [keyRef1]: reference2Val };
                    }
                    arrayFieldsKey = { ...arrayFieldsKey, ...arrayFields };
                  }
                });
                arrObj.push(arrayFieldsKey);
                if (reference) {
                  inputData = this.evaluateObjectRef(reference, inputData, [key], arrObj);
                } else {
                  inputData = { ...inputData, [key]: arrObj };
                }
              });
            }
          } else {
            if (fields[key].objRefOutput && !reference) {
              reference = fields[key].objRefOutput;
            }
            let objValue = fields[key].value;
            if (fields[key].objType && fields[key].objType === 'FileObjectType') {
              objValue = this.evalFileObj(fields[key]);
            } else if (fields[key].objType && fields[key].objType === 'DATE') {
              objValue = this.evalDateObj(fields[key].value);
            } else if (fields[key].objType && fields[key].objType === 's3File') {
              objValue = this.evalS3FileObj(fields[key]);
              // {
              //   id: 1,
              //   url: fields[key].preSignedUrl,
              //   fileName: fields[key].value,
              //   isPublic: true,
              // };
            }
            if (reference) {
              inputData = this.evaluateObjectRef(reference, inputData, [key], objValue);
            } else if (fields[key].refSelector !== undefined
              && fields[fields[key].refSelector].value !== undefined) {
              let val = '';
              if (fields[fields[key].refSelector].value) {
                if (fields[key].value !== '' && fields[key].value !== undefined && fields[key].value !== null) {
                  val = objValue;
                } else {
                  val = fields[key].defaultValue;
                }
              }
              inputData = { ...inputData, [key]: val };
            } else {
              inputData = { ...inputData, [key]: objValue };
            }
          }
        }
      } catch (e) {
        console.log(e);
      }
    });
    return inputData;
  }
}
export default new FormValidator();
