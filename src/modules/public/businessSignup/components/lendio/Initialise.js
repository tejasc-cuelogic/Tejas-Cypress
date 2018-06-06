import React from 'react';
import { Link } from 'react-router-dom';
import Aux from 'react-aux';
import { Divider, Image, Button } from 'semantic-ui-react';
import LogoLendio from '../../../../../assets/images/lendio_logo.svg';

const Initialise = () => (
  <Aux>
    <Image className="small" src={LogoLendio} alt="Lendio.com" />
    <Divider hidden />
    <p>
      We`ve partnered with Lendio, a leading small business loan marketplace where
      completing a free application puts you in front of 75+<br />
      lenders and helps you get access to capital. Based on the information in your
      application, your business is pre-qualified for access to Lendio!
    </p>
    <Divider section hidden />
    <Button.Group>
      <Button as={Link} to="/business-application/lendio" color="green" className="relaxed">I’m interested in Lendio</Button>
      <Button as={Link} to="/" inverted color="green" className="relaxed">Return to Home Page</Button>
    </Button.Group>
  </Aux>
);

export default Initialise;
