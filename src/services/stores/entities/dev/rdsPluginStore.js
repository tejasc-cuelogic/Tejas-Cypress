import { observable, action, decorate } from 'mobx';
import { get, pick } from 'lodash';
import DataModelStore, { decorateDefault } from '../shared/dataModelStore';
import { FormValidator as Validator } from '../../../../helper';
import { TABLE_META, COLUMN_TO_REVIEW, QUERY_FILTER } from '../../../constants/admin/data';
import Helper from '../../../../helper/utility';
import { adminListRdsPlugins } from '../../queries/data';

export class RdsPluginStore extends DataModelStore {
  constructor() {
    super({ adminListRdsPlugins });
  }

  QUERY_FILTER_FRM = Validator.prepareFormObject(QUERY_FILTER);

  COLUMN_TO_REVIEW_FRM = Validator.prepareFormObject(COLUMN_TO_REVIEW);

  TABLE_FRM = Validator.prepareFormObject(TABLE_META);

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
        this.setFieldValue('TABLE_FRM', tables, 'fields.table.values');
      }
    } catch (error) {
      Helper.toast('Something went wrong, please try again later.', 'error');
    }
  }

  formChangeForTable = (e, result, form) => {
    this[form] = Validator.onChange(this[form], Validator.pullValues(e, result), 'dropdown');
    // ['COLUMN_TO_REVIEW_FRM', 'QUERY_FILTER_FRM'].forEach((f) => {
    //   this[f] = Validator.resetFormData(this[f]);
    // });
    this.QUERY_FILTER_FRM = Validator.resetFormData(this.QUERY_FILTER_FRM);
    const { columns } = this.TABLE_FRM.fields.table.values.find(t => t.value === result.value);
    this.QUERY_FILTER_FRM.fields.selectColumns.values = (columns && columns.map(c => ({ ...pick(c, ['key', 'value']), text: c.value }))) || [];
  }

  formChangeForColumns = (e, result, form) => {
    this[form] = Validator.onChange(this[form], Validator.pullValues(e, result), 'dropdown');
  }
}

decorate(RdsPluginStore, {
  ...decorateDefault,
  QUERY_FILTER_FRM: observable,
  COLUMN_TO_REVIEW_FRM: observable,
  TABLE_FRM: observable,
  formChangeForTable: action,
  formChangeForColumns: action,
  initRequest: action,
});

export default new RdsPluginStore();
