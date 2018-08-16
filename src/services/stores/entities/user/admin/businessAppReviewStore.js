import { observable, action } from 'mobx';
import { OVERVIEW } from '../../../../constants/admin/businessApplication';
import { FormValidator as Validator } from '../../../../../helper';

export class BusinessAppReviewStore {
  @observable OVERVIEW_FRM = Validator.prepareFormObject(OVERVIEW);

  @action
  addMoreCriticalPoint = () => {
    this.OVERVIEW_FRM = {
      ...this.OVERVIEW_FRM,
      fields: {
        ...this.OVERVIEW_FRM.fields,
        overview: [
          ...this.OVERVIEW_FRM.fields.overview,
          OVERVIEW.overview[0],
        ],
      },
      meta: {
        ...this.OVERVIEW_FRM.meta,
        isValid: false,
      },
    };
  }

  @action
  overviewEleChange = (e, result, index) => {
    this.OVERVIEW_FRM = Validator
      .onArrayFieldChange(this.OVERVIEW_FRM, Validator.pullValues(e, result), 'overview', index);
  };
}

export default new BusinessAppReviewStore();
