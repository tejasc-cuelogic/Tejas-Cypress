import { toJS, observable, computed, action } from 'mobx';
import graphql from 'mobx-apollo';
import { GqlClient as clientPublic } from '../../../../api/publicApi';
// import { userStore } from '../../index';
// import { clientSearch } from '../../../../helper';
import { allKbsAndFaqsQuery } from '../../queries/knowledgeBase';

export class EducationStore {
  @observable data = { KnowledgeBase: [], Faq: [] };
  @observable searchParam = { Faq: '', KnowledgeBase: '' };
  @observable selected = { id: '', title: '', content: '' };
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
    // let categoryType = '';
    // if (props && props.isMkt && props.params) {
    //   categoryType = props.params.for === 'investor' ? 'INVESTOR_KB' : 'ISSUER_KB';
    // } else if (userStore.currentUser) {
    //   categoryType = toJS(userStore.currentUser.roles)[0] === 'investor' ? 'INVESTOR' : 'ISSUER';
    // }
    this.data[module] = graphql({
      client: clientPublic,
      query: allKbsAndFaqsQuery,
      variables: { categoryType },
    });
  }

  @action
  getOne = (ref, id) => {
    const meta = { knowledgeBase: ['kbs', 'title', 'content'], faq: ['faqs', 'title', 'content'] };
    if (this[meta[ref][0]].length > 0) {
      let tempItem = {};
      this[meta[ref][0]].forEach((element) => {
        element.knowledgeBaseItemList.forEach((f) => {
          if (f.id === id) {
            tempItem = f;
          }
        });
      });
      const item = (!id) ? this[meta[ref][0]][0].knowledgeBaseItemList[0] : tempItem;
      // flatMap(mapValues(this[meta[ref][0]], f => f[`${ref}ItemList`])).find(i => i.id === id);
      this.selected = item ? { id: item.id, title: item[meta[ref][1]], body: item[meta[ref][2]] } :
        {};
    }
  }

  @action
  setSrchParam = (module, value) => {
    this.searchParam[module] = value || '';
  }

  @computed get allData() {
    return this.data;
  }

  @computed get kbs() {
    return (this.allData.KnowledgeBase.data &&
      this.allData.KnowledgeBase.data.faqAndKnowledgeBaseItems);
    // && clientSearch.search(
    //   toJS(this.allData.KnowledgeBase.data.faqAndKnowledgeBaseItems),
    //   this.searchParam.KnowledgeBase,
    //   'knowledgeBase',
    // )) || [];
  }

  @computed get faqs() {
    return (this.allData.Faq.data && this.allData.Faq.data.faqAndKnowledgeBaseItems);
    // && clientSearch.search(toJS(this.allData.Faq.data.faqAndKnowledgeBaseItems),
    // this.searchParam.Faq, 'knowledgeBase')) || [];
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
