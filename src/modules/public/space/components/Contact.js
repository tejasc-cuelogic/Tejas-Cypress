import React from 'react';
import { Modal, Header, Divider, Grid, Form, Responsive, Button } from 'semantic-ui-react';
import NSImage from '../../../shared/NSImage';


const handleCloseModal = (history) => {
    history.push('/space');
};

const Contact = ({ history }) => (
    <Modal open closeIcon onClose={() => handleCloseModal(history)} size="large">
      <Modal.Content>
        <section className="padded">
          <Grid columns="equal" stackable>
            <Grid.Column only="computer">
              <Header as="h3">Interested in learning more<Responsive as="br" minWidth={992} /> about NextSeed Space?</Header>
              <p>Let us know how we can support you and we’ll be in<Responsive as="br" minWidth={992} /> touch.</p>
              <Divider hidden section />
              <NSImage path="space/crowd-hero.jpg" />
            </Grid.Column>
            <Grid.Column>
              <Form className="nss-form">
                <Form.Group widths="equal">
                  <Form.Input fluid label="First Name" placeholder="First Name" />
                  <Form.Input fluid label="Last Name" placeholder="Last Name" />
                </Form.Group>
                <Form.Group widths="equal">
                  <Form.Input fluid label="Business Name" placeholder="Business Name" />
                  <Form.Input fluid label="Industry" placeholder="Industry" />
                </Form.Group>
                <Form.Group widths="equal">
                  <Form.Input fluid label="Where are you currently operating?" placeholder="Where are you currently operating?" />
                  <Form.Input fluid label="Website URL" placeholder="Website URL" />
                </Form.Group>
                <Form.Group widths="equal">
                  <Form.Input fluid label="Phone Number" placeholder="Phone Number" />
                  <Form.Input fluid label="Email" placeholder="Email" />
                </Form.Group>
                <Form.TextArea className="secondary mt-20 mb-20" fluid label="How can we help?" placeholder="" />
                <Button secondary fluid content="Let’s Talk" />
              </Form>
            </Grid.Column>
          </Grid>
        </section>
      </Modal.Content>
    </Modal>
  );

export default Contact;
