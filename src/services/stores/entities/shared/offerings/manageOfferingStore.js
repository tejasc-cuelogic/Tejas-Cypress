import { decorate, observable, action, computed, toJS } from 'mobx';
import { startCase, get, filter, orderBy } from 'lodash';
import cleanDeep from 'clean-deep';
import omitDeep from 'omit-deep';
import { FormValidator as Validator, DataFormatter } from '../../../../../helper';
import DataModelStore, * as dataModelStore from '../dataModelStore';
import { INVEST_NOW_TOC, INVEST_NOW_PAGE } from '../../../../constants/offering/formMeta';
import Helper from '../../../../../helper/utility';
import { GqlClient as client } from '../../../../../api/gqlApi';
import { offeringCreationStore, offeringsStore, uiStore } from '../../../index';
import { offeringUpsert } from '../../../queries/offerings/manageOffering';


export class ManageOfferingStore extends DataModelStore {
  INVEST_NOW_TOC_FRM = Validator.prepareFormObject(INVEST_NOW_TOC);

  INVEST_NOW_PAGE_FRM = Validator.prepareFormObject(INVEST_NOW_PAGE);

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

  investNowAddData = (params) => {
    const { form, regulation, page, type, tocIndex } = params;
    const agreementLists = this.getAgreementTocList;
    const { offer } = offeringsStore;
    let investNow = get(offer, 'investNow.page') || [];
    if (['TOC_EDIT', 'PAGE_EDIT', 'TOC_REQUIRED'].includes(type)) {
      let formData;
      if (type !== 'TOC_REQUIRED') {
        formData = Validator.evaluateFormData(this[form].fields);
      }
      const index = investNow.findIndex(i => i.page === page && i.regulation === regulation);
      if (['TOC_REQUIRED', 'TOC_EDIT'].includes(type) && tocIndex >= 0) {
        const editTOC = type === 'TOC_EDIT' ? {
          label: formData.label,
          required: formData.required,
          account: formData.account,
        } : { required: !investNow[index].toc[tocIndex].required };
        investNow[index].toc[tocIndex] = { ...investNow[index].toc[tocIndex], ...editTOC };
      } else {
        investNow[index] = { ...investNow[index], title: formData.title };
      }
    } else if (form === 'INVEST_NOW_PAGE_FRM') {
      const formData = Validator.evaluateFormData(this[form].fields);
      const addPage = {
        page: ((agreementLists[regulation] && agreementLists[regulation].length) || 0) + 1,
        regulation,
        title: formData.title,
      };
      investNow.push(addPage);
    } else if (form === 'INVEST_NOW_TOC_FRM') {
      const formData = Validator.evaluateFormData(this[form].fields);
      const agreementToc = investNow.find(i => i.page === page && i.regulation === regulation);
      const addTOC = {
        label: formData.label,
        order: ((agreementToc.toc && agreementToc.toc.length) || 0) + 1,
        required: formData.required,
        account: formData.account,
      };
      investNow = investNow.map(i => ((i.regulation === regulation && i.page === page) ? { ...i, toc: i.toc && i.toc.length ? [...i.toc, addTOC] : [addTOC] } : { ...i }));
    } else if (type === 'PAGE') {
      const index = investNow.findIndex(i => i.page === page && i.regulation === regulation);
      investNow.splice(index, 1);
    } else if (type === 'TOC_DELETE') {
      // delete particular toc
      investNow = investNow.map((i) => {
        let iData;
        if (i.regulation === regulation && i.page === page) {
          i.toc.splice(tocIndex, 1);
          iData = { ...i, toc: i.toc };
        } else {
          iData = { ...i };
        }
        return iData;
      });
    } else if (type === 'REORDER') {
      const index = investNow.findIndex(i => i.page === page && i.regulation === regulation);
      return { index, investNow };
    }
    return { page: investNow };
  }

  updateOffering = params => new Promise((res) => {
    const { keyName, forms, cleanData, offeringData } = params;
    let offeringDetails = {};
    let data;
    if (offeringData) {
      data = offeringData;
    } else if (Array.isArray(forms)) {
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
      data = omitDeep(data, ['__typename', 'fileHandle']);
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

  setFormDataV2 = ({ type, page, regulation, tocIndex }) => {
    const { offer } = offeringsStore;
    const investNow = get(offer, 'investNow.page') ? JSON.parse(JSON.stringify([...get(offer, 'investNow.page')])) : [];
    if (type === 'TOC_EDIT') {
      const index = investNow.findIndex(i => i.page === page && i.regulation === regulation);
      if (index > -1) {
        const pageData = investNow[index];
        const toc = pageData.toc && pageData.toc.length ? pageData.toc[tocIndex] : { };
        this.INVEST_NOW_TOC_FRM = Validator.setFormData(this.INVEST_NOW_TOC_FRM, toc);
        this.INVEST_NOW_TOC_FRM = Validator.validateForm(this.INVEST_NOW_TOC_FRM);
      }
    } else {
      const index = investNow.findIndex(i => i.page === page && i.regulation === regulation);
      if (index > -1) {
        const pageData = investNow[index];
        this.INVEST_NOW_PAGE_FRM = Validator.setFormData(this.INVEST_NOW_PAGE_FRM, pageData);
        this.INVEST_NOW_PAGE_FRM = Validator.validateForm(this.INVEST_NOW_PAGE_FRM);
      }
    }
  }
}

  decorate(ManageOfferingStore, {
    ...dataModelStore.decorateDefault,
    INVEST_NOW_TOC_FRM: observable,
    INVEST_NOW_PAGE_FRM: observable,
    initLoad: observable,
    onDragSaveEnable: observable,
    getAgreementTocList: computed,
    reOrderHandle: action,
    resetInitLoad: action,
    updateOffering: action,
    updateOfferingMutation: action,
    setFormData: action,
    setFormDataV2: action,
  });

export default new ManageOfferingStore();
