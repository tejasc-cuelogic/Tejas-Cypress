/* eslint-disable no-unused-vars */
import { toJS, observable, computed, action } from 'mobx';
import graphql from 'mobx-apollo';
import { map, sortBy } from 'lodash';
import { GqlClient as clientPublic } from '../../../../api/publicApi';
// import { userStore } from '../../index';
import { clientSearch } from '../../../../helper';
import { allKbsQuery, allFaqQuery } from '../../queries/knowledgeBase';

const sortMe = (dataToSort, key) => {
  let data = toJS(dataToSort);
  data = map(data, (c) => {
    const newC = c;
    newC[key] = sortBy(newC[key], ['order']);
    return newC;
  });
  return sortBy(data, ['order']);
};
export class EducationStore {
  @observable data = { KnowledgeBase: [], Faq: [] };
  @observable searchParam = { Faq: '', KnowledgeBase: '' };
  @observable selected = {
    slug: '', title: '', content: '', id: '',
  };
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
  initRequest = (module, props, categoryType = 'INV_FAQ') => {
    const query = (module === 'KnowledgeBase') ? allKbsQuery : allFaqQuery;
    this.data[module] = graphql({
      client: clientPublic,
      query,
      variables: { categoryType },
    });
  }

  @action
  getOne = (ref, slug) => {
    const meta = { knowledgeBase: ['kbs', 'title', 'content'], faq: ['faqs', 'question', 'answer'] };
    const subItems = ref === 'knowledgeBase' ? 'knowledgeBaseItemList' : 'faqItems';
    if (this[meta[ref][0]].length > 0) {
      let tempItem = {};
      this[meta[ref][0]].forEach((element) => {
        element[subItems].forEach((f) => {
          if (f.slug === slug || f.id === slug) {
            tempItem = f;
          }
        });
      });
      const item = (!slug) ? this[meta[ref][0]][0][subItems][0] : tempItem;
      this.selected = item ?
        {
          slug: item.slug, id: item.id, title: item[meta[ref][1]], content: item[meta[ref][2]],
        } :
        {};
    }
  }

  @action
  setSrchParam = (value) => {
    this.searchParam.Faq = value || '';
    this.searchParam.KnowledgeBase = value || '';
  }

  @computed get allData() {
    return this.data;
  }

  @computed get kbs() {
    return (this.allData.KnowledgeBase.data &&
      this.allData.KnowledgeBase.data.faqAndKnowledgeBaseItems
    && clientSearch.search(
      sortMe(this.allData.KnowledgeBase.data.faqAndKnowledgeBaseItems, 'knowledgeBaseItemList'),
      this.searchParam.KnowledgeBase,
      'knowledgeBase',
    )) || [];
  }

  @computed get faqs() {
    return (this.allData.Faq.data && this.allData.Faq.data.faqAndKnowledgeBaseItems
    && clientSearch.search(
      sortMe(this.allData.Faq.data.faqAndKnowledgeBaseItems, 'faqItems'),
      this.searchParam.Faq, 'faq',
    )) || [];
  }

  @computed get error() {
    return (this.allData.error && this.allData.error.message) || null;
  }

  @action
  loading = module => this.allData[module].loading;

  @computed get faqsOfModule() {
    return toJS(this.faqsList);
  }
}

export default new EducationStore();
