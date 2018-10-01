import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import Report from './bonusrewards/Report';
import Creation from './bonusrewards/Creation';

@inject('offeringsStore')
@observer
export default class BonusRewards extends Component {
  render() {
    const { match, offeringsStore } = this.props;
    const { offer } = offeringsStore;
    return offer.stage === 'CREATION' ? <Creation match={match} /> : <Report />;
  }
}
