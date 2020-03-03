import React from 'react';
import { Link } from 'react-router-dom';
import { toJS, observable, computed, action } from 'mobx';
import { forEach, filter, get } from 'lodash';
import graphql from 'mobx-apollo';
import { uiStore, campaignStore, userDetailsStore } from '../../../index';
import { GqlClient as client } from '../../../../../api/publicApi';
import { getBoxEmbedLink, getLegalDocsFileIds, getS3DownloadLinkByFileId } from '../../../queries/agreements';
import { AGREEMENT_TEMPLATE_DETAILS_INFO } from '../../../../constants/investment';
import { FormValidator as Validator } from '../../../../../helper';
import Helper from '../../../../../helper/utility';
import HtmlEditor from '../../../../../modules/shared/HtmlEditor';

export class AgreementsStore {
  @observable legalDocsList = [];

  @observable agreements = [
    {
      key: 'cCAgreement',
      title: 'Crowdpay Custodial Agreement',
      refEnum: 'CROWDPAY_CUSTODIAL_AGREEMENT',
    },
    {
      key: 'irsCertification',
      title: 'Subsitute IRS Form W-9 Certification',
      refEnum: 'IRS_W9_CERTIFICATION',
    },
    {
      key: 'businessPan',
      title: 'businessPan',
      refEnum: 'BUSINESS_PLAN_101',
    },
    {
      key: 'welcomeKit',
      title: 'Welcome Packet',
      refEnum: 'INVESTOR_WELCOME_PACKET',
    },
    {
      key: 'fPAgreemnt',
      title: 'Nextseed Funding Portal Agreement',
      refEnum: 'MEMBERSHIP_AGREEMENT',
    },
    {
      key: 'bDIAgreemnt',
      title: 'NextSeed Broker-Dealer Investor Agreement',
      refEnum: 'SECURITIES_INVESTOR_AGREEMENT',
    },
    {
      key: 'instruction2017',
      title: 'Instruction 2017',
      refEnum: 'INSTRUCTIONS_1099_2017',
    },
    {
      key: 'instruction2018',
      title: 'Instruction 2018',
      refEnum: 'INSTRUCTIONS_1099_2018',
    },
    {
      key: 'instruction2019',
      title: 'Instruction 2019',
      refEnum: 'INSTRUCTIONS_1099_2019',
    },
  ];

  @observable embedUrl = null;

  @observable S3DownloadLink = null;

  @observable docLoading = false;

  @observable docIdsLoading = false;

  @observable alreadySet = false;

  @observable tocRequiredArray = [];

  @observable AGREEMENT_DETAILS_FORM = Validator.prepareFormObject(AGREEMENT_TEMPLATE_DETAILS_INFO);

  @computed get getAgreementsList() {
    return toJS(this.agreements);
  }

  @action
  setField = (key, status) => {
    this[key] = status;
  }

  @action
  setAgreementUrl = (of, url) => {
    const index = this.agreements.findIndex(ele => ele.key === of);
    this.agreements[index].embedUrl = url;
    this.embedUrl = url;
  }

  @action
  getBoxEmbedLink = (of, fileId, accountType) => new Promise((resolve) => {
    this.setField('docLoading', true);
    const fId = fileId || toJS(this.agreements).find(ele => ele.key === of).id;
    const accountTypeToPass = accountType && accountType === 'SECURITIES' ? accountType : 'SERVICES';
    client.mutate({
      mutation: getBoxEmbedLink,
      variables: { fileId: fId, accountType: accountTypeToPass },
    }).then((res) => {
      this.setAgreementUrl(of, res.data.getBoxEmbedLink);
      this.setField('docLoading', false);
      resolve(res.data.getBoxEmbedLink);
    }).catch(() => this.setField('docLoading', false));
  });

  @action
  readPdfFile = (key, docId) => {
    this.setField('docLoading', true);
    return new Promise((resolve, reject) => {
      const fileId = docId || toJS(this.agreements).find(ele => ele.key === key).id;
      this.pdfLinkData = graphql({
        client,
        query: getS3DownloadLinkByFileId,
        variables: {
          fileId,
          accountType: 'SERVICES',
          getS3DownloadLink: false,
        },
        fetchPolicy: 'network-only',
        onFetch: (data) => {
          this.setField('docLoading', false);
          if (data && !this.pdfLinkData.loading) {
            if (data.getS3DownloadLinkByFileId.preSignedUrl) {
              resolve(data.getS3DownloadLinkByFileId.preSignedUrl);
            } else {
              Helper.toast('Unable to Fetch the File', 'error');
              reject();
            }
          }
        },
        onError: () => reject(),
      });
    });
  }

  @action
  setNavItemsIds = (data) => {
    const agreementsList = this.getAgreementsList;
    const navList = [];
    forEach(agreementsList, (ele) => {
      navList.push({ ...ele, id: data[ele.refEnum] });
    });
    this.agreements = [...navList];
  }

