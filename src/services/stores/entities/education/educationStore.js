import { toJS, observable, computed, action } from 'mobx';
import graphql from 'mobx-apollo';
import flatMap from 'lodash/flatMap';
import mapValues from 'lodash/mapValues';
import { GqlClient as client } from '../../../../api/gqlApi';
import { GqlClient as clientPublic } from '../../../../api/publicApi';
import { userStore } from '../../index';
import { clientSearch } from '../../../../helper';
import { allKbsQuery, allFaqQuery } from '../../queries/knowledgeBase';

export class EducationStore {
  @observable data = { KnowledgeBase: [], Faq: [] };
  @observable searchParam = { Faq: '', KnowledgeBase: '' };
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
  initRequest = (module, props) => {
    const query = (module === 'KnowledgeBase') ? allKbsQuery : allFaqQuery;
    let scopeType = 'INVESTOR';
    if (props && props.isMkt && props.params) {
      scopeType = props.params.for === 'investor' ? 'INVESTOR' : 'ISSUER';
    } else if (userStore.currentUser) {
      scopeType = toJS(userStore.currentUser.roles)[0] === 'investor' ? 'INVESTOR' : 'ISSUER';
    }
    this.data[module] = graphql({
      client: props && props.isMkt ? clientPublic : client,
      query,
      variables: { scopeType },
    });
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
  setSrchParam = (module, value) => {
    this.searchParam[module] = value || '';
  }

  @computed get allData() {
    return this.data;
  }

  @computed get kbs() {
    return (this.allData.KnowledgeBase.data && this.allData.KnowledgeBase.data.knowledgeBase
      && clientSearch.search(
        toJS(this.allData.KnowledgeBase.data.knowledgeBase),
        this.searchParam.KnowledgeBase,
        'knowledgeBase',
      )) || [];
  }

  @computed get faqs() {
    return (this.allData.Faq.data && this.allData.Faq.data.faqs
      && clientSearch.search(toJS(this.allData.Faq.data.faqs), this.searchParam.Faq, 'faq')) || [];
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
