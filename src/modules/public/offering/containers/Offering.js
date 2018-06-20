import React, { Component } from 'react';
import Aux from 'react-aux';
import { Header, Divider } from 'semantic-ui-react';
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
      <Aux>
        <Header as="h1">NextSeed Offerings
          <Header.Subheader>Invest in growing local businesses</Header.Subheader>
        </Header>
        <Divider inverted section />
        {pageContent}
      </Aux>
    );
  }
}

export default Offering;
