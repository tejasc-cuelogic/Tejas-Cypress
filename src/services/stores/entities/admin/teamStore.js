import { observable, action, computed, toJS } from 'mobx';
import graphql from 'mobx-apollo';
import { forEach, sortBy, uniqWith, isEqual, map } from 'lodash';
import { GqlClient as clientPublic } from '../../../../api/publicApi';
import { GqlClient as clientPrivate } from '../../../../api/gqlApi';
import { FormValidator as Validator, ClientDb } from '../../../../helper';
import Helper from '../../../../helper/utility';
import { allTeamMembers, getTeamMemberById, deleteTeamMemberById, filteredTeamMembers, newTeamMember, editTeamMember } from '../../queries/Team';
import { TEAM } from '../../../constants/team';
// import { uiStore, userStore, userDetailsStore } from '../../index';
import { fileUpload } from '../../../actions';

export class TeamStore {
  @observable data = [];
  @observable db;
  @observable TEAM_FRM = Validator.prepareFormObject(TEAM);
  @observable editMode = false;
  @observable requestState = {
    skip: 0,
    page: 1,
    perPage: 10,
    displayTillIndex: 10,
    filters: false,
    search: {
    },
  };
  @observable confirmBox = {
    entity: '',
    refId: '',
  };
  @observable removeFileIdsList = [];

  @action
  initRequest = (isPrivate = false) => {
    const query = allTeamMembers;
    const client = isPrivate ? clientPrivate : clientPublic;
    this.data = graphql({
      client,
      query,
      onFetch: (res) => {
        if (res && res.teamMembers) {
          this.setDb(res.teamMembers);
        }
      },
    });
    this.editMode = false;
  }

  @action
  setDb = (data) => {
    const d = map(data, (dd) => {
      const de = { teamId: dd.id, ...dd };
      return de;
    });
    this.db = ClientDb.initiateDb(d, true);
  }

  @computed get teamMembers() {
    return (this.db && this.db.length &&
      sortBy(toJS(this.db.slice(this.requestState.skip, this.requestState.displayTillIndex)), ['order'])) || [];
  }

  @computed get loading() {
    return this.data.loading;
  }

  @action
  getOne = (id) => {
    this.currentUpdate = graphql({
      client: clientPrivate,
      query: getTeamMemberById,
      variables: { id },
      onFetch: (res) => {
        if (res && res.getTeamMemberById) {
          this.setFormData(res.getTeamMemberById);
        }
      },
    });
  }
  @action
  maskChange = (values, form, field) => {
    this[form] = Validator.onChange(
      this[form],
      { name: field, value: values.floatValue },
    );
  }
  @action
  setFormData = (formData) => {
    Object.keys(this.TEAM_FRM.fields).map(action((key) => {
      if (!this.TEAM_FRM.fields[key].ArrayObjItem) {
        if (key === 'avatar') {
          this.TEAM_FRM.fields[key].preSignedUrl = formData[key];
          this.TEAM_FRM.fields[key].value = formData[key];
        } else {
          this.TEAM_FRM.fields[key].value = formData[key];
        }
      } else {
        forEach(formData.social, (s) => {
          this.TEAM_FRM.fields[s.type.toLowerCase()].value = s.url;
        });
      }
      return null;
    }));
    this.editMode = true;
    Validator.validateForm(this.TEAM_FRM);
  }

  getTeamFormData = () => {
    const data = {};
    const socialData = [];
    forEach(this.TEAM_FRM.fields, (t, key) => {
      if (!t.ArrayObjItem) {
        data[key] = this.TEAM_FRM.fields[key].value;
      } else {
        socialData.push({ type: key, url: this.TEAM_FRM.fields[key].value });
      }
    });
    data.social = socialData;
    return data;
  }

  @action
  reset = () => {
    this.TEAM_FRM = Validator.prepareFormObject(TEAM);
  }

  @action
  formChange = (e, result, form) => {
    this[form] = Validator.onChange(
      this[form],
      Validator.pullValues(e, result),
    );
  }

  @action
  userEleChange = (e, res, type) => {
    this.USR_FRM = Validator.onChange(this.TEAM_FRM, Validator.pullValues(e, res), type);
  };

  @action
  FChange = (field, value) => {
    this.TEAM_FRM.fields[field].value = value;
    Validator.validateForm(this.TEAM_FRM);
  }

  @action
  deleteTeamMemberById = (id) => {
    clientPrivate
      .mutate({
        mutation: deleteTeamMemberById,
        variables: {
          id,
        },
        refetchQueries: [{ query: allTeamMembers }],
      })
      .then(() => Helper.toast('Team Member deleted successfully.', 'success'))
      .catch(() => Helper.toast('Error while deleting team member ', 'error'));
  }
  @action
  setConfirmBox = (entity, refId) => {
    this.confirmBox.entity = entity;
    this.confirmBox.refId = refId;
  }

