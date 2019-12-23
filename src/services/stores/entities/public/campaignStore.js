import { toJS, observable, computed, action } from 'mobx';
import graphql from 'mobx-apollo';
import { pickBy, get, set, filter, orderBy, sortBy, includes, has, remove, uniqWith, isEqual, isEmpty, reduce, isArray } from 'lodash';
import money from 'money-math';
import moment from 'moment';
import { Calculator } from 'amortizejs';
import { GqlClient as clientPublic } from '../../../../api/publicApi';
import { GqlClient as client } from '../../../../api/gqlApi';
import { allOfferings, campaignDetailsQuery, campaignDetailsAdditionalQuery, getOfferingById, campaignDetailsForInvestmentQuery, getOfferingsReferral, checkIfEarlyBirdExist } from '../../queries/campagin';
import { STAGES } from '../../../constants/admin/offerings';
import { CAMPAIGN_KEYTERMS_SECURITIES_ENUM } from '../../../../constants/offering';
import { getBoxEmbedLink } from '../../queries/agreements';
import { userDetailsStore, watchListStore, userStore, authStore } from '../../index';
// import uiStore from '../shared/uiStore';
import Helper from '../../../../helper/utility';
import { DataFormatter } from '../../../../helper';

export class CampaignStore {
  @observable data = [];

  @observable completedOfferings = [];

  @observable details = {};

  @observable additionalDetails = {};

  @observable option = false;

  @observable campaignSideBarShow = true;

  @observable selectedReadMore = {};

  @observable selectedReadLess = {};

  @observable RECORDS_TO_DISPLAY = 12;

  @observable completedToDisplay = this.RECORDS_TO_DISPLAY;

  @observable activeToDisplay = this.RECORDS_TO_DISPLAY;

  @observable gallarySelectedImageIndex = null;

  @observable docsWithBoxLink = [];

  @observable campaignNavData = [];

  @observable totalPayment = 0;

  @observable principalAmt = 0;

  @observable totalPaymentChart = [];

  @observable showFireworkAnimation = false;

  @observable earlyBirdCheck = null;

  @observable isInvestBtnClicked = false;

  @observable isFetchedError = false;

  @observable docLoading = false;

  @observable documentMeta = {
    closingBinder: { selectedDoc: null, accordionActive: true },
  };

  @action
  setFieldValue = (field, val, path = false) => {
    if (path) {
      set(this[field], path, val);
    } else {
      this[field] = val;
    }
  }

  @action
  initRequest = (group, referralCode = false, field = 'data') => {
    let stageGroup = group;
    let groupKey = 'group';
    if (isArray(group)) {
      groupKey = 'stage';
      stageGroup = Object.keys(pickBy(STAGES, s => group.includes(s.publicRef)));
    }
    const variables = { filters: { [groupKey]: stageGroup } };
    if (referralCode) {
      variables.filters.referralCode = referralCode;
    }
    if (!referralCode && userStore.currentUser && userStore.currentUser.sub) {
      variables.userId = userStore.currentUser.sub;
    }
    return new Promise((resolve) => {
      this[field] = graphql({
        client: clientPublic,
        query: referralCode ? getOfferingsReferral : allOfferings,
        variables,
        onFetch: (data) => {
          if (data && !this[field].loading) {
            const offering = data.getOfferingList.length && data.getOfferingList[0];
            resolve(offering);
          }
        },
        onError: (err) => {
          console.log(err);
        },
      });
    });
  }

  @action
  getCampaignDetails = (id, queryType = false, isValid = false) => new Promise((resolve, reject) => {
    const gqlClient = authStore.isUserLoggedIn ? client : clientPublic;
    watchListStore.setFieldValue('isWatching', false);
    this.details = graphql({
      client: gqlClient,
      query: queryType ? campaignDetailsForInvestmentQuery : campaignDetailsQuery,
      variables: { id, isValid },
      fetchPolicy: 'network-only',
      onFetch: (data) => {
        if (data && data.getOfferingDetailsBySlug && !this.details.loading) {
          if (!queryType) {
            watchListStore.setFieldValue('isWatching', ['WATCHING', 'INVESTOR'].includes(get(data.getOfferingDetailsBySlug, 'watchListStatus')));
            this.getCampaignAdditionalDetails(id);
          }
          resolve(data.getOfferingDetailsBySlug);
        } else if (!this.details.loading) {
          resolve(false);
        }
      },
      onError: (err) => {
        reject(err);
      },
    });
  });

