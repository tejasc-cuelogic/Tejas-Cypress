import React, { Component } from 'react';
import { Header } from 'semantic-ui-react';

class Disclosures extends Component {
  render() {
    return (
      <div className="campaign-content-wrapper">
        <Header as="h3">Disclosures</Header>
        <div className="pdf-viewer">
          <object width="100%" height="100%" data="https://s3.amazonaws.com/dev-cdn.nextseed.qa/welcome-packet/offeringpageignited.pdf" type="application/pdf">failed to load..</object>
        </div>
      </div>
    );
  }
}

export default Disclosures;
