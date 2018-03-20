import _ from 'lodash';
import moment from 'moment';
import shortid from 'shortid';

import businessStore from './../stores/businessStore';
import uiStore from './../stores/uiStore';
import { EDGAR_URL, XML_URL, GRAPHQL, PERSONAL_SIGNATURE, FILES } from './../constants/business';
import ApiService from '../services/api';
import Helper from '../helper/utility';

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
    businessStore.setNewPersonalSignature(signaturePersons);
    return personalSignature.id;
  }

  /**
  * @desc Makes an API Call to server to generate Docx file from data entered
  */
  generateDocxFile = () => {
    const { templateVariables } = businessStore;
    uiStore.setProgress();
    uiStore.setLoaderMessage('Generating Docx File');
    uiStore.toggleSubmitButton();
    return ApiService.post(EDGAR_URL, { templateVariables, documentList: FILES });
  }

  /**
  * @desc Make an API Call to server to generate XML for final submittion
  */
  generateXml = () => {
    const {
      businessId,
      filingId,
      offeringUrl,
      annualReportRequirements,
      filerInformation,
      issuerInformation,
      offeringInformation,
      signature,
      documentList,
    } = businessStore;

    const payload = {
      businessId,
      filingId,
      offeringUrl,
      filerInformation: this.getFormattedInformation(filerInformation),
      issuerInformation: this.getFormattedInformation(issuerInformation),
      offeringInformation: this.getFormattedInformation(offeringInformation),
      annualReportDisclosureRequirements: this.getFormattedInformation(annualReportRequirements),
      signature: this.getFormattedSignature(signature),
      documentList: _.filter(documentList, document => document.checked),
    };

    uiStore.setProgress();
    uiStore.setLoaderMessage('Submitting XML Form');
    return ApiService.post(XML_URL, payload);
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
    const payload = { query: 'query getBusinesses { businesses{ id name description created } }' };
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
  businessExists = (field) => {
    uiStore.toggleAsyncCheckLoader();
    const payload = {
      query: 'query businessExistsByName($name: String!){businessExists(name:$name)}',
      variables: {
        name: field,
      },
    };
    ApiService.post(GRAPHQL, payload)
      .then(data => businessStore.setIsBusinessExist(data.body.data.businessExists))
      .catch(err => uiStore.setErrors(err))
      .finally(() => uiStore.toggleAsyncCheckLoader());
  }

  /**
   * @desc To check if business name is already for Edit Business
   */
  businessExistsOnEdit = (field) => {
    const payload = {
      query: 'query businessExistsByName($name: String!){businessExists(name:$name)}',
      variables: {
        name: field,
      },
    };
    return new Promise((res, rej) => {
      ApiService.post(GRAPHQL, payload)
        .then(data => res(data))
        .catch(err => rej(err))
        .finally(() => {
          uiStore.clearLoaderMessage();
        });
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
        ' filings { filingId businessId created folderId submissions { xmlSubmissionId created } } } }',
    };
    ApiService.post(GRAPHQL, payload)
      .then(data => this.setBusinessDetails(data.body.data.business))
      .catch(err => uiStore.setErrors(err))
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
      query: 'mutation createBusiness($newBusiness: CreateBusinessInput){createBusiness(newBusiness:$newBusiness){id name created description}}',
      variables: {
        newBusiness: {
          name: businessStore.newOfferingInformation.businessName.value,
          description: businessStore.newOfferingInformation.businessDescription.value,
        },
      },
    };

    return ApiService.post(GRAPHQL, payload);
  }

  /**
   * @desc To add newly created business in the list
   */
  addToBusinessList = (data) => {
    const oldBusinessList = [...businessStore.businessList];
    oldBusinessList.unshift(data);
    businessStore.setBusinessList(oldBusinessList);
  }

  editBusinessDetails = () => {
    uiStore.setProgress();
    uiStore.setLoaderMessage('Updating Business Name');
    const payload = {
      query: 'mutation updateBusiness($id: String!, $updateBusiness: CreateBusinessInput){updateBusiness(id:$id, business: $updateBusiness){id name description}}',
      variables: {
        id: businessStore.business.id,
        updateBusiness: {
          name: businessStore.business.name.value,
          description: businessStore.business.desc.value,
        },
      },
    };
    ApiService.post(GRAPHQL, payload)
      .then(uiStore.setModalStatus(false), Helper.toast('Business details modified successfully', 'success'))
      .catch(err => uiStore.setErrors(err))
      .finally(() => {
        uiStore.setProgress(false);
      });
  }

  /**
   * @desc This method fetches filing details from id provided for business,
   * and stores data in store.
   */
  fetchEdgarDetails = (businessId, filingId) => {
    uiStore.setActionLoader('Fetching Edgar data');
    const payload = {
      query: `query fetchFilingById { businessFiling(businessId: "${businessId}", ` +
        `filingId: "${filingId}") { filingPayload } }`,
    };
    ApiService.post(GRAPHQL, payload)
      .then(data => businessStore.setTemplateVariable(data.body.data.businessFiling.filingPayload))
      .catch(err => console.log(err))
      .finally(() => {
        uiStore.clearActionLoader();
      });
  }

  fetchBusinessName = (businessId) => {
    uiStore.setActionLoader('Fetching business name');
    const payload = {
      query: 'query getBusinessName($businessId: ID!) { business(id: $businessId) { name } }',
      variables: {
        businessId,
      },
    };
    ApiService.post(GRAPHQL, payload)
      .then(data => businessStore.setTemplateVariableByKey(
        'name_of_business',
        data.body.data.business.name,
      ))
      .finally(() => {
        uiStore.clearActionLoader();
      });
  }

  getFiles = ({ businessId, filingId }) => {
    uiStore.setProgress();
    uiStore.setLoaderMessage('Fetching details');
    const payload = {
      query: 'query fetchFilingById($businessId: ID!, $filingId: ID!){businessFiling(businessId: ' +
        '$businessId, filingId: $filingId) { folderId } }',
      variables: {
        businessId,
        filingId,
      },
    };
    return new Promise((resolve, reject) => {
      ApiService.post(GRAPHQL, payload)
        .then((data) => {
          this.fetchAttachedFiles(data.body.data.businessFiling.folderId)
            .then(() => resolve());
        })
        .catch(err => reject(err))
        .finally(() => {
          uiStore.setProgress(false);
          uiStore.clearLoaderMessage();
        });
    });
  }

  /**
   * @desc This method fetches XML
   */
  fetchXmlDetails = ({ filingId, xmlId }) => {
    uiStore.setProgress();
    uiStore.setLoaderMessage('Fetching XML Data');
    const payload = {
      query: 'query fetchFilingSubmission($filingId: ID!, $xmlSubmissionId: ID!)' +
        '{businessFilingSubmission(filingId:$filingId, xmlSubmissionId:$xmlSubmissionId){ ' +
        'payload } }',
      variables: {
        filingId,
        xmlSubmissionId: xmlId,
      },
    };
    ApiService.post(GRAPHQL, payload)
      .then(data => this.setXmlPayload(data.body.data.businessFilingSubmission.payload))
      .catch(err => console.log(err))
      .finally(() => {
        uiStore.setProgress(false);
        uiStore.clearLoaderMessage();
      });
  }

  /**
   *
   */
  fetchAttachedFiles = (folderId) => {
    uiStore.setProgress();
    uiStore.setLoaderMessage('Fetching available files');
    const payload = {
      query: 'query getFIles($folderId: ID!) { files(folderId: $folderId) { id name } }',
      variables: {
        folderId,
      },
    };
    return new Promise((resolve, reject) => {
      ApiService.post(GRAPHQL, payload)
        .then((data) => {
          this.setDocumentList(data.body.data.files);
          resolve();
        })
        .catch((err) => {
          reject(err);
        })
        .finally(() => {
          uiStore.setProgress(false);
          uiStore.clearLoaderMessage();
        });
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

  /**
   *
   */
  toggleFileSelection = (key) => {
    const { documentList } = businessStore;
    const file = _.remove(documentList, document => document.name === key)[0];
    file.checked = !file.checked;
    documentList.push(file);
    businessStore.setDocumentList(documentList);
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
      personData.signatureDate = person.signatureDate.value.format('MM-DD-YYYY');
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
    hash.name = { value: details.name, error: undefined, key: 'name' };
    hash.desc = { value: details.description, error: undefined, key: 'desc' };
    businessStore.setTemplateVariableByKey('name_of_business', details.name);
    businessStore.setBusiness(hash);
  }

  /* eslint-disable */
  setDocumentList = (list) => {
    _.map(list, document => document.checked = false);
    businessStore.setDocumentList(list);
  }

setXmlPayload = (payload) => {
    const dateFields = ['dateIncorporation', 'deadlineDate', 'signatureDate'];
    const confirmationFlags = ['confirmingCopyFlag', 'returnCopyFlag', 'overrideInternetFlag'];
    if (payload) {
      businessStore.setBusinessId(payload.businessId);
      businessStore.setFilingId(payload.filingId);
      businessStore.setOfferingUrl(payload.offeringUrl);
      _.map(payload.filerInformation, (value, key) => {
        if (confirmationFlags.includes(key)) {
          businessStore.setFilerInfo(key, (value || false))
        } else {
          businessStore.setFilerInfo(key, (value || ''))
        }
      });
      _.map(payload.issuerInformation, (value, key) => {
        if (dateFields.includes(key)) {
          businessStore.setIssuerInfo(key, moment(value, 'MM-DD-YYYY'));
        } else {
          businessStore.setIssuerInfo(key, (value || ''));
        }
      });
      _.map(payload.offeringInformation, (value, key) => {
        if (dateFields.includes(key)) {
          businessStore.setOfferingInfo(key, moment(value, 'MM-DD-YYYY'));
        } else {
          businessStore.setOfferingInfo(key, (value || ''))
        }
      });
      _.map(payload.annualReportDisclosureRequirements, (value, key) => {
        businessStore.setAnnualReportInfo(key, (value || ''));
      })
      _.map(payload.signature, (value, key) => {
        if (key !== 'signaturePersons') {
          businessStore.setSignatureInfo(key, (value || ''));
        }
      })
      businessStore.setNewPersonalSignature([]);
      _.map(payload.signature.signaturePersons, (signature) => {
        const id = this.addPersonalSignature();
        _.map(signature, (value, key) => {
          if (dateFields.includes(key)) {
            businessStore.changePersonalSignature(key, id, moment((value || moment().format('MM-DD-YYYY'))));
          } else {
            businessStore.changePersonalSignature(key, id, value);
          }
        });
      })
      _.map(payload.documentList, document => businessStore.toggleRequiredFiles(document.name))
    }
  }
  // Private Methods ends here
}

export default new Business();