  @action
  getCampaignAdditionalDetails = (id) => {
    const gqlClient = authStore.isUserLoggedIn ? client : clientPublic;
    this.additionalDetails = graphql({
      client: gqlClient,
      query: campaignDetailsAdditionalQuery,
      variables: { id, isValid: true },
      fetchPolicy: 'network-only',
      onFetch: (data) => {
        if (data && data.getOfferingDetailsBySlug && !this.additionalDetails.loading) {
          this.concatOfferingDetails(get(data, 'getOfferingDetailsBySlug'));
        }
      },
    });
  }

  @action
  concatOfferingDetails = (newData) => {
    if (newData && this.campaign && get(this.campaign, 'id') === get(newData, 'id')) {
      const campaignData = toJS(this.details);
      campaignData.data.getOfferingDetailsBySlug.updates = get(newData, 'updates');
      campaignData.data.getOfferingDetailsBySlug.comments = get(newData, 'comments');
      this.details = campaignData;
    }
  }

  @action
  getIssuerIdForOffering = id => new Promise((resolve, reject) => {
    this.details = graphql({
      client: clientPublic,
      query: getOfferingById,
      variables: { id },
      onFetch: (data) => {
        if (data && !this.details.loading) {
          if (data.getOfferingDetailsBySlug) {
            resolve(data.getOfferingDetailsBySlug);
          } else {
            reject();
          }
        }
      },
      fetchPolicy: 'network-only',
    });
  });

  @computed get allData() {
    return this.data;
  }

  @computed get getEarlyBirdCheck() {
    return this.earlyBirdCheck && this.earlyBirdCheck.data
      && this.earlyBirdCheck.data.checkEarlyBirdByInvestorAccountAndOfferingId;
  }

  @computed get earlyBirdLoading() {
    return this.earlyBirdCheck && this.earlyBirdCheck.loading;
  }

  @computed get OfferingList() {
    return (this.allData.data && this.allData.data.getOfferingList
      && toJS(this.allData.data.getOfferingList)) || [];
  }

  @computed get CompletedOfferingList() {
    return (this.completedOfferings.data && this.completedOfferings.data.getOfferingList
      && toJS(this.completedOfferings.data.getOfferingList)) || [];
  }

  @computed get active() {
    const offeringList = this.orderedActiveList.slice();
    return offeringList.splice(0, this.activeToDisplay);
  }

  @computed get activeList() {
    // const activeListArr = this.OfferingList.filter(o => Object.keys(pickBy(STAGES, s => s.publicRef === 'active')).includes(o.stage));
    return orderBy(this.OfferingList, o => (get(o, 'keyTerms.shorthandBusinessName') ? get(o, 'keyTerms.shorthandBusinessName').toLowerCase() : get(o, 'keyTerms.shorthandBusinessName')), ['asc']);
  }

  @computed get orderedActiveList() {
    // const activeListArr = this.OfferingList.filter(o => Object.keys(pickBy(STAGES, s => s.publicRef === 'active')).includes(o.stage));
    const orderedActiveListArr = this.generateBanner(this.OfferingList, true);
    return orderedActiveListArr;
  }

  @computed get completed() {
    const offeringList = this.completedList.slice();
    return offeringList.splice(0, this.completedToDisplay);
  }

  @computed get completedList() {
    // return sortBy(this.CompletedOfferingList.filter(o => Object.keys(pickBy(STAGES, s => s.publicRef === 'completed')).includes(o.stage)), ['order']);
    return sortBy(this.CompletedOfferingList, ['order']);
  }

  @action
  loadMoreRecord = (type) => {
    const offeringsList = type === 'completedToDisplay' ? this.completedList : this.orderedActiveList;
    if (offeringsList.length > this[type]) {
      this[type] = this[type] + this.RECORDS_TO_DISPLAY;
    }
  }

  @action
  resetDisplayCounts = () => {
    this.completedToDisplay = this.RECORDS_TO_DISPLAY;
    this.activeToDisplay = this.RECORDS_TO_DISPLAY;
  }

  @computed get campaign() {
    if (this.details.data && this.details.data.getOfferingDetailsBySlug) {
      return toJS(this.details.data.getOfferingDetailsBySlug);
    } if (this.details.data && this.details.data.getOfferingById) {
      return toJS(this.details.data.getOfferingById);
    }
    return {};
  }

