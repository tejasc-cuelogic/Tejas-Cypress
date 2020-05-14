import { decorate, observable, action, computed, toJS } from 'mobx';
import { startCase, get, includes, filter, orderBy, forEach } from 'lodash';
import money from 'money-math';
import moment from 'moment';
import cleanDeep from 'clean-deep';
import omitDeep from 'omit-deep';
import { FormValidator as Validator, DataFormatter } from '../../../../../helper';
import DataModelStore, * as dataModelStore from '../dataModelStore';
import {
  TOMBSTONE_BASIC, TOMBSTONE_HEADER_META, HEADER_BASIC, OFFERING_CONTENT, OFFERING_MISC, SUB_HEADER_BASIC, GALLERY,
} from '../../../../constants/offering/formMeta/offering';
import { INVEST_NOW_TOC, INVEST_NOW_PAGE, DOCUMENT_MAPPING } from '../../../../constants/offering/formMeta';
import Helper from '../../../../../helper/utility';
import { GqlClient as client } from '../../../../../api/gqlApi';
import { offeringCreationStore, offeringsStore, uiStore, userDetailsStore, campaignStore } from '../../../index';
import * as investNowTocDefaults from '../../../../constants/offering/InvestNowToc';
import { offeringUpsert, adminLockOrUnlockOffering, adminGetInvestNowMappings } from '../../../queries/offerings/manageOffering';
import { CAMPAIGN_KEYTERMS_SECURITIES_ENUM, CAMPAIGN_KEYTERMS_EQUITY_CLASS_ENUM } from '../../../../../constants/offering';


export class ManageOfferingStore extends DataModelStore {
  constructor() {
    super({ adminLockOrUnlockOffering, adminGetInvestNowMappings });
  }

  TOMBSTONE_BASIC_FRM = Validator.prepareFormObject(TOMBSTONE_BASIC);

  TOMBSTONE_HEADER_META_FRM = Validator.prepareFormObject(TOMBSTONE_HEADER_META);

  GALLERY_FRM = Validator.prepareFormObject(GALLERY);

  HEADER_BASIC_FRM = Validator.prepareFormObject(HEADER_BASIC);

  SUB_HEADER_BASIC_FRM = Validator.prepareFormObject(SUB_HEADER_BASIC);

  OFFERING_CONTENT_FRM = Validator.prepareFormObject(OFFERING_CONTENT);

  OFFERING_MISC_FRM = Validator.prepareFormObject(OFFERING_MISC);

  INVEST_NOW_TOC_FRM = Validator.prepareFormObject(INVEST_NOW_TOC);

  INVEST_NOW_PAGE_FRM = Validator.prepareFormObject(INVEST_NOW_PAGE);

  DOCUMENT_MAPPING_FRM = Validator.prepareFormObject(DOCUMENT_MAPPING);

  onDragSaveEnable = false;

  DOCUMENT_UPLOAD_MAPPING_FRM = [];

  initLoad = [];

  DOCUMENT_MAPPING_OPTIONS = [];

  getInvestNowTocDefaults = (isPublic = false) => {
    const { offer } = offeringsStore;
    const { campaign } = campaignStore;
    const offerDetails = isPublic ? campaign : offer;
    const regulation = isPublic ? get(offerDetails, 'keyTerms.regulation') : get(offerDetails, 'regulation');
    const securities = get(offerDetails, 'keyTerms.securities');
    const equityClass = get(offerDetails, 'keyTerms.equityClass');
    let nsDefaultData = [];
    if (securities === CAMPAIGN_KEYTERMS_SECURITIES_ENUM.EQUITY) {
      if (equityClass === CAMPAIGN_KEYTERMS_EQUITY_CLASS_ENUM.LLC_MEMBERSHIP_UNITS) {
        nsDefaultData = get(investNowTocDefaults.REAL_ESTATE_EQUITY, 'investNow.page');
      } else if (equityClass === CAMPAIGN_KEYTERMS_EQUITY_CLASS_ENUM.PREFERRED) {
        nsDefaultData = get(investNowTocDefaults.PREFERRED_EQUITY, 'investNow.page');
      } else {
        nsDefaultData = get(investNowTocDefaults.CLASS_EQUITY, 'investNow.page');
      }
    } else if (securities === CAMPAIGN_KEYTERMS_SECURITIES_ENUM.TERM_NOTE) {
      nsDefaultData = get(investNowTocDefaults.TERM_NOTE, 'investNow.page');
    } else if (securities === CAMPAIGN_KEYTERMS_SECURITIES_ENUM.REVENUE_SHARING_NOTE) {
      nsDefaultData = get(investNowTocDefaults.REVENUE_SHARING_NOTE, 'investNow.page');
    } else if (securities === CAMPAIGN_KEYTERMS_SECURITIES_ENUM.SAFE) {
      nsDefaultData = get(investNowTocDefaults.SAFE, 'investNow.page');
    }
    const regCheck = regulation === 'BD_CF_506C' ? ['BD_506C', 'BD_CF'] : [regulation];
    nsDefaultData = nsDefaultData.filter(t => regCheck.includes(t.regulation));
    return nsDefaultData || [];
  }

