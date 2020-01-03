import { decorate, observable, action } from 'mobx';
import { startCase } from 'lodash';
import { FormValidator as Validator, DataFormatter } from '../../../../../helper';
import DataModelStore, * as dataModelStore from '../dataModelStore';
import { TOMBSTONE_BASIC, TOMBSTONE_HEADER_META, HEADER_BASIC } from '../../../../constants/offering/formMeta/offering';
import { fileUpload } from '../../../../actions';
import Helper from '../../../../../helper/utility';
import { GqlClient as client } from '../../../../../api/gqlApi';
import { offeringCreationStore, offeringsStore, uiStore } from '../../../index';
import { offeringUpsert } from '../../../queries/offerings/manage-v2';


export class ManageOfferingStore extends DataModelStore {
  TOMBSTONE_BASIC_FRM = Validator.prepareFormObject(TOMBSTONE_BASIC);

  TOMBSTONE_HEADER_META_FRM = Validator.prepareFormObject(TOMBSTONE_HEADER_META);

  HEADER_BASIC_FRM = Validator.prepareFormObject(HEADER_BASIC);

  uploadMedia = (name, form) => {
    const fileObj = {
      obj: this[form].fields[name].base64String,
      name: Helper.sanitize(this[form].fields[name].fileName),
    };
    fileUpload.uploadToS3(fileObj, `offerings/${offeringCreationStore.currentOfferingId}`)
      .then((res) => {
        console.log(res);
        const url = res.split('/');
        this.setMediaAttribute(form, 'value', url[url.length - 1], name);
        this.setMediaAttribute(form, 'preSignedUrl', res, name);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  updateOffering = params => new Promise((res) => {
    const { keyName, forms } = params;
    const offeringDetails = {};
    let data;
    if (Array.isArray(forms)) {
      forms.forEach((f) => {
        data = { ...data, ...Validator.evaluateFormData(this[f].fields) };
      });
    } else {
      data = Validator.evaluateFormData(this[forms].fields);
    }
    offeringDetails[keyName] = data;
    const mutationsParams = {
      ...params,
      id: offeringCreationStore.currentOfferingId,
      offeringDetails,
      res,
    };
    console.log(offeringDetails);
    this.updateOfferingMutation(mutationsParams);
  });

  updateOfferingMutation = (params) => {
    const {
      id, offeringDetails, keyName, notify = true, successMsg = undefined, fromS3 = false, res, msgType = 'success',
     } = params;
    uiStore.setProgress('save');
    const variables = {
      id,
      offeringDetails,
    };
    client
      .mutate({
        mutation: offeringUpsert,
        variables,
      })
      .then(() => {
        // let upatedOffering = null;
        // if (get(result, 'data.updateOffering')) {
        //   upatedOffering = Helper.replaceKeysDeep(toJS(get(result, 'data.updateOffering')), { aliasId: 'id', aliasAccreditedOnly: 'isVisible' });
        //   offeringsStore.updateOfferingList(id, upatedOffering, keyName);
        // }
        this.removeUploadedFiles(fromS3);
        if (successMsg) {
          Helper.toast(successMsg, msgType || 'success');
        } else if (notify) {
          Helper.toast(`${startCase(keyName) || 'Offering'} has been saved successfully.`, 'success');
        }
        offeringsStore.getOne(id, false);
        uiStore.setProgress(false);
        res();
      })
      .catch((err) => {
        uiStore.setErrors(DataFormatter.getSimpleErr(err));
        Helper.toast('Something went wrong.', 'error');
        uiStore.setProgress(false);
      });
  };

  getActionType = (formName, getField = 'actionType') => {
    const metaDataMapping = {
      TOMBSTONE_HEADER_META_FRM: { isMultiForm: true },
      TOMBSTONE_BASIC_FRM: { isMultiForm: false },
      HEADER_BASIC_FRM: { isMultiForm: false },
    };
    return metaDataMapping[formName][getField];
  }

  setFormData = (form, ref, keepAtLeastOne) => {
    Validator.resetFormData(this[form]);
    const { offer } = offeringsStore;
    if (!offer) {
      return false;
    }
    this[form] = Validator.setFormData(this[form], offer, ref, keepAtLeastOne);
    const multiForm = this.getActionType(form, 'isMultiForm');
    this[form] = Validator.validateForm(this[form], multiForm, false, false);
    return false;
  }
}

  decorate(ManageOfferingStore, {
    ...dataModelStore.decorateDefault,
    TOMBSTONE_BASIC_FRM: observable,
    TOMBSTONE_HEADER_META_FRM: observable,
    HEADER_BASIC_FRM: observable,
    uploadMedia: action,
    updateOffering: action,
    updateOfferingMutation: action,
    setFormData: action,
  });

export default new ManageOfferingStore();
