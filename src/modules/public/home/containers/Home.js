import React, { Component } from 'react';
import Aux from 'react-aux';
import { Link } from 'react-router-dom';
import { Header, Form, Container, Grid, Image, Button, Divider, Embed, Card, Label, Icon, List } from 'semantic-ui-react';
import UserOne from '../../../../assets/images/owner-1.jpg';
import UserTwo from '../../../../assets/images/owner-2.jpg';
import videoPoster from '../../../../assets/images/636206632.webp';
import campaign1 from '../../../../assets/images/campaign-1.jpg';
import campaign2 from '../../../../assets/images/campaign-2.jpg';
import campaign3 from '../../../../assets/images/campaign-3.jpg';
import bloomberg from '../../../../assets/images/bloomberg.png';
import houstonCronical from '../../../../assets/images/houston-chronicle.png';
import forbes from '../../../../assets/images/forbes.png';
import newYorkTimes from '../../../../assets/images/new-york-times.png';
import austinAmericanStatesman from '../../../../assets/images/austin-american-statesman.png';
import wallstreetJournal from '../../../../assets/images/wallstreet-journal.png';
import npr from '../../../../assets/images/npr.png';
import time from '../../../../assets/images/time.png';
import msnMoney from '../../../../assets/images/msn-money.png';
import crowdfundInsider from '../../../../assets/images/crowdfund-insider.png';
import pc from '../../../../assets/images/pc.png';
import mashable from '../../../../assets/images/mashable.png';
import usNews from '../../../../assets/images/us-news.png';

const nsvideos = {
  embed: '218642510',
};

