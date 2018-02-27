import _ from 'lodash';

import businessStore from './../stores/businessStore';
import uiStore from './../stores/uiStore';
import { EDGAR_URL, XML_URL, GRAPHQL } from './../constants/business';
import ApiService from '../services/api';

export class Business {
  /**
  * @desc Makes an API Call to server to generate Docx file from data entered
  */
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

  /**
  * @desc Make an API Call to server to generate XML for final submittion
  */
  generateXml = () => {
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
      // TODO: Decide what should happen after XML generation
      .then(data => console.log(data))
      // TODO: Decide what should happen after error in XML generation
      .catch(err => console.log(err));
  }

  /**
  * @desc Lists offerings submitted and which needs to be converted to XML for final submission
  *       Fetches list of offerings from DynamoDB
  */
  listOfferings = () => {
    const payload = {
      query: 'query getOfferingFilings{offeringFilings{id created payload{' +
        'templateVariables{ name_of_business } } } }',
    };
    uiStore.toggleDropdownLoader();
    ApiService.post(GRAPHQL, payload)
      .then(data => this.setOfferings(data.body.data.offeringFilings))
      .catch(err => uiStore.setErrors(err))
      .finally(() => {
        uiStore.toggleDropdownLoader();
      });
  }

  // Private Methods starts here
  /**
  * @desc Converts store data in the format that should be sent in an API
  * @param $info - {
  *   filerCik: {
  *     value: '12345',
  *     key: 'filerCik',
  *     rule: 'required',
  *     error: undefined,
  *   },
  *   filerCcc: {
  *     value: 'abcde',
  *     key: 'filerCcc',
  *     rule: 'required',
  *     error: undefined,
  *   },
  * }
  * @return {
  *   filerCik: '12345',
  *   filerCcc: 'abcde',
  * }
  */
  getFormattedInformation = (info) => {
    const formattedData = {};
    _.forEach(info, (data, key) => {
      formattedData[key] = data.value;
    });
    return formattedData;
  }

  /**
  * @desc Covnerts list fetched from DynamoDB to desired form
  * @param $offerings - [{
  *   id: #offeringId,
  *   created: #DateTime
  *   payload: { templateVariables: { name_of_business: #name } }
  * }]
  * @return { key: #uniqueKey, value: #uniqueValue, text: #dropdownDisplayText }
  */
  setOfferings = (offerings) => {
    const list = _.map(offerings, (offering) => {
      const hash = {};
      hash.key = offering.id;
      hash.value = offering.id;
      hash.text = `${offering.payload.templateVariables.name_of_business} - ${offering.created}`;
      return hash;
    });
    businessStore.setOfferingList(list);
  }
  // Private Methods ends here
}

export default new Business();
