import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { inject } from 'mobx-react';
import { Grid, Container, Button, Header } from 'semantic-ui-react';
import NSImage from '../../../shared/NSImage';

const CollectionItem = ({ isMobile, isTablet, responsiveVars, collections }) => (
  <>
    <section key={collections.id} className={`${responsiveVars.uptoTablet ? 'pt-50 pb-50' : 'pt-100 pb-100'} bg-offwhite`}>
      <Container>
        {
          collections.map(items => (
            <Grid>
            <Grid.Column widescreen={4} computer={4} tablet={16} mobile={16}>
              <NSImage path={items.image} />
            </Grid.Column>
            <Grid.Column widescreen={11} computer={11} tablet={16} mobile={16}>
              <p className="mb-30 mt-30">{items.description}</p>
              {items.link && !isMobile && !isTablet
                && (
                <a href={items.link} target="_blank" rel="noopener noreferrer"><Button inverted color="green" className="mb-30">Explore</Button></a>
                )
              }
            </Grid.Column>
          </Grid>
          ))
        }
      </Container>
    </section>
    <Button inverted color="green" className="mb-30 center">View All Collections</Button>
  </>
);
const Heading = ({ responsiveVars }) => (
  <>
    <Header as="h2" textAlign={responsiveVars.isMobile ? '' : 'center'} caption className={responsiveVars.isMobile ? 'mb-20 mt-20' : 'mt-50 mb-30'}>Collections</Header>
    <p className={responsiveVars.isMobile ? 'mb-40' : 'center-align mb-80'}>Browse investment opportunities by Collection - featuring exclusive deals from official NextSeed{!responsiveVars.isMobile && <br /> } Partner Organizations, as well as offerings grouped by theme, such as location or security type.</p>
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
        description: <>NextSeed operates a fully integrated online investment platform that offers all investors the opportunity to invest directly in local businesses and commercial real estate projects, enabling private companies across the US to raise capital directly from the general public in a legal, compliant manner.
          <br /><br />NextSeed Securities is our forward-thinking investment banking practice, which sources exclusive alternative investment offerings for our investment platform. Our proprietary platform manages everything from deal-sourcing and underwriting to investor account management and automatic payment processing.</>,
        logo: 'group/ns-logo.png',
        image: 'group/ns-securities.jpg',
        link: 'https://www.nextseed.com',
        background: 'image',
      }, {
        id: 2,
        title: 'Nextseed Capital',
        description: <>NextSeed Capital is our private investment fund manager that directly invests in local communities through a diversified portfolio of income-producing, private debt and equity securities.
          <br /><br />We seek to invest in impactful and traditionally underserved enterprises such as women- and minority-owned businesses and veteran-run management teams. Our inaugural fund aspires to serve the capital needs of small businesses recovering from the COVID-19 recession.</>,
        logo: 'group/ns-capital-logo.png',
        image: 'group/ns-capital.jpg',
        disclosure: 'NextSeed Capital and NextSeed Special Situations Local Business Fund have not yet been registered and the fund terms not yet finalized. Final terms and documents will be made available to qualified investors only once finalized and registered, as applicable.',
        background: 'color',
      }, {
        id: 3,
        title: 'Collaboration Capital',
        description: <>Collaboration Capital is a wealth management practice that aggregates the niche expertise of multiple, independent investment practitioners into a tangible deliverable for each client.
          <br /><br />Forward-looking clients receive a custom-tailored ESG/impact-oriented portfolio across public and private securities that both reflects their values and priorities and whose return objective and risk profile approximates that of traditional benchmarks.</>,
        logo: 'group/collab-capital-logo.png',
        image: 'group/collab-capital.jpg',
        link: 'https://collaboration.capital',
        background: 'color',
      }, {
        id: 4,
        title: 'Collaboration Assets Management',
        description: <>Collaboration Asset Management offers multiple proprietary public equity strategies built on the core fundamentals of ESG investing, accessible to both institutional and retail investors across various distribution channels.
          <br /><br />Our experienced investment team aggregates selected securities across asset classes through a disciplined portfolio construction methodology that combines both fundamental and quantitative securities analysis.</>,
        logo: 'group/collab-assets-logo.png',
        image: 'group/collab-assets.jpg',
        link: 'https://am.collaboration.capital',
        background: 'someDefaultValue',
      },
    ];
    return (
      <>
        <Heading responsiveVars={responsiveVars} />
        <CollectionItem collections={collectionsList} isMobile={isMobile} isTablet={isTablet} responsiveVars={responsiveVars} />
      </>
    );
  }
}
