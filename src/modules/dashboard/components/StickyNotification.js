import React from 'react';
import { Link } from 'react-router-dom';

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
          <Button primary as={Link} floated="right" className="pull-right" onClick={() => props.setDashboardWizardSetup(props.stepinfo.linkPath)} to="/app/dashboard">{props.stepinfo.linkText}</Button>
        </Card.Content>
      </Card>
    </div>
  </Responsive>
);

export default StickyNotification;
