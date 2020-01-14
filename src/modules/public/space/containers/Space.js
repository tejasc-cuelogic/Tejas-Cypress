import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Responsive, Grid, Divider, Header, Container, List, Icon, Button, Item, Segment, Card, Modal } from 'semantic-ui-react';
import Banner from '../components/Banner';
import NSImage from '../../../shared/NSImage';

@inject('navStore', 'userStore', 'uiStore')
@observer
class Space extends Component {
  render() {
    const { responsiveVars } = this.props.uiStore;
    const { location } = this.props;
    const alumini = [
      {
        title: 'Breaking Bao',
        image: 'space/breaking.jpg',
        description: 'Fusion steamed buns featuring unique and compelling flavor combinations',
        link: 'https://www.breakingbao.com/',
      },
      {
        title: 'Pura Vida',
        image: 'space/pura-vida.jpg',
        description: 'Cold bar serving fresh ceviche and homemade artisanal teas',
        link: 'https://houston.eater.com/2019/8/12/20802393/pura-vida-pop-up-nextseed-space-greenway-plaza',
      },
      {
        title: 'The DoughCone',
        image: 'space/theDoughCone.jpg',
        description: 'Handmade Donut Cones & Ice Cream with unlimited toppings',
        link: 'https://www.facebook.com/TheDoughCone/',
      },
      {
        title: 'Tlahuac',
        image: 'space/tlahuac.jpg',
        description: 'Central Mexican cuisine and pan dulce in Houston, TX',
        link: 'https://www.facebook.com/TlahuacHTX/',
      },
      {
        title: 'The Waffle Bus',
        image: 'space/the-waffle-bus.jpg',
        description: 'Zagat-rated chicken & waffles in Houston, TX',
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
                <Header as="h2" className={responsiveVars.uptoTablet ? 'mb-30' : 'mb-50'}>Not your average retail</Header>
                <p>
                  NextSeed Space enables entrepreneurs to test and grow concepts with move-in ready, short-term leases.
                </p>
                <Divider hidden />
                <p>
                  By focusing on what is needed to quickly open and operate their businesses, NextSeed Space allows tenants to immediately thrive while reducing delays, distractions, and other typical retail hurdles.
                </p>
              </Grid.Column>
              <Grid.Column width={responsiveVars.uptoTablet ? 16 : 7} floated="right">
                <NSImage path="space/img-1.jpg" />
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
                  <List.Item className={responsiveVars.isMobile ? 'mt-0' : 'mb-20'}>
                    <Icon className="ns-tick" color="grey" size="large" />
                    Move-in ready kitchen and storefront
                  </List.Item>
                  <List.Item className={responsiveVars.isMobile ? 'mt-14' : 'mb-20'}>
                    <Icon className="ns-tick" color="grey" size="large" />
                    Permitting and lease negotiations
                  </List.Item>
                  <List.Item className={responsiveVars.isMobile ? 'mt-0' : 'mb-20'}>
                    <Icon className="ns-tick" color="grey" size="large" />
                    The latest point-of-sale technology
                  </List.Item>
                  <List.Item className={responsiveVars.isMobile ? 'mt-14' : 'mb-20'}>
                    <Icon className="ns-tick" color="grey" size="large" />
                    Marketing support to drive business
                  </List.Item>
                </List>
                <Button className="mt-40" secondary>Contact Us</Button>
              </Grid.Column>
              <Grid.Column width={responsiveVars.uptoTablet ? 16 : 7} floated="right">
                <p className="quotes left-align space-quotes">
                  <sup><Icon size="tiny" color="blue" className="ns-quote-left" /></sup> One of the biggest hurdles for a small business is the build-out process. A talented chef or designer might be very skilled at their craft, but many other factors are critical to opening a storefront including the capital raise, lease negotiation, design, permitting, construction and marketing. Finding ways to assist the entrepreneur in reducing complexity and controlling risks at this juncture is critical. <sup><Icon size="tiny" color="blue" className="ns-quote-right" /></sup>
                </p>
                <Item.Group className="space-user">
                  <Item>
                    <NSImage path="space/monte-large.png" circular />
                    <Item.Content>
                      <Item.Header>Monte Large</Item.Header>
                      <Item.Meta>NextSeed Space</Item.Meta>
                    </Item.Content>
                  </Item>
                </Item.Group>
              </Grid.Column>
            </Grid>
          </section>
          <Divider fitted />
          <section className={responsiveVars.uptoTablet ? 'pt-50 pb-50' : 'pt-100 pb-100'}>
            <Header as="h2" className="mb-80 center-align">Currently at NextSeed Space</Header>
            <Segment className="no-shadow">
              <Grid stackable>
                <Grid.Column width="5" className="plr-0 pt-0 pb-0">
                  <NSImage path="space/chicken-and-rice.jpg" />
                </Grid.Column>
                <Grid.Column width="11" verticalAlign="middle" textAlign="center">
                  <Header as="h3">The Chicken & Rice Guys</Header>
                  <p>Boston{"'"}s original Halal-style street food has arrived in Houston</p>
                  <Modal trigger={<Button className="mt-40" basic secondary>Visit at Greenway Plaza</Button>} closeIcon className="nss-modal">
                    <Modal.Content image className="plr-0 pt-0 pb-0">
                      <NSImage wrapped path="space/chicken-and-rice-portrait.jpg" />
                      <Modal.Description>
                        <Header as="h2">The Chicken<Responsive as="br" minWidth={992} /> & Rice Guys</Header>
                        <Header as="h3" className="mb-0">Boston{"'"}s hit food truck,<Responsive as="br" minWidth={992} /> now in Houston!</Header>
                        <Divider section />
                        <p className="mb-20"><b>Come visit at Greenway Plaza</b></p>
                        <p className="mb-0">
                        The HUB at Greenway Plaza<Responsive as="br" minWidth={992} />
                        5 Greenway Plaza - Suite C-615<Responsive as="br" minWidth={992} />
                        Houston, TX 77046
                        </p>
                        <Divider section />
                        <a className="primary-two-text mt-20" href="https://www.facebook.com/cnrguys/" target="_blank" rel="noopener noreferrer">Visit The Chicken & Rice Guys on Facebook</a>
                      </Modal.Description>
                    </Modal.Content>
                  </Modal>
                </Grid.Column>
              </Grid>
            </Segment>
          </section>
          <Divider fitted />
          <section className={responsiveVars.uptoTablet ? 'pt-50 pb-50' : 'pt-100 pb-100'}>
            <Header as="h2" className="mb-80 center-align">Currently at NextSeed Space</Header>
            <Card.Group itemsPerRow={3} stackable>
              {
                alumini.map(a => (
                  <Card className="bordered center-align">
                    <NSImage path={a.image} centered />
                    <Card.Content className="pb-30 pt-30">
                      <Header as="h5">{a.title}</Header>
                      <p>{a.description}</p>
                      <a target="_blank" rel="noopener noreferrer" href={a.link} className="secondary-link mt-30 display-block">Read More</a>
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
                <Header as="h2" className={responsiveVars.uptoTablet ? 'mb-30' : 'mb-40'}>Interested in learning more<Responsive as="br" minWidth={768} /> about NextSeed Space?</Header>
                <p>
                  NextSeed Space is an initiative by NextSeed, a<Responsive as="br" minWidth={768} /> community-driven investment platform focused on<Responsive as="br" minWidth={768} /> local offerings.
                </p>
                <Button className="mt-60" secondary>Contact Us</Button>
              </Grid.Column>
              <Grid.Column width={responsiveVars.uptoTablet ? 16 : 7} floated="right">
                <NSImage path="space/img-2.jpg" />
              </Grid.Column>
            </Grid>
          </section>
        </Container>
        <Modal
          size="small"
          // open={this.props.uiStore.modalStatus === 'BusinessForm'}
          closeIcon
          onOpen={this.handleOpenModal}
          onClose={this.handleCloseModal}
        />
      </>
    );
  }
}

export default Space;
