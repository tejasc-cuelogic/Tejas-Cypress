import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Grid, Header, Container, List, Icon, Responsive } from 'semantic-ui-react';
import NSImage from '../../../shared/NSImage';
import CapitalContactInformation from './CapitalContactInformation';

@inject('navStore', 'userStore', 'uiStore')
@observer
class Capital extends Component {
  state = { activeIndex: 0 }

  handleClick = (e, titleProps) => {
    const { index } = titleProps;
    const { activeIndex } = this.state;
    const newIndex = activeIndex === index ? -1 : index;
    this.setState({ activeIndex: newIndex });
  }

  render() {
    const { responsiveVars } = this.props.uiStore;
    return (
      <>
        <section className="banner capital-banner">
          <Container>
            <div className="banner-caption center-align">
              <NSImage path="capital/ns-capital-logo.svg" className="mb-20" />
              <Header as="h2" className={responsiveVars.isMobile ? 'mt-0 mb-14' : 'mb-14'}>Invest in Small Businesses</Header>
              <Header as="h4" className="mb-40">
                Access a diversified portfolio of income-generating <Responsive minWidth="768" as="br" />
              businesses with NextSeed’s inaugural fund
            </Header>
          </div>
        </Container>
      </section>
      <section className={`capital-wrap ${responsiveVars.uptoTablet ? 'pt-10 pb-10 mb-20' : 'pt-70 pb-70'}`}>
        <Container>
        <p className="mb-30 mt-30">Small businesses have long been applauded as the backbone of our economy. Unfortunately, private capital markets have not treated them with the same regard.</p>
        <p className="mb-30 mt-30">While high-growth technology companies have captured the attention and funding from venture capital, income-based businesses have historically been ignored and underserved by investors. Quite simply, SMB’s with annual revenues below $5 million have been considered “not worth the time” for traditional investors.</p>
          <Grid centered reversed="mobile">
            <Grid.Column width={responsiveVars.uptoTablet ? 16 : 7} floated="left">
              <p className="mb-30">NextSeed’s online marketplace has been able to leverage technology and a scalable diligence process to review thousands of businesses, shedding light on this new asset class as inefficiently priced and one that offers potential for strong return opportunities for investors.</p>
              <p>NextSeed Capital is launching in 2020 to invest directly, via flexible debt and equity capital, into small businesses that are vital to their communities. These funds will also provide qualified investors the opportunity to gain direct, diversified exposure to local businesses that provide positive hyper-local impact</p>
              <p className="mb-30 mt-30">NextSeed Capital will operate synergistically with the greater NextSeed platform, which has been a leader in the small business investment space since 2015, to access scalable deal flow and networks while serving as a strategic capital partner for great small businesses.</p>
            </Grid.Column>
            <Grid.Column width={responsiveVars.uptoTablet ? 16 : 9} className="center-align" floated="right">
              <NSImage path="capital/slider.png" />
              <p className="mt-30 note">Small businesses successfully funded on the NextSeed platform</p>
            </Grid.Column>
          </Grid>
        </Container>
      </section>
      <section className={`capital-wrap bg-offwhite ${responsiveVars.uptoTablet ? 'pt-10 pb-10 mb-20' : 'pt-100 pb-30'}`}>
        <Container>
          <Grid stackable className="mt-0 mb-0 mlr-0" reversed="mobile">
            <Grid.Column width={responsiveVars.uptoTablet ? 16 : 7} className="capital-sidebg" floated="left">
              <NSImage floated="left" path={responsiveVars.uptoTablet ? 'capital/imgMobile.png' : 'capital/img.png'} />
            </Grid.Column>
            <Grid.Column width={responsiveVars.uptoTablet ? 16 : 9} floated="right" className="pt-0">
              <section className={`${responsiveVars.isMobile ? '' : 'pl-100 pt-0 pr-0'}`}>
                <Header as="h2" className="capital-header">Overview</Header>
                <List bulleted relaxed="very" className={`${responsiveVars.isMobile ? '' : 'mt-30'} capital`}>
                  <List.Item className="pb-0 mt-0 mb-10 pt-0">
                    NextSeed Capital will invest in local communities through a diversified fund focusing on income producing private debt and equity securities.
                  </List.Item>
                    <List.Item className="pb-0 mt-0 mb-10 pt-0">
                      The Fund will be managed by an investment team with over 50 years of global financial institution experience, paired with an accomplished NextSeed management team and advisory board.
                  </List.Item>
                    <List.Item className="pb-0 mt-0 mb-10 pt-0">
                      Fund Manager will leverage the NextSeed technology platform with robust due diligence and underwriting to access and review a high volume of potential portfolio companies.
                  </List.Item>
                    <List.Item className="pb-0 mt-0 mb-10 pt-0">
                      The Fund will aim to invest in impactful and traditionally underserved businesses such as women- and minority-owned enterprises, and veteran-run management teams.
                  </List.Item>
                </List>
              </section>
            </Grid.Column>
          </Grid>
        </Container>
      </section>
      <section className={`capital-wrap ${responsiveVars.uptoTablet ? 'pt-10 pb-10 mb-20' : 'pt-100 pb-40'}`}>
        <Container>
          <Grid stackable className="mt-0 mb-0 mlr-0">
            <Grid.Column width={responsiveVars.uptoTablet ? 16 : 7} floated="left" className="pt-0 pl-0">
              <section className={`${responsiveVars.isMobile ? '' : 'pt-0 pl-0'}`}>
                <Header as="h2" className="capital-header">Proposed Investment Strategy</Header>
                <List className={`${responsiveVars.isMobile ? '' : 'mt-30'} capital-investment-strategy-wrap icon-list`}>
                  <List.Item className="pb-0 mt-0 mb-20 pt-0">
                    <Icon className="ns-tick" color="grey" size="large" />
                    <p>Focus on consumer-facing small businesses</p>
                  </List.Item>
                    <List.Item className="pb-0 mt-0 mb-20 pt-0">
                      <Icon className="ns-tick" color="grey" size="large" />
                    <p>Tailor investment products to capital needs</p>
                  </List.Item>
                    <List.Item className="pb-0 mt-0 mb-20 pt-0">
                      <Icon className="ns-tick" color="grey" size="large" />
                    <p>Primarily fund small business needs in the areas of working capital, growth capital, refinancing, and recapitalizations.</p>
                  </List.Item>
                    <List.Item className="pb-0 mt-0 mb-20 pt-0">
                      <Icon className="ns-tick" color="grey" size="large" />
                    <p>Integrate technology into underwriting to access and review a high volume of select portfolio companies.</p>
                  </List.Item>
                    <List.Item className="pb-0 mt-0 mb-20 pt-0">
                      <Icon className="ns-tick" color="grey" size="large" />
                    <p>Apply institutional diligence standards to underserved and mispriced asset class</p>
                  </List.Item>
                  </List>
                </section>
              </Grid.Column>
            <Grid.Column width={responsiveVars.uptoTablet ? 16 : 8} className="capital-sidebg" floated="right">
                <NSImage floated="right" path={responsiveVars.uptoTablet ? 'capital/houstonMobile.png' : 'capital/houston.png'} />
              </Grid.Column>
            </Grid>
          </Container>
        </section>
        <section className={`bg-offwhite ${responsiveVars.uptoTablet ? 'pt-50 pb-50' : 'pt-100 pb-100'}`}>
          <Container>
            <CapitalContactInformation />
          </Container>
        </section>
        <section className={`contact_info_content ${responsiveVars.uptoTablet ? 'pt-50 pb-50' : 'pt-100 pb-100'}`}>
          <Container>
            <p><b>Important Notices</b></p>
            <p>
              NextSeed Capital is a subsidiary of The Next Seed, Inc., a fast-growing fintech company that enables private companies across the US to raise capital directly from everyday investors. The Next Seed, Inc. operates NextSeed Services, LLC, a fully-integrated online investment platform, and NextSeed Securities, LLC, a forward-thinking investment banking practice.
            </p>
            <p>
              No Offer: This presentation (“Presentation”) is neither an offer to sell nor a solicitation of an offer to buy any security, nor is it an offer of any sort of investment advice. Instead, it is intended to describe an investment vehicle being developed by NextSeed Capital (“NSC”), the terms of which are under consideration—the Special Situations Local Fund, LP (the “Fund”). An offer may only be made via a written offering document (“Memorandum”) that may be provided by the Fund in the future that offers interests in the Fund (the “Interests”).
            </p>
            <p>
              Presently, NSC has not yet registered as an investment adviser and does not intend to until the Fund commences operations, and accordingly, NSC does not hold itself out as an investment adviser to any person. Rather, NSC is seeking to obtain indications of interest in potential investments in the Interests, and upon receiving sufficient indications of interest, may finalize the terms of the Fund and commence an offering of Interests via the distribution of the Memorandum.  Until that time, the terms of the offering of the Interests are not certain.
            </p>
          </Container>
        </section>
        </>
      );
    }
}

export default Capital;
