import { observable, action, computed, toJS } from 'mobx';
import graphql from 'mobx-apollo';
import { sortBy, filter } from 'lodash';
import { GqlClient as client } from '../../../../api/gqlApi';
import { getCategories, createCategory, updateCategoryInfo, deleteCategory, updateCategoryStaus } from '../../queries/category';
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
          type: 'INV_FAQ',
        },
        {
          title: 'Issuer FAQ',
          categories: filter(this.categories, cat => cat.categoryType === 'ISSUER_FAQ'),
          type: 'ISSUER_FAQ',
        },
        {
          title: 'Issuer Knowledge Base',
          categories: filter(this.categories, cat => cat.categoryType === 'ISSUER_KB'),
          type: 'ISSUER_KB',
        },
        {
          title: 'Investor Knowledge Base',
          categories: filter(this.categories, cat => cat.categoryType === 'INVESTOR_KB'),
          type: 'INVESTOR_KB',
        },
        {
          title: 'Offerings',
          categories: filter(this.categories, cat => cat.categoryType === 'OFFERINGS'),
          type: 'OFFERINGS',
        },
        {
          title: 'Insights',
          categories: filter(this.categories, cat => cat.categoryType === 'INSIGHTS'),
          type: 'INSIGHTS',
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
    saveCategories = (id, isPublished) => {
      const mutation = id === 'new' ? createCategory : (isPublished === 'defaultPublished' ? updateCategoryInfo : updateCategoryStaus);
      const param = {};
      if (id !== 'new') {
        param.id = id;
        if (isPublished !== 'defaultPublished') {
          param.isPublished = !isPublished;
        } else {
          param.categoryDetailsInput = Validator.evaluateFormData(this.CATEGORY_DETAILS_FRM.fields);
        }
      } else {
        param.categoryDetailsInput = Validator.evaluateFormData(this.CATEGORY_DETAILS_FRM.fields);
      }
      const successMessage = id === 'new' ?
        'Category created successfully.' :
        (isPublished === 'defaultPublished' ?
          'Category Updated successfully.' :
          'Category Status Updated successfully.');
      uiStore.setProgress();
      client
        .mutate({
          mutation,
          variables: param,
        })
        .then(() => {
          this.initRequest();
          Helper.toast(successMessage, 'success');
          // Helper.toast('Category created successfully.', 'success');
        })
        .catch(() => {
          Helper.toast('Error while Performing the Operation', 'error');
        })
        .finally(() => {
          uiStore.setProgress(false);
        });
    }
}


export default new CategoryStore();
