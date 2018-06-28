import React, { Component } from 'react';
import Aux from 'react-aux';
import { Header, Container, Grid, Image, Button, Divider, Embed, Card, Icon } from 'semantic-ui-react';
import UserOne from '../../../../assets/images/owner-1.jpg';
import UserTwo from '../../../../assets/images/owner-2.jpg';
import videoPoster from '../../../../assets/images/636206632.webp';
import assetsUrl from '../../../../assets/images/campaign-1.jpg';

const nsvideos = {
  embed: '218642510',
};

class Home extends Component {
  render() {
    return (
      <Aux>
        <Container fluid className="home-banner">
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
            <Header as="h2">
              A community-driven platform for fundraising and investing.
            </Header>
            <p className="caption">
              Welcome to capital investing reinvented. NextSeed connects entrepreneurs with
              everyday people to help businesses, investors and communities grow together.
            </p>
            {/* <Button primary content="Primary Button" />
            <Button secondary content="Secondary Button" /> */}
          </Container>
          <Container>
            <Grid centered relaxed="very">
              <Grid.Column textAlign="center" width={6} className="info-card">
                <Image src={UserOne} size="small" circular centered />
                <Header as="h4">Raise funds without giving up ownership.</Header>
                <p>
                  Access flexible debt financing while avoiding the hassles of traditional
                  fundraising. No need to sell ownership of your business. Simply create a
                  debt offering and invite your community to invest in your growth.
                </p>
                <Button primary content="How Investing Works" />
              </Grid.Column>
              <Grid.Column textAlign="center" width={6} className="info-card">
                <Image src={UserTwo} size="small" circular centered />
                <Header as="h4">Invest in businesses you believe in.</Header>
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
        <section>
          <Container>
            <Header as="h2" textAlign="center">How does NextSeed work?</Header>
            <Grid centered relaxed="very">
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
            <p className="caption text-center">Browse the newest investment opportunities on NextSeed. The next big thing may be inviting you to participate.</p>
            <Card.Group itemsPerRow={3}>
              <Card>
                <Image src={assetsUrl} />
                <Card.Content>
                  <Card.Header>Matthew</Card.Header>
                  <Card.Meta>
                    <span className="date">Joined in 2015</span>
                  </Card.Meta>
                  <Card.Description>Matthew is a musician living in Nashville.</Card.Description>
                </Card.Content>
                <Card.Content extra>
                  <a>
                    <Icon name="user" />
                    22 Friends
                  </a>
                </Card.Content>
              </Card>
              <Card>
                <Image src={assetsUrl} />
                <Card.Content>
                  <Card.Header>Matthew</Card.Header>
                  <Card.Meta>
                    <span className="date">Joined in 2015</span>
                  </Card.Meta>
                  <Card.Description>Matthew is a musician living in Nashville.</Card.Description>
                </Card.Content>
                <Card.Content extra>
                  <a>
                    <Icon name="user" />
                    22 Friends
                  </a>
                </Card.Content>
              </Card>
              <Card>
                <Image src={assetsUrl} />
                <Card.Content>
                  <Card.Header>Matthew</Card.Header>
                  <Card.Meta>
                    <span className="date">Joined in 2015</span>
                  </Card.Meta>
                  <Card.Description>Matthew is a musician living in Nashville.</Card.Description>
                </Card.Content>
                <Card.Content extra>
                  <a>
                    <Icon name="user" />
                    22 Friends
                  </a>
                </Card.Content>
              </Card>
              <Card>
                <Image src={assetsUrl} />
                <Card.Content>
                  <Card.Header>Matthew</Card.Header>
                  <Card.Meta>
                    <span className="date">Joined in 2015</span>
                  </Card.Meta>
                  <Card.Description>Matthew is a musician living in Nashville.</Card.Description>
                </Card.Content>
                <Card.Content extra>
                  <a>
                    <Icon name="user" />
                    22 Friends
                  </a>
                </Card.Content>
              </Card>
              <Card>
                <Image src={assetsUrl} />
                <Card.Content>
                  <Card.Header>Matthew</Card.Header>
                  <Card.Meta>
                    <span className="date">Joined in 2015</span>
                  </Card.Meta>
                  <Card.Description>Matthew is a musician living in Nashville.</Card.Description>
                </Card.Content>
                <Card.Content extra>
                  <a>
                    <Icon name="user" />
                    22 Friends
                  </a>
                </Card.Content>
              </Card>
              <Card>
                <Image src={assetsUrl} />
                <Card.Content>
                  <Card.Header>Matthew</Card.Header>
                  <Card.Meta>
                    <span className="date">Joined in 2015</span>
                  </Card.Meta>
                  <Card.Description>Matthew is a musician living in Nashville.</Card.Description>
                </Card.Content>
                <Card.Content extra>
                  <a>
                    <Icon name="user" />
                    22 Friends
                  </a>
                </Card.Content>
              </Card>
            </Card.Group>
          </Container>
        </section>
      </Aux>
    );
  }
}

export default Home;
