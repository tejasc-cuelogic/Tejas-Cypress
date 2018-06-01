import React from 'react';
import { Link } from 'react-router-dom';
import { Grid, Icon, Header, Divider, Button } from 'semantic-ui-react';

const Failure = () => (
  <Grid.Column className="issuer-signup">
    <Icon className="ns-paper-plane" size="huge" color="green" />
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
    <Button as={Link} to="/" size="large" color="green" className="very relaxed">Return to Home Page</Button>
  </Grid.Column>
);

export default Failure;
