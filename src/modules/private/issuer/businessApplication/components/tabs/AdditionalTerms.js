import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import HtmlEditor from '../../../../../shared/HtmlEditor';

@inject('businessAppReviewStore')
@observer
export default class AdditionalTerms extends Component {
  render() {
    const { selectedOfferIndex, fetchBusinessApplicationOffers } = this.props.businessAppReviewStore;
    return (
      <>
        <HtmlEditor
          readOnly
          content={(fetchBusinessApplicationOffers
            && fetchBusinessApplicationOffers.offers.offer[selectedOfferIndex]
            && fetchBusinessApplicationOffers.offers.offer[selectedOfferIndex].additionalTerms)}
        />
      </>
    );
  }
}
