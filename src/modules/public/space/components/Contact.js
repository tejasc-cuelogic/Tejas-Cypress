import React from 'react';
import { Modal, Header, Divider, Grid, Form, Responsive, Button, Select } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import NSImage from '../../../shared/NSImage';


const handleCloseModal = (history) => {
    history.push('/space');
};
const currentOperation = [
  { key: 'sk', text: 'Shared kitchen', value: 'Shared kitchen' },
  { key: 'h', text: 'Home', value: 'Home' },
  { key: 'ft', text: 'Food Truck', value: 'Food Truck' },
  { key: 'sk', text: 'Food Hall', value: 'Food Hall' },
  { key: 'no', text: 'Not operational yet', value: 'Not operational yet' },
  { key: 'c', text: 'Co-working', value: 'Co-working' },
  { key: 'p', text: 'Pop-ups', value: 'Pop-ups' },
  { key: 'on', text: 'Online', value: 'Online' },
  { key: 'o', text: 'Other', value: 'Other' },
];
const industry = [
  { key: 'b', text: 'Brewery', value: 'Brewery' },
  { key: 'rb', text: 'Restaurant & Bar', value: 'Restaurant & Bar' },
  { key: 'pf', text: 'Packaged Foods & Beverage', value: 'Packaged Foods & Beverage' },
  { key: 'fr', text: 'Fashion Retail', value: 'Fashion Retail' },
  { key: 'fu', text: 'Furniture', value: 'Furniture' },
  { key: 'om', text: 'Other Manufacturing', value: 'Other Manufacturing' },
  { key: 'j', text: 'Jewelry', value: 'Jewelry' },
  { key: 'f', text: 'Fitness', value: 'Fitness' },
  { key: 'hw', text: 'Health & Wellness', value: 'Health & Wellness' },
  { key: 'o', text: 'Other', value: 'Other' },
];

const Contact = ({ history, uiStore }) => (
    <Modal dimmer={uiStore.responsiveVars.isMobile ? 'inverted' : ''} className={uiStore.responsiveVars.isMobile ? 'full-screen-modal' : ''} open closeIcon onClose={() => handleCloseModal(history)} size={uiStore.responsiveVars.isMobile ? 'fullscreen' : 'large'}>
      <Modal.Content>
        <section className={!uiStore.responsiveVars.isMobile ? 'padded' : ''}>
          <Grid columns="equal" stackable>
            <Grid.Column only="computer">
              <Header as="h3">Interested in learning more<Responsive as="br" minWidth={992} /> about NextSeed Space?</Header>
              <p>Let us know how we can support you and we’ll be in<Responsive as="br" minWidth={992} /> touch.</p>
              <Divider hidden section />
              <NSImage path="space/crowd-hero.jpg" />
            </Grid.Column>
            <Grid.Column>
              {uiStore.responsiveVars.isMobile
              && (
                <>
                  <Header as="h3">Interested in learning about<br /> NextSeed Space?</Header>
                  <p className="mb-30">Let us know how we can support you and we’ll be<br /> in touch.</p>
                </>
              )}
              <Form className="nss-form">
                <Form.Group widths="equal">
                  <Form.Input fluid label="First Name" placeholder="First Name" />
                  <Form.Input fluid label="Last Name" placeholder="Last Name" />
                </Form.Group>
                <Form.Group widths="equal">
                  <Form.Input fluid label="Business Name" placeholder="Business Name" />
                  <Form.Field
                    control={Select}
                    options={industry}
                    label={{ children: 'Industry', htmlFor: 'industry' }}
                    placeholder="Pick One"
                    search
                    searchInput={{ id: 'industry' }}
                  />
                </Form.Group>
                <Form.Group widths="equal">
                  <Form.Field
                    control={Select}
                    options={currentOperation}
                    label={{ children: 'Where are you currently operating?', htmlFor: 'current-operation' }}
                    placeholder="Pick One"
                    search
                    searchInput={{ id: 'current-operation' }}
                  />
                  <Form.Input fluid label="Website URL" placeholder="Website URL" />
                </Form.Group>
                <Form.Group widths="equal">
                  <Form.Input fluid label="Phone Number" placeholder="123-456-7891" />
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

export default inject('uiStore')(observer(Contact));
