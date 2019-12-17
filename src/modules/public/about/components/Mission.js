import React, { Component } from 'react';
import { Header, Container, Grid, Statistic, Responsive, Divider, Icon, Card } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { Route } from 'react-router-dom';
import NSImage from '../../../shared/NSImage';
import TeamModal from './TeamModal';
import { InlineLoader } from '../../../../theme/shared';
import TeamList from './TeamList';

const isMobile = document.documentElement.clientWidth < 768;

@inject('teamStore', 'uiStore')
@observer
class Mission extends Component {
  constructor(props) {
    super(props);
    props.teamStore.initRequest();
  }

  render() {
    const { teamMembers, loading } = this.props.teamStore;
    const { responsiveVars } = this.props.uiStore;
    const teamInfo = (
      <Grid centered className="team-list">
        <TeamList
          columns={4}
          className="team-gallery"
          match={this.props.match}
        />
        <Route
          path={`${this.props.match.url}/:id`}
          render={
            props => <TeamModal refLink={this.props.match.url} {...props} />
          }
        />
      </Grid>
    );
    return (
      <>
        <section className={responsiveVars.uptoTablet ? 'pt-50 pb-50' : 'pt-100 pb-100'}>
          <Container>
            <Grid centered stackable>
              <Grid.Row>
                <Grid.Column textAlign={isMobile ? 'left' : 'center'}>
                  <Header as="h2" className={isMobile ? 'mb-10' : 'mb-60'}>
                    Invest in each other. Grow together
                  </Header>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column width={8} verticalAlign="middle">
                  <Header as="h3" className="highlight-text quotes left-align">
                    <sup><Icon size="mini" className="ns-quote-left" /></sup> Our mission is to build prosperous communities by making meaningful investments accessible to everyone. <sup><Icon size="mini" className="ns-quote-right" /></sup>
                  </Header>
                </Grid.Column>
                <Grid.Column width={8}>
                  <p>
                    We are a fast-growing fintech company that enables everyday investors to invest directly in local businesses, enabling private companies across the US to raise capital directly from everyday investors. The Next Seed, Inc. operates NextSeed Services, LLC, a fully-integrated online investment platform, and NextSeed Securities, LLC, a forward-thinking investment banking practice.
                  </p>
                  <p>
                    We recently merged with Collaboration Capital, an SEC-registered investment adviser that focuses on impact and ESG investing strategies. Collaboration Capital was established in 2017 and has since become an industry leader in the impact/ESG investing space, currently with over $175 million AUM. Together, we aim to build a leading technology-driven impact investment firm open to everyone, furthering our mission to democratize finance.
                  </p>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Container>
        </section>
        <Divider fitted as={Container} />
        <section className={responsiveVars.uptoTablet ? 'pt-50 pb-50' : 'pt-100 pb-100'}>
          <Container>
            <Header as="h2" className={responsiveVars.isMobile ? 'mb-30' : 'mb-80 center-align'}>We{"'"}ve built our brand and our platform<Responsive minWidth={768} as="br" /> on three core values</Header>
            <Card.Group itemsPerRow={responsiveVars.isMobile ? 1 : 3} className="statistic-section proven-result-section" doubling>
              <Card className={`${responsiveVars.isMobile ? 'mlr-0' : ''} bordered`}>
                <Card.Content extra>
                  <Header as="h3" className="mb-10">Trust</Header>
                  <p>
                    Our team of experts vet every offering on our platform, giving people real opportunities to invest in businesses they believe in.
                  </p>
                </Card.Content>
                <Card.Content className="bg-offwhite">
                  <Statistic color="green" size="mini" className="basic">
                    <Statistic.Value>Top 3%</Statistic.Value>
                    <Statistic.Label className="grey-header">Business applicants approved and launched campaigns</Statistic.Label>
                    <Statistic.Value>90%+</Statistic.Value>
                    <Statistic.Label className="grey-header">Campaigns meet fundraising goals</Statistic.Label>
                  </Statistic>
                </Card.Content>
              </Card>
              <Card className={`${responsiveVars.isMobile ? 'mlr-0' : ''} bordered`}>
                <Card.Content extra>
                  <Header as="h3" className="mb-10">Innovation</Header>
                  <p>
                    We’re reinventing how local economies can grow from within by offering access to new forms of investments and capital.
                  </p>
                </Card.Content>
                <Card.Content className="bg-offwhite">
                  <Statistic color="green" size="mini" className="basic">
                    <Statistic.Value>May 2016</Statistic.Value>
                    <Statistic.Label className="grey-header">NextSeed US LLC became the first Funding Portal registered by the SEC</Statistic.Label>
                    <Statistic.Value>October 2018</Statistic.Value>
                    <Statistic.Label className="grey-header">NextSeed Securities, LLC is licensed and registered with the SEC as a broker-dealer</Statistic.Label>
                  </Statistic>
                </Card.Content>
              </Card>
              <Card className={`${responsiveVars.isMobile ? 'mlr-0' : ''} bordered`}>
                <Card.Content extra>
                  <Header as="h3" className="mb-10">Community</Header>
                  <p>
                    We empower entrepreneurs from all walks of life to follow their dreams and give back to their communities.
                  </p>
                </Card.Content>
                <Card.Content className="bg-offwhite">
                  <Statistic color="green" size="mini" className="basic">
                    <Statistic.Value>$10.6 million</Statistic.Value>
                    <Statistic.Label className="grey-header">Invested in women and minority-owned businesses</Statistic.Label>
                    <Statistic.Value>&gt;75% </Statistic.Value>
                    <Statistic.Label className="grey-header">Investment dollars go to women or minority-owned businesses</Statistic.Label>
                  </Statistic>
                </Card.Content>
              </Card>
            </Card.Group>
            {!isMobile && <Divider hidden section />}
            <p className={`${responsiveVars.isMobile ? 'mt-40' : 'center-align mt-30'} note`}>
              <sup>1</sup> This calculates the percent of businesses that began the application
              process, passed NextSeed{"'"}s objective diligence <Responsive minWidth={992} as="br" />
              criteria, and launched an offering on the platform since NextSeed{"'"}s inception.
            </p>
            <p className={`${responsiveVars.isMobile ? '' : 'center-align'} note`}>
              <sup>2</sup> Historical figures only. Past performance of one business is not a
              guarantee of future results of another business.
            </p>
            <p className={`${responsiveVars.isMobile ? '' : 'center-align'} note`}>
              <sup>3,4</sup> Data reflects figures from both the NextSeed TX and Reg CF
              Platforms as of October 2018.
            </p>
          </Container>
        </section>
        <Divider fitted as={Container} />
        <section className={responsiveVars.uptoTablet ? 'pt-50 pb-50' : 'pt-100 pb-100'}>
          <Container>
            <Grid centered>
              <Grid.Column textAlign={responsiveVars.isMobile ? 'left' : 'center'} computer={15} tablet={14} mobile={16}>
                <Header as="h2" className={responsiveVars.isMobile ? 'mb-10' : 'mb-30'}>Meet our team</Header>
                <p className={responsiveVars.isMobile ? 'mb-40' : 'mb-60'}>
                  We{"'"}re a team of entrepreneurs with backgrounds in business, finance, law, marketing and technology.<Responsive minWidth={992} as="br" /> We{"'"}re here to empower business owners and everyday people to invest in one another.
                </p>
                {loading ? (<InlineLoader />)
                  : teamMembers.length === 0 ? <section className="center-align"><h3 style={{ color: '#31333d7d' }}>No Records to Display</h3></section>
                    : teamInfo}
              </Grid.Column>
            </Grid>
          </Container>
        </section>
        <Divider fitted as={Container} />
        <section className={responsiveVars.uptoTablet ? 'pt-50 pb-50' : 'pt-100 pb-100'}>
          <Container>
            <Grid centered reversed="mobile">
              <Grid.Column width={responsiveVars.uptoTablet ? 16 : 7} floated="left">
                <Header as="h2" className="mb-30">Democratize finance.<Responsive minWidth={992} as="br" />Create change.<Responsive minWidth={992} as="br" />Join our team.</Header>
                {responsiveVars.isMobile
                && <NSImage path="collage.jpg" className="mb-30" fluid />}
                <p>
                We’re just getting started in our journey to shape the future of finance in local communities. We’re looking for talented and motivated individuals who are seeking an adventure to learn new skills and cover new ground.
                </p>
                {!responsiveVars.isMobile
                && <Divider hidden />}
                <p>
                  If you are a self-starter and love working in a dynamic environment, NextSeed may be the place for you.
                </p>
                <Divider hidden />
                <p>
                  <b>Contact info:</b> Submit your resume to <a target="_blank" rel="noreferrer noopener" href="mailto:jobs@nextseed.com">jobs@nextseed.com</a> and indicate position in the subject line.
                </p>
              </Grid.Column>
              <Grid.Column width={responsiveVars.uptoTablet ? 16 : 7} verticalAlign="middle">
                {!responsiveVars.isMobile
                && <NSImage path="collage.jpg" fluid />}
              </Grid.Column>
            </Grid>
          </Container>
        </section>
        <Divider fitted as={Container} />
        <section className={responsiveVars.uptoTablet ? 'pt-50 pb-50' : 'pt-100 pb-100'}>
          <Container>
            <Grid centered stackable>
              <Grid.Column width={responsiveVars.uptoTablet ? 16 : 8}>
                {responsiveVars.uptoTablet
                  && <Header as="h2" className="mb-30">Our Offices</Header>}
                <NSImage path="map.png" fluid />
              </Grid.Column>
              <Grid.Column width={responsiveVars.uptoTablet ? 16 : 7} floated="right" verticalAlign="middle" textAlign="left">
                {!responsiveVars.uptoTablet
                  && <Header as="h2" className="mb-30">Our Offices</Header>}
                <p>
                  We are headquartered in Houston, TX with satellite offices in Austin, New York and Los Angeles.
                </p>
              </Grid.Column>
            </Grid>
          </Container>
        </section>
      </>
    );
  }
}
export default Mission;
