import React from 'react';
import { Grid } from 'semantic-ui-react';
import { UPLOADS_CONFIG } from '../../../../../constants/aws';

const WelcomePacket = () => (
  <div>
    <Grid>
      <Grid.Row>
        <Grid.Column className="welcome-packet">
          <div className="pdf-viewer">
            <object width="100%" height="100%" data={`https://s3.amazonaws.com/${UPLOADS_CONFIG.bucket}/welcome-packet/offeringpageignited.pdf`} type="application/pdf">failed to load..</object>
          </div>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  </div>
);

export default WelcomePacket;
