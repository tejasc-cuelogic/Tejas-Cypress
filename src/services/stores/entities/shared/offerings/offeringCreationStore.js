/* eslint-disable no-unused-vars, no-param-reassign, no-underscore-dangle */
import { observable, toJS, action } from 'mobx';
import { map, startCase, isArray } from 'lodash';
import graphql from 'mobx-apollo';
import { ADD_NEW_TIER, AFFILIATED_ISSUER, LEADER, MEDIA, RISK_FACTORS, GENERAL, ISSUER, LEADERSHIP, OFFERING_DETAILS, CONTINGENCIES, ADD_NEW_CONTINGENCY, COMPANY_LAUNCH, SIGNED_LEGAL_DOCS, KEY_TERMS, OFFERING_OVERVIEW, OFFERING_COMPANY, OFFER_CLOSE, ADD_NEW_BONUS_REWARD } from '../../../../constants/admin/offerings';
import { FormValidator as Validator, DataFormatter } from '../../../../../helper';
import { deleteBac, updateOffering, getOfferingDetails, getOfferingBac, createBac, updateBac } from '../../../queries/offerings/manage';
import { GqlClient as client } from '../../../../../api/gqlApi';
import Helper from '../../../../../helper/utility';
import { offeringsStore, uiStore } from '../../../index';

export class OfferingCreationStore {
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
  @observable LEADERSHIP_FRM = Validator.prepareFormObject(LEADERSHIP);
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
  @observable contingencyFormSelected = undefined;
  @observable confirmModal = false;
  @observable confirmModalName = null;
  @observable removeIndex = null;
  @observable initLoad = [];
  @observable currentOfferingId = null;
  @observable issuerOfferingBac = {};
  @observable affiliatedIssuerOfferingBac = {};
  @observable leadershipOfferingBac = {};

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
  removeData = (formName, subForm = 'data', isApiDelete = false) => {
    if (!isApiDelete) {
      this[formName].fields[subForm].splice(this.removeIndex, 1);
    }
    Validator.validateForm(this[formName], true, false, false);
    this.confirmModal = !this.confirmModal;
    this.confirmModalName = null;
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
  formArrayChange = (e, result, form, subForm = '', index) => {
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
    this[form] = Validator.addMoreRecordToSubSection(this[form], key);
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
    Validator.setAddressFieldsIndex(place, this.LEADERSHIP_FRM, 'data', index);
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
    this[form] = Validator.setFormData(this[form], offer, ref, keepAtLeastOne);
    this.initLoad.push(form);
    return false;
  }

  @action
  setBacFormData = (form, data, ref) => {
    this[form] = Validator.setFormData(this[form], data, ref);
    this.initLoad.push(form);
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

  @action
  evaluateFormData = (fields) => {
    let inputData = {};
    map(fields, (ele, key) => {
      try {
        const records = toJS(fields[key]);
        if (fields[key] && Array.isArray(records)) {
          if (fields[key] && fields[key].length > 0) {
            inputData = { ...inputData, [key]: [] };
            const arrObj = [];
            records.forEach((field) => {
              let arrayFieldsKey = {};
              let arrayFields = {};
              map(field, (eleV, keyRef1) => {
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
                } else {
                  arrayFields = { [keyRef1]: field[keyRef1].value };
                }
                arrayFieldsKey = { ...arrayFieldsKey, ...arrayFields };
                // if (eleV.objRefOutput) {
                //   arrayFieldsKey = has(arrayFieldsKey, [eleV.objRefOutput]) ?
                //     { ...arrayFieldsKey, [eleV.objRefOutput]: arrayFieldsKey } :
                //     { [eleV.objRefOutput]: arrayFieldsKey };
                // }
              });
              arrObj.push(arrayFieldsKey);
              inputData = { ...inputData, [key]: arrObj };
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
        } else if (fields[key].objType && fields[key].objType === 'businessPhone') {
          const fileObj = { number: fields[key].value, countryCode: '1' };
          inputData = { ...inputData, businessPhone: fileObj };
        } else if (fields[key].objType && fields[key].objType === 'reachedMinOfferingGoal') {
          const fileObj = { reachedMinOfferingGoal: fields[key].value };
          inputData = { ...inputData, useOfProceeds: fileObj };
        } else if (fields[key].objType && fields[key].objType === 'reachedMaxOfferingGoal') {
          const fileObj = { reachedMaxOfferingGoal: fields[key].value };
          inputData = { ...inputData, useOfProceeds: { ...inputData.useOfProceeds, ...fileObj } };
        } else if (fields[key].toSkip) {
          inputData = { ...inputData };
        } else {
          inputData = { ...inputData, [key]: fields[key].value };
        }
      } catch (e) {
        // do nothing
      }
    });
    return inputData;
  }

  updateOffering = (id, fields, keyName, subKey) => {
    const { getOfferingById } = offeringsStore.offerData.data;
    let payloadData = {
      applicationId: getOfferingById.applicationId,
      issuerId: getOfferingById.issuerId,
    };
    if (subKey) {
      payloadData = { ...payloadData, [keyName]: { [subKey]: Validator.evaluateFormData(fields) } };
      if (subKey === 'overview') {
        payloadData.offering.overview = {
          ...payloadData.offering.overview,
          ...this.evaluateFormFieldToArray(fields),
        };
      }
    } else if (keyName) {
      payloadData = { ...payloadData, [keyName]: Validator.evaluateFormData(fields) };
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
        Helper.toast(`${startCase(keyName) || 'Offering'} has been saved successfully.`, 'success');
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
    this.affiliatedIssuerOfferingBac = graphql({
      client,
      fetchPolicy: 'network-only',
      query: getOfferingBac,
      variables: { offeringId, bacType },
      onFetch: (res) => {
        if (res && res.getOfferingBac) {
          this.setBacFormData('LEADER_FRM', res || {}, false);
        }
      },
    });
  }

  createOrUpdateOfferingBac = (bacType, fields, issuerNumber = undefined) => {
    const { getOfferingById } = offeringsStore.offerData.data;
    const { issuerBacId } = getOfferingById.legal;
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
      const { affiliatedIssuerBacId } = getOfferingById.legal;
      if (affiliatedIssuerBacId === null ||
        (Array.isArray(toJS(affiliatedIssuerBacId)) && !affiliatedIssuerBacId[issuerNumber])) {
        mutation = createBac;
        variables = {
          offeringBacDetails: payload,
        };
      } else {
        mutation = updateBac;
        variables = {
          offeringBacDetails: payload,
          id: affiliatedIssuerBacId[issuerNumber],
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

  deleteBac = (issuerIndex) => {
    const { getOfferingById } = offeringsStore.offerData.data;
    const { affiliatedIssuerBacId } = getOfferingById.legal;
    const bacType = 'AFFILIATED_ISSUER';
    uiStore.setProgress();
    client
      .mutate({
        mutation: deleteBac,
        variables: {
          id: affiliatedIssuerBacId[issuerIndex],
          offeringId: this.currentOfferingId,
        },
        refetchQueries: [{
          query: getOfferingBac,
          variables: { offeringId: this.currentOfferingId, bacType },
        }],
      })
      .then(() => {
        Helper.toast('Affiliated Issuer has been deleted successfully.', 'success');
      })
      .catch(action((err) => {
        uiStore.setErrors(DataFormatter.getSimpleErr(err));
        Helper.toast('Something went wrong.', 'error');
      }))
      .finally(() => {
        uiStore.setProgress(false);
      });
  }
}

export default new OfferingCreationStore();
