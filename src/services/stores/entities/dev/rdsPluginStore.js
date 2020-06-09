import { observable, action, decorate, computed } from 'mobx';
import { get, pick, orderBy } from 'lodash';
import DataModelStore, { decorateDefault } from '../shared/dataModelStore';
import { FormValidator as Validator } from '../../../../helper';
import { QUERY_BUILDER } from '../../../constants/admin/data';
import Helper from '../../../../helper/utility';
import { adminListRdsPlugins, adminRunRdsQuery } from '../../queries/data';

export class RdsPluginStore extends DataModelStore {
  constructor() {
    super({ adminListRdsPlugins, adminRunRdsQuery });
  }

  rdsData = {};

  reorderedList = [];

  sortOrder = {
    column: null,
    direction: 'asc',
  };

  QUERY_BUILDER_FRM = Validator.prepareFormObject(QUERY_BUILDER);

  fetchPlugins = async () => {
    try {
      const res = await this.executeQuery({
        client: 'PRIVATE',
        query: 'adminListRdsPlugins',
        setLoader: 'adminListRdsPlugins',
        fetchPolicy: 'cache-first',
      });

      const tables = get(res, 'adminListRdsPlugins.tables');
      if (tables) {
        this.setFieldValue('QUERY_BUILDER_FRM', tables, 'fields.table.values');
      }
    } catch (error) {
      Helper.toast('Something went wrong, please try again later.', 'error');
    }
  }

  initRequest = async (reqParams) => {
    try {
      const data = Validator.evaluateFormData(this.QUERY_BUILDER_FRM.fields);
      this.requestState.page = (reqParams && reqParams.page) || this.requestState.page;
      this.requestState.perPage = (reqParams && reqParams.first) || 100;
      Object.keys(data).forEach((key) => {
        const field = key === 'where' ? 'name' : 'column';
        if (['where', 'orderBy'].includes(key)) {
          if (data[key].length === 1 && data[key][0][field] === '') {
            data[key] = [];
          } else {
            data[key].forEach((d) => {
              // eslint-disable-next-line no-param-reassign
              d.value = d.value === '' ? null : d.value;
              return d;
            });
          }
        }
      });
      const res = await this.executeQuery({
        query: 'adminRunRdsQuery',
        variables: {
          ...data,
          page: this.requestState.page,
          pageSize: this.requestState.perPage,
        },
        setLoader: 'adminRunRdsQuery',
      });
      this.setFieldValue('rdsData', res);
      return true;
    } catch {
      Helper.toast('Something went wrong, please try again later.', 'error');
      this.setFieldValue('rdsData', {});
      return false;
    }
  }

  setSortingOrder = (column = null, direction = null) => {
    this.sortOrder = {
      column,
      direction,
    };
  }

  get rdsListingRows() {
    const list = get(this.rdsData, 'adminRunRdsQuery.results') || [];
    return orderBy(list, [this.sortOrder.column], [this.sortOrder.direction]);
  }

  get initialColumns() {
    let columns = get(this.rdsData, 'adminRunRdsQuery.results[0]') ? Object.keys(get(this.rdsData, 'adminRunRdsQuery.results[0]')) : [];
    if (columns.length > 0) {
      columns = columns.map(c => ({ title: this.QUERY_BUILDER_FRM.fields.selectColumns.values.find(s => s.key === c).text, field: c }));
    }
    return columns;
  }

  get rdsListingColumns() {
    let columns = this.initialColumns;
    if (this.reorderedList.length > 0) {
      columns = this.reorderedList;
    }
    return columns;
  }

  get totalRecords() {
    return get(this.rdsData, 'adminRunRdsQuery.totalCount') || 0;
  }

  resetData = () => {
    this.requestState.page = 1;
    this.requestState.perPage = 100;
    this.reorderedList = [];
  }

  formChangeForTable = (e, result, props) => {
    this.QUERY_BUILDER_FRM = Validator.resetFormData(this.QUERY_BUILDER_FRM);
    this.formChange(e, result, get(props, 'multiForm'), 'dropdown');
    const { columns } = this.QUERY_BUILDER_FRM.fields.table.values.find(t => t.value === result.value);
    const dropDownColumns = (columns && columns.map(c => ({ ...pick(c, ['key']), text: c.value, value: c.key }))) || [];
    this.QUERY_BUILDER_FRM.fields.selectColumns.values = dropDownColumns;
    this.QUERY_BUILDER_FRM.fields.groupByColumns.values = dropDownColumns;
    this.QUERY_BUILDER_FRM.fields.orderBy[0].column.values = dropDownColumns;
    this.QUERY_BUILDER_FRM.fields.where[0].name.values = dropDownColumns;
  }
}

decorate(RdsPluginStore, {
  ...decorateDefault,
  QUERY_BUILDER_FRM: observable,
  reorderedList: observable,
  sortOrder: observable,
  rdsData: observable,
  formChangeForTable: action,
  resetData: action,
  setSortingOrder: action,
  initRequest: action,
  fetchPlugins: action,
  rdsListingRows: computed,
  rdsListingColumns: computed,
  totalRecords: computed,
});

export default new RdsPluginStore();