  @action
  save = (id) => {
    const data = this.getTeamFormData();
    clientPrivate
      .mutate({
        mutation: id === 'new' ? newTeamMember : editTeamMember,
        variables: id === 'new' ? { teamMemberDetailsInput: data } : { id, teamMemberDetailsInput: data },
        refetchQueries: [{ query: allTeamMembers }],
      })
      .then(() => {
        Helper.toast(id === 'new' ? 'Team Member added successfully.' : 'Team Member updated successfully.', 'success');
      })
      .catch(res => Helper.toast(`${res} Error`, 'error'));
  }
  @action
  setProfilePhoto(attr, value, field) {
    this.TEAM_FRM.fields[field][attr] = value;
  }
  @action
  uploadProfilePhoto = (name, form = 'TEAM_FRM') => {
    const fileObj = {
      obj: this[form].fields[name].base64String,
      type: this[form].fields[name].meta.type,
      name: this[form].fields[name].fileName,
    };
    const fileField = this[form].fields[name];
    return new Promise((resolve, reject) => {
      fileUpload.uploadToS3(fileObj, 'team')
        .then(action((res) => {
          // this.setProfilePhoto('responseUrl', response.body.fileFullPath);
          Helper.toast(`${this[form].fields[name].label} uploaded successfully.`, 'success');
          fileField.value = fileObj.name;
          fileField.preSignedUrl = res;
          fileField.fileId = `${fileObj.name}${Date.now()}`;
          fileField.fileName = `${fileObj.name}${Date.now()}`;
          this.resetFormFieldForProfileImage(form, name, res);
          // this.updateOffering(this.currentOfferingId, this[form].fields,
          // 'leadership', null, true, null, null, true, index);
          // this.save('new');
          resolve(res);
        }))
        .catch((err) => {
          console.log(err);
          reject(err);
        });
    });
  }

  @action
  uploadFileToS3 = (form, name, files) => {
    let fileField = '';
    fileField = this[form].fields[name];
    fileField.showLoader = true;
    fileUpload.uploadToS3(files[0], 'team')
      .then(action((res) => {
        Helper.toast('file uploaded successfully', 'success');
        fileField.value = files[0].name;
        fileField.preSignedUrl = res;
        fileField.fileId = `${files[0].name}${Date.now()}`;
        fileField.fileName = `${files[0].name}${Date.now()}`;
      }))
      .catch(action(() => {
        Helper.toast('Something went wrong, please try again later.', 'error');
        fileField.showLoader = false;
      }))
      .finally(action(() => {
        fileField.showLoader = false;
      }));
  }

  @action
  removeUploadedDataMultiple = (form, field) => {
    // let removeFileNames = '';
    // const { value } = this[form].fields[field];
    // const { value } = this.TEAM_FRM.fields[field];
    // removeFileNames = value;
    // this.removeFileNamesList = [...this.removeFileNamesList, removeFileNames];
    this.setFormFileArray(form, field, 'fileName', '');
    this.setFormFileArray(form, field, 'fileData', '');
    this.setFormFileArray(form, field, 'value', null);
    this.setFormFileArray(form, field, 'error', undefined);
    this.setFormFileArray(form, field, 'showLoader', false);
    this.setFormFileArray(form, field, 'preSignedUrl', '');
    Validator.validateForm(this.TEAM_FRM);
  }

  @action
  setFormFileArray = (formName, field, getField, value) => {
    if (Array.isArray(toJS(this[formName].fields[field][getField]))) {
      this[formName].fields[field][getField].push(value);
    } else {
      this[formName].fields[field][getField] = value;
    }
  }

  @action
  resetProfilePhoto = (name) => {
    const attributes = ['src', 'error', 'value', 'base64String'];
    attributes.forEach((val) => {
      this.TEAM_FRM.fields[name][val] = '';
    });
  }

  @computed
  get canUpdateProfilePhoto() {
    return this.TEAM_FRM.fields.avatar.fileName !== '';
  }

  @action
  resetFormFieldForProfileImage = (form, name, res) => {
    if (res) {
      this.TEAM_FRM.fields[name].preSignedUrl = res;
      this.TEAM_FRM.fields[name].value = res;
    }
    this[form].fields[name] = {
      ...this.TEAM_FRM.fields[name],
      ...{
        src: '',
        meta: {},
      },
    };
  }
  @action
  filterTeamMembersByName = (teamMemberName) => {
    const query = filteredTeamMembers;
    const client = clientPrivate;
    this.data = graphql({
      client,
      query,
      variables: { memberName: teamMemberName },
    });
  }

  @computed get count() {
    return (this.db && this.db.length) || 0;
  }

  @action
  pageRequest = ({ skip, page }) => {
    this.requestState.displayTillIndex = this.requestState.perPage * page;
    this.requestState.page = page;
    this.requestState.skip = skip;
  }

  @action
  setInitiateSrch = (keyword, value) => {
    this.requestState.search[keyword] = value;
    this.initiateFilters();
  }
  @action
  initiateFilters = () => {
    const { keyword } = this.requestState.search;
    let resultArray = [];
    if (keyword) {
      resultArray = ClientDb.filterData('memberName', keyword, 'likenocase');
      this.setDb(uniqWith(resultArray, isEqual));
      this.requestState.page = 1;
      this.requestState.skip = 0;
    } else {
      this.setDb(this.data.data.teamMembers);
    }
  }
}


export default new TeamStore();
