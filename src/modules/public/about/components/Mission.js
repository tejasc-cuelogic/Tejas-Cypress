import React, { Component } from 'react';
import { Header, Container, Grid, Statistic, Responsive, Divider } from 'semantic-ui-react';
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
          columns={3}
          className="team-gallery"
          match={this.props.match}
          joinColumn
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
                  <Header as="h2" className={isMobile ? 'mb-20' : 'mb-30'}>
                    Invest in each other. Grow together
                  </Header>
                  <p className={isMobile ? 'mb-0' : 'mb-30'}>Our mission is to connect businesses and individuals to build vibrant communities.</p>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column width={8}>
                  <NSImage path="about-page.jpg" />
                </Grid.Column>
                <Grid.Column width={8}>
                  <p>
                    By using the latest crowdfunding laws and technology, NextSeed is empowering
                    business owners and everyday people to invest in one another and grow together.
                  </p>
                  <p>
                    Through NextSeed, local entrepreneurs are building places people love, creating jobs, and making a tangible impact in their neighborhoods. Investors are getting access to private investment opportunities once reserved for the well-connected and engaging with the businesses that matter most to them.
                  </p>
                  <p>
                    The team behind NextSeed created the first registered funding portal with the
                    Securities & Exchange Commission (SEC) and became a member of the Financial
                    Industry Regulatory Authority{' '}
                    (<a href="https://www.finra.org/" target="_blank" rel="noopener noreferrer">FINRA</a>).
                    {' '}The portal closed the first-ever regulation crowdfunding offering in the country. Beginning in October 2018, NextSeed Securities LLC operates as an SEC-registered broker-dealer and FINRA member.
                  </p>
                  <p>
                    Anyone in the US, regardless of income or net worth, can now invest in innovative local business concepts that are defining the new landscape of Main Street. Everyday people have an opportunity to start building a portfolio of impactful, local and community-driven investments.
                  </p>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Container>
        </section>
        <Divider fitted as={Container} />
        <section className={`${responsiveVars.uptoTablet ? 'pt-50 pb-50' : 'pt-100 pb-50'} statistic-section featured-statistic`}>
          <Container>
            <Grid centered>
              <Grid.Row>
                <Grid.Column width={14}>
                  <Header as="h2" className="mb-70" textAlign={responsiveVars.isMobile ? '' : 'center'}>
                    We{"'"}ve built our brand and our platform <Responsive minWidth={992} as="br" />on three core values.
                  </Header>
                  <Grid celled columns={isMobile ? 1 : 2} className="mb-40">
                    <Grid.Row>
                      <Grid.Column verticalAlign="middle">
                        <Header as="h2">Trust</Header>
                        <p>
                        Our team of experts vet every offering on our platform, giving people real opportunities to invest in the local businesses they believe in.
                        </p>
                      </Grid.Column>
                      <Grid.Column className="blue-block center-align">
                        <Statistic size={isMobile ? 'small' : 'large'} className="basic">
                          <Statistic.Value>Top 3%</Statistic.Value>
                          <Statistic.Label className="mb-30">
                          Business applicants approved and launched campaigns <sup>1</sup>
                          </Statistic.Label>
                          <Statistic.Value>90%+</Statistic.Value>
                          <Statistic.Label>
                          Campaigns meet fundraising goals <sup>2</sup>
                          </Statistic.Label>
                        </Statistic>
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
                  <Grid celled columns={isMobile ? 1 : 2} className="mb-40">
                    <Grid.Row>
                      <Grid.Column verticalAlign="middle">
                        <Header as="h2">Innovation</Header>
                        <p>
                        We’re reinventing how local economies can grow from within by offering
                        access to new forms of investments and capital.
                        </p>
                      </Grid.Column>
                      <Grid.Column className="primary-block center-align">
                        <Statistic size={isMobile ? 'small' : 'large'} className="basic">
                          <Statistic.Value>May 2016</Statistic.Value>
                          <Statistic.Label className="mb-30">
                            NextSeed US LLC became the first Funding Portal registered by the SEC
                          </Statistic.Label>
                          <Statistic.Value>October 2018</Statistic.Value>
                          <Statistic.Label>
                            NextSeed Securities LLC is licensed and registered with the SEC as a
                            broker-dealer
                          </Statistic.Label>
                        </Statistic>
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
                  <Grid celled columns={isMobile ? 1 : 2}>
                    <Grid.Row>
                      <Grid.Column verticalAlign="middle">
                        <Header as="h2">Community</Header>
                        <p>
                        We empower entrepreneurs from all walks of life to follow their
                        dreams and give back to their communities.
                        </p>
                      </Grid.Column>
                      <Grid.Column className="green-block center-align">
                        <Statistic size={isMobile ? 'small' : 'large'} className="basic">
                          <Statistic.Value>$8.9 million</Statistic.Value>
                          <Statistic.Label className="mb-30">
                            Invested in women and minority-owned businesses <sup>3</sup>
                          </Statistic.Label>
                          <Statistic.Value>80%</Statistic.Value>
                          <Statistic.Label>
                            Issuers are women and minority-owned businesses <sup>4</sup>
                          </Statistic.Label>
                        </Statistic>
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
                </Grid.Column>
              </Grid.Row>
            </Grid>
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
            <p className={`${responsiveVars.isMobile ? '' : 'center-align mb-10'} note`}>
              <sup>3,4</sup> Data reflects figures from both the NextSeed TX and Reg CF
              Platforms as of October 2018.
            </p>
          </Container>
        </section>
        <Divider fitted as={Container} />
        <section className={responsiveVars.uptoTablet ? 'pt-50 pb-50' : 'pt-100 pb-100'}>
          <Container>
            <Grid centered>
              <Grid.Column textAlign={isMobile ? 'left' : 'center'} computer={10} tablet={10} mobile={16}>
                <Header as="h2" className="mb-30">Meet our team</Header>
                <p className={isMobile ? 'mb-40' : 'mb-60'}>
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
            <Grid centered>
              <Grid.Column textAlign={isMobile ? 'left' : 'center'} computer={12} tablet={12} mobile={16}>
                <Header as="h2">
                  Democratize finance. Create change. Join our team.
                </Header>
                <p className="mt-30">
                  We’re just getting started in our journey to shape the future of finance in
                  local communities. We’re looking for talented and motivated individuals who
                  are seeking an adventure to learn new skills and cover new ground. If you are
                  a self-starter and love working in a dynamic environment, NextSeed may be
                  the place for you.
                </p>
                <NSImage path="collage.jpg" className={`${isMobile ? 'mt-30 mb-40' : 'mt-60 mb-70'} careers-banner`} />
                {!isMobile && <Divider hidden section />}
                <Header as="h4" className="mb-20">About NextSeed</Header>
                <p className="left-align">
                  NextSeed Inc. (<a target="_blank" rel="noreferrer noopener" href="https://www.nextseed.com">www.nextseed.com</a>) is a
                  financial technology company designed to empower mainstream entrepreneurs with
                  financing needs and connect them to investors (whether individuals or firms)
                  looking to invest directly into local businesses and commercial real estate
                  projects as a differentiated private asset class. We have developed a unique
                  online marketplace that enables entrepreneurs to fundraise through both accredited
                  and non-accredited investors across the country. NextSeed Inc.’s affiliate,
                  NextSeed Securities, is a registered broker dealer and FINRA member.
                </p>
                <p className="left-align">
                  We are headquartered in Houston, TX with satellite offices in Austin, New York
                  and Los Angeles. As a rapidly growing startup that leverages cutting edge
                  technologies to help us scale quickly, we are looking for highly motivated
                  individuals to join the team.
                </p>
                <p className="left-align">
                  Contact info: Submit your resume to <a target="_blank" rel="noreferrer noopener" href="mailto:jobs@nextseed.com">jobs@nextseed.com</a>
                  and indicate position in the subject line.
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
