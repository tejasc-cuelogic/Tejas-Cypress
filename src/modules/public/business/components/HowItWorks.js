import React from 'react';
import Aux from 'react-aux';
import { Link } from 'react-router-dom';
import { Header, Grid, Button, Image, Container, Embed, List, Statistic, Divider, Responsive, Item } from 'semantic-ui-react';
import { NsCarousel } from '../../../../theme/shared';
import supportIcon from '../../../../assets/images/icons/support.svg';
import sellingIcon from '../../../../assets/images/icons/selling.svg';
import networkIcon from '../../../../assets/images/icons/network.svg';
import carouselImg from '../../../../assets/images/business/lian.jpg';
import videoPoster from '../../../../assets/images/636206632.webp';

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
          <Header as="h3">Accelerate your growth with the power of the crowd.</Header>
          <div className="center-align">
            <Button.Group>
              <Button secondary content="Apply Business" />
              <Button secondary content="Apply for CRE" />
            </Button.Group>
          </div>
          <Divider section />
        </Responsive>
        <Header as="h2" className="mb-80" textAlign={isMobile ? 'left' : 'center'}>
          Get flexible financing that doesn’t<br />cost you everything.
        </Header>
        <Grid relaxed="very" stackable columns={3} doubling>
          <Grid.Column className="info-grid">
            <Image src={sellingIcon} verticalAlign="top" />
            <div>
              <Header as="h5">New, community-driven approach</Header>
              <p>
                Rich uncles and banks aren’t your only funding options.
                With NextSeed, everyone is now a potential source of capital –
                and a potential advocate.
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
              {/* <p><b>Learn more</b></p> */}
              <List horizontal relaxed className="learn-more-list left-align">
                <List.Item>
                  <List.Header>Learn more</List.Header>
                  <List.Icon className="ns-arrow-right" color="green" />
                  <List.Content as="a">Why fundraise on NextSeed?</List.Content>
                </List.Item>
                <List.Item>
                  <Responsive minWidth={768} as={Aux}>
                    <List.Header>&nbsp;</List.Header>
                  </Responsive>
                  <List.Icon className="ns-arrow-right" color="green" />
                  <List.Content as="a">Is fundraising on NextSeed risky?</List.Content>
                </List.Item>
              </List>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
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
                    <Item.Description>
                      <Responsive minWidth={768} as={Aux}>
                        <h3 className="mb-50">
                          “Loved the experience! Financing this way allowed me to focus
                          on my passion and not on pitching investors.”
                        </h3>
                      </Responsive>
                      <Responsive maxWidth={767} as={Aux}>
                        <h3 className="mt-20 mb-20">
                          “Loved the experience! Financing this way allowed me to focus
                          on my passion and not on pitching investors.”
                        </h3>
                      </Responsive>
                    </Item.Description>
                    <Item.Extra className="testimonial-user-details">
                      <p><b>Lian Nguyen,</b> Bravery Chef Hall</p>
                      <span>$1,000,000 | 539 Investors</span>
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
            <Grid columns={2}>
              <Grid.Row>
                <Grid.Column>
                  <Statistic color="green" size="mini" className="basic">
                    <Statistic.Value>$9M+</Statistic.Value>
                    <Statistic.Label>In capital deployed by NextSeed investors</Statistic.Label>
                  </Statistic>
                </Grid.Column>
                <Grid.Column>
                  <Statistic color="green" size="mini" className="basic">
                    <Statistic.Value>35+</Statistic.Value>
                    <Statistic.Label>Businesses successfully funded</Statistic.Label>
                  </Statistic>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column>
                  <Statistic color="green" size="mini" className="basic">
                    <Statistic.Value>135</Statistic.Value>
                    <Statistic.Label>Avg. number of investors per offering</Statistic.Label>
                  </Statistic>
                </Grid.Column>
                <Grid.Column>
                  <Statistic color="green" size="mini" className="basic">
                    <Statistic.Value>11,630</Statistic.Value>
                    <Statistic.Label>Avg. unique page views per offering</Statistic.Label>
                  </Statistic>
                </Grid.Column>
              </Grid.Row>
            </Grid>
            <Divider hidden />
            <p>
              The above figures include data from both the Texas and Reg CF NextSeed platforms.
              The total amount raised from debt crowdfunding as of Nov 2017 figure includes
              amounts invested in offerings completed through NextSeed US LLC
              (&quot;NextSeed&quot;) or NextSeed TX LLC (&quot;NextSeed TX&quot;),
              an affiliate of NextSeed. The aggregate amount invested through NextSeed is
              $6,745,700 and the aggregate amount invested through NextSeed TX is $1,303,500.
              Historical figures only. Past performance of one business is not a guarantee of
              future results of another business.
            </p>
          </Grid.Column>
          <Grid.Column>
            <Embed
              id={nsvideos.embed}
              placeholder={videoPoster}
              source="vimeo"
            />
            <p className="caption-note mt-10">
              The Native Hostel and Bar & Kitchen raised $396,500 from 227 investors.
            </p>
          </Grid.Column>
        </Grid>
        <div className="mt-80 mb-50 center-align">
          <Button as={Link} to="/business/funding-options/term-notes" primary content="See Funding Options" />
        </div>
      </Container>
    </section>
  </Aux>
);

export default HowItWorks;