  @computed get getNavItems() {
    const agreementsList = this.getAgreementsList;
    const navList = [];
    forEach(agreementsList, (ele) => {
      if (!['welcomeKit', 'businessPan'].includes(ele.key) && !ele.key.includes('instruction')) {
        navList.push({ title: ele.title, to: ele.key, id: ele.id });
      }
    });
    return navList;
  }

  getBoxLink = (fileId, accountType) => new Promise((resolve) => {
    const accountTypeToPass = accountType && accountType === 'SECURITIES' ? accountType : 'SERVICES';
    client.mutate({
      mutation: getBoxEmbedLink,
      variables: { fileId, accountType: accountTypeToPass },
    }).then((resp) => {
      resolve(resp);
    });
  })

  getLegalDocsFileIds = () => new Promise((resolve, reject) => {
    this.setField('docIdsLoading', true);
    graphql({
      client,
      query: getLegalDocsFileIds,
      onFetch: (data) => {
        if (data) {
          this.setNavItemsIds(data.getLegalDocsFileIds);
          this.setField('alreadySet', true);
          this.setField('docIdsLoading', false);
          uiStore.setProgress(false);
          resolve(data);
        }
      },
      onError: () => {
        uiStore.setProgress(false);
        Helper.toast('Something went wrong, please try again later.', 'error');
        reject();
      },
    });
  });

  @computed get legalDocs() {
    return toJS(this.legalDocsList);
  }

  @action
  setFileIdsData = (meta, data) => {
    meta.forEach((item) => {
      const newItem = { ...item };
      newItem.boxId = data[item.refEnum];
      this.legalDocsList.push(newItem);
    });
  }

  encodeString = (data, { docuSignHandeler, refLink, agreementPDFLoader }) => {
    let encodedString = data;
    if (data) {
      const content = data.split('-');
      const identifier = get(content, '[0]');
      const title = get(content, '[1]');
      const accountType = get(content, '[3]');
      const agreementKey = get(content, '[2]');
      switch (identifier) {
        case 'CF_MODAL':
          encodedString = (<Link to={`${refLink}/change-investment-limit`}>{title}</Link>);
          break;
        case 'DOCUSIGN_ENVELOPE':
          encodedString = (<Link to="/" onClick={e => docuSignHandeler(e, true)}>{title}</Link>);
          break;
        case 'AGREEMENT':
          encodedString = (<Link to="/" onClick={e => agreementPDFLoader(e, true, agreementKey, accountType)}>{title}</Link>);
          break;
        default:
          encodedString = (
            <HtmlEditor
              tag="span"
              noDivWrap
              readOnly
              content={encodedString}
            />
          );
          break;
      }
    }
    return encodedString;
  };

  preview = (string, params) => {
    let originalText = '';
    const findArray = string.split(new RegExp(/\|\|\|([^|]*)\|\|\|/g));
    originalText = findArray.map(str => this.encodeString(str, params));
    return originalText;
  };

  @action
  createAgreementTocs = (currentRegulation, params) => {
    const { campaignStatus } = campaignStore;
    const { currentActiveAccount } = userDetailsStore;
    const currentSelectedAccount = ['individual', 'ira'].includes(currentActiveAccount) ? 'INDIVIDUAL' : 'ENTITY';
    const tocArray = campaignStatus.investNowToc;
    // Filter as per Account Type:
    const filterAllAccountTypeArray = filter(tocArray, o => o.account === 'ALL');
    const filterSpecificAccountTypeArray = filter(tocArray, o => o.account !== 'ALL' && o.account === currentSelectedAccount);
    const filterAccountTypeArray = [...filterAllAccountTypeArray, ...filterSpecificAccountTypeArray];
    // Filter as per Regulation Type:
    const filterDefaultValueArray = filter(filterAccountTypeArray, o => !o.regulation);
    const filteredRegulationArray = filter(filterAccountTypeArray, o => o.regulation && o.regulation.includes(currentRegulation));
    const resultArray = [...filteredRegulationArray, ...filterDefaultValueArray];
    const valuesArray = [];
    const requiredArray = [];
    forEach(resultArray, (data) => {
      const valueObj = {};
      const label = this.preview(data.label, params);
      valueObj.label = label;
      valueObj.value = data.order;
      valuesArray.push(valueObj);
      if (data.required) {
        requiredArray.push(data.order);
      }
    });
    this.tocRequiredArray = requiredArray;
    this.AGREEMENT_DETAILS_FORM.fields.toc.values = valuesArray;
  }

  @computed get isAgreementFormValid() {
    return toJS(this.tocRequiredArray).every(e => toJS(this.AGREEMENT_DETAILS_FORM.fields.toc.value).includes(e));
  }

  @action
  setCheckbox = (e, res) => {
    this.AGREEMENT_DETAILS_FORM = Validator.onChange(this.AGREEMENT_DETAILS_FORM, Validator.pullValues(e, res), 'checkbox');
  }
}

export default new AgreementsStore();
