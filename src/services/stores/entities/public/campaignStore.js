import { toJS, observable, computed, action } from 'mobx';
import graphql from 'mobx-apollo';
import { pickBy, reduce, get } from 'lodash';
import money from 'money-math';
import { Calculator } from 'amortizejs';
import { GqlClient as clientPublic } from '../../../../api/publicApi';
import { allOfferings, campaignDetailsQuery, getOfferingById, campaignDetailsForInvestmentQuery, getOfferingsReferral } from '../../queries/campagin';
import { STAGES } from '../../../constants/admin/offerings';
import { getBoxEmbedLink } from '../../queries/agreements';

export class CampaignStore {
  @observable data = [];
  @observable details = {};
  @observable option = false;
  @observable campaignSideBarShow = false;
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
            if (data) {
              const offering = data.getOfferingList.length && data.getOfferingList[0];
              resolve(offering);
            }
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
        if (data) {
          resolve(data.getOfferingDetailsBySlug);
        }
      },
      fetchPolicy: 'network-only',
    });
  });

  @computed get allData() {
    return this.data;
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
    return this.OfferingList.filter(o => Object.keys(pickBy(STAGES, s => s.publicRef === 'active')).includes(o.stage));
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
      tempEle.BoxUrl = await this.getBoxLink(get(ele, 'upload.fileHandle.boxFileId'), accountType);
      this.updateDocs(tempEle);
    });
  }

  @action
  updateDocs = ele => this.docsWithBoxLink.push(ele);

  getBoxLink = (fileId, accountType) => new Promise((resolve) => {
    clientPublic.mutate({
      mutation: getBoxEmbedLink,
      variables: { fileId, accountType },
    }).then((res) => {
      resolve(res.data.getBoxEmbedLink);
    });
  });
  @computed get navCountData() {
    const res = { updates: 0, comments: 0 };
    if (this.campaign) {
      const { updates, comments } = this.campaign;
      res.updates = updates && updates.length ? updates.length : 0;
      // eslint-disable-next-line arrow-body-style
      res.comments = reduce(comments, (sum, c) => {
        console.log('name', get(c, 'createdUserInfo.roles[0].name'));
        return (c.scope === 'PUBLIC' && ((get(c, 'createdUserInfo.roles[0].name') === 'admin' || get(c, 'createdUserInfo.roles[0].name') === 'investor') || (get(c, 'createdUserInfo.roles[0].name') === 'issuer' && c.approved)) ? (sum + 1) : sum);
      }, 0);
    }
    return res;
  }

  @computed get offerStructure() {
    const { selectedOffer, keyTerms } = this.campaign;
    let offerStructure = '';
    if (selectedOffer && selectedOffer.structure !== '') {
      offerStructure = selectedOffer.structure;
    } else {
      offerStructure = keyTerms.securities;
    }
    return offerStructure;
  }

  @action
  calculateTotalPaymentData = (amt = null) => {
    this.principalAmt = amt !== null ? amt : get(this.campaign, 'keyTerms.minOfferingAmount');
    const data = {
      method: 'mortgage',
      apr: parseFloat(get(this.campaign, 'keyTerms.interestRate')) || 0,
      balance: this.principalAmt || 0,
      loanTerm: parseFloat(get(this.campaign, 'keyTerms.maturity')) || 0,
    };
    const { totalPayment, schedule } = Calculator.calculate(data);
    this.totalPayment = money.floatToAmount(totalPayment, 2);
    const payChart = [];
    schedule.forEach((item, index) => {
      payChart.push({
        month: index + 1,
        'Projected total payment': money.floatToAmount(totalPayment - item.remainingBalance, 2),
      });
    });
    this.totalPaymentChart = payChart;
    console.log('data is ->', schedule);
  }
}

export default new CampaignStore();