class Home extends Component {
  render() {
    return (
      <Aux>
        <Container fluid className="banner home-banner">
          <Container>
            <div className="banner-caption">
              <Header as="h1">
                Raise capital.<br />
                Invest local.<br />
                <span className="highlight-text">Thrive as a<br />
                  community.
                </span>
              </Header>
            </div>
          </Container>
        </Container>
        <section>
          <Container text textAlign="center">
            <Header as="h2" className="mb-30">
              A community-driven platform for fundraising and investing.
            </Header>
            <p className="mb-80">
              Welcome to capital investing reinvented. NextSeed connects entrepreneurs with
              everyday people to help businesses, investors and communities grow together.
            </p>
            {/* <Button primary content="Primary Button" />
            <Button secondary content="Secondary Button" /> */}
          </Container>
          <Container>
            <Grid centered relaxed="very" stackable>
              <Grid.Column textAlign="center" width={6} className="info-card">
                <Image src={UserOne} size="small" circular centered />
                <Header as="h5">Raise funds without giving up ownership.</Header>
                <p>
                  Access flexible debt financing while avoiding the hassles of traditional
                  fundraising. No need to sell ownership of your business. Simply create a
                  debt offering and invite your community to invest in your growth.
                </p>
                <Button primary content="How Fundraising Works" />
              </Grid.Column>
              <Grid.Column textAlign="center" width={6} className="info-card">
                <Image src={UserTwo} size="small" circular centered />
                <Header as="h5">Invest in businesses you believe in.</Header>
                <p>
                  Investing isn’t just for Wall Street and Silicon Valley. Now anyone can access
                  exclusive investment opportunities. Make an impact for local businesses and
                  communities with minimum investments as low as $100.
                </p>
                <Button primary content="How Investing Works" />
              </Grid.Column>
            </Grid>
          </Container>
        </section>
        <Divider fitted as={Container} />
        <section className="how-it-works">
          <Container>
            <Header as="h2" textAlign="center">How does NextSeed work?</Header>
            <Grid centered>
              <Grid.Column width={12}>
                <Embed
                  className="centered-video"
                  id={nsvideos.embed}
                  placeholder={videoPoster}
                  source="vimeo"
                />
              </Grid.Column>
            </Grid>
          </Container>
        </section>
        <Divider fitted as={Container} />
        <section>
          <Container>
            <Header as="h2" textAlign="center">Latest Campaigns</Header>
            <p className="mb-30 center-align">Browse the newest investment opportunities on NextSeed. The next big thing may be inviting you to participate.</p>
            <Card.Group itemsPerRow={3} stackable>
              <Card className="campaign">
                <Image src={campaign1} />
                <Label basic color="green">300% Funded</Label>
                <Icon name="heart" />
                <Card.Content>
                  <div className="tags">
                    brewpub
                    <span className="pull-right">1.45x/48mos</span>
                  </div>
                  <Card.Header>Buffbrew Taproom</Card.Header>
                  <Card.Meta>Houston, TX</Card.Meta>
                  <Card.Description>
                    Houston Brewery is expanding its facilities and launching
                    the new Buffbrew Taproom, complete with a full-service
                    kitchen, event space and over 40 beers on tap.
                  </Card.Description>
                  <List divided horizontal>
                    <List.Item as={Link} to="/">Brewery & Pub</List.Item>
                    <List.Item as={Link} to="/">Shedule A</List.Item>
                    <List.Item as={Link} to="/">Revenue Sharing </List.Item>
                  </List>
                </Card.Content>
              </Card>
              <Card className="campaign">
                <Image src={campaign2} />
                <Label basic color="green">New</Label>
                <Icon name="heart outline" />
                <Card.Content>
                  <div className="tags">
                    Fitness
                    <span className="pull-right">1.45x/48mos</span>
                  </div>
                  <Card.Header>Mob Cycle</Card.Header>
                  <Card.Meta>Salt Lake City, UT</Card.Meta>
                  <Card.Description>
                    Experienced team opening one of the first indoor cycling studios
                    in downtown Salt Lake City. Skilled instructors and top of the
                    line equipment. Looking to expand throughout the state and region.
                  </Card.Description>
                  <List divided horizontal>
                    <List.Item as={Link} to="/">Fitness</List.Item>
                    <List.Item as={Link} to="/">Shedule A</List.Item>
                    <List.Item as={Link} to="/">Revenue Sharing </List.Item>
                  </List>
                </Card.Content>
              </Card>
              <Card className="campaign">
                <Image src={campaign3} />
                <Label basic color="green">10 days left</Label>
                <Icon name="heart outline" />
                <Card.Content>
                  <div className="tags">
                    Education
                    <span className="pull-right">11%/18mos</span>
                  </div>
                  <Card.Header>Avant Media Institute</Card.Header>
                  <Card.Meta>Houston, TX</Card.Meta>
                  <Card.Description>
                    Audio engineering program providing relevant, hands-on
                    training with experienced faculty. Seeking national accreditation.
                  </Card.Description>
                  <List divided horizontal>
                    <List.Item as={Link} to="/">Education</List.Item>
                    <List.Item as={Link} to="/">Shedule A</List.Item>
                    <List.Item as={Link} to="/">Revenue Sharing </List.Item>
                  </List>
                </Card.Content>
              </Card>
            </Card.Group>
            <div className="explore-campaign-button">
              <Button secondary compact as={Link} to="/offerings/">Explore Campaigns</Button>
            </div>
          </Container>
        </section>
        <section className="featured-section">
          <Container>
            <Header as="h2" textAlign="center" className="mb-50">As seen on…</Header>
            <Grid columns="equal" doubling>
              <Grid.Row>
                <Grid.Column>
                  <Image src={bloomberg} />
                </Grid.Column>
                <Grid.Column>
                  <Image src={houstonCronical} />
                </Grid.Column>
                <Grid.Column>
                  <Image src={forbes} />
                </Grid.Column>
                <Grid.Column>
                  <Image src={newYorkTimes} />
                </Grid.Column>
                <Grid.Column>
                  <Image src={austinAmericanStatesman} />
                </Grid.Column>
                <Grid.Column>
                  <Image src={wallstreetJournal} />
                </Grid.Column>
                <Grid.Column>
                  <Image src={npr} />
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column>
                  <Image src={time} />
                </Grid.Column>
                <Grid.Column>
                  <Image src={msnMoney} />
                </Grid.Column>
                <Grid.Column>
                  <Image src={crowdfundInsider} />
                </Grid.Column>
                <Grid.Column>
                  <Image src={pc} />
                </Grid.Column>
                <Grid.Column>
                  <Image src={mashable} />
                </Grid.Column>
                <Grid.Column>
                  <Image src={usNews} />
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Container>
        </section>
        <section className="learn-more">
          <Container textAlign="center">
            <Header as="h2">Want to learn more about NextSeed?</Header>
            <p className="mb-30">
              Leave us your contact information and we’ll keep you posted
              with the latest news and updates.
            </p>
            <Form>
              <Form.Group>
                <Form.Input inverted placeholder="Name" name="name" width={4} />
                <Form.Input
                  placeholder="Email"
                  name="email"
                  width={4}
                />
                <Form.Button primary content="Submit" compact width={2} />
              </Form.Group>
            </Form>
          </Container>
        </section>
      </Aux>
    );
  }
}

export default Home;
