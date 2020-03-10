import { decorate, observable, action, computed, toJS } from 'mobx';
import { startCase, get, filter, orderBy } from 'lodash';
import cleanDeep from 'clean-deep';
import { FormValidator as Validator, DataFormatter } from '../../../../../helper';
import DataModelStore, * as dataModelStore from '../dataModelStore';
import { INVEST_NOW_TOC } from '../../../../constants/offering/formMeta';
import Helper from '../../../../../helper/utility';
import { GqlClient as client } from '../../../../../api/gqlApi';
import { offeringCreationStore, offeringsStore, uiStore } from '../../../index';
import { offeringUpsert } from '../../../queries/offerings/manageOffering';


export class ManageOfferingStore extends DataModelStore {
  INVEST_NOW_TOC_FRM = Validator.prepareFormObject(INVEST_NOW_TOC);

  onDragSaveEnable = false;

  initLoad = [];

  // eslint-disable-next-line class-methods-use-this
  get getAgreementTocList() {
    const { offer } = offeringsStore;
    const regulation = get(offer, 'regulation');
    const investNow = get(offer, 'investNow.page') || [];
    const investNowTocs = {};
    if (regulation === 'BD_CF_506C') {
      investNowTocs.BD_506C = orderBy(filter(investNow, i => i.regulation === 'BD_506C'), ['page'], ['asc']);
      investNowTocs.BD_CF = orderBy(filter(investNow, i => i.regulation === 'BD_CF'), ['page'], ['asc']);
    } else {
      investNowTocs[regulation] = orderBy(filter(investNow, i => i.regulation === regulation), ['page'], ['asc']);
    }
    return investNowTocs;
  }

  updateOffering = params => new Promise((res) => {
    const { keyName, forms, cleanData } = params;
    let offeringDetails = {};
    let data;
    if (Array.isArray(forms)) {
      forms.forEach((f) => {
        data = { ...data, ...Validator.evaluateFormData(this[f].fields) };
      });
    } else if (keyName === 'misc') {
      data = offeringCreationStore.evaluateFormFieldToArray(this[forms].fields, false);
      data = { ...data, ...Validator.evaluateFormData(this[forms].fields) };
    } else {
      data = Validator.evaluateFormData(this[forms].fields);
    }
    if (cleanData) {
      data = cleanDeep(data);
    }
    if (keyName) {
      offeringDetails[keyName] = data;
    } else {
      offeringDetails = { ...data };
    }
    const mutationsParams = {
      ...params,
      id: offeringCreationStore.currentOfferingId,
      offeringDetails,
      res,
    };
    console.log(offeringDetails);
    this.updateOfferingMutation(mutationsParams);
  });

  updateOfferingMutation = (params) => {
    const {
      id, offeringDetails, keyName, notify = true, successMsg = undefined, fromS3 = false, res, msgType = 'success',
     } = params;
    uiStore.setProgress('save');
    const variables = {
      id,
      offeringDetails,
    };
    client
      .mutate({
        mutation: offeringUpsert,
        variables,
      })
      .then((data) => {
        this.setFieldValue('onDragSaveEnable', false);
        this.removeUploadedFiles(fromS3);
        if (successMsg) {
          Helper.toast(successMsg, msgType || 'success');
        } else if (notify) {
          Helper.toast(`${keyName ? startCase(keyName) : 'Offering'} has been saved successfully.`, 'success');
        }
        offeringsStore.getOne(get(data, 'data.offeringUpsert.offeringSlug'), false);
        uiStore.setProgress(false);
        res();
      })
      .catch((err) => {
        uiStore.setErrors(DataFormatter.getSimpleErr(err));
        Helper.toast('Something went wrong.', 'error');
        uiStore.setProgress(false);
      });
  };

  getActionType = (formName, getField = 'actionType') => {
    const metaDataMapping = {
      INVEST_NOW_TOC_FRM: { isMultiForm: true },
    };
    return metaDataMapping[formName][getField];
  }

  reOrderHandle = (orderedForm = 'OFFERING_CONTENT_FRM', form, arrayName = 'content') => {
    const content = toJS(orderedForm).map((d, index) => ({ ...d, order: { ...d.order, value: index + 1 } }));
    this.setFieldValue(form, content, `fields.${arrayName}`);
  }

  setFormData = (form, ref, keepAtLeastOne) => {
    Validator.resetFormData(this[form]);
    this.initLoad.push(form);
    const { offer } = offeringsStore;
    if (!offer) {
      return false;
    }
    this[form] = Validator.setFormData(this[form], offer, ref, keepAtLeastOne);
    const multiForm = this.getActionType(form, 'isMultiForm');
    this[form] = Validator.validateForm(this[form], multiForm, false, false);
    return false;
  }
}

  decorate(ManageOfferingStore, {
    ...dataModelStore.decorateDefault,
    INVEST_NOW_TOC_FRM: observable,
    initLoad: observable,
    onDragSaveEnable: observable,
    getAgreementTocList: computed,
    reOrderHandle: action,
    resetInitLoad: action,
    updateOffering: action,
    updateOfferingMutation: action,
    setFormData: action,
  });

export default new ManageOfferingStore();
