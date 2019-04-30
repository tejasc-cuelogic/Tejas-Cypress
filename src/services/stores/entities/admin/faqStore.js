/* eslint-disable no-param-reassign */
import { observable, action, computed, toJS } from 'mobx';
import graphql from 'mobx-apollo';
import { forEach, uniqWith, isEqual, map } from 'lodash';
import { GqlClient as clientPrivate } from '../../../../api/gqlApi';
import { FormValidator as Validator, ClientDb } from '../../../../helper';
import Helper from '../../../../helper/utility';
import { faqs, getFaqById, upsertFaq } from '../../queries/faq';
import { FAQ } from '../../../constants/faq';
import { uiStore } from '../../index';

export class FaqStore {
  @observable data = [];
  @observable db;
  @observable FAQ_FRM = Validator.prepareFormObject(FAQ);
  @observable editMode = false;
  @observable requestState = {
    skip: 0,
    page: 1,
    perPage: 50,
    displayTillIndex: 50,
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
    if (result.name !== 'faqType') {
      this.FAQ_FRM = Validator.onChange(this.FAQ_FRM, Validator.pullValues(e, result));
    }
  }

  @action
  userEleChange = (e, res, type) => {
    this.USR_FRM = Validator.onChange(this.FAQ_FRM, Validator.pullValues(e, res), type);
  };

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
  save = id => new Promise((resolve, reject) => {
    const data = this.getFaqFormData();
    clientPrivate
      .mutate({
        mutation: id === 'new' ? faqs : upsertFaq,
        variables: id === 'new' ? { faqInput: data } : { id, faqInput: data },
      })
      .then(() => {
        Helper.toast(id === 'new' ? 'FAQ added successfully.' : 'FAQ updated successfully.', 'success');
        resolve();
      })
      .catch((res) => {
        Helper.toast(`${res} Error`, 'error');
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
  filterTeamMembersByName = (teamMemberName) => {
    const query = faqs;
    const client = clientPrivate;
    this.data = graphql({
      client,
      query,
      variables: { memberName: teamMemberName },
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
    this.initiateFilters();
  }
  @action
  initiateFilters = () => {
    const { keyword } = this.requestState.search;
    let resultArray = [];
    if (keyword) {
      resultArray = ClientDb.filterData('memberName', keyword, 'likenocase');
      this.setDb(uniqWith(resultArray, isEqual));
      this.requestState.page = 1;
      this.requestState.skip = 0;
    } else {
      this.setDb(this.data.data.teamMembers);
    }
  }
}


export default new FaqStore();
