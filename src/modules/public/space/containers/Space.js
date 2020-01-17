import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Switch, Route, Link } from 'react-router-dom';
import { Responsive, Grid, Divider, Header, Container, List, Icon, Button, Item, Segment, Card } from 'semantic-ui-react';
import Banner from '../components/Banner';
import Contact from '../components/Contact';
import ChickenAndRice from '../components/ChickenAndRice';
import NSImage from '../../../shared/NSImage';

@inject('navStore', 'userStore', 'uiStore')
@observer
class Space extends Component {
  render() {
    const { responsiveVars } = this.props.uiStore;
    const { location } = this.props;
    const alumni = [
      {
        title: 'Breaking Bao',
        image: 'space/breaking.jpg',
        description: <>Fusion steamed buns featuring<Responsive as="br" maxWidth={767} /> unique and compelling flavor<Responsive as="br" maxWidth={767} /> combinations</>,
        link: 'https://www.breakingbao.com/',
      },
      {
        title: 'Pura Vida',
        image: 'space/pura-vida.jpg',
        description: <>Cold bar serving fresh ceviche and<Responsive as="br" maxWidth={767} /> homemade artisanal teas</>,
        link: 'https://houston.eater.com/2019/8/12/20802393/pura-vida-pop-up-nextseed-space-greenway-plaza',
      },
      {
        title: 'The DoughCone',
        image: 'space/theDoughCone.jpg',
        description: <>Handmade Donut Cones & Ice<Responsive as="br" maxWidth={767} /> Cream with unlimited toppings</>,
        link: 'https://www.facebook.com/TheDoughCone/',
      },
      {
        title: 'Tlahuac',
        image: 'space/tlahuac.jpg',
        description: <>Central Mexican cuisine and<Responsive as="br" maxWidth={767} /> pan dulce in Houston, TX</>,
        link: 'https://www.facebook.com/TlahuacHTX/',
      },
      {
        title: 'The Waffle Bus',
        image: 'space/the-waffle-bus.jpg',
        description: <>Zagat-rated chicken & waffles in<Responsive as="br" maxWidth={767} /> Houston, TX</>,
        link: 'https://www.chron.com/entertainment/restaurants-bars/article/Waffle-Bus-getting-permanent-location-in-the-13221311.php',
      },
    ];
    return (
      <>
        {location.pathname === '/space' ? <Banner />
          : <Responsive as="section" maxWidth={991} className={`banner ${location.pathname.split('/')[2]}`} />
        }
        <Container>
          <section className={responsiveVars.uptoTablet ? 'pt-50 pb-50' : 'pt-100 pb-100'}>
            <Grid centered reversed="mobile">
              <Grid.Column width={responsiveVars.uptoTablet ? 16 : 7} floated="left">
                <Header as="h2" className={responsiveVars.uptoTablet ? 'mb-20' : 'mb-50'}>Not your average retail</Header>
                <p>
                  NextSeed Space enables entrepreneurs to test and grow concepts with move-in ready, short-term leases.
                </p>
                <Divider hidden />
                <p>
                  By focusing on what is needed to quickly open and operate their businesses, NextSeed Space allows tenants to immediately thrive while reducing delays, distractions, and other typical retail hurdles.
                </p>
              </Grid.Column>
              <Grid.Column width={responsiveVars.uptoTablet ? 16 : 7} floated="right">
                <NSImage path="space/img-1.jpg" className={responsiveVars.uptoTablet ? 'mt-20' : ''} />
              </Grid.Column>
            </Grid>
          </section>
          <Divider fitted />
          <section className={responsiveVars.uptoTablet ? 'pt-50 pb-50' : 'pt-100 pb-100'}>
            <Grid centered reversed="mobile">
              <Grid.Column width={responsiveVars.uptoTablet ? 16 : 7} floated="left">
                <Header as="h2" className={responsiveVars.uptoTablet ? 'mb-30' : 'mb-50'}>For local restaurateurs,<Responsive as="br" minWidth={768} /> makers, and retailers</Header>
                <p>
                  Bring your new or existing concept to our turnkey retail space, with everything needed to open for business.
                </p>
                <Divider hidden />
                <List className="space-list">
                  <List.Item className={`${responsiveVars.isMobile ? 'pb-0 mt-0' : ''} mb-20`}>
                    <Icon className="ns-tick" color="grey" size="large" />
                    Move-in ready kitchen and storefront
                  </List.Item>
                  <List.Item className={`${responsiveVars.isMobile ? 'pb-0 mt-0' : ''} mb-20`}>
                    <Icon className="ns-tick" color="grey" size="large" />
                    Permitting and lease negotiations
                  </List.Item>
                  <List.Item className={`${responsiveVars.isMobile ? 'pb-0 mt-0' : ''} mb-20`}>
                    <Icon className="ns-tick" color="grey" size="large" />
                    The latest point-of-sale technology
                  </List.Item>
                  <List.Item className={responsiveVars.isMobile ? 'pb-0 mt-0' : 'mb-20'}>
                    <Icon className="ns-tick" color="grey" size="large" />
                    Marketing support to drive business
                  </List.Item>
                </List>
                {!responsiveVars.isMobile
                && <Button as={Link} to="/space/contact" className="mt-40" secondary>Contact Us</Button>}
              </Grid.Column>
              <Grid.Column width={responsiveVars.uptoTablet ? 16 : 7} floated="right">
                <p className="quotes left-align space-quotes">
      {responsiveVars.isMobile ? <span>&ldquo;</span> : <sup><Icon size="tiny" color="blue" className="ns-quote-left" /></sup>} One of the biggest hurdles for a small business is the build-out process. A talented chef or designer might be very skilled at their craft, but many other factors are critical to opening a storefront including the capital raise, lease negotiation, design, permitting, construction and marketing. Finding ways to assist the entrepreneur in reducing complexity and controlling risks at this juncture is critical. {responsiveVars.isMobile ? <span>&rdquo;</span> : <sup><Icon size="tiny" color="blue" className="ns-quote-right" /></sup>}
                </p>
                <Item.Group unstackable className="space-user">
                  <Item>
                    <NSImage path="space/monte-large.png" circular />
                    <Item.Content>
                      <Item.Header>Monte Large</Item.Header>
                      <Item.Meta>NextSeed Space</Item.Meta>
                    </Item.Content>
                  </Item>
                </Item.Group>
                {responsiveVars.isMobile
                && <Button fluid as={Link} to="/space/contact" className="mt-30" secondary>Contact Us</Button>}
              </Grid.Column>
            </Grid>
          </section>
          <Divider fitted />
          <section className={responsiveVars.uptoTablet ? 'pt-50 pb-50' : 'pt-100 pb-100'}>
            <Header as="h2" className={responsiveVars.uptoTablet ? 'mb-30' : 'mb-80 center-align'}>Currently at NextSeed Space</Header>
            <Segment className={`${responsiveVars.isMobile ? 'plr-0 pt-0 pb-0' : ''} no-shadow space-segment`}>
              <Grid stackable>
                <Grid.Column width="5" className="plr-0 pt-0 pb-0">
                  <NSImage path={`space/chicken-and-rice${responsiveVars.isMobile ? '-landscape.jpg' : '.jpg'}`} fluid={responsiveVars.isMobile} />
                </Grid.Column>
                <Grid.Column width="11" verticalAlign="middle" textAlign="center">
                  <Header as="h3" className="space-header">The Chicken & Rice Guys</Header>
                  <p>Boston{"'"}s original Halal-style street<br /> food has arrived in Houston</p>
                  <Button fluid={responsiveVars.isMobile} className={`${responsiveVars.isMobile ? 'mb-30 mt-20 space-visit-btn' : ' mt-30'} hoverable`} basic secondary as={Link} to="/space/chicken-and-rice">Visit at Greenway Plaza</Button>
                </Grid.Column>
              </Grid>
            </Segment>
          </section>
          <Divider fitted />
          <section className={responsiveVars.uptoTablet ? 'pt-50 pb-50' : 'pt-100 pb-100'}>
            <Header as="h2" className={responsiveVars.uptoTablet ? 'mb-50' : 'mb-80 center-align'}>Alumni</Header>
            <Card.Group itemsPerRow={3} stackable>
              {
                alumni.map(a => (
                  <Card className={`${responsiveVars.isMobile ? 'alumni-card' : ''} bordered center-align`}>
                    <NSImage path={a.image} centered fluid={responsiveVars.isMobile} />
                    <Card.Content className="pb-30 pt-30">
                      <Header as="h5" className={responsiveVars.isMobile ? 'mb-half' : ''}>{a.title}</Header>
                      <p>{a.description}</p>
                      <a target="_blank" rel="noopener noreferrer" href={a.link} className={`${responsiveVars.isMobile ? 'mt-20' : 'mt-30'} secondary-link display-block`}>Read More</a>
                    </Card.Content>
                  </Card>
                ))
              }
            </Card.Group>
          </section>
          <Divider fitted />
          <section className={responsiveVars.uptoTablet ? 'pt-50 pb-50' : 'pt-100 pb-100'}>
            <Grid centered reversed="mobile">
              <Grid.Column width={responsiveVars.uptoTablet ? 16 : 8} floated="left">
                <Header as="h2" className={responsiveVars.uptoTablet ? 'mb-30' : 'mb-40'}>Interested in learning more<Responsive as="br" minWidth={992} /> about NextSeed Space?</Header>
                <p>
                  NextSeed Space is an initiative by NextSeed, a<Responsive as="br" minWidth={768} /> community-driven investment platform focused on<Responsive as="br" minWidth={768} /> local offerings.
                </p>
                {!responsiveVars.isMobile
                && <Button as={Link} to="/space/contact" className="mt-60" secondary>Contact Us</Button>}
              </Grid.Column>
              <Grid.Column width={responsiveVars.uptoTablet ? 16 : 7} floated="right">
                <NSImage path="space/img-2.jpg" />
                {responsiveVars.isMobile
                && <Button fluid as={Link} to="/space/contact" className="mt-40" secondary>Contact Us</Button>}
              </Grid.Column>
            </Grid>
          </section>
        </Container>
        <Switch>
          <Route exact path="/space/contact" component={Contact} />
          <Route exact path="/space/chicken-and-rice" component={ChickenAndRice} />
        </Switch>
      </>
    );
  }
}

export default Space;
