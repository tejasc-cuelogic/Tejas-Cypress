import React from 'react';
import Aux from 'react-aux';
import { Link } from 'react-router-dom';
import { Header, Container, Grid, Image, Icon, Responsive, Divider, Button, Card } from 'semantic-ui-react';
import icon1 from '../../../../assets/images/icons/resources_1.svg';
import icon2 from '../../../../assets/images/icons/resources_2.svg';

const isMobile = document.documentElement.clientWidth < 768;
const Summary = props => (
  <section>
    <Container text textAlign={isMobile ? 'left' : 'center'}>
      <Responsive maxWidth={767} as={Aux}>
        <Header as="h2">Education Center</Header>
        <Divider section />
      </Responsive>
      <Header as="h2" className="mb-30">NextSeed 101</Header>
      <p className="mb-80">
        A resource for investors and entrepreneurs to understand how NextSeed works and
        how best to leverage this new way of fundraising and investing.
      </p>
    </Container>
    <Container>
      <Grid centered relaxed="very" stackable>
        <Grid.Column textAlign="center" width={6}>
          <Card as={Link} to={`${props.refUrl}/investor`} className="info-card campaign">
            <Image src={icon1} centered className="mb-20" />
            <Card.Content>
              <Card.Description>
                Understand how to add local businesses to your investment portfolio, how NextSeed
                investments work, and the risks and opportunities offered by this
                new way of investing.
              </Card.Description>
            </Card.Content>
            <Card.Content extra>
              <Button color="black" className="link-button">
                For Investors
                <Icon className="ns-arrow-right right" color="green" />
              </Button>
            </Card.Content>
          </Card>
        </Grid.Column>
        <Grid.Column textAlign="center" width={6}>
          <Card className="info-card campaign" as={Link} to={`${props.refUrl}/business`}>
            <Image src={icon2} centered className="mb-20" />
            <Card.Content>
              <Card.Description>
                Learn about the business implications of different types of fundraising,
                how to add NextSeed to your capital stack and how to get started.
              </Card.Description>
            </Card.Content>
            <Card.Content extra>
              <Button color="black" className="link-button">
                For Businesses
                <Icon className="ns-arrow-right right" color="green" />
              </Button>
            </Card.Content>
          </Card>
        </Grid.Column>
      </Grid>
    </Container>
  </section>
);

export default Summary;
