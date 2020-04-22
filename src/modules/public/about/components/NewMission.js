import React, { Component } from 'react';
import { Header, Container, Grid, Statistic, Responsive, Divider, Icon, Card } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';

const isMobile = document.documentElement.clientWidth < 768;

@inject('teamStore', 'uiStore', 'publicStore', 'campaignStore')
@observer

export default class NewMission extends Component {
  render() {
    const { responsiveVars } = this.props.uiStore;
    return (
      <>
        <section className={responsiveVars.uptoTablet ? 'pt-50 pb-50' : 'pt-100 pb-100'}>
          <Container>
            <Grid centered stackable>
              <Grid.Row>
                <Grid.Column textAlign={isMobile ? 'left' : 'center'}>
                  <Header as="h2" className={isMobile ? 'mb-10' : 'mb-60'}>
                    Invest in each other.<Responsive maxWidth={768} as="br" /> Grow together.
                  </Header>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column width={8} verticalAlign="middle">
                  <Header as="h3" className="highlight-text quotes left-align">
                    <sup><Icon size="mini" className="ns-quote-left" /></sup> Our mission is to build <br />prosperous communities by making meaningful investments accessible to everyone. <sup><Icon size="mini" className="ns-quote-right" /></sup>
                  </Header>
                </Grid.Column>
                <Grid.Column width={7} floated="right">
                  <p>
                    We are a fast-growing fintech company that empowers everyday investors to invest directly in local businesses, enabling private companies across the US to raise capital directly from their community. The Next Seed, Inc. operates NextSeed Services LLC, a fully-integrated online investment platform, and NextSeed Securities, LLC, a forward-thinking investment banking practice.
                  </p>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Container>
        </section>
        <Divider fitted as={Container} />
        <section className={responsiveVars.uptoTablet ? 'pt-50 pb-50' : 'pt-100 pb-100'}>
          <Container>
            <Header as="h2" className={responsiveVars.isMobile ? 'mb-30' : 'mb-80 center-align'}>We{'\''}ve built our brand and our platform<Responsive minWidth={768} as="br" /> on three core values</Header>
            <Card.Group itemsPerRow={responsiveVars.isMobile ? 1 : 3} className="statistic-section proven-result-section" doubling>
              <Card className={`${responsiveVars.isMobile ? 'mlr-0' : ''} bordered`}>
                <Card.Content extra>
                  <Header as="h3" className="mb-10">Trust</Header>
                  <p className="neutral-text">
                    Our team of experts vet every offering on our platform, giving people real opportunities to invest in businesses they believe in.
                  </p>
                </Card.Content>
                <Card.Content className="bg-offwhite">
                  <Statistic color="green" size="mini" className="basic">
                    <Statistic.Value>Top 3%</Statistic.Value>
                    <Statistic.Label className="neutral-text">Business applicants approved and launched campaigns<sup>1</sup></Statistic.Label>
                    <Statistic.Value>90%+</Statistic.Value>
                    <Statistic.Label className="neutral-text">Campaigns meet fundraising goals<sup>2</sup></Statistic.Label>
                  </Statistic>
                </Card.Content>
              </Card>
              <Card className={`${responsiveVars.isMobile ? 'mlr-0' : ''} bordered`}>
                <Card.Content extra>
                  <Header as="h3" className="mb-10">Innovation</Header>
                  <p className="neutral-text">
                    We’re reinventing how local economies can grow from within by offering access to new forms of investments and capital.
                  </p>
                </Card.Content>
                <Card.Content className="bg-offwhite">
                  <Statistic color="green" size="mini" className="basic">
                    <Statistic.Value>May 2016</Statistic.Value>
                    <Statistic.Label className="neutral-text">NextSeed US LLC became the first Funding Portal registered by the SEC</Statistic.Label>
                    <Statistic.Value>October 2018</Statistic.Value>
                    <Statistic.Label className="neutral-text">NextSeed Securities, LLC is licensed and registered with the SEC as a broker-dealer</Statistic.Label>
                  </Statistic>
                </Card.Content>
              </Card>
              <Card className={`${responsiveVars.isMobile ? 'mlr-0' : ''} bordered`}>
                <Card.Content extra>
                  <Header as="h3" className="mb-10">Community</Header>
                  <p className="neutral-text">
                    We empower entrepreneurs from all walks of life to follow their dreams and give back to their communities.
                  </p>
                </Card.Content>
                <Card.Content className="bg-offwhite">
                  <Statistic color="green" size="mini" className="basic">
                    <Statistic.Value>$12 million</Statistic.Value>
                    <Statistic.Label className="neutral-text">Invested in women and minority-owned businesses<sup>3</sup></Statistic.Label>
                    <Statistic.Value>&gt;75% </Statistic.Value>
                    <Statistic.Label className="neutral-text">Investment dollars go to women or minority-owned businesses<sup>4</sup></Statistic.Label>
                  </Statistic>
                </Card.Content>
              </Card>
            </Card.Group>
            {!isMobile && <Divider hidden section />}
            <p className={`${responsiveVars.isMobile ? 'mt-40' : 'center-align mt-30'} note`}>
              <sup>1</sup> This calculates the percent of businesses that began the application
              process, passed NextSeed{'\''}s objective diligence <Responsive minWidth={992} as="br" />
              criteria, and launched an offering on the platform since NextSeed{'\''}s inception.
            </p>
            <p className={`${responsiveVars.isMobile ? '' : 'center-align'} note`}>
              <sup>2</sup> Historical figures only. Past performance of one business is not a
              guarantee of future results of another business.
            </p>
            <p className={`${responsiveVars.isMobile ? '' : 'center-align'} note`}>
              <sup>3,4</sup> Data reflects figures from offerings conducted by NextSeed TX LLC, NextSeed UC LLC and NextSeed Securities, LLC as of December 2019.
            </p>
          </Container>
        </section>
      </>
    );
  }
}