  // eslint-disable-next-line class-methods-use-this
  get getAgreementTocList() {
    const { offer } = offeringsStore;
    const regulation = get(offer, 'regulation');
    const selectedTemplate = get(offer, 'investNow.template');
    const nsDefaultData = this.getInvestNowTocDefaults();
    let investNow = [];
    if (selectedTemplate === 2 && get(offer, 'investNow.page[0]')) {
      investNow = get(offer, 'investNow.page');
    } else {
      investNow = nsDefaultData;
    }
    const investNowTocs = {};
    if (regulation === 'BD_CF_506C') {
      investNowTocs.BD_506C = orderBy(filter(investNow, i => i.regulation === 'BD_506C'), ['page'], ['asc']);
      investNowTocs.BD_CF = orderBy(filter(investNow, i => i.regulation === 'BD_CF'), ['page'], ['asc']);
    } else {
      investNowTocs[regulation] = orderBy(filter(investNow, i => i.regulation === regulation), ['page'], ['asc']);
    }
    return investNowTocs;
  }

  investNowAddData = (params) => {
    const { form, regulation, page, type, tocIndex } = params;
    const agreementLists = this.getAgreementTocList;
    const { offer } = offeringsStore;
    let investNow = get(offer, 'investNow.page') || [];
    if (['TOC_EDIT', 'PAGE_EDIT', 'TOC_REQUIRED'].includes(type)) {
      let formData;
      if (type !== 'TOC_REQUIRED') {
        formData = Validator.evaluateFormData(this[form].fields);
      }
      const index = investNow.findIndex(i => i.page === page && i.regulation === regulation);
      if (['TOC_REQUIRED', 'TOC_EDIT'].includes(type) && tocIndex >= 0) {
        const editTOC = type === 'TOC_EDIT' ? {
          label: formData.label,
          required: formData.required,
          account: formData.account,
        } : { required: !investNow[index].toc[tocIndex].required };
        investNow[index].toc[tocIndex] = { ...investNow[index].toc[tocIndex], ...editTOC };
      } else {
        investNow[index] = { ...investNow[index], title: formData.title, note: formData.note, hideHeader: formData.hideHeader.includes(true) || false };
      }
    } else if (form === 'INVEST_NOW_PAGE_FRM') {
      const formData = Validator.evaluateFormData(this[form].fields);
      const addPage = {
        page: ((agreementLists[regulation] && agreementLists[regulation].length) || 0) + 1,
        regulation,
        title: formData.title,
        note: formData.note,
        hideHeader: formData.hideHeader.includes(true) || false,
      };
      investNow.push(addPage);
    } else if (form === 'INVEST_NOW_TOC_FRM') {
      const formData = Validator.evaluateFormData(this[form].fields);
      const agreementToc = investNow.find(i => i.page === page && i.regulation === regulation);
      const addTOC = {
        label: formData.label,
        order: ((agreementToc.toc && agreementToc.toc.length) || 0) + 1,
        required: formData.required,
        account: formData.account,
      };
      investNow = investNow.map(i => ((i.regulation === regulation && i.page === page) ? { ...i, toc: i.toc && i.toc.length ? [...i.toc, addTOC] : [addTOC] } : { ...i }));
    } else if (type === 'PAGE') {
      const index = investNow.findIndex(i => i.page === page && i.regulation === regulation);
      investNow.splice(index, 1);
    } else if (type === 'TOC_DELETE') {
      // delete particular toc
      investNow = investNow.map((i) => {
        let iData;
        if (i.regulation === regulation && i.page === page) {
          i.toc.splice(tocIndex, 1);
          iData = { ...i, toc: i.toc };
        } else {
          iData = { ...i };
        }
        return iData;
      });
    } else if (type === 'REORDER') {
      const index = investNow.findIndex(i => i.page === page && i.regulation === regulation);
      return { index, investNow };
    }
    return { page: investNow };
  }

