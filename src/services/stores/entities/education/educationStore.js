import { toJS, observable, computed, action } from 'mobx';
import graphql from 'mobx-apollo';
import flatMap from 'lodash/flatMap';
import mapValues from 'lodash/mapValues';
import { GqlClient as client } from '../../../../api/gqlApi';
import { userStore } from '../../index';
import { clientSearch } from '../../../../helper';
import { allKbsQuery, allFaqQuery } from '../../queries/knowledgeBase';

export class EducationStore {
  @observable data = [];
  @observable searchParam = '';
  @observable selected = { id: '', title: '', body: '' };
  @observable faqsList = [
    {
      id: 1,
      title: 'Lorem ipsum dolor sit amet enim ullamcorper?',
      description: `Pellentesque facilisis. Nulla imperdiet sit amet magna. Vestibulum
      dapibus, mauris nec malesuada fames ac turpis Pellentesque facilisis.
      Nulla imperdiet sit amet magna. Vestibulum dapibus, mauris nec
      malesuada fames ac turpis`,
    },
    {
      id: 2,
      title: 'Lorem ipsum dolor sit amet enim ullamcorper?',
      description: `Pellentesque facilisis. Nulla imperdiet sit amet magna. Vestibulum
      dapibus, mauris nec malesuada fames ac turpis Pellentesque facilisis.
      Nulla imperdiet sit amet magna. Vestibulum dapibus, mauris nec
      malesuada fames ac turpis`,
    },
  ];

  @action
  initRequest = (module) => {
    const query = (module === 'KnowledgeBase') ? allKbsQuery : allFaqQuery;
    if (userStore.currentUser) {
      const scopeType = toJS(userStore.currentUser.roles)[0] === 'investor' ? 'INVESTOR' : 'ISSUER';
      this.data = graphql({
        client,
        query,
        variables: { scopeType },
      });
    }
  }

  @action
  getOne = (ref, id) => {
    const meta = { knowledgeBase: ['kbs', 'title', 'body'], faq: ['faqs', 'question', 'answer'] };
    if (this[meta[ref][0]].length > 1) {
      const item = (!id) ? this[meta[ref][0]][0][`${ref}Items`][0] :
        flatMap(mapValues(this[meta[ref][0]], f => f[`${ref}Items`])).find(i => i.id === id);
      this.selected = item ? { id: item.id, title: item[meta[ref][1]], body: item[meta[ref][2]] } :
        {};
    }
  }

  @action
  setSrchParam = (value) => {
    this.searchParam = value || '';
  }

  @computed get allData() {
    return this.data;
  }

  @computed get kbs() {
    return (this.allData.data && this.allData.data.knowledgeBase
      && clientSearch.search(
        toJS(this.allData.data.knowledgeBase),
        this.searchParam,
        'knowledgeBase',
      )) || [];
  }

  @computed get faqs() {
    return (this.allData.data && this.allData.data.faqs
      && clientSearch.search(toJS(this.allData.data.faqs), this.searchParam, 'faq')) || [];
  }

  @computed get error() {
    return (this.allData.error && this.allData.error.message) || null;
  }

  @computed get loading() {
    return this.allData.loading;
  }

  @computed get faqsOfModule() {
    return toJS(this.faqsList);
  }
}

export default new EducationStore();
