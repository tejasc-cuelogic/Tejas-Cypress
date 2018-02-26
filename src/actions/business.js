import _ from 'lodash';

import businessStore from './../stores/businessStore';
import uiStore from './../stores/uiStore';
import { EDGAR_URL, XML_URL } from './../constants/business';
import ApiService from '../services/api';

export class Business {
  getFormattedInformation = (info) => {
    const formattedData = {};
    _.forEach(info, (data, key) => {
      formattedData[key] = data.value;
    });
    return formattedData;
  }

  generateDocxFile = () => {
    const { templateVariables, documentList } = businessStore;
    uiStore.toggleSubmitButton();
    ApiService.post(EDGAR_URL, { templateVariables, documentList: _.keys(documentList) })
      .then((data) => {
        uiStore.setSuccess(`Successfully created docx files with id ${data.body.requestId}`);
      })
      .catch(err => uiStore.setErrors(err))
      .finally(() => {
        uiStore.toggleSubmitButton();
      });
  }

  xmlFormSubmitted = () => {
    const {
      offeringId,
      offeringUrl,
      annualReportRequirements,
      filerInformation,
      issuerInformation,
      offeringInformation,
      signature,
      documentList,
    } = businessStore;

    const payload = {
      offeringId,
      offeringUrl,
      filerInformation: this.getFormattedInformation(filerInformation),
      issuerInformation: this.getFormattedInformation(issuerInformation),
      offeringInformation: this.getFormattedInformation(offeringInformation),
      annualReportDisclosureRequirements: this.getFormattedInformation(annualReportRequirements),
      signature: this.getFormattedInformation(signature),
      documentList: _.filter(_.keys(documentList), key => documentList[key]),
    };

    ApiService.post(XML_URL, payload)
      .then(data => console.log(data))
      .catch(err => console.log(err));
  }
}

export default new Business();