  get campaignStatus() {
    const { currentUserId } = userDetailsStore;
    window.logger(this.TOMBSTONE_BASIC_FRM);
    const { offer } = offeringsStore;
    const campaignStatus = {};
    const closingDate = get(offer, 'closureSummary.processingDate') && get(offer, 'closureSummary.processingDate') !== 'Invalid date' ? get(offer, 'closureSummary.processingDate') : null;
    campaignStatus.lock = get(offer, 'lock.userId') && currentUserId !== get(offer, 'lock.userId');
    campaignStatus.diff = DataFormatter.diffDays(closingDate || null, false, true);
    campaignStatus.diffForProcessing = DataFormatter.getDateDifferenceInHoursOrMinutes(closingDate, true, true);
    campaignStatus.countDown = (includes(['Minute Left', 'Minutes Left'], campaignStatus.diffForProcessing.label) && campaignStatus.diffForProcessing.value > 0) || campaignStatus.diffForProcessing.value <= 48 ? { valueToShow: campaignStatus.diffForProcessing.value, labelToShow: campaignStatus.diffForProcessing.label } : { valueToShow: campaignStatus.diff, labelToShow: campaignStatus.diff === 1 ? 'Day Left' : 'Days Left' };
    campaignStatus.isInProcessing = campaignStatus.diffForProcessing.value <= 0 && (!get(offer, 'closureSummary.hardCloseDate') || get(offer, 'closureSummary.hardCloseDate') === 'Invalid date');
    campaignStatus.collected = this.HEADER_BASIC_FRM.fields.raisedAmount.value || this.SUB_HEADER_BASIC_FRM.fields.raisedAmount.value || 0;
    const offeringRegulation = get(offer, 'keyTerms.regulation');
    const minOffering = get(offer, 'keyTerms.minOfferingAmountCF') || 0;
    const minOfferingD = get(offer, 'keyTerms.minOfferingAmount506') && get(offer, 'keyTerms.minOfferingAmount506') !== '0.00' ? get(offer, 'keyTerms.minOfferingAmount506') : get(offer, 'keyTerms.minOfferingAmount506C') ? get(offer, 'keyTerms.minOfferingAmount506C') : '0.00';
    campaignStatus.minOffering = includes(['BD_CF_506C', 'BD_506C', 'BD_506B'], offeringRegulation) ? minOfferingD : minOffering;
    const maxOffering = get(offer, 'keyTerms.maxOfferingAmountCF') || 0;
    const maxOfferingD = get(offer, 'keyTerms.maxOfferingAmount506') && get(offer, 'keyTerms.maxOfferingAmount506') !== '0.00' ? get(offer, 'keyTerms.maxOfferingAmount506') : get(offer, 'keyTerms.maxOfferingAmount506C') ? get(offer, 'keyTerms.maxOfferingAmount506C') : '0.00';
    campaignStatus.maxOffering = includes(['BD_CF_506C', 'BD_506C', 'BD_506B'], offeringRegulation) ? maxOfferingD : maxOffering;
    campaignStatus.minFlagStatus = campaignStatus.collected >= campaignStatus.minOffering;
    campaignStatus.percentBefore = (campaignStatus.minOffering / campaignStatus.maxOffering) * 100;
    const formattedRaisedAmount = money.floatToAmount(campaignStatus.collected);
    const formattedMaxOfferingAmount = money.floatToAmount(campaignStatus.maxOffering);
    const maxReachedComparedAmount = money.cmp(formattedRaisedAmount, formattedMaxOfferingAmount);
    const formattedReachedMaxCompareAmountValue = money.floatToAmount(maxReachedComparedAmount);
    const minMaxOffering = campaignStatus.minFlagStatus
      ? campaignStatus.maxOffering : campaignStatus.minOffering;
    campaignStatus.maxFlagStatus = !!(money.isZero(formattedReachedMaxCompareAmountValue)
      || money.isPositive(formattedReachedMaxCompareAmountValue));
    campaignStatus.percent = (campaignStatus.collected / minMaxOffering) * 100;
    campaignStatus.address = get(offer, 'keyTerms.city') || get(offer, 'keyTerms.state') ? `${get(offer, 'keyTerms.city') || 'Houston'}, ${get(offer, 'keyTerms.state') || 'Texas'}` : 'Houston, Texas';
    campaignStatus.earlyBird = get(offer, 'earlyBird') || null;
    campaignStatus.bonusRewards = get(offer, 'bonusRewards') || [];
    campaignStatus.isEarlyBirdRewards = campaignStatus.bonusRewards.filter(b => b.earlyBirdQuantity > 0).length;
    campaignStatus.isBonusReward = campaignStatus.bonusRewards && campaignStatus.bonusRewards.length;
    const elevatorPitch = (offer && offer.offering && offer.offering.overview
      && offer.offering.overview.elevatorPitch)
      || (offer && offer.offering && offer.offering.overview
        && offer.offering.overview.highlight);
    campaignStatus.hasTopThingToKnow = elevatorPitch;
    campaignStatus.dataRooms = [];
    campaignStatus.gallery = get(offer, 'media.gallery') ? get(offer, 'media.gallery').length : 0;
    campaignStatus.keyTerms = get(offer, 'keyTerms');
    campaignStatus.issuerStatement = get(offer, 'keyTerms.offeringDisclaimer');
    campaignStatus.companyDescription = get(offer, 'offering.about.theCompany');
    campaignStatus.businessModel = get(offer, 'offering.about.businessModel');
    campaignStatus.localAnalysis = get(offer, 'offering.about.locationAnalysis');
    campaignStatus.history = get(offer, 'offering.about.history');
    campaignStatus.team = get(offer, 'leadership');
    campaignStatus.useOfProcceds = get(offer, 'legal.general.useOfProceeds.offeringExpenseAmountDescription');
    campaignStatus.revenueSharingSummary = get(offer, 'keyTerms.revShareSummary');
    campaignStatus.updates = get(offer, 'updates') && get(offer, 'updates').length;
    campaignStatus.investmentHighlights = true;
    campaignStatus.investmentSummary = get(offer, 'investmentSummary');
    campaignStatus.isRevenueShare = get(offer, 'keyTerms.securities') === CAMPAIGN_KEYTERMS_SECURITIES_ENUM.REVENUE_SHARING_NOTE && campaignStatus.revenueSharingSummary;
    campaignStatus.isTermNote = get(offer, 'keyTerms.securities') === CAMPAIGN_KEYTERMS_SECURITIES_ENUM.TERM_NOTE;
    campaignStatus.isFund = get(offer, 'keyTerms.securities') === CAMPAIGN_KEYTERMS_SECURITIES_ENUM.FUNDS;
    campaignStatus.isRealEstate = get(offer, 'keyTerms.securities') === CAMPAIGN_KEYTERMS_SECURITIES_ENUM.REAL_ESTATE;
    campaignStatus.isPreferredEquity = get(offer, 'keyTerms.securities') === CAMPAIGN_KEYTERMS_SECURITIES_ENUM.PREFERRED_EQUITY_506C;
    return campaignStatus;
  }

