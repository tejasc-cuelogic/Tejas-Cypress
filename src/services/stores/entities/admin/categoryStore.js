import { observable, action, computed, toJS } from 'mobx';
import graphql from 'mobx-apollo';
import { sortBy, filter } from 'lodash';
import { GqlClient as client } from '../../../../api/gqlApi';
import { getCategories, createCategory, updateCategoryInfo, deleteCategory } from '../../queries/category';
import { CATEGORY_DETAILS } from '../../../constants/admin/categories';
import { FormValidator as Validator } from '../../../../helper';
import Helper from '../../../../helper/utility';
import { uiStore } from '../../../../services/stores';
// import { createCategory } from '../../../../services/stores/queries/category';
export class CategoryStore {
    @observable data = [];
    @observable CATEGORY_DETAILS_FRM = Validator.prepareFormObject(CATEGORY_DETAILS);
    @observable selectedCategoryState = {
      type: '',
      title: '',
    };

    @action
    setFieldValue = (key, val) => {
      this[key] = val;
    }

    @action
    initRequest = () => {
      const query = getCategories;
      this.data = graphql({
        client,
        query,
        fetchPolicy: 'network-only',
        variables: { types: null },
      });
    }

    @action
    setFormData = (id) => {
      console.log('datasrc -> ', this.categories.find(obj => obj.id === id));
      this.CATEGORY_DETAILS_FRM =
      Validator.setFormData(this.CATEGORY_DETAILS_FRM, this.categories.find(obj => obj.id === id));
      this.CATEGORY_DETAILS_FRM.fields.categoryType.value = this.selectedCategoryState.type;
      Validator.validateForm(this.CATEGORY_DETAILS_FRM);
    }

    @action
    reset = () => {
      this.CATEGORY_DETAILS_FRM = Validator.prepareFormObject(CATEGORY_DETAILS);
      this.CATEGORY_DETAILS_FRM.fields.categoryType.value = this.selectedCategoryState.type;
    }
    @computed get getAllCategoriesData() {
      const formattedData = [
        {
          title: 'Investor FAQ',
          categories: filter(this.categories, cat => cat.categoryType === 'INV_FAQ'),
        },
        {
          title: 'Issuer FAQ',
          categories: filter(this.categories, cat => cat.categoryType === 'ISSUER_FAQ'),
        },
        {
          title: 'Issuer Knowledge Base',
          categories: filter(this.categories, cat => cat.categoryType === 'ISSUER_KB'),
        },
        {
          title: 'Investor Knowledge Base',
          categories: filter(this.categories, cat => cat.categoryType === 'INVESTOR_KB'),
        },
        {
          title: 'Offerings',
          categories: filter(this.categories, cat => cat.categoryType === 'OFFERINGS'),
        },
        {
          title: 'Insights',
          categories: filter(this.categories, cat => cat.categoryType === 'INSIGHTS'),
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
    deleteCategory = (id) => {
      uiStore.setProgress();
      client
        .mutate({
          mutation: deleteCategory,
          variables: { id },
        }).then(() => {
          this.initRequest();
          Helper.toast('Category deleted successfully.', 'success');
        }).catch(() => {
          Helper.toast('Error while creating Category', 'error');
        })
        .finally(() => {
          uiStore.setProgress(false);
        });
    }

    @action
    saveCategories = (id) => {
      const mutation = id === 'new' ? createCategory : updateCategoryInfo;
      const param = {};
      param.categoryDetailsInput = Validator.evaluateFormData(this.CATEGORY_DETAILS_FRM.fields);
      if (id !== 'new') {
        param.id = id;
      }
      uiStore.setProgress();
      client
        .mutate({
          mutation,
          variables: param,
        })
        .then(() => {
          this.initRequest();
          Helper.toast('Category created successfully.', 'success');
        })
        .catch(() => {
          Helper.toast('Error while creating Category', 'error');
        })
        .finally(() => {
          uiStore.setProgress(false);
        });
    }
}


export default new CategoryStore();
