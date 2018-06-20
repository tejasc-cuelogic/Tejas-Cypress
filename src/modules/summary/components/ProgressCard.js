import React from 'react';
import { Card, Icon } from 'semantic-ui-react';

const checkStatus = (signupStatus, key) => {
  console.log(signupStatus, key);
  return true;
};

const ProgressCard = ({ metaData, signupStatus }) => (
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
                {status ?
                  `Please verify your <b>${metaData[key]}</b>` :
                  `Your <b>${metaData[key]}</b> has been verified`
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
