import React from 'react';
import { Card, Statistic } from 'semantic-ui-react';

const StickyNotification = () => (
  <div className="top-cta-section">
    <div className="sticky-notification">
      <Card fluid raised>
        <Card.Content>
          <Card.Meta>Congratulations!</Card.Meta>
          <Statistic size="mini" className="cta">
            <Statistic.Value className="mb-10">You have been pre-qualified for a NextSeed campaign</Statistic.Value>
            <Statistic.Label>
              We are hard at work finalizing your application and will be in touch within
              three business days.
              If you have any questions in the meantime, please contact us at <a href="mailto:apply@nextseed.com" className="link"><b>apply@nextseed.com</b></a>
            </Statistic.Label>
          </Statistic>
        </Card.Content>
      </Card>
    </div>
  </div>
);

export default StickyNotification;
