import { observable, action } from 'mobx';

export class OfferingsStore {
  @observable offerings = [];
  @observable selectedOffering = null;
  @observable isLoadingOffering = false;
  mockOfferings = [{
    id: 1,
    title: 'Pitch 25',
    details: '1.50x return by 48 mos',
  },
  {
    id: 2,
    title: 'Pokéology',
    details: '13.25% APR for 48 mos',
  },
  {
    id: 3,
    title: 'Leela\'s & abv',
    details: '13.25% APR for 48 mos',
  }];

  @action
  loadOfferings() {
    this.offerings = this.mockOfferings;
  }

  @action
  selectOffering(id) {
    this.isLoadingProfile = true;
    this.selectedOffering = this.mockOfferings.find(offering => offering.id === parseInt(id, 10));
    this.isLoadingProfile = false;
  }
}

export default new OfferingsStore();