  generateBanner = () => {
    const { offer } = offeringsStore;
    const resultObject = {};
    const offeringKeyTermDetails = get(offer, 'keyTerms');
    const minimumOfferingAmountCF = get(offeringKeyTermDetails, 'minOfferingAmountCF') || '0.00';
    const minimumOfferingAmountRegD = get(offeringKeyTermDetails, 'minOfferingAmount506') && get(offeringKeyTermDetails, 'minOfferingAmount506') !== '0.00' ? get(offeringKeyTermDetails, 'minOfferingAmount506') : get(offeringKeyTermDetails, 'minOfferingAmount506C') ? get(offeringKeyTermDetails, 'minOfferingAmount506C') : '0.00';
    const maxOfferingAmountCF = get(offeringKeyTermDetails, 'maxOfferingAmountCF') || '0.00';
    const maxOfferingAmountRegD = get(offeringKeyTermDetails, 'maxOfferingAmount506') && get(offeringKeyTermDetails, 'maxOfferingAmount506') !== '0.00' ? get(offeringKeyTermDetails, 'maxOfferingAmount506') : get(offeringKeyTermDetails, 'maxOfferingAmount506C') ? get(offeringKeyTermDetails, 'maxOfferingAmount506C') : '0.00';
    const regulation = get(offeringKeyTermDetails, 'regulation');
    const securities = get(offeringKeyTermDetails, 'securities');
    const isRealEstate = (securities === CAMPAIGN_KEYTERMS_SECURITIES_ENUM.EQUITY && get(offeringKeyTermDetails, 'equityClass') === 'LLC_MEMBERSHIP_UNITS');
    const minimumOfferingAmount = includes(['BD_CF_506C', 'BD_506C', 'BD_506B'], regulation) ? minimumOfferingAmountRegD : minimumOfferingAmountCF;
    const launchDate = this.TOMBSTONE_BASIC_FRM.fields.launchDate.value || null;
    const closingDate = this.TOMBSTONE_BASIC_FRM.fields.closeDate.value || null;
    const maxOfferingAmount = includes(['BD_CF_506C', 'BD_506C', 'BD_506B'], regulation) ? maxOfferingAmountRegD : maxOfferingAmountCF;
    const raisedAmount = money.floatToAmount(this.TOMBSTONE_BASIC_FRM.fields.raisedAmount.value || 0);
    const divResult = money.div(raisedAmount, minimumOfferingAmount);
    const percent = money.mul(divResult, '100.00');
    const customAddinggDaysDateObj = {
      number: 7,
      format: 'days',
    };
    const launchDaysToRemainsForNewLable = DataFormatter.diffDaysForLauch(
      launchDate || null,
      false, true, true, customAddinggDaysDateObj,
    );
    const closeDaysToRemains = DataFormatter.diffDays(closingDate || null, false, true);
    const closeDaysToRemainsInHours = DataFormatter.getDateDifferenceInHoursOrMinutes(closingDate, true, true);
    const isInProcessing = closeDaysToRemainsInHours.value <= 0 && (!this.TOMBSTONE_BASIC_FRM.fields.hardCloseDate.value || this.TOMBSTONE_BASIC_FRM.fields.hardCloseDate.value === 'Invalid date');
    const percentageCompairResult = money.cmp(percent, '50.00').toString();
    const amountCompairResult = money.cmp(raisedAmount, maxOfferingAmount).toString();
    let isReachedMax = false;
    if (money.isZero(amountCompairResult) || !money.isNegative(amountCompairResult)) {
      isReachedMax = true;
    }
    if (launchDate && (launchDaysToRemainsForNewLable < closeDaysToRemains
      || closeDaysToRemains === null)
      && launchDaysToRemainsForNewLable >= 0 && launchDaysToRemainsForNewLable <= 7) {
      resultObject.isBannerShow = true;
      resultObject.datesBanner = 'NEW';
      resultObject.amountsBanner = this.generateLabelBannerSecond(amountCompairResult, percentageCompairResult, percent, isRealEstate);
      if (isRealEstate) {
        resultObject.realEstateBanner = 'Real Estate';
      }
      resultObject.launchDate = moment(launchDate).unix() || null;
      resultObject.processingDate = moment(closingDate).unix() || null;
      resultObject.category = 'newOffering';
      return resultObject;
    } if (closingDate && closeDaysToRemains >= 0 && closeDaysToRemains <= 7 && !isInProcessing) {
      const labelBannerFirst = ((includes(['Minute Left', 'Minutes Left'], closeDaysToRemainsInHours.label) && closeDaysToRemainsInHours.value > 0) || closeDaysToRemainsInHours.value <= 48) ? `${closeDaysToRemainsInHours.value} ${closeDaysToRemainsInHours.label}` : closeDaysToRemains === 1 ? `${closeDaysToRemains} Day Left` : `${closeDaysToRemains} Days Left`;
      resultObject.isBannerShow = !!labelBannerFirst;
      resultObject.datesBanner = labelBannerFirst;
      resultObject.amountsBanner = this.generateLabelBannerSecond(amountCompairResult, percentageCompairResult, percent, isRealEstate);
      if (isRealEstate) {
        resultObject.realEstateBanner = 'Real Estate';
      }
      resultObject.launchDate = moment(launchDate).unix() || null;
      resultObject.processingDate = moment(closingDate).unix() || null;
      resultObject.category = 'closingSoon';
      if (!isReachedMax) {
        return resultObject;
      }
    } if (isInProcessing) {
      resultObject.isBannerShow = true;
      resultObject.datesBanner = 'Processing';
      if (isRealEstate) {
        resultObject.realEstateBanner = 'Real Estate';
      }
      resultObject.launchDate = moment(launchDate).unix() || null;
      resultObject.processingDate = moment(closingDate).unix() || null;
      resultObject.category = 'processing';
      return resultObject;
    }
    resultObject.amountsBanner = this.generateLabelBannerSecond(amountCompairResult, percentageCompairResult, percent, isRealEstate);
    if (isRealEstate) {
      resultObject.realEstateBanner = 'Real Estate';
    }
    resultObject.isBannerShow = !!(resultObject.datesBanner || resultObject.amountsBanner);
    resultObject.launchDate = moment(launchDate).unix() || null;
    resultObject.processingDate = moment(closingDate).unix() || null;
    if (money.isZero(amountCompairResult) || !money.isNegative(amountCompairResult)) {
      resultObject.category = 'reachedMax';
      return resultObject;
    }
    return resultObject;
  }

