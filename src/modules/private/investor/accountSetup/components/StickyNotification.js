import React from 'react';
import { Card, Statistic } from 'semantic-ui-react';

const stepinfo = {
  group: 'Investor Account Creation',
  title: '',
  label: 'You’re a few steps away from being able to invest!',
};

const StickyNotification = () => (
  <div className="top-cta-section">
    <div className="sticky-notification">
      <Card fluid raised>
        <Card.Content>
          <Card.Meta>{stepinfo.group}</Card.Meta>
          <Statistic size="mini" className="cta">
            <Statistic.Value>{stepinfo.title}</Statistic.Value>
            <Statistic.Label>{stepinfo.label}</Statistic.Label>
          </Statistic>
        </Card.Content>
      </Card>
    </div>
  </div>
);

export default StickyNotification;
