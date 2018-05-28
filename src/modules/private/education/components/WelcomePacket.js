import React from 'react';
import { Grid } from 'semantic-ui-react';

const WelcomePacket = () => (
  <div>
    <Grid>
      <Grid.Row>
        <Grid.Column className="welcome-packet">
          <div className="pdf-viewer">
            <object width="100%" height="100%" data="http://www.africau.edu/images/default/sample.pdf" type="application/pdf">failed to load..</object>
          </div>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  </div>
);

export default WelcomePacket;
