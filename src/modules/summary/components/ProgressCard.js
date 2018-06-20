import React from 'react';
import Aux from 'react-aux';
import { Card, Icon, Button } from 'semantic-ui-react';

const checkStatus = (signupStatus, key) => {
  let status = false;
  if (key === 'envelope-line') {
    status = true;
  } else if (key === 'contact-card') {
    if (signupStatus.idVerification === 'PASS') {
      status = true;
    }
  } else if (key === 'phone-line') {
    if (signupStatus.phoneVerification === 'DONE') {
      status = true;
    }
  } else if (key === 'bar-line-chart') {
    if (signupStatus.partialAccounts.length > 0) {
      status = true;
    }
  } else if (key === 'chart-setting') {
    if (signupStatus.inActiveAccounts.length > 0) {
      status = true;
    }
  }
  return status;
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
                <Icon corner color={status ? 'green' : 'red'} className={`ns-${status ? 'check' : 'warning'}-circle`} />
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
