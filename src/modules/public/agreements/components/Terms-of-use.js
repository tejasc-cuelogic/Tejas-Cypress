import React from 'react';
import Aux from 'react-aux';
import { Header, Divider } from 'semantic-ui-react';

const ambassadors = () => (
  <Aux>
    <Header as="h1">Terms of Use</Header>
    <Divider inverted section />
    <p className="pageContent">
      NextSeed US LLC (together with its affiliates, “NextSeed”) offers its website and services
      on the terms stated in these Terms of Use (the “Terms”). The NextSeed Privacy Policy
      includes additional information about NextSeed’s use of information you submit using the
      website and services. Please read the Terms and the Privacy Policy carefully and let us
      know if you have any questions at all.
    </p>
  </Aux>
);

export default ambassadors;
