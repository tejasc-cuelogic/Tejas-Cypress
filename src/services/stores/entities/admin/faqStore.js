/* eslint-disable no-param-reassign */
import { observable, action, computed, toJS } from 'mobx';
import graphql from 'mobx-apollo';
import { forEach, map, sortBy, kebabCase } from 'lodash';
import { GqlClient as clientPrivate } from '../../../../api/gqlApi';
import { FormValidator as Validator, ClientDb } from '../../../../helper';
import Helper from '../../../../helper/utility';
import { faqs, getFaqById, upsertFaq, faqsListByFilters, deleteFaq, updateStatus, setOrderForFAQ } from '../../queries/faq';
import { FAQ } from '../../../constants/faq';
import { uiStore } from '../../index';

export class FaqStore {
  @observable data = [];
  @observable db;
  @observable FAQ_FRM = Validator.prepareFormObject(FAQ);
  @observable editMode = false;
  @observable filters = false;
  @observable globalAction = '';
  @observable selectedRecords = [];
  @observable requestState = {
    skip: 0,
    page: 1,
    perPage: 10,
    displayTillIndex: 10,
    filters: false,
    search: {
    },
  };
  @observable confirmBox = {
    entity: '',
    refId: '',
  };
  @observable removeFileIdsList = [];

  @action
  initRequest = () => {
    uiStore.setProgress();
    const query = faqs;
    const client = clientPrivate;
    this.data = graphql({
      client,
      query,
      fetchPolicy: 'network-only',
      onFetch: (res) => {
        if (res && res.faqs) {
          this.setDb(res.faqs);
          uiStore.setProgress(false);
        }
      },
    });
  }
  @action
  setGlobalAction = (name, globalAction) => {
    this[name] = globalAction;
  }
  @action
  setConfirmBox = (entity, refId) => {
    this.confirmBox.entity = entity;
    this.confirmBox.refId = refId;
  }
  @action
  addSelectedRecord = (id) => {
    this.isReadOnly = false;
    this.selectedRecords.push(id);
    if (this.selectedRecords.length === this.allFaqs.length) {
      this.selectedRecords.push('all');
    }
  }
  @action
  removeUnSelectedRecord = (id) => {
    this.selectedRecords = this.selectedRecords.filter(recordId => recordId !== id);
    if (id !== 'all') {
      this.selectedRecords = this.selectedRecords.filter(recordId => recordId !== 'all');
    }
  }

  @action
  applyGlobalAction = () => {
    const idArr = this.selectedRecords;
    const status = this.globalAction;
    this.data.loading = true;
    if (status === 'delete') {
      this.deleteRecords(idArr);
    } else {
      this.updateRecordStatus(idArr, status);
    }
  }

  updateRecordStatus = (id, status) => {
    uiStore.setProgress();
    clientPrivate.mutate({
      mutation: updateStatus,
      variables: {
        id,
        itemStatus: status,
      },
      refetchQueries: [{ query: faqs }],
    }).then(() => {
      this.resetSelectedRecords();
      uiStore.setProgress();
      Helper.toast('Status updated successfully.', 'success');
    }).catch(() => {
      this.resetSelectedRecords();
      uiStore.setProgress();
      Helper.toast('Error while updating status.', 'error');
    });
  }
  @action
  resetSelectedRecords = () => {
    this.selectedRecords = [];
    this.isReadOnly = true;
    this.globalAction = '';
  }
  deleteRecords = (id) => {
    uiStore.setProgress();
    clientPrivate.mutate({
      mutation: deleteFaq,
      variables: {
        ids: id.isArray ? id : [id],
      },
      refetchQueries: [{ query: faqs }],
    }).then(() => {
      this.resetSelectedRecords();
      uiStore.setProgress(false);
      Helper.toast('Records deleted successfully.', 'success');
    }).catch(() => {
      this.resetSelectedRecords();
      uiStore.setProgress(false);
      Helper.toast('Error while deleting records.', 'error');
    });
  }

  @action
  setDb = (data) => {
    const d = map(data, (dd) => {
      const de = { faqId: dd.id, ...dd };
      return de;
    });
    this.db = ClientDb.initiateDb(d, true);
  }
  @computed get allFaqs() {
    return (this.db && this.db.length &&
      toJS(sortBy(this.db, ['order']).slice(this.requestState.skip, this.requestState.displayTillIndex))) || [];
  }
  @computed get allCategorizedFaqs() {
    const arrFaqs = [];
    if (this.db && this.db.length) {
      this.db.forEach((faq) => {
        if (arrFaqs[faq.faqType]) {
          if (arrFaqs[faq.faqType][faq.categoryId]) {
            arrFaqs[faq.faqType][faq.categoryId].push(faq);
            sortBy(arrFaqs[faq.faqType][faq.categoryId], ['order']);
          } else {
            arrFaqs[faq.faqType][faq.categoryId] = [];
            arrFaqs[faq.faqType][faq.categoryId].push(faq);
            sortBy(arrFaqs[faq.faqType][faq.categoryId], ['order']);
          }
        } else {
          arrFaqs[`${faq.faqType}`] = [];
          arrFaqs[`${faq.faqType}`][`${faq.categoryId}`] = [];
          arrFaqs[`${faq.faqType}`][`${faq.categoryId}`].push(faq);
        }
      });
    }
    return arrFaqs;
  }
  @computed get loading() {
    return this.data.loading;
  }

