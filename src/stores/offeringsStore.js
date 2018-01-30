import { observable, action } from 'mobx';

import uiStore from './uiStore';

export class OfferingsStore {
  @observable offerings = [];
  @observable selectedOffering = null;
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
    uiStore.setProgress(true);
    this.selectedOffering = this.mockOfferings.find(offering => offering.id === parseInt(id, 10));
    uiStore.setProgress(false);
  }
}

export default new OfferingsStore();
