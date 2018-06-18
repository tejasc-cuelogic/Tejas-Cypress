import React from 'react';

import { Card, Statistic, Button } from 'semantic-ui-react';

const StickyNotification = props => (
  <div className="top-cta-section">
    <div className="sticky-notification">
      <Card fluid raised>
        <Card.Content>
          <Card.Meta>Next Step:</Card.Meta>
          <Statistic size="mini" className="cta">
            <Statistic.Value>{props.stepinfo.value}</Statistic.Value>
            <Statistic.Label>{props.stepinfo.label}</Statistic.Label>
          </Statistic>
          <Button primary floated="right" onClick={() => props.setDashboardWizardSetup(props.stepinfo.linkPath)}>{props.stepinfo.linkText}</Button>
        </Card.Content>
      </Card>
    </div>
  </div>
);

export default StickyNotification;
