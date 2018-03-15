import _ from 'lodash';
import shortid from 'shortid';

import businessStore from './../stores/businessStore';
import uiStore from './../stores/uiStore';
import { EDGAR_URL, XML_URL, GRAPHQL, PERSONAL_SIGNATURE } from './../constants/business';
import ApiService from '../services/api';

export class Business {
  /**
  * @desc Adds new field for PersonalSignatureArray
  *       if previous value of `signaturePersons` prop is [{...}, {...}]
  *       then calling method will add bank map to above array as [{...}, {...}, {...}]
  */
  addPersonalSignature = () => {
    const personalSignature = { ...PERSONAL_SIGNATURE };
    personalSignature.id = shortid.generate();
    const signaturePersons = [...businessStore.signature.signaturePersons];
    signaturePersons.push(personalSignature);
    businessStore.addNewPersonalSignature(signaturePersons);
  }

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
      signature: this.getFormattedSignature(signature),
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

  /**
   * @desc List all businesses that were filled to nextseed
   * @todo Add Pagination to api
  */
  listBusinesses = () => {
    uiStore.setProgress();
    uiStore.setLoaderMessage('Fetching business list');
    const payload = { query: 'query getBusinesses { businesses{ id name created } }' };
    ApiService.post(GRAPHQL, payload)
      .then(data => businessStore.setBusinessList(data.body.data.businesses))
      .catch(err => uiStore.setErrors(err))
      .finally(() => {
        uiStore.clearLoaderMessage();
        uiStore.setProgress(false);
      });
  }

  /**
   * @desc To check if business name is already exist
   */
  businessExists = () => {
    uiStore.setProgress();
    const payload = {
      query: 'query businessExistsByName($name: String!){businessExists(name:$name)}',
      variables: {
        name: businessStore.newOfferingInformation.businessName.value,
      },
    };
    ApiService.post(GRAPHQL, payload)
      .then(data => businessStore.setIsBusinessExist(data.body.data.businessExists))
      .catch(err => uiStore.setErrors(err))
      .finally(() => {
        uiStore.setProgress(false);
      });
  }

  /**
   * @desc This method gets the details of business and store it to store.
   * @param $businessId - Id of business for which data will fetched
  */
  getBusinessDetails = (businessId) => {
    uiStore.setProgress();
    uiStore.setLoaderMessage('Getting business data');
    const payload = {
      query: `query getBusiness { business(id: "${businessId}") { id name description created` +
        ' filings { filingId businessId created submissions { xmlSubmissionId created } } } }',
    };
    ApiService.post(GRAPHQL, payload)
      .then(data => this.setBusinessDetails(data.body.data.business))
      .catch(err => console.log(err))
      .finally(() => {
        uiStore.setProgress(false);
        uiStore.clearLoaderMessage();
      });
  }

  /**
   * @desc To create a new business
   */
  createBusiness = () => {
    uiStore.setProgress();
    uiStore.setLoaderMessage('Creating New Business');
    const payload = {
      query: 'mutation createBusiness($newBusiness: CreateBusinessInput){createBusiness(newBusiness:$newBusiness){id name created}}',
      variables: {
        newBusiness: {
          name: businessStore.newOfferingInformation.businessName.value,
        },
      },
    };
    ApiService.post(GRAPHQL, payload)
      .then(data => this.addToBusinessList(data.body.data.createBusiness), uiStore.setSuccess('New business has been created.'), uiStore.setModalStatus(false))
      .catch(err => uiStore.setErrors(err))
      .finally(() => {
        uiStore.setProgress(false);
      });
  }

  addToBusinessList = (data) => {
    const oldBusinessList = [...businessStore.businessList];
    oldBusinessList.push(data);
    businessStore.setBusinessList(oldBusinessList);
  }

  /**
   * @desc This method fetches filing details from id provided for business,
   * and stores data in store.
   */
  fetchEdgarDetails = (businessId, filingId) => {
    uiStore.setProgress();
    uiStore.setLoaderMessage('Fetching Edgar data');
    const payload = {
      query: `query fetchFilingById { businessFiling(businessId: "${businessId}", ` +
        `filingId: "${filingId}") { filingPayload } }`,
    };
    ApiService.post(GRAPHQL, payload)
      .then(data => businessStore.setTemplateVariable(data.body.data.businessFiling.filingPayload))
      .catch(err => console.log(err))
      .finally(() => {
        uiStore.setProgress(false);
        uiStore.clearLoaderMessage();
      });
  }

  /**
   *
   */
  deleteBusiness = (businessId) => {
    uiStore.setProgress();
    uiStore.setLoaderMessage('Deleting business');
    const payload = {
      query: 'mutation deleteBusiness($id: String!){ deleteBusiness(id:$id){ id } }',
      variables: {
        id: businessId,
      },
    };
    return new Promise((res, rej) => {
      ApiService.post(GRAPHQL, payload)
        .then(data => res(data))
        .catch(err => rej(err))
        .finally(() => {
          uiStore.setProgress(false);
          uiStore.clearLoaderMessage();
        });
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
    const dateKeys = ['dateIncorporation', 'deadlineDate'];
    _.forEach(info, (data, key) => {
      if (dateKeys.includes(key)) {
        // If value is date then it has Moment object and not string value, in order to send proper
        // value to server we have to parse value as follows
        formattedData[key] = data.value.format('MM-DD-YYYY');
      } else {
        formattedData[key] = data.value;
      }
    });
    return formattedData;
  }

  getFormattedSignature = (signature) => {
    const formattedData = {};
    formattedData.issuer = signature.issuer.value;
    formattedData.issuerSignature = signature.issuerSignature.value;
    formattedData.issuerTitle = signature.issuerTitle.value;
    formattedData.signaturePersons = [];
    _.map(signature.signaturePersons, (person) => {
      const personData = {};
      personData.personSignature = person.personSignature.value;
      personData.personTitle = person.personTitle.value;
      personData.signatureDate = person.signatureDate.value;
      formattedData.signaturePersons.push(personData);
    });
    return formattedData;
  };

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

  setBusinessDetails = (details) => {
    const hash = { ...details };
    hash.name = { value: details.name, error: undefined };
    businessStore.setBusiness(hash);
  }
  // Private Methods ends here
}

export default new Business();
