/* eslint-disable no-param-reassign */
import { observable, action, computed, toJS } from 'mobx';
import graphql from 'mobx-apollo';
import { forEach, map } from 'lodash';
import { GqlClient as clientPrivate } from '../../../../api/gqlApi';
import { FormValidator as Validator, ClientDb } from '../../../../helper';
import Helper from '../../../../helper/utility';
import { faqs, getFaqById, upsertFaq, faqsListByFilters } from '../../queries/faq';
import { FAQ } from '../../../constants/faq';
import { uiStore } from '../../index';

export class FaqStore {
  @observable data = [];
  @observable db;
  @observable FAQ_FRM = Validator.prepareFormObject(FAQ);
  @observable editMode = false;
  @observable filters = false;
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
    const query = faqs;
    const client = clientPrivate;
    this.data = graphql({
      client,
      query,
      onFetch: (res) => {
        if (res && res.faqs) {
          this.setDb(res.faqs);
        }
      },
    });
  }
  @action
  setConfirmBox = (entity, refId) => {
    this.confirmBox.entity = entity;
    this.confirmBox.refId = refId;
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
      this.db.slice(this.requestState.skip, this.requestState.displayTillIndex)) || [];
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
      if (!t.ArrayObjItem && key !== 'author') {
        data[key] = this.FAQ_FRM.fields[key].value;
      }
    });
    return data;
  }

  @action
  reset = () => {
    this.FAQ_FRM = Validator.prepareFormObject(FAQ);
  }

  @action
  formChange = (e, result) => {
    this.FAQ_FRM = Validator.onChange(this.FAQ_FRM, Validator.pullValues(e, result));
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
  deleteTeamMemberById = (id) => {
    clientPrivate
      .mutate({
        mutation: faqs,
        variables: {
          id,
        },
        refetchQueries: [{ query: faqs }],
      })
      .then(() => Helper.toast('FAQ deleted successfully.', 'success'))
      .catch(() => Helper.toast('Error while deleting FAQ ', 'error'));
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
  }

  @action
  setInitiateSrch = (keyword, value) => {
    this.requestState.search[keyword] = value;
    this.requestState = { ...this.requestState };
    if (keyword !== 'keyword') {
      this.faqListByFilter();
    }
  }
}


export default new FaqStore();
