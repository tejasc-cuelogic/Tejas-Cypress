import React, { Component } from 'react';
import Aux from 'react-aux';
import { Header, Container, Form } from 'semantic-ui-react';
import Banner from '../components/Banner';
import CampaignList from '../components/listing/CampaignList';

class Offering extends Component {
  render() {
    return (
      <Aux>
        <Banner />
        <CampaignList
          locked="cjk9pj4250d0f0123n0lng1qr"
          filters
          heading={<Header as="h2" textAlign="center" caption className="mb-50">Active Campaigns</Header>}
        />
        <section className="learn-more">
          <Container textAlign="center">
            <Header as="h2">Get notified lorem ipsum</Header>
            <Form className="public-form mt-40">
              <Form.Group>
                <Form.Input
                  placeholder="Email"
                  name="email"
                  width={6}
                />
                <Form.Button primary fluid content="Submit" width={2} />
              </Form.Group>
            </Form>
          </Container>
        </section>
        <CampaignList
          locked={3}
          heading={<Header as="h2" textAlign="center" caption className="mb-50">Successfully Funded Campaigns</Header>}
        />
      </Aux>
    );
  }
}

export default Offering;
