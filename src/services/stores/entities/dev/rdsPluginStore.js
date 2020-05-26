import { observable, action, decorate, toJS } from 'mobx';
import { get, pick } from 'lodash';
import DataModelStore, { decorateDefault } from '../shared/dataModelStore';
import { FormValidator as Validator } from '../../../../helper';
import { QUERY_BUILDER } from '../../../constants/admin/data';
import Helper from '../../../../helper/utility';
import { adminListRdsPlugins, adminRunRdsQuery } from '../../queries/data';

export class RdsPluginStore extends DataModelStore {
  constructor() {
    super({ adminListRdsPlugins, adminRunRdsQuery });
  }

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

  adminRunRdsQuery = async () => {
    try {
      const data = Validator.evaluateFormData(this.QUERY_BUILDER_FRM.fields);
      console.log(toJS(data));
      data.where.forEach((d) => {
        // eslint-disable-next-line no-param-reassign
        d.value = d.value === '' ? null : d.value;
        return d;
      });
      const res = await this.executeQuery({
        query: 'adminRunRdsQuery',
        variables: {
          ...data,
        },
        setLoader: 'adminRunRdsQuery',
      });

      return res;
    } catch (error) {
      Helper.toast('Something went wrong, please try again later.', 'error');
      return false;
    }
  }

  formChangeForTable = (e, result, props) => {
    this.QUERY_BUILDER_FRM = Validator.resetFormData(this.QUERY_BUILDER_FRM);
    this.formChange(e, result, get(props, 'multiForm'), 'dropdown');
    const { columns } = this.QUERY_BUILDER_FRM.fields.table.values.find(t => t.value === result.value);
    const dropDownColumns = (columns && columns.map(c => ({ ...pick(c, ['key', 'value']), text: c.value }))) || [];
    this.QUERY_BUILDER_FRM.fields.selectColumns.values = dropDownColumns;
    this.QUERY_BUILDER_FRM.fields.groupByColumns.values = dropDownColumns;
    this.QUERY_BUILDER_FRM.fields.orderBy[0].column.values = dropDownColumns;
    this.QUERY_BUILDER_FRM.fields.where[0].name.values = dropDownColumns;
  }
}

decorate(RdsPluginStore, {
  ...decorateDefault,
  QUERY_BUILDER_FRM: observable,
  formChangeForTable: action,
  adminRunRdsQuery: action,
  initRequest: action,
});

export default new RdsPluginStore();
