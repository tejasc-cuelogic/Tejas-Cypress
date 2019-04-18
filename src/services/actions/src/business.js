import _ from 'lodash';
import moment from 'moment';
import shortid from 'shortid';
import graphql from 'mobx-apollo';
import { GqlClient as client } from '../../../api/gqlApi';
import {
  getXmlDetails,
  filerInformationMutation,
  issuerInformationMutation,
  offeringInformationMutation,
  annualReportMutation,
  signatureMutation,
  documentListMutation,
  xmlSubmissionMutation,
  cloneXmlSubmissionMutation } from '../../stores/queries/business';
import { businessStore, uiStore } from '../../stores';
import {
  EDGAR_URL,
  GRAPHQL,
  PERSONAL_SIGNATURE,
  FILES,
  XML_STATUSES,
} from '../../../constants/business';
import ApiService from '../../../api/restApi';
import { validationActions } from '../../../services/actions';
import Helper from '../../../helper/utility';

export class Business {
  /**
  * @desc Adds new field for PersonalSignatureArray
  *       if previous value of `signaturePersons` prop is [{...}, {...}]
  *       then calling method will add bank map to above array as [{...}, {...}, {...}]
  */
  addPersonalSignature = () => {
    const personalSignature = { ...PERSONAL_SIGNATURE };
    personalSignature.id = shortid.generate();
    const signaturePersons = [...businessStore.formSignatureInfo.fields.signaturePersons];
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
   * Submit XML submission
   */
  submitXMLInformation = (action) => {
    const {
      offeringId,
      filingId,
      xmlSubmissionId,
      formFilerInfo,
      formIssuerInfo,
      formOfferingInfo,
      formAnnualInfo,
      formSignatureInfo,
      formDocumentInfo,
    } = businessStore;
    let payload = {};
    const ids = {
      offeringId,
      filingId,
      xmlSubmissionId,
    };

    if (action === 'filerInformation') {
      payload = {
        mutation: filerInformationMutation,
        variables: {
          ...ids,
          filerInformation: this.getFormattedInformation(formFilerInfo.fields),
        },
      };
    } else if (action === 'issuerInformation') {
      payload = {
        mutation: issuerInformationMutation,
        variables: {
          ...ids,
          issuerInformation: this.getFormattedInformation(formIssuerInfo.fields),
        },
      };
    } else if (action === 'offeringInformation') {
      payload = {
        mutation: offeringInformationMutation,
        variables: {
          ...ids,
          offeringInformation: this.getFormattedInformation(formOfferingInfo.fields),
        },
      };
    } else if (action === 'annualReport') {
      payload = {
        mutation: annualReportMutation,
        variables: {
          ...ids,
          annualReportDisclosureRequirements:
          this.getFormattedInformation(formAnnualInfo.fields),
        },
      };
    } else if (action === 'signature') {
      payload = {
        mutation: signatureMutation,
        variables: {
          ...ids,
          signature: this.getFormattedSignature(formSignatureInfo.fields),
        },
      };
    } else if (action === 'documentList') {
      payload = {
        mutation: documentListMutation,
        variables: {
          ...ids,
          documentList: _.map(
            _.filter(formDocumentInfo.documentList, document => document.checked),
            document => ({
              name: document.name,
              id: document.id,
            }),
          ),
        },
      };
    } else if (action === 'xmlSubmission') {
      uiStore.setProgress();
      uiStore.setLoaderMessage('Submiting XML submission');
      payload = {
        mutation: xmlSubmissionMutation,
        variables: {
          ...ids,
        },
      };
    }

    return new Promise((resolve, reject) => {
      client
        .mutate(payload)
        .then(data => resolve(data.data))
        .catch(error => reject(error));
    });
  }

  /**
   * Copy XML submission
   */
  copyXMLInformation = () => {
    const {
      filingId,
      xmlSubmissionId,
    } = businessStore;

    const payload = {
      mutation: cloneXmlSubmissionMutation,
      variables: {
        filingId,
        xmlSubmissionId,
      },
    };
    return new Promise((resolve, reject) => {
      client
        .mutate(payload)
        .then(data => resolve(data.data))
        .catch(error => reject(error));
    });
  }

  /**
  * @desc Lists offerings submitted and which needs to be converted to XML for final submission
  *       Fetches list of offerings from DynamoDB
  */

  /**
   * @desc List all businesses that were filled to nextseed
   * @todo Add Pagination to api
  */
  listBusinesses = () => {
    uiStore.setProgress();
    uiStore.setLoaderMessage('Fetching business list');
    const params = { field: 'created', sort: 'desc' };
    const payload = {
      query: 'query getBusinesses($orderByBusiness: businessOrderBy) { businesses(orderBy:$orderByBusiness){ id name description created } }',
      variables: { orderByBusiness: params },
    };

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
  getBusinessDetails = (businessId, showLoader = true) => {
    if (showLoader) {
      uiStore.setProgress();
      uiStore.setLoaderMessage('Getting business data');
    }
    const params = { field: 'created', sort: 'desc' };
    const payload = {
      query: `query getBusiness($orderByBusinessFilings:businessfilingOrderBy, $orderByBusinessFilingSubmission: businessfilingsubmissionOrderBy) { business(id: "${businessId}") { id name description folderId created` +
        ' filings(orderBy: $orderByBusinessFilings) { filingId filingFolderName businessId created folderId lockedStatus submissions(orderBy: $orderByBusinessFilingSubmission) { xmlSubmissionId created xmlSubmissionDownloadUrl folderName jobStatus xmlSubmissionStatus lockedStatus} } } }',
      variables: { orderByBusinessFilings: params, orderByBusinessFilingSubmission: params },
    };
    ApiService.post(GRAPHQL, payload)
      .then((data) => {
        this.setBusinessDetails(data.body.data.business);
        _.filter(data.body.data.business.filings, (filing) => {
          _.map(filing.submissions, (submission) => {
            if (submission.xmlSubmissionStatus === XML_STATUSES.created) {
              this.createPoll();
            }
          });
        });
      })
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
    uiStore.addMoreInProgressArray('fetchEdgarDetails');
    const payload = {
      query: `query fetchFilingById { businessFiling(businessId: "${businessId}", ` +
        `filingId: "${filingId}") { filingPayload } }`,
    };
    ApiService.post(GRAPHQL, payload)
      .then(data => businessStore.setTemplateVariable(data.body.data.businessFiling.filingPayload))
      .catch(err => console.log(err))
      .finally(() => {
        uiStore.removeOneFromProgressArray('fetchEdgarDetails');
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

  getFiles = ({ offeringId, filingId }, accountType) => {
    uiStore.setProgress();
    uiStore.setLoaderMessage('Fetching details');
    const accountTypeToPass = accountType && accountType === 'SECURITIES' ? accountType : 'SERVICES';
    const payload = {
      query: 'query fetchFilingById($offeringId: ID!, $filingId: ID!){businessFiling(offeringId: ' +
        '$offeringId, filingId: $filingId) { folderId } }',
      variables: {
        offeringId,
        filingId,
      },
    };
    return new Promise((resolve, reject) => {
      ApiService.post(GRAPHQL, payload)
        .then((data) => {
          this.fetchAttachedFiles(data.body.data.businessFiling.folderId, accountTypeToPass)
            .then(() => resolve(data.body.data.businessFiling.folderId));
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
    uiStore.addMoreInProgressArray('fetchXmlDetails');
    uiStore.setLoaderMessage('Fetching XML Data');
    graphql({
      client,
      query: getXmlDetails,
      variables: {
        filingId,
        xmlSubmissionId: xmlId,
      },
      onFetch: (data) => {
        uiStore.removeOneFromProgressArray('fetchXmlDetails');
        this.setXmlPayload(data.businessFilingSubmission);
      },
      onError: (err) => {
        uiStore.removeOneFromProgressArray('fetchXmlDetails');
        console.log('ERROR: ', err);
      },
    });
  }

  /**
   *
   */
  fetchAttachedFiles = (folderId, accountType) => {
    uiStore.setProgress();
    uiStore.addMoreInProgressArray('fetchAttachedFiles');
    uiStore.setLoaderMessage('Fetching available files');
    const accountTypeToPass = accountType && accountType === 'SECURITIES' ? accountType : 'SERVICES';
    const payload = {
      query: 'query getFIles($folderId: ID!, $accountType: BoxAccountTypeEnum) { files(folderId: $folderId, accountType: $accountType) { id name } }',
      variables: {
        folderId,
        accountType: accountTypeToPass,
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
          uiStore.removeOneFromProgressArray('fetchAttachedFiles');
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
   * @desc To delete XML submission for the filing
   */
  deleteXmlSubmission = (filingId, xmlSubmissionId) => {
    uiStore.setProgress();
    uiStore.setLoaderMessage('Deleting XML Submission');
    const payload = {
      query: `mutation deleteXmlSubmissionById($filingId: String!, $xmlSubmissionId: String!) {
        deleteBusinessFilingSubmission(filingId: $filingId, xmlSubmissionId: $xmlSubmissionId){
          xmlSubmissionId
        }
      }`,
      variables: {
        filingId, xmlSubmissionId,
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
   * @desc To delete Filing for the business
   */
  deleteFiling = (offeringId, filingId) => {
    uiStore.setProgress();
    uiStore.setLoaderMessage('Deleting Business Filing');
    const payload = {
      query: `mutation deleteBusinessFiling($offeringId: String!, $filingId: String!) {
         deleteBusinessFiling(offeringId: $offeringId, filingId: $filingId ){
           offeringId
           created
          }
      }`,
      variables: {
        offeringId,
        filingId,
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
   * @desc To lock/unlock XML Submission
   */
  lockUnlockXmlSubmission = (offeringId, filingId, xmlSubmissionId, lockedStatus) => {
    const status = lockedStatus === false ? 'Unlocking' : 'Locking';
    uiStore.setProgress();
    uiStore.setLoaderMessage(`${status} XML Submission`);
    const payload = {
      query: `mutation lockUnlockBusinessFilingSubmission($offeringId: String!, $filingId: String!, $xmlSubmissionId: String!, $lockedStatus: Boolean!){
        lockBusinessFilingSubmission(offeringId: $offeringId,filingId: $filingId, xmlSubmissionId: $xmlSubmissionId, lockedStatus: $lockedStatus){
          offeringId xmlSubmissionId lockedStatus
        }
      }`,
      variables: {
        offeringId, filingId, xmlSubmissionId, lockedStatus,
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
   * @desc To lock/unlock filing
   */
  lockUnlockFiling = (businessId, filingId, lockedStatus) => {
    const status = lockedStatus === false ? 'Unlocking' : 'Locking';
    uiStore.setProgress();
    uiStore.setLoaderMessage(`${status} filing`);
    const payload = {
      query: `mutation lockUnlockBusinessFiling($businessId: String!, $filingId: String!, $lockedStatus: Boolean!){
        lockBusinessFiling(businessId: $businessId, filingId: $filingId, lockedStatus: $lockedStatus){
          filingId
        }
      }`,
      variables: {
        businessId, filingId, lockedStatus,
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
  */
  getFormattedInformation = (info) => {
    const formattedData = {};
    const dateKeys = ['dateIncorporation', 'deadlineDate'];
    _.forEach(info, (data, key) => {
      formattedData[key] = dateKeys.includes(key) ? moment(data.value).format('MM-DD-YYYY') : data.value;
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
      personData.signatureDate = moment(person.signatureDate.value).format('MM-DD-YYYY');
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

  createPoll = () => {
    setTimeout(() => this.getBusinessDetails(businessStore.business.id, false), 15 * 1000);
  }

  /* eslint-disable */
  setDocumentList = (list) => {
    _.map(list, document => document.checked = false);
    businessStore.setDocumentList(list);
  }

  setXmlPayload = (data) => {
    const dateFields = ['dateIncorporation', 'deadlineDate', 'signatureDate'];
    const confirmationFlags = ['confirmingCopyFlag', 'returnCopyFlag', 'overrideInternetFlag'];

    if (data) {
      businessStore.setOfferingId(data.offeringId);
      businessStore.setFilingId(data.filingId);
      businessStore.setXmlSubmissionStatus(data.xmlSubmissionStatus);
      _.map(data.payload.filerInformation, (value, key) => {
        if (confirmationFlags.includes(key)) {
          businessStore.setFilerInfo(key, (value || false));
        }
        else {
          businessStore.setFilerInfo(key, (value || ''));
        }
      });
      _.map(data.payload.issuerInformation, (value, key) => {
        if (dateFields.includes(key)) {
          businessStore.setIssuerInfo(key, moment(value).format('MM-DD-YYYY'));
        } else {
          businessStore.setIssuerInfo(key, (value || ''));
        }
      });
      _.map(data.payload.offeringInformation, (value, key) => {
        if (dateFields.includes(key)) {
          businessStore.setOfferingInfo(key,  moment(value).format('MM-DD-YYYY'));
        } else {
          businessStore.setOfferingInfo(key, (value || ''))
        }
      });
      _.map(data.payload.annualReportDisclosureRequirements, (value, key) => {
        businessStore.setAnnualReportInfo(key, (value || ''));
      })
      _.map(data.payload.signature, (value, key) => {
        if (key !== 'signaturePersons') {
          businessStore.setSignatureInfo(key, (value || ''));
        }
      })

      businessStore.setNewPersonalSignature([]);

      if (data.payload.signature) {
         _.map(data.payload.signature.signaturePersons, (signature) => {
          const id = this.addPersonalSignature();
          _.map(signature, (value, key) => {
            if (dateFields.includes(key)) {
              businessStore.changePersonalSignature(key, id, value ? moment(value).format('MM-DD-YYYY') : moment().format('MM-DD-YYYY'), false);
            } else {
              businessStore.changePersonalSignature(key, id, value, false);
            }
          });
        })
      }

      if (businessStore.formSignatureInfo.fields.signaturePersons.length === 0) {
        this.addPersonalSignature();
      }
      _.map(data.payload.documentList, document => businessStore.toggleRequiredFiles(document.name, false));
      this.checkandUpdateValidationStepsStaus();
    }
  }

  validateFilerInfo = (filerInformation, setError = true) => {
    const newFiler = validationActions.validateXmlFormData(filerInformation);
    const errors = this.newValidationErrors(newFiler);
    businessStore.setFiler(newFiler);
    // check form is valid or not
    if (!setError) {
      if (businessStore.canSubmitFilerInfoXmlForm) {
        businessStore.setXmlSubStepsStatus('filer', true);
        businessStore.updateStatusFlag('formFilerInfo', 'meta', true);
      } else {
        businessStore.clearFiler();
      }
    }
  }

  validateIssuerInfo = (issuerInformation, setError = true) => {
    const newIssuer = validationActions.validateXmlFormData(issuerInformation);
    const errors = this.newValidationErrors(newIssuer);
    businessStore.setIssuer(newIssuer);
    // check form is valid or not
    if (!setError) {
      if (businessStore.canSubmitIssuerInfoXmlForm) {
        businessStore.setXmlSubStepsStatus('issuer', true);
        businessStore.updateStatusFlag('formIssuerInfo', 'meta', true);
      } else {
        businessStore.clearIssuer();
      }
    }
  }

  validateOfferingInfo = (offeringInformation, setError = true) => {
    const newOffering = validationActions.validateXmlFormData(offeringInformation);
    const errors = this.newValidationErrors(newOffering);
    businessStore.setOffering(newOffering);
    // check form is valid or not
    if (!setError) {
      if (businessStore.canSubmitOfferingInfoXmlForm) {
        businessStore.setXmlSubStepsStatus('offering', true);
        businessStore.updateStatusFlag('formOfferingInfo', 'meta', true);
      } else {
        businessStore.clearOffering();
      }
    }
  }

  validateAnnualReportInfo = (annualReportRequirements, setError = true) => {
    const newAnnualReport = validationActions.validateXmlFormData(annualReportRequirements);
    const errors = this.newValidationErrors(newAnnualReport);
    businessStore.setAnnualReport(newAnnualReport);
    // check form is valid or not
    if (!setError) {
      if (businessStore.canSubmitAnnualReportXmlForm) {
        businessStore.setXmlSubStepsStatus('annual', true);
        businessStore.updateStatusFlag('formAnnualInfo', 'meta', true);
      } else {
        businessStore.clearAnnualReport();
      }
    }
  }

  validateSignatureInfo = (signature, setError = true) => {

    const newSignature = validationActions.validateXmlFormData({
      issuer: signature.issuer,
      issuerSignature: signature.issuerSignature,
      issuerTitle: signature.issuerTitle,
    });

    const errors = this.newValidationErrors(newSignature);
    newSignature['signaturePersons'] = signature.signaturePersons;
    businessStore.setSignature(newSignature);
    this.validatePersonSign(signature.signaturePersons, setError);
  }

  validatePersonSign = (signaturePersons, setError = true) => {
    let personSignatureData = [];
    _.map(signaturePersons, (field, index) => {
      personSignatureData.push(validationActions.validateXmlFormData({
        personSignature: field.personSignature,
        personTitle: field.personTitle,
        signatureDate: field.signatureDate,
      }));

      this.newValidationErrors(personSignatureData, true);
      personSignatureData[index].id = field.id;
    });

    businessStore.setNewPersonalSignature(personSignatureData);

    if (!setError) {
      // check form is valid or not
      if (businessStore.canSubmitSigntureForm ||
        _.includes(businessStore.canSubmitSignaturePersonsForm, true)) {
          businessStore.setXmlSubStepsStatus('signature', true);
          businessStore.updateStatusFlag('formSignatureInfo', 'meta', true);
      } else {
        businessStore.clearSignature();
      }
    }
  }

  validateDocumentList = (documentList, setError = true) => {
    const documentCount = documentList.length;
    let documnetCurrentCount = 0;
    _.map(documentList, (document) => {
      if (document.checked === false) {
        documnetCurrentCount++;
      }
    });

    if (documentCount === documnetCurrentCount) {
      const errorMessage = {
        documentListError:'Please select at least one document.'
      };
      if (setError) {
        businessStore.setXmlError(errorMessage);
      }
      return errorMessage;
    }
  }

  newValidationErrors = (data, isMultiple = false) => {
    const xmlErrors = { ...businessStore.xmlErrors };

    if (isMultiple) {
      let errors = {};
      _.map(data, (key) => {
        errors = _.mapValues(key, input =>  input.error);
        _.merge(xmlErrors, errors);
      })
      return xmlErrors;
    } else {
      const errors = _.mapValues(data, input => input.error);
      return _.merge(xmlErrors, errors);
    }
  }

  checkandUpdateValidationStepsStaus = () => {
    this.validateFilerInfo(businessStore.formFilerInfo.fields, false);
    this.validateIssuerInfo(businessStore.formIssuerInfo.fields, false);
    this.validateOfferingInfo(businessStore.formOfferingInfo.fields, false);
    this.validateAnnualReportInfo(businessStore.formAnnualInfo.fields, false);
    this.validateSignatureInfo(businessStore.formSignatureInfo.fields, false);
    const errorMessage = this.validateDocumentList(businessStore.formDocumentInfo.documentList, false);

    if (!errorMessage) {
      businessStore.setXmlSubStepsStatus('doc', true);
    }
  }
  // Private Methods ends here
}

export default new Business();
