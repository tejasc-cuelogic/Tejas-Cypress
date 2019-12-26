import { decorate, observable, action } from 'mobx';
import { FormValidator as Validator } from '../../../../../helper';
import DataModelStore, * as dataModelStore from '../dataModelStore';
import { TOMBSTONE_BASIC } from '../../../../constants/offering/formMeta/offering';
import { fileUpload } from '../../../../actions';
import Helper from '../../../../../helper/utility';


export class ManageOfferingStore extends DataModelStore {
  TOMBSTONE_BASIC_FRM = Validator.prepareFormObject(TOMBSTONE_BASIC);

  uploadMedia = (name, form = 'TOMBSTONE_BASIC_FRM') => {
    const fileObj = {
      obj: this[form].fields[name].base64String,
      name: Helper.sanitize(this[form].fields[name].fileName),
    };
    fileUpload.uploadToS3(fileObj, `offerings/${this.currentOfferingId}`)
      .then((res) => {
        console.log(res);
        this.setMediaAttribute(form, 'value', res, 'tombstoneImage');
        this.setMediaAttribute(form, 'preSignedUrl', res, 'tombstoneImage');
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

decorate(ManageOfferingStore, {
  ...dataModelStore.decorateDefault,
  TOMBSTONE_BASIC_FRM: observable,
  uploadMedia: action,
});

export default new ManageOfferingStore();
