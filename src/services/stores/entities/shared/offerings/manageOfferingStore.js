import { decorate, observable, action, computed, toJS } from 'mobx';
import { startCase, get, includes } from 'lodash';
import money from 'money-math';
import { FormValidator as Validator, DataFormatter } from '../../../../../helper';
import DataModelStore, * as dataModelStore from '../dataModelStore';
import { TOMBSTONE_BASIC, TOMBSTONE_HEADER_META, HEADER_BASIC, OFFERING_CONTENT, OFFERING_MISC } from '../../../../constants/offering/formMeta/offering';
import Helper from '../../../../../helper/utility';
import { GqlClient as client } from '../../../../../api/gqlApi';
import { offeringCreationStore, offeringsStore, uiStore } from '../../../index';
import { offeringUpsert } from '../../../queries/offerings/manage-v2';
import { CAMPAIGN_KEYTERMS_SECURITIES_ENUM } from '../../../../../constants/offering';


export class ManageOfferingStore extends DataModelStore {
  TOMBSTONE_BASIC_FRM = Validator.prepareFormObject(TOMBSTONE_BASIC);

  TOMBSTONE_HEADER_META_FRM = Validator.prepareFormObject(TOMBSTONE_HEADER_META);

  HEADER_BASIC_FRM = Validator.prepareFormObject(HEADER_BASIC);

  OFFERING_CONTENT_FRM = Validator.prepareFormObject(OFFERING_CONTENT);

  OFFERING_MISC_FRM = Validator.prepareFormObject(OFFERING_MISC);

  onDragSaveEnable = false;

  get campaignStatus() {
    console.log(this.TOMBSTONE_BASIC_FRM);
    const { offer } = offeringsStore;
    const campaignStatus = {};
    const closingDate = get(offer, 'closureSummary.processingDate') && get(offer, 'closureSummary.processingDate') !== 'Invalid date' ? get(offer, 'closureSummary.processingDate') : null;
    campaignStatus.diff = DataFormatter.diffDays(closingDate || null, false, true);
    campaignStatus.diffForProcessing = DataFormatter.getDateDifferenceInHoursOrMinutes(closingDate, true, true);
    campaignStatus.countDown = (includes(['Minute Left', 'Minutes Left'], campaignStatus.diffForProcessing.label) && campaignStatus.diffForProcessing.value > 0) || campaignStatus.diffForProcessing.value <= 48 ? { valueToShow: campaignStatus.diffForProcessing.value, labelToShow: campaignStatus.diffForProcessing.label } : { valueToShow: campaignStatus.diff, labelToShow: campaignStatus.diff === 1 ? 'Day Left' : 'Days Left' };
    campaignStatus.isInProcessing = campaignStatus.diffForProcessing.value <= 0 && (!get(offer, 'closureSummary.hardCloseDate') || get(offer, 'closureSummary.hardCloseDate') === 'Invalid date');
    campaignStatus.collected = get(offer, 'closureSummary.totalInvestmentAmount') || 0;
    const offeringRegulation = get(offer, 'keyTerms.regulation');
    const minOffering = get(offer, 'keyTerms.minOfferingAmountCF') || 0;
    const minOfferingD = get(offer, 'keyTerms.minOfferingAmount506') && get(offer, 'keyTerms.minOfferingAmount506') !== '0.00' ? get(offer, 'keyTerms.minOfferingAmount506') : get(offer, 'keyTerms.minOfferingAmount506C') ? get(offer, 'keyTerms.minOfferingAmount506C') : '0.00';
    // campaignStatus.minOffering = get(offer, 'keyTerms.regulation') === 'BD_CF_506C' ? money.add(minOfferingD, minOffering) : includes(['BD_506C', 'BD_506B'], offeringRegulation) ? minOfferingD : minOffering;
    campaignStatus.minOffering = includes(['BD_CF_506C', 'BD_506C', 'BD_506B'], offeringRegulation) ? minOfferingD : minOffering;
    const maxOffering = get(offer, 'keyTerms.maxOfferingAmountCF') || 0;
    const maxOfferingD = get(offer, 'keyTerms.maxOfferingAmount506') && get(offer, 'keyTerms.maxOfferingAmount506') !== '0.00' ? get(offer, 'keyTerms.maxOfferingAmount506') : get(offer, 'keyTerms.maxOfferingAmount506C') ? get(offer, 'keyTerms.maxOfferingAmount506C') : '0.00';
    // campaignStatus.maxOffering = get(offer, 'keyTerms.regulation') === 'BD_CF_506C' ? money.add(maxOfferingD, maxOffering) : includes(['BD_506C', 'BD_506B'], offeringRegulation) ? maxOfferingD : maxOffering;
    campaignStatus.maxOffering = includes(['BD_CF_506C', 'BD_506C', 'BD_506B'], offeringRegulation) ? maxOfferingD : maxOffering;
    campaignStatus.minFlagStatus = campaignStatus.collected >= campaignStatus.minOffering;
    campaignStatus.percentBefore = (campaignStatus.minOffering / campaignStatus.maxOffering) * 100;
    const formatedRaisedAmount = money.floatToAmount(campaignStatus.collected);
    // const formatedMaxOfferingAmount = money.floatToAmount(maxOffering);
    const formatedMaxOfferingAmount = money.floatToAmount(campaignStatus.maxOffering);
    const maxReachedCompairedAmount = money.cmp(formatedRaisedAmount, formatedMaxOfferingAmount);
    const formatedReachedMaxCompairAmountValue = money.floatToAmount(maxReachedCompairedAmount);
    const minMaxOffering = campaignStatus.minFlagStatus
      ? campaignStatus.maxOffering : campaignStatus.minOffering;
    campaignStatus.maxFlagStatus = !!(money.isZero(formatedReachedMaxCompairAmountValue)
      || money.isPositive(formatedReachedMaxCompairAmountValue));
    campaignStatus.percent = (campaignStatus.collected / minMaxOffering) * 100;
    campaignStatus.address = get(offer, 'keyTerms.city') || get(offer, 'keyTerms.state') ? `${get(offer, 'keyTerms.city') || '-'}, ${get(offer, 'keyTerms.state') || '-'}` : '--';
    campaignStatus.isClosed = get(offer, 'stage') !== 'LIVE';
    campaignStatus.isCreation = get(offer, 'stage') === 'CREATION';
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
    campaignStatus.gallary = get(offer, 'media.gallery') ? get(offer, 'media.gallery').length : 0;
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
    campaignStatus.isInvestedInOffering = get(offer, 'isInvestedInOffering');
    campaignStatus.isRevenueShare = get(offer, 'keyTerms.securities') === CAMPAIGN_KEYTERMS_SECURITIES_ENUM.REVENUE_SHARING_NOTE && campaignStatus.revenueSharingSummary;
    campaignStatus.isTermNote = get(offer, 'keyTerms.securities') === CAMPAIGN_KEYTERMS_SECURITIES_ENUM.TERM_NOTE;
    campaignStatus.isFund = get(offer, 'keyTerms.securities') === CAMPAIGN_KEYTERMS_SECURITIES_ENUM.FUNDS;
    campaignStatus.isRealEstate = get(offer, 'keyTerms.securities') === CAMPAIGN_KEYTERMS_SECURITIES_ENUM.REAL_ESTATE;
    campaignStatus.isPreferredEquity = get(offer, 'keyTerms.securities') === CAMPAIGN_KEYTERMS_SECURITIES_ENUM.PREFERRED_EQUITY_506C;
    return campaignStatus;
  }

