import React from 'react';
import { Link } from 'react-router-dom';
import {
  // Button,
  Container,
  Divider,
  Grid,
  Header,
  // Icon,
  // Image,
  // List,
  // Menu,
  Segment,
  // Visibility,
} from 'semantic-ui-react';

const footer = () => (
  <Segment inverted vertical style={{ padding: '2em 0em' }}>
    <Container>
      <Grid divided inverted stackable>
        <Grid.Row>
          <Grid.Column width={3}>
            <Header inverted as="h4" content="Team" />
            <Header inverted as={Link} to="/blog" content="Blog" />
            <Header inverted as="h4" content="FAQ" />
            <Header inverted as="h4" content="Browse" />
          </Grid.Column>
          <Grid.Column width={3}>
            <Header inverted as="h4" content="info@nextseed.com" />
            <Header inverted as="h4" content="800-705-4220" />
            <Header inverted as="h4" content="Terms of Use" />
            <Header inverted as="h4" content="Privacy Policy" />
          </Grid.Column>
          <Grid.Column width={10}>
            <p>
              This site is operated by NextSeed US LLC, a Funding Portal
              registered with the U.S. Securities and Exchange Commission (the &quot;SEC&quot;),
              for the purpose of offering and selling securities in accordance
              with the exemption from securities registration requirements
              contained in Section 4(a)(6) of the Securities Act of 1933 and
              the regulations promulgated by the SEC
            </p>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
    <Divider inverted section />
    <Container style={{ textAlign: 'right' }}>&copy; 2018 NextSeed US LLC</Container>
  </Segment>
);

export default footer;
