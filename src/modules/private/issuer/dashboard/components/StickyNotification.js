import React from 'react';
import { Card, Statistic } from 'semantic-ui-react';
import { get } from 'lodash';

const StickyNotification = props => (
  <div className="top-cta-section">
    <div className="sticky-notification">
      <Card fluid raised>
        <Card.Content>
          <Card.Meta>{get(props, 'notificationCard.congratulations')}</Card.Meta>
          <Statistic size="mini" className="cta">
            <Statistic.Value className="mb-10">{get(props, 'notificationCard.header')}</Statistic.Value>
            <Statistic.Label>{get(props, 'notificationCard.message')}</Statistic.Label>
          </Statistic>
        </Card.Content>
      </Card>
    </div>
  </div>
);

export default StickyNotification;
