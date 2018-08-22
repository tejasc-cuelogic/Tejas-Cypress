import React, { Component } from 'react';
import { Route, Link, Switch } from 'react-router-dom';
import { Header, Icon, Grid, Image, Embed, Container, List, Divider, Breadcrumb, Segment, Reveal } from 'semantic-ui-react';
import Loadable from 'react-loadable';
import { NsCarousel, InlineLoader } from '../../../../../theme/shared';
import videoPoster from '../../../../../assets/images/636206632.webp';
import campainAboutImg from '../../../../../assets/images/campaign_about.jpg';
import teamMember1 from '../../../../../assets/images/avatar-1.jpg';
import teamMember2 from '../../../../../assets/images/owner-1.jpg';
import teamMember3 from '../../../../../assets/images/avatar-3.jpg';
import teamMember4 from '../../../../../assets/images/avatar-4.jpg';
import teamMember5 from '../../../../../assets/images/avatar-5.jpg';
import businessModel from '../../../../../assets/images/business_model.jpg';

const getModule = component => Loadable({
  loader: () => import(`../${component}`),
  loading() {
    return <InlineLoader />;
  },
});

const settings = {
  dots: true,
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: false,
};

const nsvideos = {
  embed: '218642510',
};

class AboutCompany extends Component {
  render() {
    const navItems = [
      { to: 'business', component: 'BusinessModal' },
      { to: 'locationanalysis', component: 'LocationAnalysisModal' },
      { to: 'meetourteam', component: 'MeetTeamModal' },
    ];
    return (
      <Grid>
        <Grid.Row>
          <Grid.Column width={12}>
            <div className="campaign-about-wrapper">
              <div className="carousel">
                <Container>
                  <NsCarousel {...settings}>
                    {[1, 2, 3].map(() => (
                      <Image src={videoPoster} />
                    ))}
                  </NsCarousel>
                </Container>
              </div>
              <Header as="h3">Buffbrew Taproom LLC</Header>
              <p>
              In the six years since its founding, Buffalo Bayou Brewing Company (“Buffbrew”) has
              grown and cultivated a craft brewery that is not only substantial in size, but even
              more importantly, substantive in quality. Their independent and relentless,
              boundary-pushing approach to craft brewing has resulted in an unmatched 70
              innovative beer varieties and a business that is now Houston’s largest
              self-distributing brewery. Buffbrew has outgrown its brewing space, and it has heard
              the resounding demand for a dedicated taproom and event space. The team recently
              announced its new location at Sawyer Yards (see Chron, Eater, HBJ), which will
              encompass both an expanded brewing facility as well as an opportunity for the
              community to invest in the new <b>Buffbrew Taproom LLC ({'"'}Taproom{'"'})</b>. Buffbrew
              Taproom will be a new business that operates two bars on-site, a full-service
              kitchen, as well as a VIP room and event space for group reservations and larger
              gatherings at the new location.
              </p>
              <Divider section />
              <Grid columns={2} stackable>
                <Grid.Column verticalAlign="middle" textAlign="center">
                  <p>
                  Over the years, Buffbrew has developed a lineup of products that has drawn an
                  adventurous community. Its brewing methods have applied cutting-edge technology,
                  technique and unique flavor profiles to achieve a unique and superior taste that
                  the team is extremely proud of. As important, its self-distributing model gives
                  the business a degree of independence and control over its product that no other
                  Houston brewery has matched.
                  </p>
                </Grid.Column>
                <Grid.Column>
                  <Embed
                    id={nsvideos.embed}
                    placeholder={videoPoster}
                    source="vimeo"
                  />
                </Grid.Column>
              </Grid>
              <Divider section />
              <p>
              The new Sawyer Yards location will allow Buffbrew the space to make beer and host
              guests in a beautifully and thoughtfully designed home. Standing three stories
              tall with over 28,000 square feet, the brewery will welcome a steady flow of beer
              enthusiasts, 7 days a week. The cornerstone of this experience will be the
              state-of-the-art Buffbrew Taproom, with over 40 beers on tap and a full-service
              kitchen serving up an elevated bar food menu.
              </p>
              <Image src={campainAboutImg} centered className="mt-30 mb-30" />
              <p>
              The team’s partnership with Method Architecture has been a process in staying true
              to the beloved elements of Buffbrew’s current home on Nolda Street – an immersive,
              picnic-tables-on-concrete feel – while creating a new, unparalleled scenic view.
              </p>
              <p>
              The main taproom will reside on the second floor. On one side, customers will be
              met with 30 feet of large, plate glass windows that directly overlook the tanks
              and brewers at work – a true tank-to-table, or tank-to-tap, experience. In line
              with its “Urban Brewery” designation, taproom patrons will also face magnificent
              Houston views with over 50 feet of downtown-facing windows. With no taller
              buildings standing between the brewery and downtown, the city’s skyline will make
              for a beautiful backdrop for private events, holidays, and any other reason to
              spend an evening on the rooftop patio or party room.
              </p>
              <Header as="h5">
                Breaking ground this winter, the Buffbrew Taproom is expected to open at Sawyer
                Yards at the end of 2018.
              </Header>

              <div className="history-section">
                <Header as="h3">History</Header>
                <List>
                  <List.Item>
                    <Icon className="ns-flag-line" color="green" />
                    <List.Content>
                      <List.Header>January 2012</List.Header>
                      <List.Description>
                        Original Buffalo Bayou Brewery location on Nolda Street opens
                      </List.Description>
                    </List.Content>
                  </List.Item>
                  <List.Item>
                    <Icon className="ns-flag-line" color="green" />
                    <List.Content>
                      <List.Header>December 2012</List.Header>
                      <List.Description>
                        Barrel production of 750 during first year
                      </List.Description>
                    </List.Content>
                  </List.Item>
                  <List.Item>
                    <Icon className="ns-flag-line" color="green" />
                    <List.Content>
                      <List.Header>December 2012</List.Header>
                      <List.Description>
                        Barrel production of 750 during first year
                      </List.Description>
                    </List.Content>
                  </List.Item>
                  <List.Item>
                    <Icon className="ns-flag-line" color="green" />
                    <List.Content>
                      <List.Header>December 2012</List.Header>
                      <List.Description>
                        Barrel production of 750 during first year
                      </List.Description>
                    </List.Content>
                  </List.Item>
                  <List.Item>
                    <Icon className="ns-flag-line" color="green" />
                    <List.Content>
                      <List.Header>December 2012</List.Header>
                      <List.Description>
                        Barrel production of 750 during first year
                      </List.Description>
                    </List.Content>
                  </List.Item>
                  <List.Item>
                    <Icon className="ns-flag-line" color="green" />
                    <List.Content>
                      <List.Header>
                        Winter 2018 Anticipated opening of Buffbrew Taproom at Sawyer Yard
                      </List.Header>
                    </List.Content>
                  </List.Item>
                </List>
              </div>
            </div>
          </Grid.Column>
          <Grid.Column width={4}>
            <div className="campaign-right-sidebar">
              <Segment padded>
                <Breadcrumb className="mb-20">
                  <Breadcrumb.Section as={Link} to={`${this.props.match.url}/meetourteam`}>
                  Meet our team
                  </Breadcrumb.Section>
                  <Breadcrumb.Divider icon={{ className: 'ns-chevron-right' }} />
                </Breadcrumb>
                <Grid doubling columns={3}>
                  <Grid.Column>
                    <Reveal animated="small fade">
                      <Reveal.Content hidden>
                        <div className="team-overlay">
                          <p>Rassul Zarinfar</p>
                        </div>
                      </Reveal.Content>
                      <Reveal.Content visible>
                        <Image src={teamMember1} circular />
                      </Reveal.Content>
                    </Reveal>
                  </Grid.Column>
                  <Grid.Column>
                    <Reveal animated="fade">
                      <Reveal.Content hidden>
                        <div className="team-overlay">
                          <p>Alex Griggs</p>
                        </div>
                      </Reveal.Content>
                      <Reveal.Content visible>
                        <Image src={teamMember2} circular />
                      </Reveal.Content>
                    </Reveal>
                  </Grid.Column>
                  <Grid.Column>
                    <Reveal animated="fade">
                      <Reveal.Content hidden>
                        <div className="team-overlay">
                          <p>Ryan Robertson</p>
                        </div>
                      </Reveal.Content>
                      <Reveal.Content visible>
                        <Image src={teamMember3} circular />
                      </Reveal.Content>
                    </Reveal>
                  </Grid.Column>
                  <Grid.Column>
                    <Reveal animated="fade">
                      <Reveal.Content hidden>
                        <div className="team-overlay">
                          <p>Troy Witherspoon</p>
                        </div>
                      </Reveal.Content>
                      <Reveal.Content visible>
                        <Image src={teamMember4} circular />
                      </Reveal.Content>
                    </Reveal>
                  </Grid.Column>
                  <Grid.Column>
                    <Reveal animated="fade">
                      <Reveal.Content hidden>
                        <div className="team-overlay">
                          <p>Tre O{"'"}Brien</p>
                        </div>
                      </Reveal.Content>
                      <Reveal.Content visible>
                        <Image src={teamMember5} circular />
                      </Reveal.Content>
                    </Reveal>
                  </Grid.Column>
                </Grid>
              </Segment>
              <Segment padded>
                <Breadcrumb className="mb-20">
                  <Breadcrumb.Section as={Link} to={`${this.props.match.url}/business`}>Business Model</Breadcrumb.Section>
                  <Breadcrumb.Divider icon={{ className: 'ns-chevron-right' }} />
                </Breadcrumb>
                <Image src={businessModel} />
              </Segment>
              <Segment padded>
                <Breadcrumb className="mb-20">
                  <Breadcrumb.Section as={Link} to={`${this.props.match.url}/locationanalysis`}>
                    Location Analysis
                  </Breadcrumb.Section>
                  <Breadcrumb.Divider icon={{ className: 'ns-chevron-right' }} />
                </Breadcrumb>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3782.8980695673813!2d73.87562555088532!3d18.53350778733976!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2c0f824992459%3A0x4f126e7b4c0ac0f6!2sCuelogic+Technologies!5e0!3m2!1sen!2sin!4v1530687811942"
                  title="test"
                />
              </Segment>
            </div>
          </Grid.Column>
        </Grid.Row>
        <Switch>
          {
            navItems.map(item => (
              <Route key={item.to} path={`${this.props.match.url}/${item.to}`} component={getModule(item.component)} />
            ))
          }
        </Switch>
      </Grid>
    );
  }
}

export default AboutCompany;