  @computed get campaignStatus() {
    const { campaign } = this;
    const campaignStatus = {};
    const closingDate = get(campaign, 'closureSummary.processingDate') && get(campaign, 'closureSummary.processingDate') !== 'Invalid date' ? get(campaign, 'closureSummary.processingDate') : null;
    campaignStatus.diff = DataFormatter.diffDays(closingDate || null, false, true);
    campaignStatus.diffForProcessing = DataFormatter.getDateDifferenceInHoursOrMinutes(closingDate, true, true);
    campaignStatus.countDown = (includes(['Minute Left', 'Minutes Left'], campaignStatus.diffForProcessing.label) && campaignStatus.diffForProcessing.value > 0) || campaignStatus.diffForProcessing.value <= 48 ? { valueToShow: campaignStatus.diffForProcessing.value, labelToShow: campaignStatus.diffForProcessing.label } : { valueToShow: campaignStatus.diff, labelToShow: campaignStatus.diff === 1 ? 'Day Left' : 'Days Left' };
    campaignStatus.isInProcessing = campaignStatus.diffForProcessing.value <= 0 && (!get(campaign, 'closureSummary.hardCloseDate') || get(campaign, 'closureSummary.hardCloseDate') === 'Invalid date');
    campaignStatus.collected = get(campaign, 'closureSummary.totalInvestmentAmount') || 0;
    const offeringRegulation = get(campaign, 'keyTerms.regulation');
    const minOffering = get(campaign, 'keyTerms.minOfferingAmountCF') || 0;
    const minOfferingD = get(campaign, 'keyTerms.minOfferingAmount506') && get(campaign, 'keyTerms.minOfferingAmount506') !== '0.00' ? get(campaign, 'keyTerms.minOfferingAmount506') : get(campaign, 'keyTerms.minOfferingAmount506C') ? get(campaign, 'keyTerms.minOfferingAmount506C') : '0.00';
    // campaignStatus.minOffering = get(campaign, 'keyTerms.regulation') === 'BD_CF_506C' ? money.add(minOfferingD, minOffering) : includes(['BD_506C', 'BD_506B'], offeringRegulation) ? minOfferingD : minOffering;
    campaignStatus.minOffering = includes(['BD_CF_506C', 'BD_506C', 'BD_506B'], offeringRegulation) ? minOfferingD : minOffering;
    const maxOffering = get(campaign, 'keyTerms.maxOfferingAmountCF') || 0;
    const maxOfferingD = get(campaign, 'keyTerms.maxOfferingAmount506') && get(campaign, 'keyTerms.maxOfferingAmount506') !== '0.00' ? get(campaign, 'keyTerms.maxOfferingAmount506') : get(campaign, 'keyTerms.maxOfferingAmount506C') ? get(campaign, 'keyTerms.maxOfferingAmount506C') : '0.00';
    // campaignStatus.maxOffering = get(campaign, 'keyTerms.regulation') === 'BD_CF_506C' ? money.add(maxOfferingD, maxOffering) : includes(['BD_506C', 'BD_506B'], offeringRegulation) ? maxOfferingD : maxOffering;
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
    campaignStatus.address = get(campaign, 'keyTerms.city') || get(campaign, 'keyTerms.state') ? `${get(campaign, 'keyTerms.city') || '-'}, ${get(campaign, 'keyTerms.state') || '-'}` : '--';
    campaignStatus.isClosed = get(campaign, 'stage') !== 'LIVE';
    campaignStatus.isCreation = get(campaign, 'stage') === 'CREATION';
    campaignStatus.earlyBird = get(campaign, 'earlyBird') || null;
    campaignStatus.bonusRewards = get(campaign, 'bonusRewards') || [];
    campaignStatus.isEarlyBirdRewards = campaignStatus.bonusRewards.filter(b => b.earlyBirdQuantity > 0).length;
    campaignStatus.isBonusReward = campaignStatus.bonusRewards && campaignStatus.bonusRewards.length;
    const elevatorPitch = (campaign && campaign.offering && campaign.offering.overview
      && campaign.offering.overview.elevatorPitch)
      || (campaign && campaign.offering && campaign.offering.overview
        && campaign.offering.overview.highlight);
    campaignStatus.hasTopThingToKnow = elevatorPitch;
    campaignStatus.dataRooms = this.dataRoomDocs.length;
    campaignStatus.gallary = get(campaign, 'media.gallery') ? get(campaign, 'media.gallery').length : 0;
    campaignStatus.keyTerms = get(campaign, 'keyTerms');
    campaignStatus.issuerStatement = get(campaign, 'keyTerms.offeringDisclaimer');
    campaignStatus.companyDescription = get(campaign, 'offering.about.theCompany');
    campaignStatus.businessModel = get(campaign, 'offering.about.businessModel');
    campaignStatus.localAnalysis = get(campaign, 'offering.about.locationAnalysis');
    campaignStatus.history = get(campaign, 'offering.about.history');
    campaignStatus.team = get(campaign, 'leadership');
    campaignStatus.useOfProcceds = get(campaign, 'legal.general.useOfProceeds.offeringExpenseAmountDescription');
    campaignStatus.revenueSharingSummary = get(campaign, 'keyTerms.revShareSummary');
    campaignStatus.updates = get(campaign, 'updates') && get(campaign, 'updates').length;
    campaignStatus.investmentHighlights = true;
    campaignStatus.isInvestedInOffering = get(campaign, 'isInvestedInOffering');
    campaignStatus.isRevenueShare = this.offerStructure === CAMPAIGN_KEYTERMS_SECURITIES_ENUM.REVENUE_SHARING_NOTE && campaignStatus.revenueSharingSummary;
    campaignStatus.isTermNote = this.offerStructure === CAMPAIGN_KEYTERMS_SECURITIES_ENUM.TERM_NOTE;
    campaignStatus.isFund = this.offerStructure === CAMPAIGN_KEYTERMS_SECURITIES_ENUM.FUNDS;
    campaignStatus.isRealEstate = this.offerStructure === CAMPAIGN_KEYTERMS_SECURITIES_ENUM.REAL_ESTATE;
    campaignStatus.isPreferredEquity = this.offerStructure === CAMPAIGN_KEYTERMS_SECURITIES_ENUM.PREFERRED_EQUITY_506C;
    campaignStatus.doneComputing = (get(this.details, 'data.getOfferingDetailsBySlug') && !isEmpty(this.details.data.getOfferingDetailsBySlug.keyTerms)) || false;
    return campaignStatus;
  }

