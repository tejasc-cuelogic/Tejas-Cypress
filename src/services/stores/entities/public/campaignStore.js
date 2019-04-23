import { toJS, observable, computed, action } from 'mobx';
import graphql from 'mobx-apollo';
import { pickBy, get, filter, orderBy } from 'lodash';
import money from 'money-math';
import { Calculator } from 'amortizejs';
import { GqlClient as clientPublic } from '../../../../api/publicApi';
import { GqlClient as client } from '../../../../api/gqlApi';
import { allOfferings, campaignDetailsQuery, getOfferingById, campaignDetailsForInvestmentQuery, getOfferingsReferral, checkIfEarlyBirdExist } from '../../queries/campagin';
import { STAGES } from '../../../constants/admin/offerings';
import { getBoxEmbedLink } from '../../queries/agreements';
import { userDetailsStore } from '../../index';
import uiStore from '../shared/uiStore';
import Helper from '../../../../helper/utility';

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

  @computed get allData() {
    return this.data;
  }

  @computed get getEarlyBirdCheck() {
    return this.earlyBirdCheck && this.earlyBirdCheck.data &&
    this.earlyBirdCheck.data.checkEarlyBirdByInvestorAccountAndOfferingId;
  }

  @computed get OfferingList() {
    return (this.allData.data && this.allData.data.getOfferingList &&
      toJS(this.allData.data.getOfferingList)) || [];
  }

  @computed get active() {
    const offeringList = this.activeList.slice();
    return offeringList.splice(0, this.activeToDisplay);
  }

  @computed get activeList() {
    const activeListArr = this.OfferingList.filter(o => Object.keys(pickBy(STAGES, s => s.publicRef === 'active')).includes(o.stage));
    return orderBy(activeListArr, o => get(o, 'keyTerms.shorthandBusinessName').toLowerCase(), ['desc']);
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
    const offeringsList = type === 'completedToDisplay' ? this.completedList : this.activeList;
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

  @computed get getOfferingId() {
    return (this.campaign && this.campaign.id);
  }

  @action
  isEarlyBirdExist(accountType) {
    const offeringId = this.getOfferingId;
    uiStore.setProgress();
    userDetailsStore.setFieldValue('currentActiveAccount', accountType);
    const account = userDetailsStore.currentActiveAccountDetails;
    const accountId = get(account, 'details.accountId') || null;
    this.earlyBirdCheck =
    graphql({
      client,
      query: checkIfEarlyBirdExist,
      variables: { offeringId, accountId },
      onFetch: (data) => {
        if (data && !this.earlyBirdCheck.loading) {
          uiStore.setProgress(false);
        }
      },
      onError: () => {
        uiStore.setProgress(false);
      },
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
        'Projected total payment': money.floatToAmount(totalPaid, 2),
      });
    });
    this.totalPaymentChart = payChart;
  }
}

export default new CampaignStore();
