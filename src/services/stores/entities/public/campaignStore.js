import { toJS, observable, computed, action } from 'mobx';
import graphql from 'mobx-apollo';
import { pickBy, get, filter, orderBy } from 'lodash';
import money from 'money-math';
import moment from 'moment';
import { Calculator } from 'amortizejs';
import { GqlClient as clientPublic } from '../../../../api/publicApi';
import { GqlClient as client } from '../../../../api/gqlApi';
import { allOfferings, campaignDetailsQuery, getOfferingById, isValidInvestorInOffering, campaignDetailsForInvestmentQuery, getOfferingsReferral, checkIfEarlyBirdExist } from '../../queries/campagin';
import { STAGES } from '../../../constants/admin/offerings';
import { getBoxEmbedLink } from '../../queries/agreements';
import { userDetailsStore } from '../../index';
// import uiStore from '../shared/uiStore';
import Helper from '../../../../helper/utility';
import { DataFormatter } from '../../../../helper';

export class CampaignStore {
  @observable data = [];
  @observable details = {};
  @observable option = false;
  @observable campaignSideBarShow = true;
  @observable selectedReadMore = {};
  @observable selectedReadLess = {};
  @observable RECORDS_TO_DISPLAY = 12;
  @observable completedToDisplay = this.RECORDS_TO_DISPLAY;
  @observable activeToDisplay = this.RECORDS_TO_DISPLAY;
  @observable gallarySelectedImageIndex = null;
  @observable docsWithBoxLink = [];
  @observable investmentDetailsSubNavs = [];
  @observable totalPayment = 0;
  @observable principalAmt = 0;
  @observable totalPaymentChart = [];
  @observable showFireworkAnimation = false;
  @observable earlyBirdCheck = null;
  @observable isInvestBtnClicked = false;
  @observable isFetchedError = false;


  @action
  setFieldValue = (field, val) => {
    this[field] = val;
  }