  @computed get getOfferingId() {
    return (this.campaign && this.campaign.id);
  }

  @computed get getOfferingSlug() {
    return (this.campaign && this.campaign.offeringSlug);
  }

  @action
  isEarlyBirdExist(accountType, isAdmin = false) {
    const offeringId = this.getOfferingId;
    userDetailsStore.setFieldValue('currentActiveAccount', accountType);
    const accountDetails = userDetailsStore.currentActiveAccountDetailsOfSelectedUsers;
    const account = isAdmin ? accountDetails : userDetailsStore.currentActiveAccountDetails;
    const accountId = get(account, 'details.accountId') || null;
    if (offeringId && accountId) {
      this.earlyBirdCheck = graphql({
        client,
        query: checkIfEarlyBirdExist,
        variables: { offeringId, accountId },
      });
    }
  }

  @computed
  get earlyBirdRewards() {
    const currentCampagin = this.campaign;
    const rewards = get(currentCampagin, 'bonusRewards') || [];
    return filter(rewards, br => br.earlyBirdQuantity);
  }

  @computed get loading() {
    return this.allData.loading || this.details.loading;
  }

  @computed get completedLoading() {
    return this.completedOfferings.loading;
  }

  @action
  setInitialStateForReadMoreAndReadLess(updatesData) {
    if (updatesData.length) {
      this.selectedReadMore = updatesData.map(() => true);
      this.selectedReadLess = updatesData.map(() => true);
    }
  }

  @computed get curretnStatusForReadMore() {
    return this.selectedReadMore;
  }

  @computed get curretnStatusForReadLess() {
    return this.selectedReadLess;
  }

  @action
  handleReadMoreReadLess(index) {
    const newReadMoreStatus = [...this.selectedReadMore];
    newReadMoreStatus[index] = !this.selectedReadMore[index];
    this.selectedReadMore = newReadMoreStatus;

    const newReadLessStatus = [...this.selectedReadLess];
    newReadLessStatus[index] = !this.selectedReadLess[index];
    this.selectedReadLess = newReadLessStatus;
  }

  @computed get minInvestAmt() {
    return this.campaign && this.campaign.keyTerms ? this.campaign.keyTerms.minInvestAmt : null;
  }

