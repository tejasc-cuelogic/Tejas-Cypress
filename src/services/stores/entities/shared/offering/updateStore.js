import { observable, action, computed, toJS } from 'mobx';
import graphql from 'mobx-apollo';
import { GqlClient as client } from '../../../../../api/gcoolApi';
import { FormValidator as Validator } from '../../../../../helper';
import Helper from '../../../../../helper/utility';
import { UPDATES } from '../../../../constants/offering';
import {
  allUpdates, newUpdate, getUpdate, editUpdate,
} from '../../../queries/offering/Updates';

export class UpdateStore {
    @observable data = [];
    @observable filters = false;
    @observable currentUpdate = {};
    @observable requestState = {
      search: {},
    };
    @observable PBUILDER_FRM = Validator.prepareFormObject(UPDATES);

    @action
    initRequest = () => {
      this.data = graphql({ client, query: allUpdates });
    }

    @action
    setInitiateSrch = (name, value) => {
      this.requestState.search[name] = value;
      this.initRequest({ ...this.requestState.search });
    }

    @action
    toggleSearch = () => {
      this.filters = !this.filters;
    }

    @action
    UpdateChange = (e, result) => {
      this.PBUILDER_FRM = Validator.onChange(this.PBUILDER_FRM, Validator.pullValues(e, result));
    };

    @action
    FChange = (field, value) => {
      this.PBUILDER_FRM.fields[field].value = value;
      Validator.validateForm(this.PBUILDER_FRM);
    }

    @action
    save = (id, status) => {
      const data = Validator.ExtractValues(this.PBUILDER_FRM.fields);
      data.status = status;
      data.lastUpdate = this.lastUpdateText;
      client
        .mutate({
          mutation: id === 'new' ? newUpdate : editUpdate,
          variables: id === 'new' ? data : { ...data, id },
          refetchQueries: [{ query: allUpdates }],
        })
        .then(() => {
          Helper.toast('Update added.', 'success');
          this.reset();
        })
        .catch(() => Helper.toast('Error', 'error'));
    }

    @action
    getOne = (id) => {
      this.currentUpdate = graphql({
        client,
        query: getUpdate,
        variables: { id },
        onFetch: (res) => {
          Object.keys(this.PBUILDER_FRM.fields).map((key) => {
            this.PBUILDER_FRM.fields[key].value = res.Update[key];
            return null;
          });
          Validator.validateForm(this.PBUILDER_FRM);
        },
      });
    }

    @action
    reset = () => {
      this.PBUILDER_FRM = Validator.prepareFormObject(UPDATES);
    }

    @computed get lastUpdateText() {
      const { status } = Validator.ExtractValues(this.PBUILDER_FRM.fields);
      const lastUpdateMeta = {
        draft: 'saved as Draft',
        submit_for_approval: 'Brandon sent update for review',
      };
      return lastUpdateMeta[status];
    }

    @computed get updates() {
      return (this.data.data && toJS(this.data.data.allUpdates)) || [];
    }

    @computed get loading() {
      return this.data.loading;
    }
}


export default new UpdateStore();
