import React from 'react';
import { Link } from 'react-router-dom';
import { toJS, observable, computed, action } from 'mobx';
import { Popup, Icon } from 'semantic-ui-react';
import { forEach, filter, get, groupBy, map, orderBy } from 'lodash';
import graphql from 'mobx-apollo';
import { uiStore, campaignStore, userDetailsStore, offeringsStore, manageOfferingStore } from '../../../index';
import { GqlClient as client } from '../../../../../api/publicApi';
import { getBoxEmbedLink, getLegalDocsFileIds, getS3DownloadLinkByFileId } from '../../../queries/agreements';
import { AGREEMENT_TEMPLATE_DETAILS_INFO } from '../../../../constants/investment';
import { FormValidator as Validator } from '../../../../../helper';
import Helper from '../../../../../helper/utility';
import HtmlEditor from '../../../../../modules/shared/HtmlEditor';
import { PopUpModal } from '../../../../../theme/shared';

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

  @observable tocOptional = { array: [], labels: [] };

  @observable agreementPage = 0;

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
// TOOLTIP--tooltip content--tooltip title

  encodeString = (data, { docuSignHandeler, refLink, agreementPDFLoader }) => {
    let encodedString = data;
    if (data) {
      const content = data.split('--');
      const identifier = get(content, '[0]');
      const title = get(content, '[1]');
      const params = get(content, '[2]');
      const accountType = get(content, '[3]');
      switch (identifier) {
        case 'CF_MODAL':
          encodedString = (<Link to={`${refLink}/change-investment-limit`}>{title}</Link>);
          break;
        case 'DOCUSIGN_ENVELOPE':
          encodedString = (<Link to="/" onClick={e => docuSignHandeler(e, true)}>{title}</Link>);
          break;
        case 'AGREEMENT':
          encodedString = (<Link to="/" onClick={e => agreementPDFLoader(e, true, params, accountType)}>{title}</Link>);
          break;
        case 'TOOLTIP':
          // eslint-disable-next-line no-case-declarations
          const tooltipContent = (
            <HtmlEditor
              tag="span"
              noDivWrap
              readOnly
              content={title}
            />
          );
          encodedString = params ? (
          <PopUpModal
            customTrigger={<span className="popup-label">{params}</span>}
            content={tooltipContent}
            position="top center"
          />
          ) : (
          <Popup trigger={<Icon className="ns-help-circle" />} content={tooltipContent} position="top center" wide />
          );
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
    let investNowTocs = campaignStatus.isAgreementTemplate ? campaignStatus.investNowToc : manageOfferingStore.getInvestNowTocDefaults(true);
    const checkAccountValidation = acc => (!acc || acc === 'ALL' || acc === currentSelectedAccount);
    const checkRegulationValidation = reg => (!reg || reg === currentRegulation);
    investNowTocs = filter(investNowTocs, i => (checkRegulationValidation(i.regulation)));
    investNowTocs = groupBy(investNowTocs, 'page');
    investNowTocs = map(investNowTocs, page => page.map(t => ({ ...t, toc: t.toc && t.toc.length ? orderBy(t.toc.filter(toc => checkAccountValidation(toc.account)), ['order'], ['asc']) : [] })));
    const requiredArray = [];
    const optionalArray = [];
    const optionalLabels = [];
    if (investNowTocs.length > 1) {
      this.AGREEMENT_DETAILS_FORM = Validator.addMoreRecordToSubSection(this.AGREEMENT_DETAILS_FORM, 'page', investNowTocs.length - 1, true);
    }
    forEach(investNowTocs, (tocs, index) => {
      const pageRequiredArray = [];
      const pageOptionalArray = [];
      const pageOptionalLabels = [];
      const valuesArray = [];
      forEach(get(tocs, '[0].toc'), (data) => {
        const valueObj = {};
        const label = this.preview(data.label, params);
        valueObj.label = label;
        valueObj.value = data.order;
        valuesArray.push(valueObj);
        if (data.required) {
          pageRequiredArray.push(data.order);
        } else {
          pageOptionalArray.push(data.order);
          pageOptionalLabels.push(data.label);
        }
      });
      requiredArray.push(pageRequiredArray);
      optionalArray.push(pageOptionalArray);
      optionalLabels.push(pageOptionalLabels);
      this.AGREEMENT_DETAILS_FORM.fields.page[index].title.value = get(tocs, '[0].title');
      this.AGREEMENT_DETAILS_FORM.fields.page[index].toc.values = valuesArray;
      this.AGREEMENT_DETAILS_FORM.fields.page[index].toc.value = [];
    });
    this.tocRequiredArray = requiredArray;
    this.tocOptional.array = optionalArray;
    this.tocOptional.labels = optionalLabels;
  }

  @action
  previewAgreementTocs = (regulation, page, params) => {
    const { offer } = offeringsStore;
    const { getInvestNowTocDefaults } = manageOfferingStore;
    const isTemplate2 = get(offer, 'investNow.template') === 2;
    let investNowTocs = (!isTemplate2 || !get(offer, 'investNow.page[0]')) ? getInvestNowTocDefaults() : get(offer, 'investNow.page') || [];
    investNowTocs = investNowTocs.find(i => i.page === page && i.regulation === regulation);
    const requiredArray = [];
    const pageRequiredArray = [];
    const valuesArray = [];
    forEach(get(investNowTocs, 'toc'), (data) => {
      const valueObj = {};
      const label = this.preview(data.label, params);
      valueObj.label = label;
      valueObj.value = data.order;
      valuesArray.push(valueObj);
      if (data.required) {
        pageRequiredArray.push(data.order);
      }
    });
    requiredArray.push(pageRequiredArray);
    this.AGREEMENT_DETAILS_FORM.fields.page[0].title.value = get(investNowTocs, 'title');
    this.AGREEMENT_DETAILS_FORM.fields.page[0].toc.values = valuesArray;
    this.tocRequiredArray = requiredArray;
  }

  @computed get getUncheckedOptionalToc() {
    const uncheckedTocs = [];
    // const page = toJS(this.AGREEMENT_DETAILS_FORM.fields.page);
    const page = toJS(this.AGREEMENT_DETAILS_FORM.fields.page);
    const optionalArray = toJS(this.tocOptional.array) || [];
    const optionalLabels = toJS(this.tocOptional.labels) || [];
    // page.forEach((p, index) => {
    // optionalArray[this.agreementPage].forEach((optional, oi) => {
    //   if (!(page.toc.value || []).includes(optional)) {
    //     uncheckedTocs.push(optionalLabels[this.agreementPage][oi]);
    //   }
    // });
    // });
// multipage support
    page.forEach((p, index) => {
      optionalArray[index].forEach((optional, oi) => {
        if (!(p.toc.value || []).includes(optional)) {
          uncheckedTocs.push(optionalLabels[index][oi]);
        }
      });
    });
    return uncheckedTocs;
  }

  @computed get isAgreementFormValid() {
    const requiredArray = toJS(get(this.tocRequiredArray, `[${this.agreementPage}]`)) || [];
    const formArr = get(this.AGREEMENT_DETAILS_FORM.fields, `page[${this.agreementPage}].toc.value`) || [];
    return requiredArray.every(e => toJS(formArr).includes(e));
  }

  @action
  setCheckbox = (e, res, field, index) => {
    this.AGREEMENT_DETAILS_FORM = Validator.onArrayFieldChange(this.AGREEMENT_DETAILS_FORM, Validator.pullValues(e, res), field, index, 'checkbox');
  }
}

export default new AgreementsStore();
