import React, { Component } from 'react';
import GridListing from '../../../../theme/ui/GridListing';
import OfferDetails from '../components/OfferDetails';

class Offering extends Component {
  offerings = [
    {
      title: 'Restaurant',
      description: 'A bar-style, fast casual restaurant bringing a unique and pot dining experience.',
    },
    {
      title: 'Chef Hall',
      description: 'Next evolution of the food hall. Bravery Chef Hall will feature 5 concepts.',
    },
    {
      title: 'BREW Pub',
      description: 'Houstan Bravery is launching new Buffbrew and over 40 beers on tap.',
    },
    {
      title: 'GastroLounge',
      description: 'GastroLounge and high end event space in up-and-coming East Downtown Houstan.',
    },
  ];

  render() {
    let pageContent = null;
    if (this.props.match.params.offerId) {
      pageContent = <OfferDetails offerId={this.props.match.params.offerId} />;
    } else {
      pageContent = <GridListing listItems={this.offerings} details="offerings/details" />;
    }

    return (
      <div className="ui vertical segment content">
        <div className="ui container">
          <div className="ui one column grid">
            <div
              className="column nsContent"
              style={{
                fontSize: '30px',
                color: '#666',
                textAlign: 'center',
                // top: '25px',
              }}
            >
              <span className="title">NextSeed Offerings</span>
              <span className="infotext">Invest in growing local businesses</span>
              {pageContent}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Offering;
