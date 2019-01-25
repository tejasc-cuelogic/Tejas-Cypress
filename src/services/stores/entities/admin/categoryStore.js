import { observable, action, computed, toJS } from 'mobx';
import graphql from 'mobx-apollo';
import { sortBy, filter } from 'lodash';
import { GqlClient as client } from '../../../../api/gqlApi';
import { getCategories, createCategory } from '../../queries/category';
import { CATEGORY_DETAILS } from '../../../constants/admin/offerings';
import { FormValidator as Validator } from '../../../../helper';
import Helper from '../../../../helper/utility';
import { uiStore } from '../../../../services/stores';
// import { createCategory } from '../../../../services/stores/queries/category';
export class CategoryStore {
    @observable data = [];
    @observable CATEGORY_DETAILS_FRM = Validator.prepareFormObject(CATEGORY_DETAILS);

    @action
    initRequest = (type) => {
      const query = getCategories;
      this.data = graphql({
        client,
        query,
        variables: { type },
      });
    }
    // @action
    // setForm = (id) => {

    @computed get getAllCategoriesData() {
      const formattedData = [
        {
          title: 'Investor FAQ',
          questions: filter(this.categories, cat => cat.categoryType === 'INV_FAQ'),
        },
        {
          title: 'Issuer FAQ',
          questions: filter(this.categories, cat => cat.categoryType === 'ISSUER_FAQ'),
        },
        {
          title: 'Issuer Knowledge Base',
          questions: filter(this.categories, cat => cat.categoryType === 'ISSUER_KB'),
        },
        {
          title: 'Investor Knowledge Base',
          questions: filter(this.categories, cat => cat.categoryType === 'INVESTOR_KB'),
        },
        {
          title: 'Offerings',
          questions: filter(this.categories, cat => cat.categoryType === 'OFFERINGS'),
        },
        {
          title: 'Insights',
          questions: filter(this.categories, cat => cat.categoryType === 'INSIGHTS'),
        }];
      return formattedData;
    }

    @computed get categories() {
      return (this.data.data && sortBy(toJS(this.data.data.categories), ['order'])) || [];
    }

    @computed get loading() {
      return this.data.loading;
    }

    @action
    formChange = (e, result, form, type) => {
      this[form] = Validator.onChange(
        this[form],
        Validator.pullValues(e, result),
        type,
      );
    }

    @action
    saveCategories = () => {
      const type = 'INV_FAQ';
      this.CATEGORY_DETAILS_FRM.fields.categoryType.value = 'INV_FAQ';
      const categoryDetailsInput = Validator.evaluateFormData(this.CATEGORY_DETAILS_FRM.fields);
      uiStore.setProgress();
      client
        .mutate({
          mutation: createCategory,
          variables: { categoryDetailsInput },
          refetchQueries: [{
            query: getCategories,
            variables: { type },
          }],
        })
        .then(() => Helper.toast('Category created successfully.', 'success'))
        .catch(() => {
          Helper.toast('Error while creating Category', 'error');
        })
        .finally(() => {
          uiStore.setProgress(false);
        });
    }
}


export default new CategoryStore();