  @computed get dataRoomDocs() {
    return this.campaign && this.campaign.legal && this.campaign.legal.dataroom
      && this.campaign.legal.dataroom.documents
      ? this.campaign.legal.dataroom.documents : [];
  }

  @action
  getAllBoxLinks = (accountType) => {
    this.docsWithBoxLink = [];
    this.dataRoomDocs.forEach(async (ele) => {
      const tempEle = { ...ele };
      if (get(ele, 'upload.fileHandle.boxFileId')) {
        tempEle.BoxUrl = await this.getBoxLink(get(ele, 'upload.fileHandle.boxFileId'), accountType);
        if (!filter(this.docsWithBoxLink, e => get(e, 'upload.fileId') === get(ele, 'upload.fileId')).length) {
          this.updateDocs(tempEle);
        }
      }
    });
  }

  @action
  updateDocs = ele => this.docsWithBoxLink.push(ele);

  getIndexValue = vale => this.campaign.legal.dataroom.documents
    && this.campaign.legal.dataroom.documents
      .findIndex(x => x.upload.fileId === vale);

  @computed get sortedDocswithBoxLink() {
    return this.docsWithBoxLink.sort((a, b) => (this.getIndexValue(a.upload.fileId) > this.getIndexValue(b.upload.fileId) ? 1 : -1));
  }

  @computed get commentsMainThreadCount() {
    const comments = get(this.campaign, 'comments') || [];
    const issuerId = this.campaign && this.campaign.issuerId;
    const filtered = comments.filter(c => ((c.createdUserInfo && c.createdUserInfo.id === issuerId
      && c.approved)
      || (c.createdUserInfo && c.createdUserInfo.id !== issuerId)) && c.scope === 'PUBLIC');
    return filtered;
  }

  getBoxLink = (fileId, accountType) => new Promise((resolve) => {
    this.setFieldValue('docLoading', true);
    clientPublic.mutate({
      mutation: getBoxEmbedLink,
      variables: { fileId, accountType },
    }).then((res) => {
      resolve(res.data.getBoxEmbedLink);
      this.setFieldValue('docLoading', false);
    }).catch(() => {
      this.setFieldValue('isFetchedError', true);
      this.setFieldValue('docLoading', false);
      Helper.toast('Something went wrong. Please try again in some time.', 'error');
    });
  });

  @computed get navCountData() {
    const res = { updates: 0, comments: 0 };
    let sum = 0;
    if (this.campaign) {
      const { updates, comments } = this.campaign;
      res.updates = updates && updates.length ? updates.length : 0;
      if (comments) {
        comments.map((c) => {
          if (c.scope === 'PUBLIC'
            && ((['admin', 'investor'].includes(get(c, 'createdUserInfo.roles[0].name')))
              || (get(c, 'createdUserInfo.roles[0].name') === 'issuer' && c.approved))) {
            const cnt = reduce(get(c, 'threadComments'), (tcSum, tc) => (tc.scope === 'PUBLIC' && ((['admin', 'investor'].includes(get(tc, 'createdUserInfo.roles[0].name'))) || (get(tc, 'createdUserInfo.roles[0].name') === 'issuer' && tc.approved)) ? (tcSum + 1) : tcSum), 0);
            sum = sum + 1 + (cnt || 0);
          }
          return null;
        });
      }
    }
    res.comments = sum;
    return res;
  }

  @computed get offerStructure() {
    return get(this.campaign, 'keyTerms.securities') || '';
  }

  @action
  calculateTotalPaymentData = (amt = 0) => {
    const ranges = [100, 500, 1000, 5000, 10000, 25000, 50000];
    this.principalAmt = ranges[amt];
    const data = {
      method: 'mortgage',
      apr: parseFloat(get(this.campaign, 'keyTerms.interestRate')) || 0,
      balance: this.principalAmt || 0,
      loanTerm: parseFloat(get(this.campaign, 'keyTerms.maturity')) || 0,
    };
    const { totalPayment, schedule } = Calculator.calculate(data);
    this.totalPayment = money.floatToAmount(totalPayment || '', 2);
    const payChart = [];
    let totalPaid = 0;
    if (schedule && Array.isArray(schedule)) {
      schedule.forEach((item, index) => {
        totalPaid = totalPaid + item.interest + item.principal;
        payChart.push({
          month: index + 1,
          'Projected total payment': parseFloat((totalPaid).toFixed(2)),
        });
      });
    }
    this.totalPaymentChart = payChart;
  }

