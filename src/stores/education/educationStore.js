/* eslint-disable class-methods-use-this, prefer-destructuring */
import { toJS, observable, computed, action } from 'mobx';
import graphql from 'mobx-apollo';
import flatMap from 'lodash/flatMap';
import mapValues from 'lodash/mapValues';
import { GqlClient as client } from '../../services/graphql';
import { allKbsQuery, allFaqQuery } from '../queries/knowledgeBase';

export class EducationStore {
  @observable data = [];
  @observable selected = { id: '', title: '', body: '' };

  @action
  initRequest = (module) => {
    const query = (module === 'KnowledgeBase') ? allKbsQuery : allFaqQuery;
    this.data = graphql({
      client,
      query,
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

  @computed get allData() {
    return this.data;
  }

  @computed get kbs() {
    return (this.allData.data && this.allData.data.knowledgeBase
      && toJS(this.allData.data.knowledgeBase)) || [];
  }

  @computed get faqs() {
    return (this.allData.data && this.allData.data.faqs &&
      toJS(this.allData.data.faqs)) || [];
  }

  @computed get error() {
    return (this.allData.error && this.allData.error.message) || null;
  }

  @computed get loading() {
    return this.allData.loading;
  }
}

export default new EducationStore();
