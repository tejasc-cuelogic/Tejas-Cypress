import { action, observable } from 'mobx';
import moment from 'moment';
import Validator from 'validatorjs';
import mapValues from 'lodash/mapValues';

class EntityAccountStore {
  @observable
  formFinInfo = {
    fields: {
      entityNetAssets: {
        value: '',
        label: 'Entity Net Assets',
        error: '',
        rule: 'required',
      },
      cfInvestments: {
        value: '',
        label: 'Other religion CF investments made in prior 12 months',
        error: '',
        rule: 'required',
      },
    },
    meta: {
      isValid: true,
      error: '',
    },
  };

  @observable
  formGeneralInfo = {
    fields: {
      nameOfEntity: {
        value: '',
        label: 'Name of Entity',
        error: '',
        rule: 'required',
      },
      taxId: {
        value: '',
        label: 'Tax ID',
        error: '',
        rule: 'required',
      },
      street: {
        value: '',
        label: 'Street',
        error: '',
        rule: 'required|string',
      },
      city: {
        value: '',
        label: 'City',
        error: '',
        rule: 'required|string',
      },
      state: {
        value: '',
        label: 'State',
        error: '',
        rule: 'required|string',
      },
      zipCode: {
        value: '',
        label: 'ZIP Code',
        error: '',
        rule: 'required|numeric',
      },
    },
    meta: {
      isValid: true,
      error: '',
    },
  };

  @observable
  formEntityInfo = {
    fields: {
      isEntityTrust: {
        value: 'yes',
        key: 'isEntityTrust',
        error: undefined,
        rule: 'required',
        label: '',
        placeHolder: '',
      },
      dateOfTrust: {
        value: moment(),
        key: 'dateOfTrust',
        error: undefined,
        rule: 'required',
        label: 'Date of Trust',
        placeHolder: '',
      },
    },
    meta: {
      isValid: true,
      error: '',
    },
  };

  @observable
  formPersonalInfo = {
    fields: {
      entityTitle: {
        value: '',
        key: 'entityTitle',
        error: undefined,
        rule: 'required',
        label: 'What is your title with the Entity',
        placeHolder: 'e.g. CEO',
      },
      photoId: {
        value: '',
        key: 'photoId',
        error: undefined,
        rule: 'required',
        label: 'Upload a Photo ID',
        sublabel: 'Drivers License or Passport',
        placeHolder: '',
      },
    },
    meta: {
      isValid: true,
      error: '',
    },
  };

  @observable
  formFormationDocuments = {
    fields: {
      entityFormationDocument: {
        value: '',
        key: 'entityFormationDocument',
        error: undefined,
        rule: 'required',
        label: 'Entity Formation Document',
        placeHolder: '',
      },
      entityOperatingDocument: {
        value: '',
        key: 'entityOperatingDocument',
        error: undefined,
        rule: 'required',
        label: 'Entity Operating Document',
        placeHolder: '',
      },
      einVerification: {
        value: '',
        key: 'einVerification',
        error: undefined,
        rule: 'required',
        label: 'EIN Verification',
        placeHolder: '',
      },
    },
    meta: {
      isValid: true,
      error: '',
    },
  };

  @action
  finInfoChange = (field, value) => {
    this.onFieldChange('formPersonalInfo', field, value);
  };

  @action
  onFileUpload = (field, files) => {
    if (files.length) {
      const uploadFile = files[0];
      this.onFieldChange('formFormationDocuments', field, uploadFile.name);
    }
  }

  @action
  resetFieldValue = (field) => {
    this.onFieldChange('formFormationDocuments', field, '');
  }

  genInfoChange = (e, { name, value }) => {
    this.onFieldChange('formGeneralInfo', name, value);
  };

  @action
  onFieldChange = (currentForm, field, value) => {
    const form = currentForm || 'formFinInfo';
    this[form].fields[field].value = value;
    const validation = new Validator(
      mapValues(this[form].fields, f => f.value),
      mapValues(this[form].fields, f => f.rule),
    );
    this[form].meta.isValid = validation.passes();
    this[form].fields[field].error = validation.errors.first(field);
  };
}

export default new EntityAccountStore();
