import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Header, Grid, Container, Button, Responsive } from 'semantic-ui-react';
import NSImage from '../../../shared/NSImage';

const highlights = {
  title: 'The Nextseed Group',
  description: <>Since 2015, we have worked on the forefront of rapidly changing financial markets to
  connect community and capital in diverse and meaningful ways. Starting by offering the first ever investment crowdfunding campaign in the United States on
  the <a href="/" target="_blank">nextseed.com</a> investment platform, The NextSeed Group has evolved into a forward-thinking investment banking practice, created a first-of-its-kind
  place-based credit fund to accelerate its mission to build community through financial markets. By combining with RIA Collaboration Capital, a leader in the
  impact/ESG investing space, the firm expanded its scope to offer full-service wealth management and asset management for retail and institutional clients, all with a focus on meaningful investing.
  <br /><br /> Looking forward, we will continue looking for ways to build a technology-driven impact investment firm open to everyone, furthering our mission to democratize finance. <br /><br /> Learn more about our portfolio of companies below.</>,
};

const nsGroup = [
  {
    title: 'Nextseed Securities',
    description: <>NextSeed Securities is a fast-growing fintech<Responsive as="br" minWidth={768} /> company that empowers everyday investors to invest directly in local businesses, enabling private companies across the US to raise capital directly from their community.
     <br />The Next Seed, Inc. operates NextSeed Services LLC, a fully-integrated online investment platform, and NextSeed Securities, LLC, a forward-thinking investment banking practice.</>,
    logo: 'group/ns-capital-logo.png',
    image: 'group/ns-securities.jpg',
    link: 'somewhere',
    gray: true,
  },
  {
    title: 'Nextseed Capital',
    description: <>NextSeed Capital is an actively managed private fund, invest in local communities through a diversified portfolio of income producing private debt and equity securities.
    <br />The fund will invest in impactful and traditionally underserved businesses such as women and minority owned enterprises, veteran run management teams, and fulfill the capital needs of small businesses recovering from the Covid-19 recession.</>,
    logo: 'group/ns-capital-logo.png',
    image: 'group/ns-capital.jpg',
    link: 'somewhere',
    gray: false,
  },
  {
    title: 'Collaboration Capital',
    description: <>Collaboration Capital is a wealth management firm that aggregates the niche expertise of multiple, independent investment practitioners into a tangible deliverable: a complete ESG/impact-oriented portfolio across public and private securities whose return objective and risk profile approximates that of traditional benchmarks.
    <br />We prioritize the caliber of intellectual property going into client deliverable over bricks and mortar.</>,
    logo: 'group/ns-capital-logo.png',
    image: 'group/collab-capital.jpg',
    link: 'somewhere',
    gray: true,
  },
  {
    title: 'Collaboration Assets Management',
    description: <>Collaboration Asset Management offers proprietary public equity strategies built on the core fundamentals of ESG investing.
    <br />Collaboration Asset Management’s investment team aggregates selected securities across asset classes through a disciplined portfolio construction methodology that combines both fundamental and quantitative securities analysis.</>,
    logo: 'group/ns-capital-logo.png',
    image: 'group/collab-assets.jpg',
    link: 'somewhere',
    gray: false,
  },
];

@inject('uiStore')
@withRouter
@observer
export default class Group extends Component {
  handleApplyCta = () => {
    this.props.uiStore.setAuthRef('/investors');
    this.props.history.push('/register-investor');
  }

  handleButtonRoutes = () => {
  }

  render() {
    const { responsiveVars } = this.props.uiStore;
    return (
      <>
        <Container>
          <section className={responsiveVars.uptoTablet ? 'pt-50 pb-50' : 'pt-100 pb-100'}>
            <Header as="h2" className={responsiveVars.uptoTablet ? 'mb-20' : 'mb-30'}>
              {highlights.title}
            </Header>
            <p className={responsiveVars.uptoTablet ? 'mb-30' : 'mb-70'}>{highlights.description}</p>
          </section>
            { nsGroup.map(i => (
                i.gray ? (
                <section className={responsiveVars.uptoTablet ? 'pt-50 pb-50' : 'pt-100'} style={{ backgroundColor: '#f7f8fc' }}>
                  <Grid>
                    <Grid.Column widescreen={8} computer={8} tablet={16} mobile={16} verticalAlign="middle">
                      <div>
                        <NSImage path={i.logo} />
                        <p className="mb-30 mt-30">{i.description}</p>
                        {!responsiveVars.isMobile
                          && (
                            <Button onClick={this.handleButtonRoutes} inverted color="green" className="mb-30">Learn More</Button>
                          )
                        }
                      </div>
                    </Grid.Column>
                    <Grid.Column widescreen={8} computer={8} tablet={16} mobile={16}>
                      <NSImage path={i.image} fluid />
                    </Grid.Column>
                  </Grid>
                </section>
                ) : (
                <section className={responsiveVars.uptoTablet ? 'pt-50 pb-50' : 'pt-100'}>
                <Grid>
                  <Grid.Column widescreen={8} computer={8} tablet={16} mobile={16}>
                    <NSImage path={i.image} fluid />
                  </Grid.Column>
                  <Grid.Column widescreen={8} computer={8} tablet={16} mobile={16} verticalAlign="middle">
                    <div>
                      <NSImage path={i.logo} />
                      <p className="mb-30 mt-30">{i.description}</p>
                      {!responsiveVars.isMobile
                        && (
                          <Button onClick={this.handleButtonRoutes} inverted color="green" className="mb-30">Learn More</Button>
                        )
                      }
                    </div>
                  </Grid.Column>
                </Grid>
              </section>
            )))}
        </Container>
      </>
    );
  }
}
