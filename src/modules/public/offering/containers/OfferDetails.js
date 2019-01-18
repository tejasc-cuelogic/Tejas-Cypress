import React, { Component } from 'react';
import Aux from 'react-aux';
import { get, find } from 'lodash';
import { inject, observer } from 'mobx-react';
import { Route, Switch, Link, withRouter } from 'react-router-dom';
import Loadable from 'react-loadable';
import { Responsive, Container, Grid, Icon, Header, Progress, Popup, Button, Statistic, Visibility, List } from 'semantic-ui-react';
import { GetNavMeta } from '../../../../theme/layout/SidebarNav';
import { Spinner, InlineLoader, MobileDropDownNav, Image64 } from '../../../../theme/shared';
import CampaignSideBar from '../components/campaignDetails/CampaignSideBar';
import InvestNow from '../components/investNow/InvestNow';
import ConfirmLoginModal from '../components/ConfirmLoginModal';
import Agreement from '../components/investNow/agreement/components/Agreement';
import Congratulation from '../components/investNow/agreement/components/Congratulation';
import DevPassProtected from '../../../auth/containers/DevPassProtected';
import NotFound from '../../../shared/NotFound';
import Footer from './../../../../theme/layout/Footer';
import { DataFormatter } from '../../../../helper';
import OfferingMetaTags from '../components/OfferingMetaTags';
import AboutPhotoGallery from './../components/campaignDetails/AboutPhotoGallery';

const getModule = component => Loadable({
  loader: () => import(`../components/campaignDetails/${component}`),
  loading() {
    return <InlineLoader />;
  },
});