  generateLabelBannerSecond = (amountCompairResult, percentageCompairResult, percent, isRealEstate) => {
    let labelBannerSecond = null;
    if (money.isNegative(amountCompairResult)
      && !money.isZero(percentageCompairResult) && !money.isNegative(percentageCompairResult) && !isRealEstate) {
      labelBannerSecond = `${Math.round(percent)}% Funded`;
    } else if (money.isZero(amountCompairResult) || !money.isNegative(amountCompairResult)) {
      labelBannerSecond = 'Reached Max';
    }
    return labelBannerSecond;
  }

  updateDocument = payloadData => new Promise(async (res) => {
    const mappingForm = this.DOCUMENT_UPLOAD_MAPPING_FRM;
    const uploadDocumentArry = payloadData.doc;
    forEach(uploadDocumentArry, (value, index) => {
      const documentObj = value;
      const mappedArray = Validator.evaluateFormData(mappingForm[index].fields).mapping || [];
      documentObj.mapping = mappedArray;
    });
    // console.log(uploadDocumentArry);
    const payload = {
      template: 2,
      doc: cleanDeep(uploadDocumentArry),
    };
    const result = await this.updateOffering({ keyName: 'investNow', offeringData: { docuSign: payload } });
    res(result);
  });

  updateOffering = params => new Promise((res) => {
    const { keyName, forms, cleanData, offeringData, tocAction } = params;
    let offeringDetails = {};
    let data;
    let miscData;
    if (offeringData) {
      data = offeringData;
    } else if (Array.isArray(forms)) {
      forms.forEach((f) => {
        if (f === 'OFFERING_MISC_FRM') {
          miscData = offeringCreationStore.evaluateFormFieldToArray(this[f].fields, false);
          miscData = { ...miscData, ...Validator.evaluateFormData(this[f].fields) };
        } else {
          data = { ...data, ...Validator.evaluateFormData(this[f].fields) };
        }
      });
    } else if (keyName === 'misc') {
      data = offeringCreationStore.evaluateFormFieldToArray(this[forms].fields, false);
      data = { ...data, ...Validator.evaluateFormData(this[forms].fields) };
    } else {
      data = Validator.evaluateFormData(this[forms].fields);
    }
    if (cleanData) {
      data = cleanDeep(data);
      data = omitDeep(data, ['__typename', 'fileHandle']);
    }
    if (keyName) {
      if (keyName === 'investNow' && tocAction) {
        const { offer } = offeringsStore;
        if (data.template === 2 && (!get(offer, 'investNow.page') || tocAction === 'RESET')) {
          offeringDetails[keyName] = { ...data, page: this.getInvestNowTocDefaults() };
        }
      } else {
        offeringDetails[keyName] = data;
        if (keyName !== 'misc' && forms && forms.includes('OFFERING_MISC_FRM')) {
          offeringDetails.misc = miscData;
        }
      }
    } else {
      offeringDetails = { ...data };
    }
    const mutationsParams = {
      ...params,
      id: offeringCreationStore.currentOfferingId,
      offeringDetails,
      res,
    };
    this.updateOfferingMutation(mutationsParams);
  });

