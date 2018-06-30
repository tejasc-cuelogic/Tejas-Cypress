import { toJS, observable, computed, action } from 'mobx';
import graphql from 'mobx-apollo';
import { GqlClient as client } from '../../../../api/gqlApi';
import { allMonthlyStatements, allTaxForms } from '../../queries/statement';

export class StatementStore {
  @observable data = [];

  @action
  initRequest = (module) => {
    const query = (module === 'MonthlyStatements') ? allMonthlyStatements : allTaxForms;
    this.data = graphql({
      client,
      query,
      variables: { accountId: '435e6230-6243-11e8-9398-89de698b9675' },
    });
  }

  @computed get allData() {
    return this.data;
  }

  @computed get taxForms() {
    return (this.allData.data && this.allData.data.investorAccountTaxForms &&
      toJS(this.allData.data.investorAccountTaxForms)) || [];
  }

  @computed get monthlyStatements() {
    return (this.allData.data && this.allData.data.investorAccountStatements &&
      toJS(this.allData.data.investorAccountStatements)) || [];
  }

  @computed get error() {
    return (this.allData && this.allData.error && this.allData.error.message) || null;
  }

  @computed get loading() {
    return this.allData.loading;
  }

  @computed get count() {
    return this.kbs.length || 0;
  }
}

export default new StatementStore();
