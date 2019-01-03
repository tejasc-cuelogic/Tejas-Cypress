import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import Parser from 'html-react-parser';
import Aux from 'react-aux';

@inject('businessAppReviewStore')
@observer
export default class AdditionalTerms extends Component {
  render() {
    const { selectedOfferIndex, fetchBusinessApplicationOffers } =
    this.props.businessAppReviewStore;
    return (
      <Aux>
        {Parser(fetchBusinessApplicationOffers &&
        fetchBusinessApplicationOffers.offers.offer[selectedOfferIndex] &&
        fetchBusinessApplicationOffers.offers.offer[selectedOfferIndex].additionalTerms)}
      </Aux>
    );
  }
}