  updateOfferingMutation = (params) => {
    const {
      id, offeringDetails, keyName, notify = true, successMsg = undefined, fromS3 = false, res, msgType = 'success',
    } = params;
    uiStore.setProgress('save');
    const variables = {
      id,
      offeringDetails,
    };
    client
      .mutate({
        mutation: offeringUpsert,
        variables,
      })
      .then((data) => {
        this.setFieldValue('onDragSaveEnable', false);
        this.removeUploadedFiles(fromS3);
        if (successMsg) {
          Helper.toast(successMsg, msgType || 'success');
        } else if (notify) {
          Helper.toast(`${keyName ? startCase(keyName) : 'Offering'} has been saved successfully.`, 'success');
        }
        offeringsStore.getOne(get(data, 'data.offeringUpsert.offeringSlug'), false);
        uiStore.setProgress(false);
        res();
      })
      .catch((err) => {
        uiStore.setErrors(DataFormatter.getSimpleErr(err));
        if (get(err, 'message') && get(err, 'message').includes('has locked the offering')) {
          Helper.toast(get(err, 'message'), 'error');
        } else {
          Helper.toast('Something went wrong.', 'error');
        }
        uiStore.setProgress(false);
      });
  };

  adminLockOrUnlockOffering = offeringAction => new Promise(async (res, rej) => {
    const variables = {
      offeringId: offeringCreationStore.currentOfferingId,
      action: offeringAction,
    };
    try {
      const data = await this.executeMutation({
        mutation: 'adminLockOrUnlockOffering',
        clientType: 'PRIVATE',
        variables,
      });
      window.logger(data);
      const lockObj = get(data, 'data.adminLockOrUnlockOffering') ? {
        date: get(data, 'data.adminLockOrUnlockOffering.date'),
        user: get(data, 'data.adminLockOrUnlockOffering.user'),
        userId: get(data, 'data.adminLockOrUnlockOffering.userId'),
      } : null;
      offeringsStore.updateLockOffering(lockObj);
      res();
    } catch (error) {
      rej(error);
    }
  });