  generateBanner = (offeringDetailsList, addObjectProps = false, isFromAdmin = false) => {
    let realEstateOfferingsArr = [];
    let closingOfferingsArr = [];
    let newOfferingsArr = [];
    let otherOfferingsArr = [];
    let reachedMaxOfferingsArr = [];
    let processingOfferingsArr = [];
    offeringDetailsList.map((offeringDetails) => {
      const offeringKeyTermDetails = get(offeringDetails, 'keyTerms');
      const minimumOfferingAmountCF = get(offeringKeyTermDetails, 'minOfferingAmountCF') || '0.00';
      const minimumOfferingAmountRegD = get(offeringKeyTermDetails, 'minOfferingAmount506') && get(offeringKeyTermDetails, 'minOfferingAmount506') !== '0.00' ? get(offeringKeyTermDetails, 'minOfferingAmount506') : get(offeringKeyTermDetails, 'minOfferingAmount506C') ? get(offeringKeyTermDetails, 'minOfferingAmount506C') : '0.00';
      const maxOfferingAmountCF = get(offeringKeyTermDetails, 'maxOfferingAmountCF') || '0.00';
      const maxOfferingAmountRegD = get(offeringKeyTermDetails, 'maxOfferingAmount506') && get(offeringKeyTermDetails, 'maxOfferingAmount506') !== '0.00' ? get(offeringKeyTermDetails, 'maxOfferingAmount506') : get(offeringKeyTermDetails, 'maxOfferingAmount506C') ? get(offeringKeyTermDetails, 'maxOfferingAmount506C') : '0.00';
      const regulation = get(offeringKeyTermDetails, 'regulation');
      const securities = get(offeringKeyTermDetails, 'securities');
      const minimumOfferingAmount = includes(['BD_CF_506C', 'BD_506C', 'BD_506B'], regulation) ? minimumOfferingAmountRegD : minimumOfferingAmountCF;
      const launchDate = get(offeringDetails, 'closureSummary.launchDate') && get(offeringDetails, 'closureSummary.launchDate') !== 'Invalid date' ? get(offeringDetails, 'closureSummary.launchDate') : null;
      const closingDate = get(offeringDetails, 'closureSummary.processingDate') && get(offeringDetails, 'closureSummary.processingDate') !== 'Invalid date' ? get(offeringDetails, 'closureSummary.processingDate') : null;
      const maxOfferingAmount = includes(['BD_CF_506C', 'BD_506C', 'BD_506B'], regulation) ? maxOfferingAmountRegD : maxOfferingAmountCF;
      const raisedAmount = get(offeringDetails, 'closureSummary.totalInvestmentAmount') ? money.floatToAmount(get(offeringDetails, 'closureSummary.totalInvestmentAmount')) : '0.00';
      const divResult = money.div(raisedAmount, minimumOfferingAmount);
      const percent = money.mul(divResult, '100.00');
      const offeringCustomOrder = get(offeringDetails, 'order');
      const resultObject = addObjectProps ? { ...offeringDetails } : {};
      const customAddinggDaysDateObj = {
        number: 7,
        format: 'days',
      };
      const launchDaysToRemainsForNewLable = DataFormatter.diffDaysForLauch(
        launchDate || null,
        false, true, true, customAddinggDaysDateObj,
      );
      /* const customAddingHoursDateObject = {
        number: 48,
        format: 'Hours',
      };
      const launchDaysToRemains = DataFormatter.diffDaysForLauch(
        launchDate || null,
        false, true, true, customAddingHoursDateObject,
      ); */
      const closeDaysToRemains = DataFormatter.diffDays(closingDate || null, false, true);
      const closeDaysToRemainsInHours = DataFormatter.getDateDifferenceInHoursOrMinutes(closingDate, true, true);
      const isInProcessing = closeDaysToRemainsInHours.value <= 0 && (!get(offeringDetails, 'closureSummary.hardCloseDate') || get(offeringDetails, 'closureSummary.hardCloseDate') === 'Invalid date');
      const percentageCompairResult = money.cmp(percent, '50.00').toString();
      const amountCompairResult = money.cmp(raisedAmount, maxOfferingAmount).toString();
      let isReachedMax = false;
      if (money.isZero(amountCompairResult) || !money.isNegative(amountCompairResult)) {
        isReachedMax = true;
      }
      if (securities === 'REAL_ESTATE' && !isInProcessing && !isReachedMax) {
        resultObject.isBannerShow = true;
        resultObject.datesBanner = 'Real Estate';
        resultObject.launchDate = moment(launchDate).unix() || null;
        resultObject.processingDate = moment(closingDate).unix() || null;
        resultObject.category = 'realEstate';
        return realEstateOfferingsArr.push(resultObject);
      } if (launchDate && (launchDaysToRemainsForNewLable < closeDaysToRemains
        || closeDaysToRemains === null)
        && launchDaysToRemainsForNewLable >= 0 && launchDaysToRemainsForNewLable <= 7) {
        resultObject.isBannerShow = true;
        resultObject.datesBanner = 'NEW';
        resultObject.amountsBanner = this.generateLabelBannerSecond(amountCompairResult, percentageCompairResult, percent, securities);
        resultObject.launchDate = moment(launchDate).unix() || null;
        resultObject.processingDate = moment(closingDate).unix() || null;
        resultObject.category = 'newOffering';
        return newOfferingsArr.push(resultObject);
      } if (closingDate && closeDaysToRemains >= 0 && closeDaysToRemains <= 7 && !isInProcessing) {
        const labelBannerFirst = ((includes(['Minute Left', 'Minutes Left'], closeDaysToRemainsInHours.label) && closeDaysToRemainsInHours.value > 0) || closeDaysToRemainsInHours.value <= 48) ? `${closeDaysToRemainsInHours.value} ${closeDaysToRemainsInHours.label}` : closeDaysToRemains === 1 ? `${closeDaysToRemains} Day Left` : `${closeDaysToRemains} Days Left`;
        resultObject.isBannerShow = !!labelBannerFirst;
        resultObject.datesBanner = labelBannerFirst;
        resultObject.amountsBanner = this.generateLabelBannerSecond(amountCompairResult, percentageCompairResult, percent, securities);
        resultObject.launchDate = moment(launchDate).unix() || null;
        resultObject.processingDate = moment(closingDate).unix() || null;
        resultObject.category = 'closingSoon';
        if (!isReachedMax) {
          return closingOfferingsArr.push(resultObject);
        }
      } if (isInProcessing) {
        resultObject.isBannerShow = true;
        resultObject.datesBanner = 'Processing';
        resultObject.launchDate = moment(launchDate).unix() || null;
        resultObject.processingDate = moment(closingDate).unix() || null;
        resultObject.category = 'processing';
        return processingOfferingsArr.push(resultObject);
      }
      // if (launchDate && (launchDaysToRemainsForNewLable < closeDaysToRemains
      //   || closeDaysToRemains === null)
      //   && launchDaysToRemainsForNewLable >= 0 && launchDaysToRemainsForNewLable <= 7) {
      //   resultObject.datesBanner = 'NEW';
      // }
      resultObject.amountsBanner = this.generateLabelBannerSecond(amountCompairResult, percentageCompairResult, percent, securities);
      resultObject.isBannerShow = !!(resultObject.datesBanner || resultObject.amountsBanner);
      resultObject.launchDate = moment(launchDate).unix() || null;
      resultObject.processingDate = moment(closingDate).unix() || null;
      if (money.isZero(amountCompairResult) || !money.isNegative(amountCompairResult)) {
        resultObject.category = 'reachedMax';
        return reachedMaxOfferingsArr.push(resultObject);
      }
      resultObject.order = offeringCustomOrder;
      resultObject.category = 'other';
      return otherOfferingsArr.push(resultObject);
    });
    newOfferingsArr = orderBy(newOfferingsArr, ['launchDate'], ['desc']);
    realEstateOfferingsArr = orderBy(realEstateOfferingsArr, ['launchDate'], ['desc']);
    closingOfferingsArr = orderBy(closingOfferingsArr, ['processingDate'], ['asc']);
    processingOfferingsArr = orderBy(processingOfferingsArr, ['processingDate'], ['desc']);
    otherOfferingsArr = orderBy(otherOfferingsArr, ['order'], ['asc']);
    reachedMaxOfferingsArr = orderBy(reachedMaxOfferingsArr, ['processingDate'], ['asc']);
    // const sortedResultObject = [];
    if (isFromAdmin) {
      const sortedResultObject = [
        { category: 'closingSoonAndNew', title: 'Real Estate, Closing Soon and New', offerings: [...realEstateOfferingsArr, ...closingOfferingsArr, ...newOfferingsArr] },
        { category: 'other', title: 'Current Offerings', offerings: [...otherOfferingsArr] },
        { category: 'reachedMaxAndProcessing', title: 'Reached Max and Processing', offerings: [...reachedMaxOfferingsArr, ...processingOfferingsArr] },
      ];
      return sortedResultObject;
    }
    const sortedResultObject = [
      ...realEstateOfferingsArr,
      ...closingOfferingsArr,
      ...newOfferingsArr,
      ...otherOfferingsArr,
      ...reachedMaxOfferingsArr,
      ...processingOfferingsArr,
    ];
    return sortedResultObject;
  }

