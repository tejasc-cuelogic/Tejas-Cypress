import React from 'react';
import { Responsive, Card, Statistic, Button, Link } from 'semantic-ui-react';

const StickyNotification = (props) => {
  return (
    <Responsive {...Responsive.onlyComputer}>
      <div className="sticky-notification">
        <Card fluid raised>
          <Card.Content>
            <Card.Meta>Next Step:</Card.Meta>
            <Statistic size="mini" className="cta">
              <Statistic.Value>Verify your identity</Statistic.Value>
              <Statistic.Label>Complete all required information about you</Statistic.Label>
            </Statistic>
            <Button color="green" as={Link} floated="right" className="rounded pull-right" to="">Verify me</Button>
          </Card.Content>
        </Card>
      </div>
    </Responsive>
  );
};

export default StickyNotification;