  getActionType = (formName, getField = 'actionType') => {
    const metaDataMapping = {
      TOMBSTONE_HEADER_META_FRM: { isMultiForm: true },
      TOMBSTONE_BASIC_FRM: { isMultiForm: false },
      SUB_HEADER_BASIC_FRM: { isMultiForm: false },
      HEADER_BASIC_FRM: { isMultiForm: false },
      OFFERING_CONTENT_FRM: { isMultiForm: true },
      OFFERING_MISC_FRM: { isMultiForm: false },
      INVEST_NOW_TOC_FRM: { isMultiForm: true },
      GALLERY_FRM: { isMultiForm: true },
    };
    return metaDataMapping[formName][getField];
  }

  reOrderHandle = (orderedForm, form, arrayName) => {
    const content = toJS(orderedForm).map((d, index) => ({ ...d, order: { ...d.order, value: index + 1 } }));
    this.setFieldValue(form, content, `fields.${arrayName}`);
  }

  toggleVisible = (index) => {
    this.GALLERY_FRM = Validator.onArrayFieldChange(
      this.GALLERY_FRM,
      { name: 'isVisible', value: !this.GALLERY_FRM.fields.gallery[index].isVisible.value },
      'gallery',
      index,
    );
    this.currTime = +new Date();
  }

  setFormData = (form, ref, keepAtLeastOne) => {
    Validator.resetFormData(this[form]);
    this.initLoad.push(form);
    const { offer } = offeringsStore;
    if (!offer) {
      return false;
    }
    this[form] = Validator.setFormData(this[form], offer, ref, keepAtLeastOne);
    const multiForm = this.getActionType(form, 'isMultiForm');
    this[form] = Validator.validateForm(this[form], multiForm, false, false);
    return false;
  }

  setFormDataV2 = ({ type, page, regulation, tocIndex }) => {
    const { offer } = offeringsStore;
    const investNow = get(offer, 'investNow.page') ? JSON.parse(JSON.stringify([...get(offer, 'investNow.page')])) : [];
    if (type === 'TOC_EDIT') {
      const index = investNow.findIndex(i => i.page === page && i.regulation === regulation);
      if (index > -1) {
        const pageData = investNow[index];
        const toc = pageData.toc && pageData.toc.length ? pageData.toc[tocIndex] : {};
        this.INVEST_NOW_TOC_FRM = Validator.setFormData(this.INVEST_NOW_TOC_FRM, toc);
        this.INVEST_NOW_TOC_FRM = Validator.validateForm(this.INVEST_NOW_TOC_FRM);
      }
    } else {
      const index = investNow.findIndex(i => i.page === page && i.regulation === regulation);
      if (index > -1) {
        const pageData = investNow[index];
        pageData.hideHeader = [pageData.hideHeader];
        this.INVEST_NOW_PAGE_FRM = Validator.setFormData(this.INVEST_NOW_PAGE_FRM, pageData);
        this.INVEST_NOW_PAGE_FRM = Validator.validateForm(this.INVEST_NOW_PAGE_FRM);
      }
    }
  }

