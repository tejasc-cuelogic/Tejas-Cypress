import request from 'superagent';
import _ from 'lodash';

import businessStore from './../stores/businessStore';
import uiStore from './../stores/uiStore';
import { EDGAR_URL } from './../constants/business';

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
    // TODO: Move the call to the service layer
    new Promise((res, rej) => {
      request
        .post(EDGAR_URL)
        .set('Content-Type', 'application/json')
        .send({ templateVariables, documentList: _.keys(documentList) })
        .end((err, data) => {
          if (err) {
            rej(err);
          }
          res(data);
        });
    })
      .then((data) => {
        const offeringId = data.body.requestId;
        uiStore.setSuccess(`Successfully created docx files with id ${offeringId}`);
      })
      .catch(err => uiStore.setErrors(err))
      .finally(() => {
        uiStore.toggleSubmitButton();
      });
  }

  xmlFormSubmitted = () => {
    const {
      offeringId,
      annualReportRequirements,
      filerInformation,
      issuerInformation,
      offeringInformation,
      signature,
      documentList,
    } = businessStore;

    request
      .post('http://localhost:3000')
      .set('Content-Type', 'application/json')
      .send({
        offeringId,
        filerInformation: this.getFormattedInformation(filerInformation),
        issuerInformation: this.getFormattedInformation(issuerInformation),
        offeringInformation: this.getFormattedInformation(offeringInformation),
        annualReportDisclosureRequirements: this.getFormattedInformation(annualReportRequirements),
        signature: this.getFormattedInformation(signature),
        documentList: _.filter(_.keys(documentList), key => documentList[key]),
      })
      .end((err, res) => {
        if (err) {
          return (err);
        }
        return res;
      });
  }
}

export default new Business();
