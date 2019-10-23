import { observable, action, computed } from 'mobx';
import graphql from 'mobx-apollo';
import { orderBy, get } from 'lodash';
import moment from 'moment';
import { GqlClient as client } from '../../../../../api/gqlApi';
import { FormValidator as Validator, ClientDb } from '../../../../../helper';
import Helper from '../../../../../helper/utility';
import { UPDATES, TEMPLATE } from '../../../../constants/offering';
import { offeringCreationStore, uiStore, userDetailsStore } from '../../../index';
import {
  allUpdates, newUpdate, getUpdate, editUpdate, approveUpdate, deleteOfferingUpdate,
  sendOfferingUpdateTestEmail, offeringUpdatePublish,
} from '../../../queries/offering/Updates';

export class UpdateStore {
    @observable data = [];

    @observable filters = false;

    @observable currentUpdate = {};

    @observable newUpdateId = null;

    @observable requestState = {
      skip: 0,
      page: 1,
      perPage: 10,
      displayTillIndex: 10,
      search: {},
    };

    @observable db;

    @observable isApiHit = false;

    @observable PBUILDER_FRM = Validator.prepareFormObject(UPDATES);

    @observable TEMPLATE_FRM = Validator.prepareFormObject(TEMPLATE);

    @action
    initRequest = () => {
      const variables = { offerId: offeringCreationStore.currentOfferingId };
      if (userDetailsStore.selectedUserId) {
        variables.userId = userDetailsStore.selectedUserId;
      }
      this.data = graphql({
        client,
        query: allUpdates,
        variables,
        fetchPolicy: 'network-only',
        onFetch: (res) => {
          if (res && res.offeringUpdatesByOfferId) {
            this.setFieldValue('isApiHit', true);
            this.requestState.page = 1;
            this.requestState.skip = 0;
            this.setDb(res.offeringUpdatesByOfferId);
          }
        },
      });
    }

  @action
  setDb = (data) => {
    const orderedData = orderBy(data, ['updated.date'], ['desc']);
    this.db = ClientDb.initiateDb(orderedData, false, true);
  }


  @action
  initiateFilters = () => {
    const { keyword } = this.requestState.search;
    let resultArray = [];
    this.setDb(this.data.data.offeringUpdatesByOfferId);
    if (keyword) {
      resultArray = ClientDb.filterData('title', keyword, 'likenocase');
      this.setDb(resultArray);
      this.requestState.page = 1;
      this.requestState.skip = 0;
    }
  }

    @action
    setInitiateSrch = (name, value) => {
      this.requestState.search[name] = value;
      this.initiateFilters();
    }

    @action
    sendTestEmail = (offeringUpdateId, emailTemplate = false) => {
      uiStore.setLoaderMessage('...Sending Test Email');
      const params = {
        offeringUpdateId,
        emailTemplate: emailTemplate || this.TEMPLATE_FRM.fields.type.value,
        shouldSendInvestorNotifications: this.PBUILDER_FRM.fields.shouldSendInvestorNotifications.value || false,
      };
      client
        .mutate({
          mutation: sendOfferingUpdateTestEmail,
          variables: params,
        })
        .then(() => {
          uiStore.setLoaderMessage('');
          Helper.toast('Email sent ', 'success');
          uiStore.setProgress(false);
        })
        .catch(() => {
          uiStore.setLoaderMessage('');
          Helper.toast('Something went wrong, please try again later. ', 'error');
          uiStore.setProgress(false);
        });
    }

    @action
    offeringUpdatePublish = (offeringUpdateId, data, shouldSendInvestorNotifications, showToast = true) => new Promise((resolve, reject) => {
      client
        .mutate({
          mutation: offeringUpdatePublish,
          variables: {
            id: offeringUpdateId,
            emailTemplate: this.TEMPLATE_FRM.fields.type.value,
            updatesInput: data,
            shouldSendInvestorNotifications,
          },
        })
        .then(() => {
          if (showToast) {
            Helper.toast('Offering Published Successfully ', 'success');
          }
          resolve();
        })
        .catch(() => {
          Helper.toast('Something went wrong, please try again later. ', 'error');
          reject();
        });
    });

