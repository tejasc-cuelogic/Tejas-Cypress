import React, { Component } from 'react';
import { Route, Link, Switch } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Header, Grid, Image, Breadcrumb, Segment, Reveal } from 'semantic-ui-react';
import Loadable from 'react-loadable';
// import { forEach } from 'lodash';
import { NsCarousel, InlineLoader } from '../../../../../theme/shared';
import teamMember1 from '../../../../../assets/images/avatar-1.jpg';
import defaultLeaderProfile from '../../../../../assets/images/leader-placeholder.jpg';
// import teamMember2 from '../../../../../assets/images/owner-1.jpg';
// import teamMember3 from '../../../../../assets/images/avatar-3.jpg';
// import teamMember4 from '../../../../../assets/images/avatar-4.jpg';
// import teamMember5 from '../../../../../assets/images/avatar-5.jpg';
import businessModel from '../../../../../assets/images/business_model.jpg';
import CompanyDescriptionModal from './CompanyDescriptionModal';
import AboutPhotoGallery from './AboutPhotoGallery';
import videoPoster from '../../../../../assets/images/636206632.jpg';


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

const isTablet = document.documentElement.clientWidth >= 768
  && document.documentElement.clientWidth < 992;
const isTabletLand = document.documentElement.clientWidth >= 992
  && document.documentElement.clientWidth < 1200;

@inject('campaignStore')
@observer
class AboutCompany extends Component {
  render() {
    const navItems = [
      { to: 'business', component: 'BusinessModal' },
      { to: 'locationanalysis', component: 'LocationAnalysisModal' },
      { to: 'meetourteam', component: 'MeetTeamModal' },
    ];
    const { campaign } = this.props.campaignStore;
    return (
      <div className="campaign-content-wrapper">
        <Grid stackable>
          <Grid.Row>
            <Grid.Column widescreen={7} largeScreen={8} computer={16} tablet={16}>
              <Segment padded>
                <Breadcrumb>
                  <Breadcrumb.Section as={Link} to={`${this.props.match.url}/companydescription`}><b>Company Description</b></Breadcrumb.Section>
                  <Breadcrumb.Divider icon={{ className: 'ns-chevron-right', color: 'green' }} />
                </Breadcrumb>
                <Header as="h3">Top things to know</Header>
                <p className="detail-section" dangerouslySetInnerHTML={{ __html: campaign && campaign.offering && campaign.offering.about && campaign.offering.about.theCompany }} />
                <Link to={`${this.props.match.url}/companydescription`}>Read More</Link>
              </Segment>
            </Grid.Column>
            <Grid.Column widescreen={9} largeScreen={8} computer={16} tablet={16} className={isTabletLand && 'mt-30'}>
              <Segment padded>
                <Breadcrumb>
                  <Breadcrumb.Section as={Link} to={`${this.props.match.url}/photogallery`}><b>Gallery</b></Breadcrumb.Section>
                  <Breadcrumb.Divider icon={{ className: 'ns-chevron-right', color: 'green' }} />
                </Breadcrumb>
                <div className="carousel mt-10 mb-30">
                  <NsCarousel {...settings}>
                    {[1, 2, 3].map(() => (
                      <Image src={videoPoster} />
                    ))}
                  </NsCarousel>
                </div>
              </Segment>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row columns={isTablet ? 1 : isTabletLand ? 2 : 3} className="campaign-right-sidebar">
            <Grid.Column>
              <Segment padded>
                <Breadcrumb className="mb-20">
                  <Breadcrumb.Section as={Link} to={`${this.props.match.url}/meetourteam`}>
                    <b>Meet our team</b>
                  </Breadcrumb.Section>
                  <Breadcrumb.Divider icon={{ className: 'ns-chevron-right', color: 'green' }} />
                </Breadcrumb>
                <Grid columns={3}>
                  {
                    campaign.leadership.map(data => (
                      <Grid.Column>
                        <Reveal animated="small fade">
                          <Reveal.Content hidden>
                            <div className="team-overlay">
                              <p>{`${data.firstName} ${data.lastName}`}</p>
                            </div>
                          </Reveal.Content>
                          <Reveal.Content visible>
                            <Image src={defaultLeaderProfile} circular />
                          </Reveal.Content>
                        </Reveal>
                      </Grid.Column>
                    ))
                  }
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
            <Grid.Column className={isTabletLand && 'mt-30'}>
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
        <Route path={`${this.props.match.url}/companydescription`} component={CompanyDescriptionModal} />
        <Route path={`${this.props.match.url}/photogallery`} component={AboutPhotoGallery} />
      </div>
    );
  }
}

export default AboutCompany;
