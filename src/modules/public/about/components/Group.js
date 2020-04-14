import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Header, Grid, Container, Button } from 'semantic-ui-react';
import NSImage from '../../../shared/NSImage';

const isMobile = document.documentElement.clientWidth < 768;
const isTablet = document.documentElement.clientWidth < 780;
const highlights = {
  title: 'The NextSeed Group',
  description: <>Since 2015, The NextSeed Group has been at the forefront of rapidly changing financial markets to connect community and capital in diverse and meaningful ways. A pioneer in
  investment crowdfunding, NextSeed has evolved into a technology-driven investment banking practice offering place-based investment opportunities that align with its mission to build
  community through financial markets. In late 2019, we combined with Collaboration Capital, a family-focused wealth management and asset management investment firm built around ESG
  (Environmental, Social, and Governance) investing. The NextSeed Group now offers leading edge investment banking and investment management services for retail and institutional clients.
    <br /><br /> Our mission is to build prosperous communities by making meaningful investments accessible to everyone, which we take to heart in every business decision we make.
    <br /><br /> Learn more about our family of businesses below.</>,
};
const nsGroup = [
  {
    title: 'Nextseed Securities',
    description: <>NextSeed operates a fully integrated online investment platform that offers all investors the opportunity to invest directly in local businesses and commercial real estate projects, enabling private companies across the US to raise capital directly from the general public in a legal, compliant manner.
      <br /><br />NextSeed Securities is our forward-thinking investment banking practice, which sources exclusive alternative investment offerings for our investment platform. Our proprietary platform manages everything from deal-sourcing and underwriting to investor account management and automatic payment processing.</>,
    logo: 'group/ns-logo.png',
    image: 'group/ns-securities.jpg',
    link: 'https://www.nextseed.com',
    gray: true,
  },
  {
    title: 'Nextseed Capital',
    description: <>NextSeed Capital is our private investment fund manager that directly invests in local communities through a diversified portfolio of income-producing, private debt and equity securities.
      <br /><br />We seek to invest in impactful and traditionally underserved enterprises such as women- and minority-owned businesses and veteran-run management teams. Our inaugural fund aspires to serve the capital needs of small businesses recovering from the COVID-19 recession.</>,
    logo: 'group/ns-capital-logo.png',
    image: 'group/ns-capital.jpg',
    disclosure: 'NextSeed Capital and NextSeed Special Situations Local Business Fund have not yet been registered and the fund terms not yet finalized. Final terms and documents will be made available to qualified investors only once finalized and registered, as applicable.',
  },
  {
    title: 'Collaboration Capital',
    description: <>Collaboration Capital is a wealth management practice that aggregates the niche expertise of multiple, independent investment practitioners into a tangible deliverable for each client.
      <br /><br />Forward-looking clients receive a custom-tailored ESG/impact-oriented portfolio across public and private securities that both reflects their values and priorities and whose return objective and risk profile approximates that of traditional benchmarks.</>,
    logo: 'group/collab-capital-logo.png',
    image: 'group/collab-capital.jpg',
    link: 'https://collaboration.capital',
    gray: true,
  },
  {
    title: 'Collaboration Assets Management',
    description: <>Collaboration Asset Management offers multiple proprietary public equity strategies built on the core fundamentals of ESG investing, accessible to both institutional and retail investors across various distribution channels.
      <br /><br />Our experienced investment team aggregates selected securities across asset classes through a disciplined portfolio construction methodology that combines both fundamental and quantitative securities analysis.</>,
    logo: 'group/collab-assets-logo.png',
    image: 'group/collab-assets.jpg',
    link: 'https://am.collaboration.capital',
  },
];

@inject('uiStore')
@withRouter
@observer
export default class Group extends Component {
  render() {
    const { responsiveVars } = this.props.uiStore;
    return (
      <>
        <Container>
          <section className={responsiveVars.uptoTablet ? 'pt-50' : 'pt-100'}>
            <Header as="h2" className={responsiveVars.uptoTablet ? 'mb-20' : 'mb-30'}>
              {highlights.title}
            </Header>
            <p className={responsiveVars.uptoTablet ? 'mb-30' : 'mb-70'}>{highlights.description}</p>
          </section>
        </Container>
        {nsGroup.map(i => (
          i.gray ? (
            <section key={i.title} className={`${responsiveVars.uptoTablet ? 'pt-50 pb-50' : 'pt-100 pb-100'} bg-offwhite`}>
              <Container>
                <Grid>
                  <Grid.Column widescreen={7} computer={7} tablet={16} mobile={16}>
                    <div>
                      <NSImage path={i.logo} />
                      <p className="mb-30 mt-30">{i.description}</p>
                      {i.link && !isMobile && !isTablet
                        && (
                          <a href={i.link} target="_blank" rel="noopener noreferrer"><Button inverted color="green" className="mb-30">Learn More</Button></a>
                        )
                      }
                    </div>
                  </Grid.Column>
                  <Grid.Column widescreen={8} computer={8} tablet={16} mobile={16} floated={!isMobile ? 'right' : ''}>
                    <NSImage path={i.image} fluid />
                    {i.link && isMobile
                      ? (
                        <a href={i.link} target="_blank" rel="noopener noreferrer"><Button inverted fluid={isMobile} color="green" className="mt-30">Learn More</Button></a>
                      ) : (
                        i.link && <a href={i.link} target="_blank" rel="noopener noreferrer"><Button inverted color="green" className="mt-30">Learn More</Button></a>
                      )
                    }
                  </Grid.Column>
                </Grid>
              </Container>
            </section>
          ) : (
              <section key={i.title} className={`${responsiveVars.uptoTablet ? 'pt-50 pb-50' : 'pt-100 pb-100'} bg-white`}>
                <Container>
                  <Grid>
                    <Grid.Column widescreen={8} computer={8} tablet={16} mobile={16}>
                      {isMobile || isTablet
                        ? (
                          <div>
                            <NSImage path={i.logo} />
                            <p className="mb-30 mt-30">{i.description}</p>
                            <NSImage path={i.image} fluid />
                            <p className="note mt-30">{i.disclosure}</p>
                            {i.link && isMobile
                              ? (
                                <a href={i.link} target="_blank" rel="noopener noreferrer"><Button inverted fluid={isMobile} color="green" className="mt-30">Learn More</Button></a>
                              ) : (
                                i.link && <a href={i.link} target="_blank" rel="noopener noreferrer"><Button inverted color="green" className="mt-30">Learn More</Button></a>
                              )
                            }
                          </div>
                        )
                        : <NSImage path={i.image} fluid />
                      }
                    </Grid.Column>
                    <Grid.Column widescreen={7} computer={7} tablet={16} mobile={16} floated={!isMobile ? 'right' : ''}>
                    {!isMobile && !isTablet
                        && (
                          <div>
                            <NSImage path={i.logo} />
                            <p className="mb-30 mt-30">{i.description}</p>
                            <p className="note">{i.disclosure}</p>
                            {i.link && <a href={i.link} target="_blank" rel="noopener noreferrer"><Button inverted color="green" className="mb-30">Learn More</Button></a>}
                          </div>
                        )
                      }
                    </Grid.Column>
                  </Grid>
                </Container>
              </section>
            )))}
      </>
    );
  }
}
