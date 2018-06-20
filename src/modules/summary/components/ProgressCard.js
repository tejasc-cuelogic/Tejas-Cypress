import React from 'react';
import Aux from 'react-aux';
import { Card, Icon, Button } from 'semantic-ui-react';

const checkStatus = (signupStatus, key) => {
  console.log(signupStatus, key);
  return true;
};

const ProgressCard = ({ metaData, signupStatus, action }) => (
  <Card.Group stackable itemsPerRow={3}>
    {
      Object.keys(metaData).map((key) => {
        const status = checkStatus(signupStatus, key);
        return (
          <Card fluid className={`verification ${status ? 'done' : ''}`}>
            <Card.Content>
              <Icon.Group size="huge">
                <Icon className={`ns-${key}`} />
                <Icon corner color="green" className={`ns-${status ? 'check' : 'warning'}-circle`} />
              </Icon.Group>
              <p>
                {!status ? 'Your <b>{metaData[key].label}</b> has been verified' : (
                  <Aux>
                    <p><b>Please verify your {metaData[key].label}</b></p>
                    <Button
                      onClick={() => action(metaData[key].action)}
                      color="green"
                      className="relaxed"
                      content="Verify"
                    />
                  </Aux>
                )
                }
              </p>
            </Card.Content>
          </Card>
        );
      })
    }
  </Card.Group>
);

export default ProgressCard;