@inject('campaignStore', 'userStore', 'navStore')
@withRouter
@observer
class offerDetails extends Component {
  state = {
    showPassDialog: false,
  }
  componentWillMount() {
    const { currentUser } = this.props.userStore;
    if ((!currentUser || (currentUser && !currentUser.roles.includes('admin'))) && this.props.match.url.includes('preview')) {
      this.props.campaignStore.getIssuerIdForOffering(this.props.match.params.id).then((data) => {
        if (currentUser && (currentUser.roles.includes('issuer') || currentUser.roles.includes('investor'))) {
          if (data && data.length && data[0].issuerId === currentUser.sub) {
            this.setState({ showPassDialog: false });
            this.props.campaignStore.getCampaignDetails(this.props.match.params.id);
          } else {
            this.setState({ showPassDialog: true });
          }
        } else {
          this.setState({ showPassDialog: true });
        }
      });
    } else {
      this.setState({ showPassDialog: false });
      this.props.campaignStore.getCampaignDetails(this.props.match.params.id);
    }
  }
  getOgDataFromSocial = (obj, type, att) => {
    const data = find(obj, o => o.type === type);
    return get(data, att) || '';
  };
  authPreviewOffer = (isAuthenticated) => {
    if (isAuthenticated) {
      this.setState({ showPassDialog: false });
      this.props.campaignStore.getCampaignDetails(this.props.match.params.id);
    }
  }
  handleUpdate = (e, { calculations }) => this.props.navStore.setNavStatus(calculations);
  handleViewGallery = (e) => {
    e.preventDefault();
    this.props.history.push(`${this.props.match.url}/photogallery`);
  }
  render() {
    const {
      match, campaignStore, location, navStore,
    } = this.props;
    const navItems = GetNavMeta(match.url, [], true).subNavigations;
    const {
      details, campaignSideBarShow, campaign, navCountData,
    } = campaignStore;
    const terminationDate = campaign && campaign.offering && campaign.offering.launch
    && campaign.offering.launch.terminationDate;
    const diff = DataFormatter.diffDays(terminationDate);
    const collected = campaign && campaign.fundedAmount ? campaign.fundedAmount : 0;
    const minOffering = campaign && campaign.keyTerms &&
      campaign.keyTerms.minOfferingAmount ? campaign.keyTerms.minOfferingAmount : 0;
    const flagStatus = collected >= minOffering;
    const address = campaign && campaign.keyTerms ?
      `${campaign.keyTerms.city ? campaign.keyTerms.city : '-'}, ${campaign.keyTerms.state ? campaign.keyTerms.state : '-'}` : '--';
    if (this.state.showPassDialog) {
      return (<DevPassProtected
        previewPassword={campaign && campaign.previewPassword}
        offerPreview
        authPreviewOffer={this.authPreviewOffer}
      />);
    }
    if (!details || details.loading) {
      return <Spinner loaderMessage="Loading.." />;
    }
    if (details && details.data &&
      details.data.getOfferingDetailsBySlug && !details.data.getOfferingDetailsBySlug[0]) {
      return <NotFound />;
    }
    const { navStatus, subNavStatus } = navStore;
    return (
      <Aux>
        {campaign &&
          <OfferingMetaTags campaign={campaign} getOgDataFromSocial={this.getOgDataFromSocial} />
        }
        <section className="campaign-details-banner banner">
          <Responsive minWidth={768} as={Container}>
            <Grid relaxed>
              <Grid.Column width={10}>
                <div className="video-wrapper">
                  {campaign && campaign.media &&
                    campaign.media.heroVideo && campaign.media.heroVideo.url ?
                      <Link to={`${this.props.match.url}/herovideo`}>
                        <Image64
                          srcUrl={campaign && campaign.media &&
                            campaign.media.heroImage &&
                            campaign.media.heroImage.url ?
                            campaign.media.heroImage.url : null
                          }
                          imgType="heroImage"
                        />
                        <Icon className="ns-play play-icon" />
                      </Link>
                      :
                      <Image64
                        srcUrl={campaign && campaign.media &&
                          campaign.media.heroImage &&
                          campaign.media.heroImage.url ?
                          campaign.media.heroImage.url : null
                        }
                        imgType="heroImage"
                      />
                  }
                  <div className="offer-stats">
                    <Statistic.Group>
                      <Statistic size="mini" className="basic">
                        <Statistic.Value>{diff || 0}</Statistic.Value>
                        <Statistic.Label>Days left</Statistic.Label>
                      </Statistic>
                      <Statistic size="mini" className="basic">
                        <Statistic.Value>
                          {(campaign && campaign.closureSummary &&
                            campaign.closureSummary.totalInvestorCount) || 0}
                        </Statistic.Value>
                        <Statistic.Label>Investors</Statistic.Label>
                      </Statistic>
                      <Statistic size="mini" className="basic">
                        <Statistic.Value>
                          {(campaign && campaign.keyTerms && campaign.keyTerms.earlyBirdsCount)
                            || 0}
                        </Statistic.Value>
                        <Statistic.Label>Early Bird Rewards</Statistic.Label>
                      </Statistic>
                    </Statistic.Group>
                  </div>
                </div>
                <div className="clearfix social-links mt-10">
                  <div className="pull-left">
                    <a href="/" target="_blank" rel="noopener noreferrer">
                      <Icon color="white" name="instagram" />
                    </a>
                    <a href="/" target="_blank" rel="noopener noreferrer">
                      <Icon color="white" name="twitter" />
                    </a>
                    <a href="/" target="_blank" rel="noopener noreferrer">
                      <Icon color="white" name="facebook" />
                    </a>
                  </div>
                  <Link to={this.props.match.url} onClick={this.handleViewGallery} className="pull-right">
                    View gallery <Icon size="small" className="ns-chevron-right" />
                  </Link>
                </div>
              </Grid.Column>
              <Grid.Column width={6}>
                <Header as="h3" inverted>
                  {campaign && campaign.keyTerms && campaign.keyTerms.shorthandBusinessName}
                  <Header.Subheader>{address}</Header.Subheader>
                </Header>
                <Statistic inverted size="tiny" className="basic mb-0">
                  <Statistic.Value>
                    <span className="highlight-text">$35,000</span> raised
                  </Statistic.Value>
                  <Statistic.Label>of $50,000 min{' '}
                    <Popup
                      trigger={<Icon name="help circle" color="green" />}
                      content="If the minimum goal is not met by the end of the offering period, any funds you invest will be automatically returned to your NextSeed account."
                      position="top center"
                    />
                  </Statistic.Label>
                </Statistic>
                {/* <Header as="h3" inverted>
                  <span className="highlight-text">$35,000</span> raised
                  <Header.Subheader>of $50,000 min{' '}
                    <Popup
                      trigger={<Icon name="help circle" color="green" />}
                      content="Lorem Ipsum"
                      position="top center"
                    />
                  </Header.Subheader>
                </Header> */}
                <Progress inverted percent={90} size="tiny" color="green" />
                {flagStatus &&
                  <p className="flag-status">
                    <Icon name="flag" /> Surpassed minimum goal
                  </p>
                }
                <p className="raise-type mt-30">
                  <b>Revenue Sharing Note</b>{' '}
                  <Popup
                    hoverable
                    trigger={<Icon name="help circle" color="green" />}
                    content={(<span>To learn more about how Revenue Sharing works, check out the <Link to="/resources/education-center">Education Center</Link>.</span>)}
                    position="top center"
                  />
                  <br />
                  Investment Multiple: 1.4–1.5x<br />
                  Maturity: 60 Months
                </p>
                <div className="center-align">
                  <Button fluid secondary content="Invest Now" as={Link} to={`${this.props.match.url}/invest-now`} />
                  <small>
                    ${(campaign && campaign.keyTerms && campaign.keyTerms.minInvestAmt)
                      || 0} min investment
                  </small>
                </div>
              </Grid.Column>
            </Grid>
          </Responsive>
        </section>
        {/* <Responsive minWidth={768} as={Aux}>
        <Responsive minWidth={768} as={Aux}>
          <CampaignSideBar navItems={navItems} />
        </Responsive> */}
        <div className={`slide-down ${location.pathname.split('/')[2]}`}>
          <Visibility offset={[58, 10]} onUpdate={this.handleUpdate} continuous className="campaign-secondary-header">
            <div className={`menu-secondary-fixed ${navStatus === 'sub' ? 'active' : ''} ${subNavStatus}`}>
              <Container>
                <List bulleted floated="right" horizontal>
                  <List.Item>134 Investors</List.Item>
                  <List.Item>8 Hours left</List.Item>
                  <Button secondary compact content="Invest Now" />
                </List>
                <List bulleted horizontal>
                  <List.Item>
                    <List.Header>Carmelo’s Cucina Italiana</List.Header>
                  </List.Item>
                  <List.Item>
                    <List.Header><span className="highlight-text">$100,000</span> raised</List.Header>
                  </List.Item>
                  <List.Item>1.4–1.5x Investment Multiple</List.Item>
                </List>
              </Container>
            </div>
          </Visibility>
          <Responsive maxWidth={767} as={Aux}>
            <CampaignSideBar navItems={navItems} className={campaignSideBarShow ? '' : 'collapse'} />
            <MobileDropDownNav
              inverted
              refMatch={match}
              navCountData={navCountData}
              navItems={navItems}
              location={location}
            />
          </Responsive>
          <Container>
            <section>
              <Grid>
                <Grid.Column width={4}>
                  <CampaignSideBar navItems={navItems} />
                </Grid.Column>
                <Grid.Column width={12}>
                  <Switch>
                    <Route exact path={match.url} component={getModule(navItems[0].component)} />
                    {
                      navItems.map((item) => {
                        const CurrentComponent = getModule(item.component);
                        return (
                          <Route key={item.to} path={`${match.url}/${item.to}`} render={props => <CurrentComponent refLink={this.props.match.url} {...props} />} />
                        );
                      })
                    }
                    <Route path={`${match.url}/invest-now`} render={props => <InvestNow refLink={this.props.match.url} {...props} />} />
                    <Route path={`${match.url}/confirm-invest-login`} render={props => <ConfirmLoginModal refLink={this.props.match.url} {...props} />} />
                    <Route path={`${match.url}/confirm-comment-login`} render={props => <ConfirmLoginModal refLink={`${this.props.match.url}/comments`} {...props} />} />
                    <Route exact path={`${match.url}/agreement`} render={() => <Agreement refLink={this.props.match.url} />} />
                    <Route exact path={`${match.url}/congratulation`} component={Congratulation} />
                    <Route path={`${this.props.match.url}/photogallery`} component={AboutPhotoGallery} />
                    <Route component={NotFound} />
                  </Switch>
                </Grid.Column>
              </Grid>
            </section>
          </Container>
        </div>
        <Responsive minWidth={768} as={Aux}>
          <Footer path={location.pathname} campaign={campaign} />
        </Responsive>
      </Aux>
    );
  }
}

export default offerDetails;