  adminGetInvestNowMappings = async () => {
    try {
      const res = await this.executeQuery({
        client: 'PRIVATE',
        query: 'adminGetInvestNowMappings',
        setLoader: 'adminGetInvestNowMappings',
        // fetchPolicy: 'cache-first',
      });
      if (get(res, 'adminGetInvestNowMappings')) {
        // console.log('lit obtained');
        this.setFieldValue('DOCUMENT_MAPPING_OPTIONS', this.dropDownValuesForPlugin(get(res, 'adminGetInvestNowMappings')));
      }
    } catch (error) {
      Helper.toast('Something went wrong, please try again later.', 'error');
    }
  }

  dropDownValuesForPlugin = (pluginList) => {
    const pluginArr = [];
    const plugins = pluginList;
    plugins.forEach((val) => {
      const tempObj = {};
      tempObj.key = val.label;
      tempObj.text = val.label;
      tempObj.value = val.value;
      pluginArr.push(tempObj);
    });
    return pluginArr;
  }

  prepareDocumentMappingForm = (form, index = 0) => {
    const mappingFields = DOCUMENT_MAPPING.mapping;
    forEach(mappingFields, (val) => {
      const formField = val;
      formField.value.options = this.DOCUMENT_MAPPING_OPTIONS;
    });
    this[form][index] = Validator.prepareFormObject(DOCUMENT_MAPPING);
  }

  setMappingFormData = (form, ref, index = 0, keepAtLeastOne) => {
    const { offer } = offeringsStore;
    const mappingData = get(offer, `investNow.docuSign.doc[${index}]`);
    this[form][index] = Validator.setFormData(this[form][index], mappingData, ref, keepAtLeastOne);
  }

  formChangeForMultilevelArray = (e, res, form, subForm, index, isArrayChange = false) => {
    if (isArrayChange) {
      this[form.parentForm][form.childForm] = Validator.onArrayFieldChange(
        this[form.parentForm][form.childForm],
        Validator.pullValues(e, res),
        subForm,
        index,
      );
    } else {
      this[form.parentForm][form.childForm] = Validator.onChange(this[form.parentForm][form.childForm], Validator.pullValues(e, res));
    }
    // const dynamicFormFields = { ...this[form.parentForm][form.childForm].fields };
    // const mappedArr = [];
    // Object.keys(dynamicFormFields).forEach((key) => {
    //   const validObj = pickBy(dynamicFormFields[key], identity);
    //   const hasKey = has(validObj, 'defaultValuesMapping');
    //   if (hasKey) {
    //     const mappedOBj = { mappedKey: key, mappedVal: dynamicFormFields[key].defaultValuesMapping };
    //     mappedArr.push(mappedOBj);
    //   }
    // });
  };
}

decorate(ManageOfferingStore, {
  ...dataModelStore.decorateDefault,
  TOMBSTONE_BASIC_FRM: observable,
  onDragSaveEnable: observable,
  OFFERING_CONTENT_FRM: observable,
  TOMBSTONE_HEADER_META_FRM: observable,
  GALLERY_FRM: observable,
  HEADER_BASIC_FRM: observable,
  OFFERING_MISC_FRM: observable,
  SUB_HEADER_BASIC_FRM: observable,
  uploadFileToS3: action,
  campaignStatus: computed,
  INVEST_NOW_TOC_FRM: observable,
  INVEST_NOW_PAGE_FRM: observable,
  initLoad: observable,
  getAgreementTocList: computed,
  reOrderHandle: action,
  resetInitLoad: action,
  updateOffering: action,
  toggleVisible: action,
  updateOfferingMutation: action,
  setFormData: action,
  setFormDataV2: action,
  adminGetInvestNowMappings: action,
  DOCUMENT_MAPPING_FRM: observable,
  DOCUMENT_UPLOAD_MAPPING_FRM: observable,
  prepareDocumentMappingForm: action,
  formChangeForMultilevelArray: action,
  DOCUMENT_MAPPING_OPTIONS: observable,
  setMappingFormData: action,
});

export default new ManageOfferingStore();