  updateOffering = params => new Promise((res) => {
    const { keyName, forms } = params;
    let offeringDetails = {};
    let data;
    if (Array.isArray(forms)) {
      forms.forEach((f) => {
        data = { ...data, ...Validator.evaluateFormData(this[f].fields) };
      });
    } else if (keyName === 'misc') {
      data = offeringCreationStore.evaluateFormFieldToArray(this[forms].fields, false);
      data = { ...data, ...Validator.evaluateFormData(this[forms].fields) };
    } else {
      data = Validator.evaluateFormData(this[forms].fields);
    }
    if (keyName) {
      offeringDetails[keyName] = data;
    } else {
      offeringDetails = { ...data };
    }
    const mutationsParams = {
      ...params,
      id: offeringCreationStore.currentOfferingId,
      offeringDetails,
      res,
    };
    console.log(offeringDetails);
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
        Helper.toast('Something went wrong.', 'error');
        uiStore.setProgress(false);
      });
  };

  getActionType = (formName, getField = 'actionType') => {
    const metaDataMapping = {
      TOMBSTONE_HEADER_META_FRM: { isMultiForm: true },
      TOMBSTONE_BASIC_FRM: { isMultiForm: false },
      HEADER_BASIC_FRM: { isMultiForm: false },
      OFFERING_CONTENT_FRM: { isMultiForm: true },
      OFFERING_MISC_FRM: { isMultiForm: false },
    };
    return metaDataMapping[formName][getField];
  }

  reOrderHandle = (orderedForm) => {
    const content = toJS(orderedForm).map((d, index) => ({ ...d, order: { ...d.order, value: index + 1 } }));
    this.setFieldValue('OFFERING_CONTENT_FRM', content, 'fields.content');
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
}

  decorate(ManageOfferingStore, {
    ...dataModelStore.decorateDefault,
    TOMBSTONE_BASIC_FRM: observable,
    onDragSaveEnable: observable,
    OFFERING_CONTENT_FRM: observable,
    TOMBSTONE_HEADER_META_FRM: observable,
    HEADER_BASIC_FRM: observable,
    OFFERING_MISC_FRM: observable,
    uploadMedia: action,
    reOrderHandle: action,
    updateOffering: action,
    uploadFileToS3: action,
    updateOfferingMutation: action,
    setFormData: action,
    campaignStatus: computed,
  });

export default new ManageOfferingStore();
