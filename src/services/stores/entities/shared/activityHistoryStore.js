import { toJS, observable, computed, action } from 'mobx';
import graphql from 'mobx-apollo';
import { GqlClient as client } from '../../../../api/gqlApi';
// import { GqlClient as clientPublic } from '../../../../api/publicApi';
import { allActivities, addActivity } from '../../queries/activity';
import { businessAppStore } from '../../index';
import Helper from '../../../../helper/utility';
import { FormValidator as Validator } from '../../../../helper';
import { LOG_ACTIVITY } from '../../../constants/activity';

export class ActivityHistoryStore {
  @observable ACTIVITY_FRM = Validator.prepareFormObject(LOG_ACTIVITY);
  @observable requestState = { filters: {} };
  @observable data = [];
  @observable message = {};

  @action
  initRequest = () => {
    const { activityType, activityUserType } = this.requestState.filters;
    let filterParams = { resourceId: businessAppStore.applicationId, orderBy: { field: 'activityDate', sort: 'desc' } };
    filterParams = activityType !== '' ? { ...filterParams, activityType } : { ...filterParams };
    filterParams = activityUserType !== '' ? { ...filterParams, scope: activityUserType } : { ...filterParams };
    this.data = graphql({
      client,
      query: allActivities,
      variables: filterParams,
    });
  }

  @action
  setInitiateSrch = (name, value) => {
    this.requestState.filters[name] = value;
    this.initRequest();
  }

  @action
  send = () => {
    const formData = Validator.ExtractValues(this.ACTIVITY_FRM.fields);
    const data = {
      resourceId: businessAppStore.applicationId,
      activityType: 'ADMIN_ACTIVITY',
      activityTitle: 'Testing',
      activity: formData.comment,
      scope: 'ADMIN',
    };
    client
      .mutate({
        mutation: addActivity,
        variables: {
          activityHistoryDetails: data,
        },
        refetchQueries: [{
          query: allActivities,
          variables: { resourceId: businessAppStore.applicationId },
        }],
      })
      .then(() => {
        Helper.toast('sent.', 'success');
        this.reset();
      })
      .catch(e => console.log(e, 'error'));
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
