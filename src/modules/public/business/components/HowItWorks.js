import React from 'react';
import Aux from 'react-aux';
import { Link } from 'react-router-dom';
import { Header, Grid, Button, Image, Container, Embed, List, Statistic, Divider, Responsive, Item } from 'semantic-ui-react';
import { NsCarousel } from '../../../../theme/shared';
import supportIcon from '../../../../assets/images/icons/support.svg';
import sellingIcon from '../../../../assets/images/icons/selling.svg';
import networkIcon from '../../../../assets/images/icons/network.svg';
import carouselImg from '../../../../assets/images/business/lian.png';
import videoPoster from '../../../../assets/images/636206632.jpg';
import UserOne from '../../../../assets/images/business/img-2.png';
import UserTwo from '../../../../assets/images/business/img.png';
import UserThree from '../../../../assets/images/business/img-1.png';
import UserFour from '../../../../assets/images/business/img-5.png';
import UserFive from '../../../../assets/images/business/img-3.png';
import UserSix from '../../../../assets/images/business/img-4.png';

const nsvideos = {
  embed: '247714163',
};
const settings = {
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: true,
  dots: false,
};
const isMobile = document.documentElement.clientWidth < 768;

const HowItWorks = () => (
  <Aux>
    <section>
      <Container>
        <Responsive maxWidth={767} as={Aux}>
          <Header as="h2">Accelerate your growth with the power of the crowd.</Header>
          <div className="center-align">
            <Button.Group>
              <Button secondary content="Apply Business" />
              <Button secondary content="Apply for CRE" />
            </Button.Group>
          </div>
          <Divider section />
        </Responsive>
        <Header as="h2" className={isMobile ? 'mb-50' : 'mb-80'} textAlign={isMobile ? 'left' : 'center'}>
          Get flexible financing that doesn’t <Responsive minWidth={768} as="br" />cost you everything.
        </Header>
        <Grid stackable columns={3} doubling>
          <Grid.Column className="info-grid">
            <Image src={sellingIcon} verticalAlign="top" />
            <div>
              <Header as="h5">New, community-driven approach</Header>
              <p>
                Don’t be limited by your network. With NextSeed, everyone is now a potential
                source of capital – and a potential customer and advocate.
              </p>
            </div>
          </Grid.Column>
          <Grid.Column className="info-grid">
            <Image src={supportIcon} verticalAlign="top" />
            <div>
              <Header as="h5">Simpler, easier, with support built in</Header>
              <p>
                NextSeed streamlines your fundraising, up until your final payment to investors.
                We’re with you at every step, so you can raise capital without losing sight of
                your business.
              </p>
            </div>
          </Grid.Column>
          <Grid.Column className="info-grid">
            <Image src={networkIcon} verticalAlign="top" />
            <div>
              <Header as="h5">Cost-effective capital, with marketing benefits</Header>
              <p>
                With NextSeed, you have access to a unique type of loan that maximizes
                your ownership stake. Share your concept with thousands of local
                investors, as well as your fans all over the country.
              </p>
            </div>
          </Grid.Column>
        </Grid>
        <Grid className="business-learn-more">
          <Grid.Row>
            <Grid.Column className="center-align">
              <List horizontal relaxed className="learn-more-list left-align">
                <List.Item>
                  <List.Header>Learn more</List.Header>
                  {/* <List.Icon className="ns-arrow-right" color="green" /> */}
                  <List.Content>Why fundraise on <a href="/">NextSeed?</a></List.Content>
                </List.Item>
                <List.Item>
                  {!isMobile &&
                    <List.Header>&nbsp;</List.Header>
                  }
                  {/* <List.Icon className="ns-arrow-right" color="green" /> */}
                  <List.Content>Is fundraising on <a href="/">NextSeed risky?</a></List.Content>
                </List.Item>
              </List>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    </section>
    <Divider fitted as={Container} />
    <section>
      <Container textAlign={isMobile ? 'left' : 'center'}>
        <Header as="h2" className={isMobile ? 'mb-40' : 'mb-80'}>We work with Main Street businesses.</Header>
      </Container>
      {!isMobile ?
        <Container>
          <Grid centered stackable columns={3} className="vertical-gutter">
            <Grid.Column textAlign="center">
              <Image src={UserOne} centered />
              <Header as="h5">Breweries & Distilleries</Header>
              <p>Wichita Falls Brewery raised $125,000 to build out a new taproom</p>
            </Grid.Column>
            <Grid.Column textAlign="center">
              <Image src={UserTwo} centered />
              <Header as="h5">Restaurants & Bars</Header>
              <p>PORTERS raised $500,000 to open a new steakhouse.</p>
            </Grid.Column>
            <Grid.Column textAlign="center">
              <Image src={UserThree} centered />
              <Header as="h5">Fitness Studios</Header>
              <p>Alkalign Studios raised $100,000 to expand franchising opportunities.</p>
            </Grid.Column>
            <Grid.Column textAlign="center">
              <Image src={UserFour} centered />
              <Header as="h5">Health & Wellness</Header>
              <p>Healing Waters raised $110,000 to open a new floatation spa.</p>
            </Grid.Column>
            <Grid.Column textAlign="center">
              <Image src={UserFive} centered />
              <Header as="h5">Hospitality</Header>
              <p>The Native raised $396,500 to open a boutique hostel and bar.</p>
            </Grid.Column>
            <Grid.Column textAlign="center">
              <Image src={UserSix} centered />
              <Header as="h5">Co-working</Header>
              <p>The Annex HTX raised $230,500 to build a co-working and retail space.</p>
            </Grid.Column>
          </Grid>
        </Container>
      :
        <Aux>
          <Container>
            <NsCarousel {...settings}>
              {
                [1, 2, 3].map(i => (
                  <div key={i}>
                    <Grid.Column textAlign="center" className="center-align">
                      <Image src={UserOne} centered />
                      <Header as="h5">Breweries & Distilleries</Header>
                      <p>Wichita Falls Brewery raised $125,000 to build out a new taproom</p>
                    </Grid.Column>
                  </div>
                ))
              }
            </NsCarousel>
          </Container>
        </Aux>
      }
    </section>
    <Divider fitted as={Container} />
    <section>
      <Container>
        <NsCarousel {...settings}>
          {
            [1, 2, 3].map(i => (
              <Item.Group key={i}>
                <Item>
                  <Item.Image size="medium" src={carouselImg} circular />
                  <Item.Content verticalAlign="middle">
                    <Item.Header as="h2">Real sucess stories {i}.</Item.Header>
                    <Item.Description className={isMobile ? 'mb-20' : 'mb-50 mt-20'}>
                      “The NextSeed process was extremely smooth and allowed me to focus on
                      getting Pitch 25 up and running. The amount of community buzz that we
                      got through this process gave our business a huge boost.”
                    </Item.Description>
                    <Item.Extra className="testimonial-user-details">
                      <p><b>Brian Ching | Pitch 25</b></p>
                      <span>$549,900 from 392 investors</span>
                    </Item.Extra>
                  </Item.Content>
                </Item>
              </Item.Group>
            ))
          }
        </NsCarousel>
      </Container>
    </section>
    <Divider fitted as={Container} />
    <section className="proven-result-section">
      <Container>
        <Grid columns={2} stackable>
          <Grid.Column>
            <Header as="h2">Proven results.</Header>
            <p className="mb-30">
              Every day, entrepreneurs like you are raising capital on
              NextSeed to bring their concepts to life.
            </p>
            <Grid columns={2} stackable>
              <Grid.Row>
                <Grid.Column>
                  <Statistic color="green" size="mini" className="basic">
                    <Statistic.Value>$10M+</Statistic.Value>
                    <Statistic.Label>In capital deployed by NextSeed investors</Statistic.Label>
                  </Statistic>
                </Grid.Column>
                <Grid.Column>
                  <Statistic color="green" size="mini" className="basic">
                    <Statistic.Value>40+</Statistic.Value>
                    <Statistic.Label>Businesses funded</Statistic.Label>
                  </Statistic>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column>
                  <Statistic color="green" size="mini" className="basic">
                    <Statistic.Value>90%+</Statistic.Value>
                    <Statistic.Label>Campaigns successfully raise their minimum</Statistic.Label>
                  </Statistic>
                </Grid.Column>
                <Grid.Column>
                  <Statistic color="green" size="mini" className="basic">
                    <Statistic.Value>15,000+</Statistic.Value>
                    <Statistic.Label>Avg. unique page views per offering</Statistic.Label>
                  </Statistic>
                </Grid.Column>
              </Grid.Row>
            </Grid>
            <Divider hidden />
            <p>
              The above figures include the total amount raised in offerings completed through
              NextSeed Securities, LLC ($XX,XXX,XXX), NextSeed US, LLC ($XX,XXX,XXX) and
              NextSeed TX, LLC ($XX,XXX,XXX). Historical figures only. Past performance of one
              business is not a guarantee of future results of another business.
            </p>
          </Grid.Column>
          <Grid.Column>
            <Embed
              id={nsvideos.embed}
              placeholder={videoPoster}
              source="vimeo"
              icon="ns-play"
            />
            <p className="caption-note mt-10">
              The Native Hostel and Bar & Kitchen raised $396,500 from 227 investors.
            </p>
          </Grid.Column>
        </Grid>
      </Container>
    </section>
    <section>
      <Container>
        <Divider />
        <List className="learn-more-list">
          <List.Item>
            <List.Content as={Link} to="/business/funding-options/term-notes" className="text-uppercase" floated="right">
              <b>Funding options</b>
              <List.Icon className="ns-arrow-right" color="green" />
            </List.Content>
          </List.Item>
        </List>
      </Container>
    </section>
  </Aux>
);

export default HowItWorks;
