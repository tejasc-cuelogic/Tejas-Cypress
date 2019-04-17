import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import Report from './bonusrewards/Report';
import Creation from './bonusrewards/Creation';

@inject('offeringsStore', 'userStore')
@observer
export default class BonusRewards extends Component {
  render() {
    const currentPhase = false;
    /*
    currentPhase is the temp constant, used to prevent rendering of <Report /> component.
    And it will be removed in next launch.
    */
    const { isIssuer } = this.props.userStore;
    const { match, offeringsStore } = this.props;
    const { offer } = offeringsStore;
    if (currentPhase) {
      return (offer.stage === 'CREATION' || isIssuer ||
      (offer.stage === 'LIVE' && `${match.url.split('/').slice(-2)[0]}/${match.url.split('/').pop()}` === 'offering-creation/bonus-rewards')) ? <Creation match={match} /> : <Report />;
    }
    return (<Creation match={match} />);
  }
}