  @action
  getOne = (id) => {
    uiStore.setProgress();
    this.currentUpdate = graphql({
      client: clientPrivate,
      query: getFaqById,
      variables: { id },
      onFetch: (res) => {
        if (res && res.getFaqById) {
          this.setFormData(res.getFaqById);
          uiStore.setProgress(false);
        }
      },
    });
  }
  @action
  maskChange = (values, form, field) => {
    this[form] = Validator.onChange(
      this[form],
      { name: field, value: values.floatValue },
    );
  }
  @action
  setFormData = (formData) => {
    Object.keys(this.FAQ_FRM.fields).map(action((key) => {
      this.FAQ_FRM.fields[key].value = formData[key];
    }));
    this.editMode = true;
    Validator.validateForm(this.FAQ_FRM);
  }
  @action
  htmlContentChange = (field, value) => {
    this.FAQ_FRM.fields[field].value = value;
    Validator.validateForm(this.FAQ_FRM);
  }
  getFaqFormData = () => {
    const data = {};
    forEach(this.FAQ_FRM.fields, (t, key) => {
      data[key] = this.FAQ_FRM.fields[key].value;
    });
    return data;
  }
  @action
  checkUncheckAll = (checked = false) => {
    if (checked) {
      this.allFaqs.forEach((faq) => {
        if (!this.selectedRecords.includes(faq.id)) {
          this.addSelectedRecord(faq.id);
        }
      });
    } else {
      this.allFaqs.forEach((faq) => {
        this.removeUnSelectedRecord(faq.id);
      });
    }
  }
  @action
  reset = () => {
    this.FAQ_FRM = Validator.prepareFormObject(FAQ);
    this.requestState.search = {};
  }
  @action
  setFaqOrder = (newArr) => {
    uiStore.setProgress();
    const data = [];
    newArr.forEach((item, index) => {
      if (item) {
        data.push({
          id: item.id,
          order: index + 1,
        });
        // eslint-disable-next-line no-param-reassign
        newArr[index].order = index + 1;
      }
    });
    clientPrivate
      .mutate({
        mutation: setOrderForFAQ,
        variables: { faqItemsList: data },
      }).then(() => {
        this.initRequest();
        Helper.toast('Order updated successfully.', 'success');
      }).catch(() => {
        uiStore.setProgress(false);
        Helper.toast('Error while updating order', 'error');
      });
  }
  @action
  formChange = (e, result) => {
    this.FAQ_FRM = Validator.onChange(this.FAQ_FRM, Validator.pullValues(e, result));
    if (result.name === 'question') {
      const formValue = { value: kebabCase(result.value), name: 'slug' };
      this.FAQ_FRM = Validator.onChange(
        this.FAQ_FRM,
        Validator.pullValues(e, formValue),
      );
    }
  }

  @action
  userEleChange = (e, res, type) => {
    this.USR_FRM = Validator.onChange(this.FAQ_FRM, Validator.pullValues(e, res), type);
  };

  @action
  toggleSearch = () => {
    this.filters = !this.filters;
  }
  @action
  FChange = (field, value) => {
    this.FAQ_FRM.fields[field].value = value;
    Validator.validateForm(this.FAQ_FRM);
  }
  @action
  save = (id, isDraft = false) => new Promise((resolve, reject) => {
    uiStore.setProgress();
    let data = this.getFaqFormData();
    data = id === 'new' ? data : { ...data, id };
    clientPrivate
      .mutate({
        mutation: upsertFaq,
        variables: id === 'new' ? { faqInput: data } : { faqInput: data, isPartial: isDraft },
      })
      .then(() => {
        Helper.toast(id === 'new' ? 'FAQ added successfully.' : 'FAQ updated successfully.', 'success');
        uiStore.setProgress(false);
        resolve();
      })
      .catch((res) => {
        Helper.toast(`${res} Error`, 'error');
        uiStore.setProgress(false);
        reject();
      });
  });
  @action
  setFormFileArray = (formName, field, getField, value) => {
    if (Array.isArray(toJS(this[formName].fields[field][getField]))) {
      this[formName].fields[field][getField].push(value);
    } else {
      this[formName].fields[field][getField] = value;
    }
  }
  @action
  faqListByFilter = () => {
    const data = this.requestState.search;
    uiStore.setProgress();
    this.data = graphql({
      client: clientPrivate,
      query: faqsListByFilters,
      fetchPolicy: 'network-only',
      variables: {
        question: data.keyword,
        faqType: data.type !== 'All' ? data.type : undefined,
        categoryId: data.categoryName,
        itemStatus: data.status !== 'All' ? data.status : undefined,
      },
      onFetch: (res) => {
        if (res && res.faqsListByFilters) {
          this.resetSelectedRecords();
          uiStore.setProgress(false);
          this.setDb(res.faqsListByFilters);
        }
      },
    });
  }
  @computed get count() {
    return (this.db && this.db.length) || 0;
  }
  @action
  pageRequest = ({ skip, page }) => {
    this.requestState.displayTillIndex = this.requestState.perPage * page;
    this.requestState.page = page;
    this.requestState.skip = skip;
    this.resetSelectedRecords();
  }
  @action
  setInitiateSrch = (keyword, value) => {
    this.requestState.search[keyword] = value;
    this.requestState = { ...this.requestState };
    if (keyword !== 'keyword') {
      this.faqListByFilter();
    }
  }
  @computed get selectedCount() {
    return this.selectedRecords.length || 0;
  }
}


export default new FaqStore();