  generateLabelBannerSecond = (amountCompairResult, percentageCompairResult, percent, offeringSecurity) => {
    let labelBannerSecond = null;
    if (money.isNegative(amountCompairResult)
      && !money.isZero(percentageCompairResult) && !money.isNegative(percentageCompairResult) && !['REAL_ESTATE'].includes(offeringSecurity)) {
      labelBannerSecond = `${Math.round(percent)}% Funded`;
    } else if (money.isZero(amountCompairResult) || !money.isNegative(amountCompairResult)) {
      labelBannerSecond = 'Reached Max';
    }
    return labelBannerSecond;
  }

  @action
  modifySubNavs = (navList, newLayout = false) => {
    const newNavList = [];
    const offeringStage = get(this.campaign, 'stage');
    navList.forEach((item) => {
      const tempItem = item;
      if (!newLayout) {
        let temNavList = item.subNavigations;
        if (has(item, 'subNavigations') && item.title === 'Investment Details') {
          const existanceResult = filter(temNavList, o => o.title === 'Revenue Sharing Summary' || o.title === 'Total Payment Calculator');
          if (this.offerStructure === CAMPAIGN_KEYTERMS_SECURITIES_ENUM.REVENUE_SHARING_NOTE) {
            if (existanceResult.length) {
              remove(temNavList, n => n.title === 'Revenue Sharing Summary' || n.title === 'Total Payment Calculator');
            }
            temNavList.push({
              title: 'Revenue Sharing Summary', to: '#revenue-sharing-summary', useRefLink: true, key: 'revenueSharingSummary',
            });
          } else if (this.offerStructure === CAMPAIGN_KEYTERMS_SECURITIES_ENUM.TERM_NOTE) {
            if (existanceResult.length) {
              remove(temNavList, n => n.title === 'Revenue Sharing Summary' || n.title === 'Total Payment Calculator');
            }
            temNavList.push({
              title: 'Total Payment Calculator', to: '#total-payment-calculator', useRefLink: true,
            });
          } else if (existanceResult.length) {
            remove(temNavList, n => n.title === 'Revenue Sharing Summary' || n.title === 'Total Payment Calculator');
          }
          tempItem.subNavigations = uniqWith(temNavList, isEqual);
        }
        if (tempItem.title === 'Summary' || tempItem.title === 'About the Company' || tempItem.title === 'Investment Details') {
          const arr = temNavList;
          if (arr && Array.isArray(arr)) {
            arr.forEach((i) => {
              if (i.key && !this.campaignStatus[i.key]) {
                temNavList = temNavList.filter(n => n.title !== i.title);
              }
            });
          }
        }
        if (temNavList && Array.isArray(temNavList)) {
          temNavList.forEach((i) => {
            if (i.key && !this.campaignStatus[i.key]) {
              temNavList = temNavList.filter(n => n.title !== i.title);
            }
          });
        }
        tempItem.subNavigations = temNavList;
        if (tempItem.to === 'data-room') {
          if (['CREATION', 'LIVE', 'LOCK', 'PROCESSING'].includes(offeringStage)) {
            newNavList.push(tempItem);
          }
        } else if (!temNavList || (temNavList && temNavList.length)) {
          newNavList.push(tempItem);
        }
      } else if (tempItem && tempItem.key && this.campaignStatus[tempItem.key]) {
        newNavList.push(tempItem);
      } else if (tempItem && !tempItem.key) {
        newNavList.push(tempItem);
      }
    });
    this.setFieldValue('campaignNavData', newNavList);
    return newNavList;
  }
}

export default new CampaignStore();
