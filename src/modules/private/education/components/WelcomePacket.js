import React from 'react';
import { Grid } from 'semantic-ui-react';

const WelcomePacket = () => (
  <div>
    <Grid>
      <Grid.Row>
        <Grid.Column className="welcome-packet">
          <div className="pdf-viewer">
            <object width="100%" height="100%" data="https://cdn.uclouvain.be/public/Exports%20reddot/core/documents/coredp2015_15web.pdf" type="application/pdf">failed to load..</object>
          </div>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  </div>
);

export default WelcomePacket;
