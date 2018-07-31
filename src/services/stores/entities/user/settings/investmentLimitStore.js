import { observable, action } from 'mobx';
// import graphql from 'mobx-apollo';
// import { GqlClient as client } from '../../../../../api/gqlApi';
import { uiStore } from '../../../index';
import { INVESTEMENT_LIMIT } from '../../../../constants/investmentLimit';
import { FormValidator as Validator } from '../../../../../helper';

export class InvestmentLimitStore {
  @observable INVESTEMENT_LIMIT_META = Validator.prepareFormObject(INVESTEMENT_LIMIT);

  @action
  maskingFieldChange = (values, field) => {
    this.INVESTEMENT_LIMIT_META = Validator.onChange(
      this.INVESTEMENT_LIMIT_META,
      { name: field, value: values.floatValue },
    );
  };

  @action
  updateInvestementLimit = () => {
    uiStore.setProgress();
    // return new Promise((resolve, reject) => {
    //   client
    //     .mutate({
    //       mutation: updateMfaModeType,
    //       variables: {
    //         mfaMethodType: this.MFA_MODE_TYPE_META.fields.mfaModeTypes.value,
    //       },
    //     })
    //     .then((result) => {
    //       resolve();
    //     })
    //     .catch(() => reject())
    //     .finally(() => {
    //       uiStore.setProgress(false);
    //     });
    // });
  }
}

export default new InvestmentLimitStore();
