import { action, observable, decorate } from 'mobx';

class MobxApollo {
  query;

  observableQuery;

  loading = false;

  setLoading = (status) => {
    this.loading = status;
  };

  graphql = (config) => {
    const { client, onError, onFetch, ...opts } = config;
    this.loading = true;
    this.query = client.watchQuery(opts);
    this.observableQuery = this.query.currentResult();
    this.query.subscribe({
      next: action((value) => {
        this.observableQuery.error = undefined;
        this.observableQuery.loading = value.loading;
        this.observableQuery.data = value.data;
        this.loading = false;
        if (onFetch) onFetch(value.data);
      }),
      error: action((error) => {
        this.observableQuery.error = error;
        this.observableQuery.loading = false;
        this.observableQuery.data = undefined;
        this.loading = false;
        if (onError) onError(error);
      }),
    });

    this.observableQuery.ref = this.query;
    return this.observableQuery;
  };
}

decorate(MobxApollo, {
  query: observable,
  observableQuery: observable.ref,
  loading: observable.ref,
  graphql: action,
  setLoading: action,
});

export default new MobxApollo();
