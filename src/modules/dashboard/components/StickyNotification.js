import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Statistic } from 'semantic-ui-react';

const StickyNotification = () => (
  <div className="top-cta-section">
    <div className="sticky-notification">
      <Card fluid raised>
        <Card.Content>
          <Card.Meta>Congratulations!</Card.Meta>
          <Statistic size="mini" className="cta">
            <Statistic.Value>You have been pre-qualified for a NextSeed campaign</Statistic.Value>
            <Statistic.Label>
              We are hard at work finalizing your application and will be in touch within
              three business days.<br />
              If you have any questions in the meantime, please contact us at <Link to="/"><b>apply@nextseed.com</b></Link>
            </Statistic.Label>
          </Statistic>
        </Card.Content>
      </Card>
    </div>
  </div>
);

export default StickyNotification;
