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
  <Segment inverted vertical className="footer">
    <Container fluid>
      <Grid divided inverted stackable>
        <Grid.Column className="footerLinks" width={3}>
          <Header inverted as={Link} to="/about/team" content="Team" />
          <Header inverted as={Link} to="/blog" content="Blog" />
          <Header inverted as={Link} to="/about/faq" content="FAQ" />
          <Header inverted as={Link} to="/offerings" content="Browse" />
        </Grid.Column>
        <Grid.Column className="footerLinks" width={3}>
          <Header inverted as="h4" content="info@nextseed.com" />
          <Header inverted as="h4" content="800-705-4220" />
          <Header inverted as={Link} to="/agreements/terms-of-use" content="Terms of Use" />
          <Header inverted as={Link} to="/agreements/privacy-policy" content="Privacy Policy" />
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
      </Grid>
    </Container>
    <Divider inverted section />
    <Container textAlign="center">&copy; 2018 NextSeed US LLC</Container>
  </Segment>
);

export default footer;
