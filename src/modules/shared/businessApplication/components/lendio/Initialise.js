import React from 'react';
import { Link } from 'react-router-dom';
import Aux from 'react-aux';
import { Divider, Button } from 'semantic-ui-react';
import { Logo } from '../../../../../theme/shared';

const Initialise = ({ match, isPublic }) => (
  <Aux>
    <Logo size="small" alt="Lendio.com" dataSrc="LogoLendio" />
    <Divider hidden />
    <p>
      We`ve partnered with Lendio, a leading small business loan marketplace where
      completing a free application puts you in front of 75+<br />
      lenders and helps you get access to capital. Based on the information in your
      application, your business is pre-qualified for access to Lendio!
    </p>
    <Divider section hidden />
    <Button.Group>
      <Button as={Link} to={`/business-application/${match.params.applicationType}/${match.params.id}/lendio`} color="green" className="relaxed">I’m interested in Lendio</Button>
      <Button as={Link} to={isPublic ? '/' : '/app/dashboard'} inverted color="green" className="relaxed">Return to Home Page</Button>
    </Button.Group>
  </Aux>
);

export default Initialise;
