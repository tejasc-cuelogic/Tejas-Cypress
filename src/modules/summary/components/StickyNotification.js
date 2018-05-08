import React from 'react';

import { Responsive, Card, Statistic, Button } from 'semantic-ui-react';

const StickyNotification = props => (
  <Responsive {...Responsive.onlyComputer}>
    <div className="sticky-notification">
      <Card fluid raised>
        <Card.Content>
          <Card.Meta>Next Step:</Card.Meta>
          <Statistic size="mini" className="cta">
            <Statistic.Value>{props.stepinfo.value}</Statistic.Value>
            <Statistic.Label>{props.stepinfo.label}</Statistic.Label>
          </Statistic>
          <Button primary floated="right" className="pull-right" onClick={() => props.setDashboardWizardSetup(props.stepinfo.linkPath)}>{props.stepinfo.linkText}</Button>
        </Card.Content>
      </Card>
    </div>
  </Responsive>
);

export default StickyNotification;