    @action
    toggleSearch = () => {
      this.filters = !this.filters;
    }

    @action
    UpdateChange = (e, result) => {
      if (result && result.type === 'checkbox') {
        if (result.name === 'allInvestor' || result.name === 'shouldSendInvestorNotifications') {
          this.PBUILDER_FRM.fields[result.name].value = result.checked;
          if (result.checked && result.name !== 'shouldSendInvestorNotifications') {
            this.PBUILDER_FRM.fields.tiers.values = [];
          }
        } else {
          const index = this.PBUILDER_FRM.fields.tiers.values.indexOf(result.value);
          if (index === -1) {
            this.PBUILDER_FRM.fields.tiers.values.push(result.value);
          } else {
            this.PBUILDER_FRM.fields.tiers.values.splice(index, 1);
          }
          this.PBUILDER_FRM.fields.allInvestor.value = this.PBUILDER_FRM.fields.tiers.values.length === 0;
        }
        this.PBUILDER_FRM.meta.isDirty = true;
        Validator.validateForm(this.PBUILDER_FRM, false, false, false);
      } else {
        this.PBUILDER_FRM = Validator.onChange(this.PBUILDER_FRM, Validator.pullValues(e, result), true);
      }
    };

    @action
    selectTemplate = (e, result) => {
      if (this.TEMPLATE_FRM.fields.type.value !== result.value) {
        this.PBUILDER_FRM.meta.isDirty = true;
      }
      this.TEMPLATE_FRM = Validator.onChange(this.TEMPLATE_FRM, Validator.pullValues(e, result), true);
    };

    @action
    maskChange = (values, form, field) => {
      const fieldValue = values.formattedValue;
      this[form] = Validator.onChange(
        this[form],
        { name: field, value: fieldValue },
      );
    }

    @action
    FChange = (field, value) => {
      this.PBUILDER_FRM.fields[field].value = value;
      this.PBUILDER_FRM.meta.isDirty = true;
      Validator.validateForm(this.PBUILDER_FRM);
    }

    @action
    setFieldValue = (field, value) => {
      this[field] = value;
    }

    @action
    setUpdate = (value) => {
      if (get(this.currentUpdate, 'data.offeringUpdatesById')) {
        this.currentUpdate.data.offeringUpdatesById = value;
        this.setStatus(get(this.currentUpdate, 'data.offeringUpdatesById.status'));
      } else {
        this.currentUpdate = { data: { offeringUpdatesById: value } };
      }
    }

    @action
    save = (id, status, showToast = true, updateOnly = false) => new Promise((resolve) => {
      uiStore.setProgress(status);
      this.PBUILDER_FRM.meta.isDirty = false;
      const data = Validator.ExtractValues(this.PBUILDER_FRM.fields);
      delete data.allInvestor;
      delete data.shouldSendInvestorNotifications;
      data.status = status;
      data.lastUpdate = this.lastUpdateText;
      data.offeringId = offeringCreationStore.currentOfferingId;
      data.tiers = this.PBUILDER_FRM.fields.tiers.values;
      const shouldSendInvestorNotifications = this.PBUILDER_FRM.fields.shouldSendInvestorNotifications.value || false;
      if (id !== 'new' && (status === 'PUBLISHED' && !updateOnly)) {
        data.isVisible = true;
        this.offeringUpdatePublish(id, data, shouldSendInvestorNotifications, showToast).then(() => {
          uiStore.setProgress(false);
          resolve();
        }).catch(() => uiStore.setProgress(false));
        return;
      }
      client
        .mutate({
          mutation: id === 'new' ? newUpdate : editUpdate,
          variables: id === 'new' ? { updatesInput: data }
            : { ...{ updatesInput: data }, id },
        })
        .then((res) => {
          if (id === 'new') {
            this.setStatus(status);
            this.setFieldValue('newUpdateId', res.data.createOfferingUpdates.id);
            this.setUpdate(res.data.createOfferingUpdates);
          } else {
            this.setUpdate(res.data.updateOfferingUpdatesInfo);
          }
          if (showToast) {
            Helper.toast(id === 'new' ? 'Update added.' : 'Update Updated Successfully', 'success');
          }
          this.setFormIsDirty(false);
          uiStore.setProgress(false);
          resolve();
        })
        .catch((res) => {
          Helper.toast(`${res} Error`, 'error');
          uiStore.setProgress(false);
        });
    });

