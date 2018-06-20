import React from 'react';
import Aux from 'react-aux';
import { Header, Divider } from 'semantic-ui-react';

const faq = () => (
  <Aux>
    <Header as="h1">FAQ</Header>
    <Divider inverted section />
    <p className="pageContent">
      If you have questions, please don’t hesitate to contact us at
      &nbsp;<a href="mailto:info@nextseed.com">info@nextseed.com</a>
    </p>
  </Aux>
);

export default faq;
