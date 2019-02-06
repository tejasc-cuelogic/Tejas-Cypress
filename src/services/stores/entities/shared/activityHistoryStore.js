import { toJS, observable, computed, action } from 'mobx';
import graphql from 'mobx-apollo';
import { isArray } from 'lodash';
import { GqlClient as client } from '../../../../api/gqlApi';
import { allActivities, addActivity } from '../../queries/activity';
import Helper from '../../../../helper/utility';
import { FormValidator as Validator } from '../../../../helper';
import { LOG_ACTIVITY } from '../../../constants/activity';
import { ACTIVITY_HISTORY_TYPES, ACTIVITY_HISTORY_SCOPE } from '../../../../constants/common';

export class ActivityHistoryStore {
  @observable ACTIVITY_FRM = Validator.prepareFormObject(LOG_ACTIVITY);
  @observable requestState = { filters: {} };
  @observable data = [];
  @observable message = {};

  @action
  initRequest = (resourceId) => {
    const { activityType, activityUserType } = this.requestState.filters;
    let filterParams = { resourceId, orderBy: { field: 'activityDate', sort: 'desc' } };
    filterParams = activityType ? { ...filterParams, activityType } : { ...filterParams };
    filterParams = activityUserType ? { ...filterParams, scope: activityUserType } :
      { ...filterParams };
    this.data = graphql({
      client,
      query: allActivities,
      variables: filterParams,
      fetchPolicy: 'network-only',
    });
  }

  @action
  setInitiateSrch = (name, value, resourceId) => {
    const srchParams = { ...this.requestState.filters };
    if ((isArray(value) && value.length > 0) || (typeof value === 'string' && value !== '')) {
      srchParams[name] = value;
      if (isArray(value) && value.length > 0) {
        // eslint-disable-next-line prefer-destructuring
        srchParams[name] = value[0];
      }
    } else {
      delete srchParams[name];
    }
    this.requestState.filters = srchParams;
    this.initRequest(resourceId);
  }

  @action
  send = (resourceId) => {
    const formData = Validator.ExtractValues(this.ACTIVITY_FRM.fields);
    const data = {
      resourceId,
      activityType: ACTIVITY_HISTORY_TYPES.ADMIN_ACTIVITY,
      activityTitle: 'Posted new comment',
      activity: formData.comment,
      scope: ACTIVITY_HISTORY_SCOPE.ADMIN,
    };
    this.createActivityHistory(data);
  }

  @action
  createActivityHistory = (payload, isInternal = false) => {
    client
      .mutate({
        mutation: addActivity,
        variables: {
          activityHistoryDetails: payload,
        },
        refetchQueries: [{
          query: allActivities,
          variables: { resourceId: payload.resourceId, orderBy: { field: 'activityDate', sort: 'desc' } },
          fetchPolicy: 'network-only',
        }],
      })
      .then(() => {
        if (isInternal) {
          Helper.toast('Activity history added successfully.', 'success');
        }
        this.reset();
      })
      .catch(() => Helper.toast('Something went wrong, please try again later.', 'error'));
  }

  @computed get allData() {
    return this.data;
  }

  @computed get activities() {
    return (this.allData.data && this.allData.data.filterActivityHistories &&
      this.allData.data.filterActivityHistories.activityHistory.length &&
      toJS(this.allData.data.filterActivityHistories.activityHistory)) || [];
  }

  @computed get error() {
    return (this.allData.error && this.allData.error.message) || null;
  }

  @computed get loading() {
    return this.allData.loading;
  }

  @action
  reset = () => {
    this.ACTIVITY_FRM = Validator.prepareFormObject(LOG_ACTIVITY);
  };

  @action
  msgEleChange = (e, result) => {
    this.ACTIVITY_FRM = Validator.onChange(this.ACTIVITY_FRM, Validator.pullValues(e, result));
  };
}

export default new ActivityHistoryStore();
