import React, { Component } from 'react';
import { Header, Grid } from 'semantic-ui-react';

class Disclosures extends Component {
  render() {
    return (
      <Grid>
        <Grid.Row>
          <Grid.Column width={16}>
            <div className="campaign-about-wrapper">
              <Header as="h3">
              Disclosures
              </Header>
              <div className="pdf-viewer">
                <object width="100%" height="100%" data="https://s3.amazonaws.com/dev-cdn.nextseed.qa/welcome-packet/offeringpageignited.pdf" type="application/pdf">failed to load..</object>
              </div>
            </div>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

export default Disclosures;
