import { observable, action, computed, toJS } from 'mobx';
import graphql from 'mobx-apollo';
import { sortBy, filter } from 'lodash';
import { GqlClient as client } from '../../../../api/gqlApi';
import { adminCategories, adminCreateCategory, adminUpdateCategoryInfo, adminDeleteCategory, adminUpdateCategoryStaus, adminSetCategoryOrderForCategoryType } from '../../queries/category';
import { CATEGORY_DETAILS, CATEGORY_DATA } from '../../../constants/admin/categories';
import { FormValidator as Validator } from '../../../../helper';
import Helper from '../../../../helper/utility';
import { uiStore } from '../..';

export class CategoryStore {
    @observable data = [];

    @observable CATEGORY_DETAILS_FRM = Validator.prepareFormObject(CATEGORY_DETAILS);

    @observable selectedCategoryState = {
      type: '',
      title: '',
      index: '',
    };

    @observable ifApiHitFirstTime = true;

    @observable currentCategoryIndex = null;

    @observable uniqueCategoryError = null;

    @observable allCategoriesData = [];

    @action
    setFieldValue = (key, val) => {
      this[key] = val;
    }

    @action
    initRequest = () => {
      this.data = graphql({
        client,
        query: adminCategories,
        fetchPolicy: 'network-only',
        variables: { types: null },
        onFetch: () => {
          if (!this.data.loading) {
            this.setAllCategoriesData();
          }
        },
      });
    }

    @action
    setFormData = (id) => {
      this.CATEGORY_DETAILS_FRM = Validator.setFormData(this.CATEGORY_DETAILS_FRM, this.categories.find(obj => obj.id === id));
      this.CATEGORY_DETAILS_FRM.fields.categoryType.value = this.selectedCategoryState.type;
      Validator.validateForm(this.CATEGORY_DETAILS_FRM);
    }

    @action
    reset = () => {
      this.CATEGORY_DETAILS_FRM = Validator.prepareFormObject(CATEGORY_DETAILS);
      this.CATEGORY_DETAILS_FRM.fields.categoryType.value = this.selectedCategoryState.type;
    }

    @action
    setAllCategoriesData = () => {
      const formattedData = [];
      CATEGORY_DATA.map((data) => {
        const categoryData = {
          title: data.title,
          categories: filter(this.categories, cat => cat.categoryType === data.enum),
          type: data.enum,
        };
        formattedData.push(categoryData);
        return null;
      });
      this.allCategoriesData = formattedData;
    }

    @computed get categories() {
      return (this.data.data && sortBy(toJS(this.data.data.adminCategories), ['order'])) || [];
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
          mutation: adminDeleteCategory,
          variables: { id },
          refetchQueries: [{
            query: adminCategories,
            variables: { types: null },
          }],
        }).then(() => {
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
      uiStore.setProgress();
      const mutation = id === 'new' ? adminCreateCategory : (isPublished === 'defaultPublished' ? adminUpdateCategoryInfo : adminUpdateCategoryStaus);
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
      const successMessage = id === 'new'
        ? 'Category created successfully.'
        : (isPublished === 'defaultPublished'
          ? 'Category Updated successfully.'
          : 'Category Status Updated successfully.');
      return new Promise((resolve, reject) => {
        client
          .mutate({
            mutation,
            variables: param,
          })
          .then(() => {
            this.currentCategoryIndex = this.selectedCategoryState.index;
            Helper.toast(successMessage, 'success');
            resolve();
          })
          .catch((res) => {
            const error = res.graphQLErrors[0] ? res.graphQLErrors[0].message : '';
            const customError = error && error.includes('already exists') ? 'This category name already exists'
              : Helper.toast('Error while Performing the Operation', 'error');
            uiStore.setErrors(customError);
            reject();
          })
          .finally(() => {
            this.initRequest();
            uiStore.setProgress(false);
          });
      });
    }

    @action
    setCategoryOrder = (newArr, catIndex) => {
      this.allCategoriesData[catIndex].categories = newArr;
      const categoryDetails = [];
      newArr.forEach((item, index) => {
        categoryDetails.push({
          categoryId: item.id,
          order: index + 1,
        });
      });
      uiStore.setProgress();
      client
        .mutate({
          mutation: adminSetCategoryOrderForCategoryType,
          variables: { categoryDetails },
        }).then(() => {
          Helper.toast('Category Order Changed successfully.', 'success');
        }).catch(() => {
          Helper.toast('Error while updating Category Order', 'error');
        })
        .finally(() => {
          uiStore.setProgress(false);
        });
    }
}


export default new CategoryStore();
