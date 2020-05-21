import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Grid, Header, Container, List, Icon, Card, Responsive } from 'semantic-ui-react';
import NSImage from '../../../shared/NSImage';

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
              Access a diversified portfolio of income-generating<Responsive minWidth="768" as="br" />
              businesses with NextSeed’s inaugural fund
            </Header>
          </div>
        </Container>
      </section>
      <section className={`${responsiveVars.uptoTablet ? 'pt-50 pb-50' : 'pt-100 pb-100'}`}>
        <Container>
        <p className="mb-30 mt-30">Small businesses have long been applauded as the backbone of our economy. Unfortunately, private capital markets have not treated them with the same regard.</p>
        <p className="mb-30 mt-30">While high-growth technology companies have captured the attention and funding from venture capital, income-based businesses have historically been ignored and underserved by investors. Quite simply, SMB’s with annual revenues below $5 million have been considered “not worth the time” for traditional investors.</p>
          <Grid centered reversed="mobile">
            <Grid.Column width={responsiveVars.uptoTablet ? 16 : 7} floated="left">
              <p className="mb-30 mt-30">NextSeed’s online marketplace has been able to leverage technology and a scalable diligence process to review thousands of businesses, shedding light on this new asset class as inefficiently priced and one that offers potential for strong return opportunities for investors.</p>
              <p>NextSeed Capital is launching in 2020 to invest directly, via flexible debt and equity capital, into small businesses that are vital to their communities. These funds will also provide qualified investors the opportunity to gain direct, diversified exposure to local businesses that provide positive hyper-local impact</p>
              <p className="mb-30 mt-30">NextSeed Capital will operate synergistically with the greater NextSeed platform, which has been a leader in the small business investment space since 2015, to access scalable deal flow and networks while serving as a strategic capital partner for great small businesses.</p>
            </Grid.Column>
            <Grid.Column width={responsiveVars.uptoTablet ? 16 : 8} floated="right">
              <NSImage path="capital/slider.png" />
            </Grid.Column>
          </Grid>
        </Container>
      </section>
      <section className={`bg-offwhite ${responsiveVars.uptoTablet ? 'pt-50 pb-50' : 'pt-100 pb-100'}`}>
        <Container>
          <Grid stackable className="mt-0 mb-0 mlr-0" reversed="mobile">
            <Grid.Column width={responsiveVars.uptoTablet ? 16 : 7} className="capital-sidebg">
              <NSImage floated="left" path={responsiveVars.uptoTablet ? 'capital/imgMobile.png' : 'capital/img.png'} />
            </Grid.Column>
            <Grid.Column width={responsiveVars.uptoTablet ? 16 : 8} floated="right">
              <section className={`investment_stat_box ${responsiveVars.isMobile ? '' : 'padded'}`}>
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
              {/* <Grid.Column width={responsiveVars.uptoTablet ? 16 : 7} className="capital-sidebg" floated="left" /> */}
            </Grid.Column>
          </Grid>
        </Container>
      </section>
      <section className={`${responsiveVars.uptoTablet ? 'pt-50 pb-50' : 'pt-100 pb-100'}`}>
        <Container>
          <Grid stackable className="mt-0 mb-0 mlr-0" reversed="mobile">
            <Grid.Column width={responsiveVars.uptoTablet ? 16 : 7}>
              <section className={`investment_stat_box ${responsiveVars.isMobile ? '' : 'padded'}`}>
                <Header as="h2" className="capital-header">Proposed Investment Strategy</Header>
                <List className={`${responsiveVars.isMobile ? '' : 'mt-30'} icon-list`}>
                  <List.Item className="pb-0 mt-0 mb-20 pt-0">
                    <Icon className="ns-tick" color="grey" size="large" />
                    Focus on consumer-facing small businesses
                  </List.Item>
                  <List.Item className="pb-0 mt-0 mb-20 pt-0">
                    <Icon className="ns-tick" color="grey" size="large" />
                    Tailor investment products to capital needs
                  </List.Item>
                  <List.Item className="pb-0 mt-0 mb-20 pt-0">
                    <Icon className="ns-tick" color="grey" size="large" />
                    Primarily fund small business needs in the areas of working capital, growth capital, refinancing, and recapitalizations.
                  </List.Item>
                  <List.Item className="pb-0 mt-0 mb-20 pt-0">
                    <Icon className="ns-tick" color="grey" size="large" />
                    Integrate technology into underwriting to access and review a high volume of select portfolio companies.
                  </List.Item>
                  <List.Item className="pb-0 mt-0 mb-20 pt-0">
                    <Icon className="ns-tick" color="grey" size="large" />
                    Apply institutional diligence standards to underserved and mispriced asset class
                  </List.Item>
                </List>
              </section>
            </Grid.Column>
            <Grid.Column width={responsiveVars.uptoTablet ? 16 : 9} className="capital-sidebg">
              <NSImage floated="right" path={responsiveVars.uptoTablet ? 'capital/houstonMobile.png' : 'capital/houston.png'} />
            </Grid.Column>
          </Grid>
        </Container>
      </section>
      {/* <section className={`bg-offwhite ${responsiveVars.uptoTablet ? 'pt-50 pb-0' : 'pt-100 pb-0'}`}>
        <Container>
          <Card fluid>
            <section className={responsiveVars.isMobile ? '' : 'padded'}>
              <Header as="h2" className={`${responsiveVars.isMobile ? 'mb-30' : 'mb-80'} capital-header left-align`}>Contact Information</Header>
              <Card.Group itemsPerRow="2" stackable>
                <Card className="capital-card">
                  <Card.Content>
                    <NSImage
                      floated="left"
                      path="capital/bharat.png"
                    />
                    <Card.Header className="capital-header">Bharat Kesavan<br />Portfolio Principal</Card.Header>
                    <Card.Meta className="text-lowercase">NextSeed Capital</Card.Meta>
                    <Card.Description>
                      Broad M&A and capital markets (high yield, investment grade and equities) background with transactions totaling $10bn+ in deal value. Prior to NextSeed, worked at BNP Paribas and BofA Merrill Lynch. Experienced in yield-based limited partnerships. Early career experience in financial monitoring and reporting. BBA from the University of Georgia and an MBA from the University of Texas at Austin.
                    </Card.Description>
                  </Card.Content>
                </Card>
                <Card className="capital-card">
                  <Card.Content>
                    <NSImage
                      floated="left"
                      path="capital/yorro_yp.png"
                    />
                    <Card.Header className="capital-header">YP Yorro<br />Managing Director</Card.Header>
                    <Card.Meta className="text-lowercase">NextSeed Securities</Card.Meta>
                    <Card.Description>
                      Leads NextSeed’s efforts to originate, evaluate and execute investment opportunities in consumer-facing businesses. Previously served as Vice President of EMG, a $15 billion AUM private equity firm where he closed $5 billion in EMG-led equity commitments and directed portfolio company management teams on organic/inorganic growth.  BA from Boston College and dual MBA/MIA degrees from Columbia University.
                    </Card.Description>
                  </Card.Content>
                </Card>
              </Card.Group>
            </section>
          </Card>
        </Container>
      </section> */}
      <section className={`capital_contact_info ${responsiveVars.isMobile ? 'pb-50 pt-50' : 'pb-80 pt-80'} bg-offwhite`}>
        <Container>
        <Grid stackable centered>
          <Grid.Column width="8" textAlign="left" verticalAlign="middle">
            <Header as="h2" className="capital-header mini">Contact for more information</Header>
            <p>bharat@nextseed.com | 832.533.2700</p>
          </Grid.Column>
          <Grid.Column width="7">
            <Card className="capital-card with-shadow pull-right">
              <Card.Content>
                <NSImage
                  floated="left"
                  path="capital/bharat.png"
                  className="mb-0"
                />
                <Card.Header>Bharat Kesavan<br />Portfolio Principal</Card.Header>
                <Card.Meta className="text-lowercase">NextSeed Capital</Card.Meta>
              </Card.Content>
            </Card>
          </Grid.Column>
        </Grid>
        </Container>
      </section>
      <section className={`contact_info_content ${responsiveVars.uptoTablet ? 'pt-50 pb-50' : 'pt-100 pb-100'}`}>
        <Container>
          <b>Important Notices</b><br />
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

// <Card fluid>
  // <Card.Content className={responsiveVars.isMobile ? '' : 'pt-0 pb-0 plr-0'}>
  // </Card.Content>
// </Card>
export default Capital;
