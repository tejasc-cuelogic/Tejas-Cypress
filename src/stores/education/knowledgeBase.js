/* eslint-disable class-methods-use-this */
import { toJS, observable, computed, action } from 'mobx';
import graphql from 'mobx-apollo';
import { GqlClient as client } from '../../services/graphqlCool';
import { allKbsQuery } from '../queries/knowledgeBase';

export class KnowledgeBase {
  @observable data = [];

  @action
  initRequest = () => {
    this.data = graphql({
      client,
      query: allKbsQuery,
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
