/* eslint-disable class-methods-use-this, prefer-destructuring */
import { toJS, observable, computed, action } from 'mobx';
import graphql from 'mobx-apollo';
import { GqlClient as client } from '../../services/graphqlCool';
import { allKbsQuery, getFirst, getOne } from '../queries/knowledgeBase';

export class KnowledgeBase {
  @observable data = [];
  @observable selected = { heading: '', description: '' };

  @action
  initRequest = () => {
    this.data = graphql({
      client,
      query: allKbsQuery,
    });
  }

  @action
  getOne = (id) => {
    const variables = (id) ? { id } : { first: 1 };
    graphql({
      client,
      query: (id) ? getOne : getFirst,
      variables,
      onFetch: (data) => {
        this.selected = (id) ? data.KnowledgeBase : data.allKnowledgeBases[0];
      },
    });
  }

  @computed get allKbs() {
    return this.data;
  }

  @computed get kbs() {
    return (this.allKbs.data
      && this.allKbs.data.allKnowledgeBases
      && toJS(this.allKbs.data.allKnowledgeBases)
    ) || [];
  }

  @computed get error() {
    return (this.allKbs.error && this.allKbs.error.message) || null;
  }

  @computed get loading() {
    return this.allKbs.loading;
  }

  @computed get count() {
    return this.kbs.length || 0;
  }
}

export default new KnowledgeBase();
