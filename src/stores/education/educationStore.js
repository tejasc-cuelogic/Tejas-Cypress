/* eslint-disable class-methods-use-this, prefer-destructuring */
import { toJS, observable, computed, action } from 'mobx';
import graphql from 'mobx-apollo';
import { GqlClient as client } from '../../services/graphqlCool';
import { allKbsQuery, getFirst, getOne, allFaqCategories, getOneFaq, getFirstFaq } from '../queries/knowledgeBase';

export class EducationStore {
  @observable data = [];
  @observable module = '';
  @observable selected = { heading: '', description: '' };

  @action
  initRequest = (module) => {
    const query = (module === 'KnowledgeBase') ? allKbsQuery : allFaqCategories;
    this.data = graphql({
      client,
      query,
    });
  }

  @action
  getOne = (module, id) => {
    const variables = (id) ? { id } : { first: 1 };
    let query = '';
    if (module === 'KnowledgeBase') {
      query = (id) ? getOne : getFirst;
    } else if (module === 'Faq') {
      query = (id) ? getOneFaq : getFirstFaq;
    }
    graphql({
      client,
      query,
      variables,
      onFetch: (data) => {
        if (module === 'KnowledgeBase') {
          this.selected = (id) ? data.KnowledgeBase : data.allKnowledgeBases[0];
        } else if (module === 'Faq') {
          this.selected = (id) ? data.Faq : data.allFaqs[0];
        }
      },
    });
  }

  @computed get allData() {
    return this.data;
  }

  @computed get kbs() {
    return (this.allData.data && this.allData.data.allKnowledgeBases &&
      toJS(this.allData.data.allKnowledgeBases)) || [];
  }

  @computed get faqs() {
    return (this.allData.data && this.allData.data.allCategories &&
      toJS(this.allData.data.allCategories)) || [];
  }

  @computed get error() {
    return (this.allData.error && this.allData.error.message) || null;
  }

  @computed get loading() {
    return this.allData.loading;
  }

  @computed get count() {
    return this.kbs.length || 0;
  }
}

export default new EducationStore();