    @action
    setStatus = (status) => {
      this.PBUILDER_FRM.fields.status.value = status;
    }

    @action
    setFormIsDirty = (isDirty) => {
      this.PBUILDER_FRM.meta.isDirty = isDirty;
    }

    @action
    approveUpdate = (id) => {
      client.mutate({
        mutation: approveUpdate,
        variables: { id },
      }).then(() => {
        Helper.toast('Update published.', 'success');
      })
        .catch(() => Helper.toast('Error', 'error'));
    }

    @action
    updateVisibility = (data, isVisible) => {
      const payload = { ...data };
      ['refId', 'id', 'approved', '__typename', 'updated', '___id', '___s'].forEach((d) => {
        delete payload[d];
      });
      payload.isVisible = isVisible;
      const variables = { offerId: offeringCreationStore.currentOfferingId };
      client
        .mutate({
          mutation: editUpdate,
          variables: {
            updatesInput: payload,
            id: data.id,
          },
          refetchQueries: [{ query: allUpdates, variables }],
        })
        .then(() => { Helper.toast(`Offering update is ${isVisible ? 'visible' : 'invisible'}`, 'success'); })
        .catch(() => { Helper.toast('Something went wrong, please try again later. ', 'error'); });
    }

    @action
    getOne = (id) => {
      this.reset();
      this.currentUpdate = graphql({
        client,
        query: getUpdate,
        variables: { id },
        fetchPolicy: 'network-only',
        onFetch: (res) => {
          if (res) {
            this.setFormData(res.offeringUpdatesById);
          }
        },
      });
    }

    @action
    setFormData = (offeringUpdatesById) => {
      Object.keys(this.PBUILDER_FRM.fields).map((key) => {
        if (key !== 'shouldSendInvestorNotifications') {
          this.PBUILDER_FRM.fields[key].value = offeringUpdatesById[key];
        }
        return null;
      });
      this.PBUILDER_FRM.fields.tiers.values = offeringUpdatesById.tiers || [];
      this.PBUILDER_FRM.fields.allInvestor.value = offeringUpdatesById.tiers && offeringUpdatesById.tiers.length === 0;
      this.PBUILDER_FRM.fields.updatedDate.value = offeringUpdatesById.updatedDate;
      Validator.validateForm(this.PBUILDER_FRM);
    }

    @action
    reset = () => {
      this.PBUILDER_FRM = Validator.prepareFormObject(UPDATES);
      this.PBUILDER_FRM.fields.updatedDate.value = moment().format('MM/DD/YYYY');
    }

    @action
    pageRequest = ({ skip, page }) => {
      this.requestState.displayTillIndex = this.requestState.perPage * page;
      this.requestState.page = page;
      this.requestState.skip = skip;
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
      return (this.db && this.db.length
        && this.db.slice(this.requestState.skip, this.requestState.displayTillIndex)) || [];
    }

    @computed get loadingCurrentUpdate() {
      return this.currentUpdate.loading;
    }

    @computed get currentUpdates() {
      return this.currentUpdate.data.offeringUpdatesById || [];
    }

    @computed get count() {
      return (this.db && this.db.length) || 0;
    }

    @action
    deleteOfferingUpdates = id => new Promise((resolve, reject) => {
      uiStore.setProgress(true);
      client
        .mutate({
          mutation: deleteOfferingUpdate,
          variables: {
            id: [id],
          },
        }).then(() => {
          Helper.toast('Update deleted.', 'success');
          this.setFieldValue('newUpdateId', null);
          resolve();
          uiStore.setProgress(false);
        }).catch(() => {
          Helper.toast('Something went wrong.', 'error');
          reject();
          uiStore.setProgress(false);
        });
    });

    @computed get loading() {
      return this.data.loading;
    }

    @computed get offeringUpdateData() {
      return (this.currentUpdate.data && this.currentUpdate.data.offeringUpdatesById) || null;
    }
}


export default new UpdateStore();
