import { observable, action } from 'mobx';
import * as elasticSearchQueries from '../../queries/elasticSearch';
import { GqlClient as client } from '../../../../api/gqlApi';
import Helper from '../../../../helper/utility';

export class ElasticSearchStore {
  @observable inProgress = {};

  @action
  setFieldValue = (field, value) => {
    this[field] = value;
  }

  @action
  elasticSearchHandler = (mutation) => {
    this.setFieldValue('inProgress', mutation);
    return new Promise((resolve, reject) => {
      client
        .mutate({
          mutation: elasticSearchQueries[mutation],
        })
        .then((result) => {
          Helper.toast('Your request is processed.', 'success');
          resolve(result);
          this.setFieldValue('inProgress', false);
        })
        .catch((error) => {
          Helper.toast('Something went wrong, please try again later.', 'error');
          reject(error);
          this.setFieldValue('inProgress', false);
        });
    });
  }
}

export default new ElasticSearchStore();
