import React, { Component } from 'react';
import { Route, Link, Switch } from 'react-router-dom';
import { Header, Grid, Image, Breadcrumb, Segment, Reveal } from 'semantic-ui-react';
import Loadable from 'react-loadable';
import { InlineLoader } from '../../../../../theme/shared';
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

class AboutCompany extends Component {
  render() {
    const navItems = [
      { to: 'business', component: 'BusinessModal' },
      { to: 'locationanalysis', component: 'LocationAnalysisModal' },
      { to: 'meetourteam', component: 'MeetTeamModal' },
    ];
    return (
      <div className="offering-content-spacer">
        <Grid>
          <Grid.Row>
            <Grid.Column widescreen={7} computer={8}>
              <Segment padded>
                <Breadcrumb>
                  <Breadcrumb.Section link><b>Company Description</b></Breadcrumb.Section>
                  <Breadcrumb.Divider icon={{ className: 'ns-chevron-right', color: 'green' }} />
                </Breadcrumb>
                <Header as="h3">Top things to know</Header>
                <p className="detail-section">
                  In the six years since its founding, Buffalo Bayou Brewing Company (“Buffbrew”)
                  has grown and cultivated a craft brewery that is not only substantial in size,
                  but even more importantly, substantive in quality.
                </p>
                <p>
                  Their independent and relentless, boundary-pushing approach to craft brewing
                  has resulted in an unmatched 70 innovative beer varieties and a business that
                  is now Houston’s largest self-distributing brewery. Buffbrew has outgrown its
                  brewing space, and it has heard the resounding demand for a dedicated taproom
                  and event space.
                </p>
                <Link to="/">Read More</Link>
              </Segment>
            </Grid.Column>
            <Grid.Column widescreen={9} computer={8}>
              <Segment padded>
                <Breadcrumb>
                  <Breadcrumb.Section link><b>Gallery</b></Breadcrumb.Section>
                  <Breadcrumb.Divider icon={{ className: 'ns-chevron-right', color: 'green' }} />
                </Breadcrumb>
              </Segment>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row columns={3} stackable doubling className="campaign-right-sidebar">
            <Grid.Column>
              <Segment padded>
                <Breadcrumb className="mb-20">
                  <Breadcrumb.Section as={Link} to={`${this.props.match.url}/meetourteam`}>
                    <b>Meet our team</b>
                  </Breadcrumb.Section>
                  <Breadcrumb.Divider icon={{ className: 'ns-chevron-right', color: 'green' }} />
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
            </Grid.Column>
            <Grid.Column>
              <Segment padded>
                <Breadcrumb className="mb-20">
                  <Breadcrumb.Section as={Link} to={`${this.props.match.url}/business`}><b>Business Model</b></Breadcrumb.Section>
                  <Breadcrumb.Divider icon={{ className: 'ns-chevron-right', color: 'green' }} />
                </Breadcrumb>
                <Image className="business-modal" src={businessModel} fluid />
              </Segment>
            </Grid.Column>
            <Grid.Column>
              <Segment padded>
                <Breadcrumb className="mb-20">
                  <Breadcrumb.Section as={Link} to={`${this.props.match.url}/locationanalysis`}>
                    <b>Location Analysis</b>
                  </Breadcrumb.Section>
                  <Breadcrumb.Divider icon={{ className: 'ns-chevron-right', color: 'green' }} />
                </Breadcrumb>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3782.8980695673813!2d73.87562555088532!3d18.53350778733976!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2c0f824992459%3A0x4f126e7b4c0ac0f6!2sCuelogic+Technologies!5e0!3m2!1sen!2sin!4v1530687811942"
                  title="test"
                />
              </Segment>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <Switch>
          {
            navItems.map(item => (
              <Route key={item.to} path={`${this.props.match.url}/${item.to}`} component={getModule(item.component)} />
            ))
          }
        </Switch>
      </div>
    );
  }
}

export default AboutCompany;
