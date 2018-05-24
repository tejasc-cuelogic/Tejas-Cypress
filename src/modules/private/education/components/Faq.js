import React from 'react';
import { Link } from 'react-router-dom';
import { Grid, Header, Accordion, Card, Icon, List } from 'semantic-ui-react';

const Faq = () => (
  <div>
    <Grid>
      <Grid.Column widescreen={6} largeScreen={6} computer={6} tablet={16} mobile={16}>
        <Accordion className="splitted">
          <Accordion.Title active>
            Investor Qualification
            <Icon className="ns-chevron-down" />
          </Accordion.Title>
          <Accordion.Content active>
            <List divided relaxed="very">
              <List.Item as="a">Who can invest on NextSeed?</List.Item>
              <List.Item as="a">Can I invest if I am under 18 years old?</List.Item>
              <List.Item as="a" className="active">If I don’t live in the U.S., can I invest on NextSeed?</List.Item>
              <List.Item as="a">Do I need to be an “Accredited Investor” to invest on NextSeed?</List.Item>
              <List.Item as="a">If I don’t live in the U.S., can I invest on NextSeed?</List.Item>
              <List.Item as="a">Can entity investors invest?</List.Item>
              <List.Item as="a">Can I invest through an Individual Retirement Account on NextSeed?</List.Item>
            </List>
          </Accordion.Content>
          <Accordion.Title>
            Investment Guidelines
            <Icon className="ns-chevron-down" />
          </Accordion.Title>
          <Accordion.Content>
            <List divided relaxed="very">
              <List.Item as="a">Who can invest on NextSeed?</List.Item>
              <List.Item as="a">Can I invest if I am under 18 years old?</List.Item>
              <List.Item as="a" className="active">If I don’t live in the U.S., can I invest on NextSeed?</List.Item>
              <List.Item as="a">Do I need to be an “Accredited Investor” to invest on NextSeed?</List.Item>
              <List.Item as="a">If I don’t live in the U.S., can I invest on NextSeed?</List.Item>
              <List.Item as="a">Can entity investors invest?</List.Item>
              <List.Item as="a">Can I invest through an Individual Retirement Account on NextSeed?</List.Item>
            </List>
          </Accordion.Content>
          <Accordion.Title>
            NextSeed Account
            <Icon className="ns-chevron-down" />
          </Accordion.Title>
          <Accordion.Content>
            <List divided relaxed="very">
              <List.Item as="a">Who can invest on NextSeed?</List.Item>
              <List.Item as="a">Can I invest if I am under 18 years old?</List.Item>
              <List.Item as="a" className="active">If I don’t live in the U.S., can I invest on NextSeed?</List.Item>
              <List.Item as="a">Do I need to be an “Accredited Investor” to invest on NextSeed?</List.Item>
              <List.Item as="a">If I don’t live in the U.S., can I invest on NextSeed?</List.Item>
              <List.Item as="a">Can entity investors invest?</List.Item>
              <List.Item as="a">Can I invest through an Individual Retirement Account on NextSeed?</List.Item>
            </List>
          </Accordion.Content>
        </Accordion>
      </Grid.Column>
      <Grid.Column widescreen={10} largeScreen={10} computer={10} tablet={16} mobile={16}>
        <Card fluid>
          <Card.Content className="padded">
            <Header as="h3">If I don’t live in the U.S., can I invest on NextSeed?</Header>
            <p>
              At this time, only people who live in the U.S. can make investments on NextSeed.
              This is because investors need to open an investment account with our partner U.S.
              bank in order to receive any business payments, which requires a U.S. address and
              social security number. However, our partner bank is looking for a solution to
              accommodate people outside of the U.S. If you would like to be notified when we are
              able to accept you as an investor, please send us a note
              at <Link to="/" className="link">info@nextseed.com</Link>.
            </p>
          </Card.Content>
        </Card>
      </Grid.Column>
    </Grid>
  </div>
);

export default Faq;
