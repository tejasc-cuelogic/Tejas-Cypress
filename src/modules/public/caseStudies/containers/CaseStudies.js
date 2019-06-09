import React, { Component } from 'react';
import Aux from 'react-aux';
import { Header, Divider } from 'semantic-ui-react';
import { GridListing } from '../../../../theme/shared';
import CStudyDetails from '../components/CStudyDetails';

class CaseStudies extends Component {
  caseStudies = [
    {
      title: 'Restaurant',
      description: 'A bar-style, fast casual restaurant bringing a unique and pot dining experience.',
    },
    {
      title: 'GastroLounge',
      description: 'GastroLounge and high end event space in up-and-coming East Downtown Houstan.',
    },
    {
      title: 'Chef Hall',
      description: 'Next evolution of the food hall. Bravery Chef Hall will feature 5 concepts.',
    },
    {
      title: 'BREW Pub',
      description: 'Houstan Bravery is launching new Buffbrew and over 40 beers on tap.',
    },
  ];

  render() {
    let pageContent = null;
    if (this.props.match.params.caseStudyId) {
      pageContent = <CStudyDetails offerId={this.props.match.params.offerId} />;
    } else {
      pageContent = <GridListing listItems={this.caseStudies} details="case-studies/details" />;
    }

    return (
      <Aux>
        <Header as="h1">
NextSeed Case Studies
          <Header.Subheader>Have a look at our Case Studies</Header.Subheader>
        </Header>
        <Divider inverted section />
        {pageContent}
      </Aux>
    );
  }
}

export default CaseStudies;
