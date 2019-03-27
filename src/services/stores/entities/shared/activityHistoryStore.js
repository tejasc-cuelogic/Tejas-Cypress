import { toJS, observable, computed, action } from 'mobx';
import graphql from 'mobx-apollo';
import { isArray, capitalize, uniqWith, isEqual } from 'lodash';
import moment from 'moment';
import { GqlClient as client } from '../../../../api/gqlApi';
import { allActivities, addActivity } from '../../queries/activity';
import Helper from '../../../../helper/utility';
import { FormValidator as Validator, DataFormatter } from '../../../../helper';
import { LOG_ACTIVITY } from '../../../constants/activity';
import { ACTIVITY_HISTORY_TYPES, ACTIVITY_HISTORY_SCOPE } from '../../../../constants/common';

export class ActivityHistoryStore {
  @observable ACTIVITY_FRM = Validator.prepareFormObject(LOG_ACTIVITY);
  @observable requestState = { filters: {} };
  @observable data = [];
  @observable message = {};
  @observable activityTypes = [];

  @action
  initRequest = (resourceId) => {
    const {
      activityType, activityUserType, startDate, endDate, subType,
    } = this.requestState.filters;
    let filterParams = { resourceId, orderBy: { field: 'activityDate', sort: 'desc' } };
    filterParams = activityType ? { ...filterParams, activityType } : { ...filterParams };
    filterParams = subType ? { ...filterParams, subType } : { ...filterParams };
    filterParams = activityUserType ? { ...filterParams, scope: activityUserType } :
      { ...filterParams };
    filterParams = (startDate || endDate) ? { ...filterParams, startDate, endDate } :
      { ...filterParams };
    this.data = graphql({
      client,
      query: allActivities,
      variables: filterParams,
      fetchPolicy: 'network-only',
      onFetch: (data) => {
        if (data && !this.data.loading) {
          this.getActivityTypes();
        }
      },
    });
  }

  @action
  setInitiateSrch = (name, value, resourceId) => {
    if (name === 'startDate' || name === 'endDate') {
      this.requestState.filters[name] = value && moment(value.formattedValue, 'MM-DD-YYYY', true).isValid() ? DataFormatter.getDate(value.formattedValue, true, name, true) : undefined;
      if (this.requestState.filters.startDate && this.requestState.filters.endDate) {
        this.initRequest(resourceId);
      }
    } else {
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

  @action
  getActivityTypes = () => {
    if (!this.activityTypes.length) {
      const tempArr = [];
      this.activities.forEach((a) => {
        tempArr.push({ text: capitalize(a.activityType).replace(/_/g, ' '), value: a.activityType });
      });
      this.activityTypes = uniqWith(tempArr, isEqual);
    }
  }
  @action
  setFieldValue = (field, val) => {
    this[field] = val;
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
