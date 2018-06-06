import React from 'react';
import { Link } from 'react-router-dom';
import { Grid, Icon, Header, Divider, Image, Button, List, Form, Checkbox } from 'semantic-ui-react';
// import { FormInput } from '../../../../theme/form/FormElements';
import FormElementWrap from '../../../private/businessApplication/components/FormElementWrap';
import LogoLendio from '../../../../assets/images/lendio_logo.svg';

const Failure = () => (
  <Grid.Column className="issuer-signup">
    <Icon className="ns-paper-plane" size="massive" color="green" />
    <Header as="h1">Thank you for completing the pre-qualification form</Header>
    <p>
      <b>Unfortunately, NextSeed is currently unable to help your business at this time.</b>
    </p>
    <p>
      We`ll update you if anything changes in the future. In the meantime, if you have
      any questions, you can contact us at <a href="mailto:apply@nextseed.com" className="link"><b>apply@nextseed.com</b></a> or<br />
      check out our <Link to="/" className="link"><b>Borrow page</b></Link> or <Link to="/about/faq" className="link"><b>FAQ </b></Link>
      section for more information on our general business requirements.
    </p>
    <Divider section hidden />
    <Image
      className="small"
      src={LogoLendio}
      alt="Lendio.com"
    />
    <Divider hidden />
    <p>
      We`ve partnered with Lendio, a leading small business loan marketplace where
      completing a free application puts you in front of 75+<br />
      lenders and helps you get access to capital. Based on the information in your
      application, your business is pre-qualified for access to Lendio!
    </p>
    <Divider section hidden />
    <Button.Group>
      <Button as={Link} to="/" color="green" className="relaxed">I’m interested in Lendio</Button>
      <Button inverted color="green" className="relaxed">Return to Home Page</Button>
    </Button.Group>
    <Divider section /> {/* To be removed on dynamic changes */}
    <Header as="h1">NextSeed has Partnered with Lendio</Header>
    <p>
      Lendio is a leading small business loan marketplace where completing one free application
      will put you in front of 75+ lenders.<br />
      The loan matching service is free with no obligation
    </p>
    <List horizontal className="feature-list">
      <List.Item>
        <Icon className="ns-timer" size="huge" />
        Quick
      </List.Item>
      <List.Item>
        <Icon className="ns-clipboard-check" size="huge" />
        Easy
      </List.Item>
      <List.Item>
        <Icon className="ns-shield-check" size="huge" />
        Secure
      </List.Item>
    </List>
    <Divider section />
    <Form>
      <FormElementWrap>
        <Grid>
          <Grid.Column widescreen={7} largeScreen={7} computer={8} tablet={16} mobile={16}>
            <Header as="h2">Pre-Qualification Questions</Header>
            <div className="field-wrap">
              Form Fields will be here
            </div>
          </Grid.Column>
          <Grid.Column widescreen={7} largeScreen={7} computer={8} tablet={16} mobile={16}>
            <Header as="h2">Customer Information</Header>
            <div className="field-wrap">
              Form Fields will be here
            </div>
          </Grid.Column>
        </Grid>
      </FormElementWrap>
      <Header as="h2">Submit your application to Lendio</Header>
      <p>
        Do you give Lendio and their <Link to="/" className="link"><b>partners</b></Link> permission to
        contact you at the number and email you provided, including via email, phone, text message
        and cell phone, including the use of automated dialing equipment or pre-recorded calls and
        messages? Your consent is not a condition of receiving services from Lendio. If you decline
        to move forward, none of your information will be sent to Lendio.<br /><br />
        <small><b>As an official partner, NextSeed may be compensated through Lendio</b></small>
      </p>
      <Checkbox label="I agree to the conditions above." />
      <Divider hidden />
      <Button primary className="very relaxed">Submit</Button>
    </Form>
  </Grid.Column>
);

export default Failure;
