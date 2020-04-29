import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { inject } from 'mobx-react';
import { Grid, Container, Button, Header } from 'semantic-ui-react';
import NSImage from '../../../shared/NSImage';

const CollectionItem = ({ isMobile, isTablet, responsiveVars, collections }) => (
  <>
    <Container>
      <section key={collections.id} className={`${responsiveVars.uptoTablet ? 'pt-50 pb-50' : 'pt-100 pb-100'} bg-offwhite`}>
        <Header as="h2" textAlign={responsiveVars.isMobile ? '' : 'center'} caption className={responsiveVars.isMobile ? 'mb-20' : 'mb-30'}>
          Collections
        </Header>
        <p className={responsiveVars.isMobile ? 'mb-40' : 'center-align mb-80'}>
          Browse investment opportunities by Collection - featuring exclusive deals from official NextSeed{!responsiveVars.isMobile && <br /> } Partner
          Organizations, as well as offerings grouped by theme, such as location or security type.
        </p>
        {
          collections.map(items => (
            <Grid>
              <Grid.Column widescreen={4} computer={4} tablet={16} mobile={16}>
                <NSImage path={items.image} />
              </Grid.Column>
              <Grid.Column widescreen={11} computer={11} tablet={16} mobile={16}>
                <Header as="h3">{items.title}</Header>
                <p className="mb-30">{items.description}</p>
                {items.link && !isMobile && !isTablet
                  && (
                  <a href={items.link} target="_blank" rel="noopener noreferrer"><Button inverted color="green" className="mb-30">Explore</Button></a>
                  )
                }
              </Grid.Column>
            </Grid>
          ))
        }
          <div className="mt-50 center-align">
            <Button fluid={responsiveVars.isMobile} color="green" inverted content="View All Collections" />
          </div>
      </section>
    </Container>
  </>
);
@withRouter
@inject('uiStore')
export default class CollectionsList extends Component {
  render() {
    const { responsiveVars } = this.props.uiStore;
    const { isMobile, isTablet } = responsiveVars;
    const collectionsList = [
      {
        id: 1,
        title: 'Nextseed Securities',
        description: <>NextSeed Securities is our forward-thinking investment banking practice, which sources exclusive alternative investment offerings for our investment platform. Our proprietary platform manages everything from deal-sourcing and underwriting to investor account management and automatic payment processing.</>,
        image: 'group/ns-securities.jpg',
        link: 'https://www.nextseed.com',
        background: 'image',
      }, {
        id: 2,
        title: 'Nextseed Capital',
        description: <>We seek to invest in impactful and traditionally underserved enterprises such as women- and minority-owned businesses and veteran-run management teams. Our inaugural fund aspires to serve the capital needs of small businesses recovering from the COVID-19 recession.</>,
        image: 'group/ns-capital.jpg',
        link: 'https://collaboration.capital',
        background: 'color',
      }, {
        id: 3,
        title: 'Collaboration Capital',
        description: <>Forward-looking clients receive a custom-tailored ESG/impact-oriented portfolio across public and private securities that both reflects their values and priorities and whose return objective and risk profile approximates that of traditional benchmarks.</>,
        image: 'group/collab-capital.jpg',
        link: 'https://collaboration.capital',
        background: 'color',
      }, {
        id: 4,
        title: 'Collaboration Assets Management',
        description: <>Our experienced investment team aggregates selected securities across asset classes through a disciplined portfolio construction methodology that combines both fundamental and quantitative securities analysis.</>,
        image: 'group/collab-assets.jpg',
        link: 'https://am.collaboration.capital',
        background: 'someDefaultValue',
      },
    ];
    return (
      <>
        <CollectionItem collections={collectionsList} isMobile={isMobile} isTablet={isTablet} responsiveVars={responsiveVars} />
      </>
    );
  }
}
