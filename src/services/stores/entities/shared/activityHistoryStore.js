import { toJS, observable, computed, action } from 'mobx';
import graphql from 'mobx-apollo';
import { GqlClient as client } from '../../../../api/gcoolApi';
import { allActivities, addActivity } from '../../queries/activity';
import { userStore } from '../../index';
import Helper from '../../../../helper/utility';
import { FormValidator as Validator } from '../../../../helper';
import { LOG_ACTIVITY } from '../../../constants/activity';

export class ActivityHistoryStore {
  @observable ACTIVITY_FRM = Validator.prepareFormObject(LOG_ACTIVITY);
  @observable requestState = { search: {} };
  @observable data = [];
  @observable current = {};
  @observable message = {};

  @action
  initRequest = () => {
    this.current = {};
    this.data = graphql({ client, query: allActivities });
  }

  @action
  send = () => {
    const data = Validator.ExtractValues(this.ACTIVITY_FRM.fields);
    data.title = 'Posted new comment';
    if (userStore.currentUser) {
      data.userName = `${userStore.currentUser.givenName} ${userStore.currentUser.familyName}`;
      data.userId = userStore.currentUser.sub;
    }
    client
      .mutate({
        mutation: addActivity,
        variables: data,
        refetchQueries: [{ query: allActivities }],
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
    return (this.allData.data && this.allData.data.allActivityHistories &&
      toJS(this.allData.data.allActivityHistories)) || [];
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
