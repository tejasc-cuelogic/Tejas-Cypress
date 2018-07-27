import React from 'react';
import { Header, Container, Form } from 'semantic-ui-react';

const SubscribeForNewsletter = () => (
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
          <Form.Button primary fluid content="Submit" compact width={2} />
        </Form.Group>
      </Form>
    </Container>
  </section>
);

export default SubscribeForNewsletter;
