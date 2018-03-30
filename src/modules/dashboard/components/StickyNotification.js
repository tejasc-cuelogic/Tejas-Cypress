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
          <Button color="green" as={Link} floated="right" className="rounded pull-right" to="">Verify me</Button>
        </Card.Content>
      </Card>
    </div>
  </Responsive>
);

export default StickyNotification;
