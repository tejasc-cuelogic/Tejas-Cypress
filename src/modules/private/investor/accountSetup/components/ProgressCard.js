import React from 'react';
import { Card, Icon, Button } from 'semantic-ui-react';
import Helper from '../helper';

const progressMeta = Helper.Progress();

const ProgressCard = props => (
  <Card.Group stackable itemsPerRow={3}>
    {
      Object.keys(progressMeta).map((key) => {
        const currentCard = progressMeta[key];
        return (
          <Card fluid className="verification">
            <Card.Content>
              <Icon.Group size="huge">
                <Icon className={`ns-${key}`} />
              </Icon.Group>
              <p><b>{currentCard.label}</b></p>
              <Button
                color="green"
                content="Verify Identity"
                onClick={() => props.renderStep(currentCard.step)}
              />
            </Card.Content>
          </Card>
        );
      })
    }
  </Card.Group>
);

export default ProgressCard;
