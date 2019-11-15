import { toJS, observable, computed, action, decorate } from 'mobx';
import graphql from 'mobx-apollo';
import { isArray, capitalize, uniqWith, isEqual } from 'lodash';
import moment from 'moment';
import DataModelStore, { decorateDefault } from './dataModelStore';
import { GqlClient as client } from '../../../../api/gqlApi';
import { allActivities, addActivity } from '../../queries/activity';
import Helper from '../../../../helper/utility';
import { FormValidator as Validator, DataFormatter } from '../../../../helper';
import { LOG_ACTIVITY } from '../../../constants/activity';
import { ACTIVITY_HISTORY_TYPES, ACTIVITY_HISTORY_SCOPE } from '../../../../constants/common';

export class ActivityHistoryStore extends DataModelStore {
  constructor() {
    super({ allActivities, addActivity });
  }

  ACTIVITY_FRM = Validator.prepareFormObject(LOG_ACTIVITY);

  requestState = { filters: {} };

  data = [];

  message = {};

  activityTypes = [];

  initRequest = (resourceId, defaultFilter = false) => {
    if (defaultFilter && resourceId === 'ELASTIC_SEARCH') {
      this.requestState.filters.startDate = DataFormatter.getDate(moment().subtract(2, 'day').format('MM-DD-YYYY'), true, 'startDate', true);
      this.requestState.filters.endDate = DataFormatter.getDate(moment().format('MM-DD-YYYY'), true, 'endDate', true);
    }
    const {
      activityType, activityUserType, startDate, endDate, subType,
    } = this.requestState.filters;
    let filterParams = { resourceId, orderBy: { field: 'activityDate', sort: 'desc' } };
    filterParams = activityType ? { ...filterParams, activityType } : { ...filterParams };
    filterParams = subType ? { ...filterParams, subType } : { ...filterParams };
    filterParams = activityUserType ? { ...filterParams, scope: activityUserType }
      : { ...filterParams };
    filterParams = (startDate || endDate) ? { ...filterParams, startDate, endDate }
      : { ...filterParams };
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

  setInitiateSrch = (name, value, resourceId) => {
    if (name === 'startDate' || name === 'endDate') {
      this.requestState.filters[name] = value && moment(value.formattedValue, 'MM-DD-YYYY', true).isValid() ? DataFormatter.getDate(value.formattedValue, true, name, true) : undefined;
      if ((this.requestState.filters.startDate && this.requestState.filters.endDate)
      || (!this.requestState.filters.startDate && !this.requestState.filters.endDate)) {
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
      this.setFieldValue('requestState', srchParams, 'filters');
      this.initRequest(resourceId);
    }
  }

  send = (resourceId, activityTitle = 'Posted new comment', activityType = ACTIVITY_HISTORY_TYPES.ADMIN_ACTIVITY) => {
    const formData = Validator.ExtractValues(this.ACTIVITY_FRM.fields);
    const data = {
      resourceId,
      activityType,
      activityTitle,
      activity: formData.comment,
      scope: ACTIVITY_HISTORY_SCOPE.ADMIN,
    };
    this.createActivityHistory(data);
  }

  createActivityHistory = async (payload, isInternal = false) => {
    try {
      await this.executeMutation({
        mutation: 'addActivity',
        variables: { activityHistoryDetails: payload },
        refetchQueries: [{
          query: allActivities,
          variables: { resourceId: payload.resourceId, orderBy: { field: 'activityDate', sort: 'desc' } },
          fetchPolicy: 'network-only',
        }],
      });
      if (isInternal) {
        Helper.toast('Activity history added successfully.', 'success');
      }
      this.resetForm('ACTIVITY_FRM');
    } catch (error) {
      Helper.toast('Something went wrong. Please try again in some time.', 'error');
    }
  }

  get allData() {
    return this.data;
  }

  getActivityTypes = () => {
    if (!this.activityTypes.length) {
      const tempArr = [{ text: 'None', value: null }];
      this.activities.forEach((a) => {
        tempArr.push({ text: capitalize(a.activityType).replace(/_/g, ' '), value: a.activityType });
      });
      this.activityTypes = uniqWith(tempArr, isEqual);
    }
  }

  get activities() {
    return (this.allData.data && this.allData.data.filterActivityHistories
      && this.allData.data.filterActivityHistories.activityHistory.length
      && toJS(this.allData.data.filterActivityHistories.activityHistory)) || [];
  }

  get error() {
    return (this.allData.error && this.allData.error.message) || null;
  }

  get loader() {
    return this.allData.loading;
  }
}

decorate(ActivityHistoryStore, {
  ...decorateDefault,
  ACTIVITY_FRM: observable,
  requestState: observable,
  data: observable,
  message: observable,
  activityTypes: observable,
  initRequest: action,
  setInitiateSrch: action,
  send: action,
  createActivityHistory: action,
  getActivityTypes: action,
  allData: computed,
  activities: computed,
  error: computed,
  loader: computed,
});

export default new ActivityHistoryStore();
