import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import Aux from 'react-aux';
import HtmlEditor from '../../../../../shared/HtmlEditor';

@inject('businessAppReviewStore')
@observer
export default class AdditionalTerms extends Component {
  render() {
    const { selectedOfferIndex, fetchBusinessApplicationOffers } =
    this.props.businessAppReviewStore;
    return (
      <Aux>
        <HtmlEditor
          readOnly
          content={(fetchBusinessApplicationOffers &&
            fetchBusinessApplicationOffers.offers.offer[selectedOfferIndex] &&
            fetchBusinessApplicationOffers.offers.offer[selectedOfferIndex].additionalTerms)}
        />
      </Aux>
    );
  }
}