  @action
  initRequest = (publicRef, referralCode = false) => {
    const stage = Object.keys(pickBy(STAGES, s => publicRef.includes(s.publicRef)));
    const filters = { stage };
    if (referralCode) {
      filters.referralCode = referralCode;
    }
    return new Promise((resolve) => {
      this.data =
        graphql({
          client: clientPublic,
          query: referralCode ? getOfferingsReferral : allOfferings,
          variables: { filters },
          onFetch: (data) => {
            if (data && !this.data.loading) {
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
  getCampaignDetails = (id, queryType) => {
    this.details = graphql({
      client: clientPublic,
      query: queryType ? campaignDetailsForInvestmentQuery : campaignDetailsQuery,
      variables: { id },
      fetchPolicy: 'network-only',
    });
  }

  @action
  getIssuerIdForOffering = id => new Promise((resolve) => {
    this.details = graphql({
      client: clientPublic,
      query: getOfferingById,
      variables: { id },
      onFetch: (data) => {
        if (data && !this.details.loading) {
          resolve(data.getOfferingDetailsBySlug);
        }
      },
      fetchPolicy: 'network-only',
    });
  });

  @action
  isValidInvestorInOffering = params => new Promise((resolve) => {
    const response = graphql({
      client,
      query: isValidInvestorInOffering,
      variables: { ...params },
      onFetch: (data) => {
        if (data && !response.loading) {
          resolve(data.isValidInvestorInOffering);
        }
      },
      fetchPolicy: 'network-only',
    });
  });

  @computed get allData() {
    return this.data;
  }

  @computed get getEarlyBirdCheck() {
    return this.earlyBirdCheck && this.earlyBirdCheck.data &&
      this.earlyBirdCheck.data.checkEarlyBirdByInvestorAccountAndOfferingId;
  }

  @computed get earlyBirdLoading() {
    return this.earlyBirdCheck && this.earlyBirdCheck.loading;
  }

  @computed get OfferingList() {
    return (this.allData.data && this.allData.data.getOfferingList &&
      toJS(this.allData.data.getOfferingList)) || [];
  }

  @computed get active() {
    const offeringList = this.orderedActiveList.slice();
    return offeringList.splice(0, this.activeToDisplay);
  }

  @computed get activeList() {
    const activeListArr = this.OfferingList.filter(o => Object.keys(pickBy(STAGES, s => s.publicRef === 'active')).includes(o.stage));
    return orderBy(activeListArr, o => (get(o, 'keyTerms.shorthandBusinessName') ? get(o, 'keyTerms.shorthandBusinessName').toLowerCase() : get(o, 'keyTerms.shorthandBusinessName')), ['asc']);
  }

  @computed get orderedActiveList() {
    const activeListArr = this.OfferingList.filter(o => Object.keys(pickBy(STAGES, s => s.publicRef === 'active')).includes(o.stage));
    const orderedActiveListArr = this.generateBanner(activeListArr, true);
    return orderedActiveListArr;
  }

  @computed get completed() {
    const offeringList = this.completedList.slice();
    return offeringList.splice(0, this.completedToDisplay);
  }
  @computed get completedList() {
    return this.OfferingList.filter(o => Object.keys(pickBy(STAGES, s => s.publicRef === 'completed')).includes(o.stage));
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
    if (this.details.data && this.details.data.getOfferingDetailsBySlug &&
      this.details.data.getOfferingDetailsBySlug[0]) {
      return toJS(this.details.data.getOfferingDetailsBySlug[0]);
    } else if (this.details.data && this.details.data.getOfferingDetailsById) {
      return toJS(this.details.data.getOfferingDetailsById);
    }
    return {};
  }

  @computed get campaignStatus() {
    const { campaign } = this;
    const campaignStatus = {};
    const closingDate = get(campaign, 'closureSummary.processingDate') && get(campaign, 'closureSummary.processingDate') !== 'Invalid date' ? get(campaign, 'closureSummary.processingDate') : null;
    campaignStatus.diff = DataFormatter.diffDays(closingDate || null, false, true);
    campaignStatus.diffForProcessing = DataFormatter.diffDays(closingDate || null, false, true);
    campaignStatus.isInProcessing = campaignStatus.diffForProcessing <= 0 && (!get(campaign, 'closureSummary.hardCloseDate') || get(campaign, 'closureSummary.hardCloseDate') === 'Invalid date');
    campaignStatus.collected = get(campaign, 'closureSummary.totalInvestmentAmount') || 0;
    const minOffering = get(campaign, 'keyTerms.minOfferingAmountCF') || 0;
    campaignStatus.minOffering = get(campaign, 'keyTerms.regulation') === 'BD_CF_506C' ? money.add(get(campaign, 'keyTerms.minOfferingAmount506C'), minOffering) : minOffering;
    const maxOffering = get(campaign, 'keyTerms.maxOfferingAmountCF') || 0;
    campaignStatus.maxOffering = get(campaign, 'keyTerms.regulation') === 'BD_CF_506C' ? money.add(get(campaign, 'keyTerms.maxOfferingAmount506C'), maxOffering) : maxOffering;
    campaignStatus.minFlagStatus = campaignStatus.collected >= campaignStatus.minOffering;
    campaignStatus.percentBefore = (campaignStatus.minOffering / campaignStatus.maxOffering) * 100;
    const formatedRaisedAmount = money.floatToAmount(campaignStatus.collected);
    // const formatedMaxOfferingAmount = money.floatToAmount(maxOffering);
    const formatedMaxOfferingAmount = money.floatToAmount(campaignStatus.maxOffering);
    const maxReachedCompairedAmount = money.cmp(formatedRaisedAmount, formatedMaxOfferingAmount);
    const formatedReachedMaxCompairAmountValue = money.floatToAmount(maxReachedCompairedAmount);
    const minMaxOffering = campaignStatus.minFlagStatus ?
      campaignStatus.maxOffering : campaignStatus.minOffering;
    campaignStatus.maxFlagStatus = !!(money.isZero(formatedReachedMaxCompairAmountValue) ||
      money.isPositive(formatedReachedMaxCompairAmountValue));
    campaignStatus.percent = (campaignStatus.collected / minMaxOffering) * 100;
    campaignStatus.address = get(campaign, 'keyTerms.city') || get(campaign, 'keyTerms.state') ? `${get(campaign, 'keyTerms.city') || '-'}, ${get(campaign, 'keyTerms.state') || '-'}` : '--';
    campaignStatus.isClosed = get(campaign, 'stage') !== 'LIVE';
    campaignStatus.isCreation = get(campaign, 'stage') === 'CREATION';
    campaignStatus.earlyBird = get(campaign, 'earlyBird') || null;
    campaignStatus.bonusRewards = get(campaign, 'bonusRewards') || [];
    campaignStatus.isEarlyBirdRewards =
      campaignStatus.bonusRewards.filter(b => b.earlyBirdQuantity > 0).length;
    campaignStatus.isBonusReward =
      campaignStatus.bonusRewards && campaignStatus.bonusRewards.length;
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
    // uiStore.setProgress();
    userDetailsStore.setFieldValue('currentActiveAccount', accountType);
    const accountDetails = userDetailsStore.currentActiveAccountDetailsOfSelectedUsers;
    const account = isAdmin ? accountDetails : userDetailsStore.currentActiveAccountDetails;
    const accountId = get(account, 'details.accountId') || null;
    this.earlyBirdCheck =
      graphql({
        client,
        query: checkIfEarlyBirdExist,
        variables: { offeringId, accountId },
        // onFetch: (data) => {
        //   if (data && !this.earlyBirdCheck.loading) {
        //     uiStore.setProgress(false);
        //   }
        // },
        // onError: (err) => {
        //   console.log(err);
        //   uiStore.setProgress(false);
        // },
      });
  }

  @computed
  get earlyBirdRewards() {
    const currentCampagin = this.campaign;
    const rewards = get(currentCampagin, 'bonusRewards') || [];
    return filter(rewards, br => br.earlyBirdQuantity);
  }

  @computed get loading() {
    return this.allData.loading;
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
      && this.campaign.legal.dataroom.documents ?
      this.campaign.legal.dataroom.documents : [];
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
    return this.docsWithBoxLink.sort((a, b) =>
      (this.getIndexValue(a.upload.fileId) > this.getIndexValue(b.upload.fileId) ? 1 : -1));
  }
  @computed get commentsMainThreadCount() {
    const comments = get(this.campaign, 'comments') || [];
    const issuerId = this.campaign && this.campaign.issuerId;
    const filtered = comments.filter(c => ((c.createdUserInfo && c.createdUserInfo.id === issuerId
      && c.approved) ||
      (c.createdUserInfo && c.createdUserInfo.id !== issuerId)) && c.scope === 'PUBLIC');
    return filtered.length;
  }
  getBoxLink = (fileId, accountType) => new Promise((resolve) => {
    clientPublic.mutate({
      mutation: getBoxEmbedLink,
      variables: { fileId, accountType },
    }).then((res) => {
      resolve(res.data.getBoxEmbedLink);
    }).catch(() => { this.setFieldValue('isFetchedError', true); Helper.toast('Something went wrong. Please try again in some time.', 'error'); });
  });
  @computed get navCountData() {
    const res = { updates: 0, comments: 0 };
    let sum = 0;
    if (this.campaign) {
      const { updates, comments } = this.campaign;
      res.updates = updates && updates.length ? updates.length : 0;
      // eslint-disable-next-line arrow-body-style
      if (comments) {
        comments.map((c) => {
          if (c.scope === 'PUBLIC' &&
            ((get(c, 'createdUserInfo.roles[0].name') === 'admin' || get(c, 'createdUserInfo.roles[0].name') === 'investor') ||
              (get(c, 'createdUserInfo.roles[0].name') === 'issuer' && c.approved))) {
            sum = sum + 1 + (get(c, 'threadComment.length') || 0);
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
    schedule.forEach((item, index) => {
      totalPaid = totalPaid + item.interest + item.principal;
      payChart.push({
        month: index + 1,
        'Projected total payment': parseFloat((totalPaid).toFixed(2)),
      });
    });
    this.totalPaymentChart = payChart;
  }

  generateBanner = (offeringDetailsList, addObjectProps = false) => {
    let parallelOfferingsArr = [];
    let newOfferingsArr = [];
    let closingOfferingsArr = [];
    let processingOfferingsArr = [];
    let reachedMaxOfferingsArr = [];
    let otherOfferingsArr = [];
    offeringDetailsList.map((offeringDetails) => {
      const offeringKeyTermDetails = get(offeringDetails, 'keyTerms');
      const minimumOfferingAmountCF = get(offeringKeyTermDetails, 'minOfferingAmountCF') || '0.00';
      const minimumOfferingAmountRegD = get(offeringKeyTermDetails, 'minOfferingAmount506C') || '0.00';
      const maxOfferingAmountCF = get(offeringKeyTermDetails, 'maxOfferingAmountCF') || '0.00';
      const maxOfferingAmountRegD = get(offeringKeyTermDetails, 'maxOfferingAmount506C') || '0.00';
      const regulation = get(offeringKeyTermDetails, 'regulation');
      const minimumOfferingAmount = regulation === 'BD_CF_506C' ? money.add(minimumOfferingAmountCF, minimumOfferingAmountRegD) : regulation === 'BD_506C' ? minimumOfferingAmountRegD : minimumOfferingAmountCF;
      const launchDate = get(offeringDetails, 'closureSummary.launchDate') && get(offeringDetails, 'closureSummary.launchDate') !== 'Invalid date' ? get(offeringDetails, 'closureSummary.launchDate') : null;
      const closingDate = get(offeringDetails, 'closureSummary.processingDate') && get(offeringDetails, 'closureSummary.processingDate') !== 'Invalid date' ? get(offeringDetails, 'closureSummary.processingDate') : null;
      // const maxOfferingAmount = get(offeringKeyTermDetails, 'maxOfferingAmountCF') || '0.00';
      const maxOfferingAmount = regulation === 'BD_CF_506C' ? money.add(maxOfferingAmountCF, maxOfferingAmountRegD) : regulation === 'BD_506C' ? maxOfferingAmountRegD : maxOfferingAmountCF;
      const raisedAmount = get(offeringDetails, 'closureSummary.totalInvestmentAmount') ? money.floatToAmount(get(offeringDetails, 'closureSummary.totalInvestmentAmount')) : '0.00';
      const divResult = money.div(raisedAmount, minimumOfferingAmount);
      const percent = money.mul(divResult, '100.00');
      const resultObject = addObjectProps ? { ...offeringDetails } : {};
      const customAddinggDaysDateObj = {
        number: 7,
        format: 'days',
      };
      const launchDaysToRemainsForNewLable =
        DataFormatter.diffDaysForLauch(
          launchDate || null,
          false, true, true, customAddinggDaysDateObj,
        );
      const customAddingHoursDateObject = {
        number: 48,
        format: 'Hours',
      };
      const launchDaysToRemains =
        DataFormatter.diffDaysForLauch(
          launchDate || null,
          false, true, true, customAddingHoursDateObject,
        );
      const closeDaysToRemains = DataFormatter.diffDays(closingDate || null, false, true);
      const isInProcessing = closeDaysToRemains <= 0 && (!get(offeringDetails, 'closureSummary.hardCloseDate') || get(offeringDetails, 'closureSummary.hardCloseDate') === 'Invalid date');
      const percentageCompairResult = money.cmp(percent, '50.00').toString();
      const amountCompairResult = money.cmp(raisedAmount, maxOfferingAmount).toString();
      if (regulation === 'BD_CF_506C' && !isInProcessing) {
        if (launchDate && (launchDaysToRemainsForNewLable < closeDaysToRemains ||
          closeDaysToRemains === null) &&
          launchDaysToRemainsForNewLable >= 0 && launchDaysToRemainsForNewLable <= 7) {
          resultObject.isBannerShow = true;
          resultObject.bannerFirstText = 'NEW';
        }
        resultObject.bannerSecondText =
          this.generateLabelBannerSecond(amountCompairResult, percentageCompairResult, percent);
        resultObject.launchDate = moment(launchDate).unix() || null;
        resultObject.processingDate = moment(closingDate).unix() || null;
        return parallelOfferingsArr.push(resultObject);
      } else if (launchDate && (launchDaysToRemains < closeDaysToRemains ||
        closeDaysToRemains === null) &&
        launchDaysToRemains >= 0 && launchDaysToRemains <= 2) {
        resultObject.isBannerShow = true;
        resultObject.bannerFirstText = 'NEW';
        resultObject.bannerSecondText =
          this.generateLabelBannerSecond(amountCompairResult, percentageCompairResult, percent);
        resultObject.launchDate = moment(launchDate).unix() || null;
        resultObject.processingDate = moment(closingDate).unix() || null;
        return newOfferingsArr.push(resultObject);
      } else if (closingDate && closeDaysToRemains >= 0 && closeDaysToRemains <= 7) {
        const labelBannerFirst = closeDaysToRemains !== 0 ? `${closeDaysToRemains} ${closeDaysToRemains === 1 ? 'Day' : 'Days'} Left` : 'Processing';
        resultObject.isBannerShow = !!labelBannerFirst;
        resultObject.bannerFirstText = labelBannerFirst;
        resultObject.bannerSecondText =
          this.generateLabelBannerSecond(amountCompairResult, percentageCompairResult, percent);
        resultObject.launchDate = moment(launchDate).unix() || null;
        resultObject.processingDate = moment(closingDate).unix() || null;
        return closingOfferingsArr.push(resultObject);
      } else if (isInProcessing) {
        resultObject.isBannerShow = true;
        resultObject.bannerFirstText = 'Processing';
        // resultObject.bannerSecondText =
        //   this.generateLabelBannerSecond(amountCompairResult, percentageCompairResult, percent);
        resultObject.launchDate = moment(launchDate).unix() || null;
        resultObject.processingDate = moment(closingDate).unix() || null;
        return processingOfferingsArr.push(resultObject);
      }
      if (launchDate && (launchDaysToRemainsForNewLable < closeDaysToRemains ||
        closeDaysToRemains === null) &&
        launchDaysToRemainsForNewLable >= 0 && launchDaysToRemainsForNewLable <= 7) {
        resultObject.bannerFirstText = 'NEW';
      }
      resultObject.bannerSecondText =
        this.generateLabelBannerSecond(amountCompairResult, percentageCompairResult, percent);
      resultObject.isBannerShow = !!(resultObject.bannerFirstText || resultObject.bannerSecondText);
      resultObject.launchDate = moment(launchDate).unix() || null;
      resultObject.processingDate = moment(closingDate).unix() || null;
      if (money.isZero(amountCompairResult) || !money.isNegative(amountCompairResult)) {
        return reachedMaxOfferingsArr.push(resultObject);
      }
      return otherOfferingsArr.push(resultObject);
    });
    parallelOfferingsArr = orderBy(parallelOfferingsArr, ['launchDate'], ['desc']);
    newOfferingsArr = orderBy(newOfferingsArr, ['launchDate'], ['desc']);
    closingOfferingsArr = orderBy(closingOfferingsArr, ['processingDate'], ['asc']);
    processingOfferingsArr = orderBy(processingOfferingsArr, ['processingDate'], ['desc']);
    otherOfferingsArr = orderBy(otherOfferingsArr, ['launchDate'], ['desc']);
    reachedMaxOfferingsArr = orderBy(reachedMaxOfferingsArr, ['processingDate'], ['desc']);
    const sortedResultObject = [
      ...parallelOfferingsArr,
      ...newOfferingsArr,
      ...closingOfferingsArr,
      ...otherOfferingsArr,
      ...reachedMaxOfferingsArr,
      ...processingOfferingsArr,
    ];
    return sortedResultObject;
  }
  generateLabelBannerSecond = (amountCompairResult, percentageCompairResult, percent) => {
    let labelBannerSecond = null;
    if (money.isNegative(amountCompairResult) &&
      !money.isZero(percentageCompairResult) && !money.isNegative(percentageCompairResult)) {
      labelBannerSecond = `${Math.round(percent)}% Funded`;
    } else if (money.isZero(amountCompairResult) || !money.isNegative(amountCompairResult)) {
      labelBannerSecond = 'Reached Max';
    }
    return labelBannerSecond;
  }
}

export default new CampaignStore();
